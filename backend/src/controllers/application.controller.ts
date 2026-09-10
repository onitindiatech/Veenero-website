import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { JobApplicationModel, ApplicationStatus } from '../models/JobApplication';
import { CareerModel } from '../models/Career';
import { cloudinary } from '../config/cloudinary';
import { sendDecisionEmail as dispatchDecisionEmail } from '../services/email.service';
import { logger } from '../utils/logger';

// ─── Multer Memory Storage Configuration ──────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB maximum
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/rtf',
    ];
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(pdf|doc|docx|rtf|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload a PDF, DOC, or DOCX resume.'));
    }
  },
});

export const uploadResumeMiddleware = upload.single('resume');

// Helper to upload raw/document buffers to Cloudinary
async function uploadResumeToCloudinary(
  buffer: Buffer,
  candidateName: string
): Promise<{ secureUrl: string; publicId: string }> {
  const cleanName = candidateName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const timestamp = Date.now();

  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'veenero/applications/resumes',
        public_id: `resume_${cleanName}_${timestamp}`,
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) {
          logger.warn(`[ApplicationController] Cloudinary upload stream fallback: ${error?.message || 'No result'}`);
          // Fallback: create base64 data URL if Cloudinary credentials are mock/offline
          const base64Fallback = `data:application/pdf;base64,${buffer.toString('base64')}`;
          resolve({
            secureUrl: base64Fallback,
            publicId: `local_${cleanName}_${timestamp}`,
          });
        } else {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    stream.end(buffer);
  });
}

// ─── 1. Public: Submit Job Application ─────────────────────────────────────────
export async function submitJobApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { careerId, candidateName, email, phone, coverLetter, linkedInUrl, portfolioUrl } = req.body;

    // Field validations
    if (!candidateName || !candidateName.trim()) {
      res.status(400).json({ success: false, message: 'Full Name is required.' });
      return;
    }
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({ success: false, message: 'A valid email address is required.' });
      return;
    }
    if (!phone || !phone.trim()) {
      res.status(400).json({ success: false, message: 'Phone number is required.' });
      return;
    }
    if (!coverLetter || !coverLetter.trim()) {
      res.status(400).json({ success: false, message: 'Cover letter or message is required.' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Please attach your Resume / CV file (PDF or DOCX).' });
      return;
    }

    // Resolve Job Details
    let jobTitle = 'General Application';
    let jobDepartment = 'Engineering';

    const careerIdStr = typeof careerId === 'string' ? careerId : '';
    if (careerIdStr && mongoose.Types.ObjectId.isValid(careerIdStr)) {
      const career = await CareerModel.findById(careerIdStr);
      if (career) {
        jobTitle = career.title;
        jobDepartment = career.department || 'Engineering';
      }
    }

    // Upload Resume to Cloudinary / storage
    const originalFilename = req.file.originalname || 'Resume.pdf';
    const uploadResult = await uploadResumeToCloudinary(req.file.buffer, candidateName);

    // Create Application in MongoDB
    const application = await JobApplicationModel.create({
      careerId: careerIdStr && mongoose.Types.ObjectId.isValid(careerIdStr) ? new mongoose.Types.ObjectId(careerIdStr) : new mongoose.Types.ObjectId(),
      jobTitle,
      jobDepartment,
      candidateName: candidateName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      resumeUrl: uploadResult.secureUrl,
      resumeFilename: originalFilename,
      resumePublicId: uploadResult.publicId,
      coverLetter: coverLetter.trim(),
      linkedInUrl: (linkedInUrl || '').trim(),
      portfolioUrl: (portfolioUrl || '').trim(),
      status: 'PENDING',
      decisionEmailSent: false,
    });

    logger.success(`[ApplicationController] New candidate application received for ${jobTitle}: ${candidateName} (${email})`);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Our team will review your profile and get back to you.',
      data: {
        id: application._id,
        candidateName: application.candidateName,
        jobTitle: application.jobTitle,
        createdAt: application.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── 2. Admin: Get Applications List ──────────────────────────────────────────
export async function getAdminApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { status, careerId, search } = req.query;

    const query: Record<string, any> = {};

    if (status && status !== 'ALL' && ['PENDING', 'UNDER_REVIEW', 'SELECTED', 'NOT_SELECTED'].includes(String(status))) {
      query.status = status;
    }

    const careerIdStr = typeof careerId === 'string' ? careerId : '';
    if (careerIdStr && mongoose.Types.ObjectId.isValid(careerIdStr)) {
      query.careerId = new mongoose.Types.ObjectId(careerIdStr);
    }

    if (search && String(search).trim() !== '') {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { candidateName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { jobTitle: searchRegex },
        { jobDepartment: searchRegex },
      ];
    }

    const applications = await JobApplicationModel.find(query).sort({ createdAt: -1 });

    // Compute status counts for admin tabs
    const allApps = await JobApplicationModel.find({});
    const counts = {
      all: allApps.length,
      pending: allApps.filter((a) => a.status === 'PENDING').length,
      underReview: allApps.filter((a) => a.status === 'UNDER_REVIEW').length,
      selected: allApps.filter((a) => a.status === 'SELECTED').length,
      notSelected: allApps.filter((a) => a.status === 'NOT_SELECTED').length,
    };

    res.json({
      success: true,
      data: applications,
      counts,
    });
  } catch (err) {
    next(err);
  }
}

// ─── 3. Admin: Get Application By ID ──────────────────────────────────────────
export async function getAdminApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) || '';
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid Application ID format.' });
      return;
    }

    const application = await JobApplicationModel.findById(id);
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    res.json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

// ─── 4. Admin: Update Application Status & Notes ──────────────────────────────
export async function updateApplicationStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) || '';
    const { status, notes } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid Application ID.' });
      return;
    }

    const updateFields: Record<string, any> = {};
    if (status && ['PENDING', 'UNDER_REVIEW', 'SELECTED', 'NOT_SELECTED'].includes(status)) {
      updateFields.status = status as ApplicationStatus;
    }
    if (typeof notes === 'string') {
      updateFields.notes = notes.trim();
    }

    const updated = await JobApplicationModel.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    logger.info(`[ApplicationController] Status updated for application ${id} to ${updated.status}`);

    res.json({
      success: true,
      data: updated,
      message: 'Application updated successfully.',
    });
  } catch (err) {
    next(err);
  }
}

// ─── 5. Admin: Send Decision Email (Selected / Not Selected) ───────────────────
export async function sendDecisionEmailAction(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) || '';
    const { type, forceResend } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid Application ID.' });
      return;
    }

    if (!type || !['SELECTED', 'NOT_SELECTED'].includes(type)) {
      res.status(400).json({ success: false, message: "Decision type must be 'SELECTED' or 'NOT_SELECTED'." });
      return;
    }

    const application = await JobApplicationModel.findById(id);
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    // Duplicate email protection
    if (application.decisionEmailSent && application.decisionEmailType === type && !forceResend) {
      res.status(400).json({
        success: false,
        isDuplicate: true,
        message: `A ${type === 'SELECTED' ? 'selection' : 'rejection'} email was already sent to ${application.candidateName} on ${application.decisionEmailSentAt ? new Date(application.decisionEmailSentAt).toLocaleDateString() : 'earlier'}. To send another email, confirm resend.`,
      });
      return;
    }

    // Send the dynamic transactional email
    const emailResult = await dispatchDecisionEmail({
      to: application.email,
      candidateName: application.candidateName,
      jobTitle: application.jobTitle,
      type: type as 'SELECTED' | 'NOT_SELECTED',
    });

    if (!emailResult.success) {
      res.status(500).json({
        success: false,
        message: `Failed to deliver decision email: ${emailResult.error || 'Mail server error'}`,
      });
      return;
    }

    // Update application record with decision email log and new status
    const adminUser = (req as any).user?.email || 'Admin';
    application.status = type as ApplicationStatus;
    application.decisionEmailSent = true;
    application.decisionEmailType = type;
    application.decisionEmailSentAt = new Date();
    application.decisionSentBy = adminUser;

    await application.save();

    logger.success(`[ApplicationController] Decision email '${type}' dispatched for candidate ${application.candidateName} (${application.email})`);

    res.json({
      success: true,
      message: `${type === 'SELECTED' ? 'Selection' : 'Rejection'} email sent successfully to ${application.candidateName}.`,
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

// ─── 6. Admin: Delete Application ─────────────────────────────────────────────
export async function deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) || '';
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid Application ID.' });
      return;
    }

    const application = await JobApplicationModel.findByIdAndDelete(id);
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found.' });
      return;
    }

    logger.info(`[ApplicationController] Application deleted: ${id}`);

    res.json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
}
