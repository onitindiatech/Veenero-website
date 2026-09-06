import { Request, Response, NextFunction } from 'express';
import { ContactPageSettingsModel, IContactPageSettings } from '../models/ContactPageSettings';
import { LeadModel } from '../models/Lead';

/**
 * Helper to ensure a singleton ContactPageSettings document exists.
 */
export async function getOrCreateContactSettings(): Promise<IContactPageSettings> {
  let doc = await ContactPageSettingsModel.findOne();
  if (!doc) {
    doc = await ContactPageSettingsModel.create({});
  }
  return doc;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * GET /api/contact
 * Returns active settings for the public contact page.
 */
export const getPublicContact = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateContactSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/contact/submit
 * Submits a new inquiry from the contact form and saves it as a Lead.
 */
export const submitContactInquiry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawName = req.body.name || req.body.fullName;
    const rawEmail = req.body.email || req.body.workEmail;
    const rawMessage = req.body.message;
    const rawPhone = req.body.phone;
    const rawOrg = req.body.organization || req.body.company;
    const rawInquiry = req.body.inquiryType || req.body.interest || 'General';
    const rawType = req.body.type === 'DEMO' ? 'DEMO' : 'ENQUIRY';

    if (!rawName || !rawEmail || !rawMessage) {
      res.status(400).json({
        success: false,
        error: 'Name, email, and message are required fields.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(rawEmail).trim())) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
      return;
    }

    const lead = await LeadModel.create({
      name: String(rawName).trim(),
      email: String(rawEmail).trim().toLowerCase(),
      phone: rawPhone ? String(rawPhone).trim() : undefined,
      organization: rawOrg ? String(rawOrg).trim() : undefined,
      inquiryType: String(rawInquiry).trim(),
      type: rawType,
      message: String(rawMessage).trim(),
      source: req.body.source || 'Contact Page Form',
      status: 'NEW',
    });

    res.status(201).json({
      success: true,
      data: {
        id: lead._id,
        message: 'Inquiry submitted successfully. Our team will contact you shortly.',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/contact/demo
 * Submits a new platform demo request from the Book Demo flow.
 */
export const submitDemoRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawName = req.body.name || req.body.fullName;
    const rawEmail = req.body.email || req.body.workEmail;
    const rawMessage = req.body.message || req.body.requirements || 'Platform Demo Request';
    const rawPhone = req.body.phone;
    const rawOrg = req.body.organization || req.body.company;

    if (!rawName || !rawEmail) {
      res.status(400).json({
        success: false,
        error: 'Full name and email are required for demo booking.',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(rawEmail).trim())) {
      res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
      return;
    }

    const lead = await LeadModel.create({
      name: String(rawName).trim(),
      email: String(rawEmail).trim().toLowerCase(),
      phone: rawPhone ? String(rawPhone).trim() : undefined,
      organization: rawOrg ? String(rawOrg).trim() : undefined,
      inquiryType: 'Demo Request',
      type: 'DEMO',
      message: String(rawMessage).trim(),
      source: req.body.source || 'Schedule a Platform Demo Card',
      status: 'NEW',
    });

    res.status(201).json({
      success: true,
      data: {
        id: lead._id,
        message: 'Platform demo request scheduled successfully. Our solution architects will reach out to confirm time.',
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── Admin API ────────────────────────────────────────────────────────────────

/**
 * GET /api/admin/contact
 * Returns full contact page settings for the admin panel.
 */
export const getAdminContactSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = await getOrCreateContactSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/contact
 * Updates entire contact page settings.
 */
export const updateAdminContactSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updateData = req.body;
    let doc = await getOrCreateContactSettings();

    const allowedSections = ['hero', 'contactInfo', 'demoCard', 'form', 'faq', 'cta', 'seo'];
    for (const key of allowedSections) {
      if (updateData[key] !== undefined) {
        (doc as any)[key] = updateData[key];
      }
    }

    doc.updatedBy = (req as any).user?.email || 'admin';
    await doc.save();

    res.status(200).json({
      success: true,
      data: doc,
      message: 'Contact page settings saved successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/contact/:sectionKey
 * Updates a single section of the contact page settings.
 */
export const updateAdminContactSection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const sectionKey = String(req.params.sectionKey || '');
    const allowedSections = ['hero', 'contactInfo', 'demoCard', 'form', 'faq', 'cta', 'seo'];

    if (!allowedSections.includes(sectionKey)) {
      res.status(400).json({
        success: false,
        error: `Invalid section '${sectionKey}'`,
      });
      return;
    }

    const doc = await getOrCreateContactSettings();
    (doc as any)[sectionKey] = req.body;
    doc.updatedBy = (req as any).user?.email || 'admin';
    await doc.save();

    res.status(200).json({
      success: true,
      data: (doc as any)[sectionKey],
      message: `Contact section '${sectionKey}' updated successfully`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/leads
 * Returns all submitted inquiries with optional status/type/search filters.
 */
export const getAdminLeads = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search, type } = req.query;
    const filter: any = {};

    if (type && type !== 'ALL') {
      filter.type = type;
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search && typeof search === 'string') {
      const q = search.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { organization: { $regex: q, $options: 'i' } },
        { message: { $regex: q, $options: 'i' } },
      ];
    }

    const leads = await LeadModel.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leads,
      count: leads.length,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/leads/:id
 * Returns single lead / inquiry details for admin inspection.
 */
export const getAdminLeadById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const lead = await LeadModel.findById(id);
    if (!lead) {
      res.status(404).json({ success: false, error: 'Inquiry record not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/admin/leads/:id/status
 * Updates lead status (NEW, IN_PROGRESS, RESOLVED, CLOSED) or notes.
 * Does NOT allow arbitrary editing of visitor message.
 */
export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const lead = await LeadModel.findById(id);
    if (!lead) {
      res.status(404).json({ success: false, error: 'Inquiry record not found' });
      return;
    }

    if (status) {
      const allowedStatuses = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CONTACTED', 'QUALIFIED', 'CLOSED'];
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ success: false, error: `Invalid status '${status}'` });
        return;
      }
      lead.status = status;
    }
    if (notes !== undefined) lead.notes = String(notes);

    await lead.save();

    res.status(200).json({
      success: true,
      data: lead,
      message: 'Inquiry status updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/admin/leads/:id
 * Deletes a lead inquiry.
 */
export const deleteLead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await LeadModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, error: 'Lead not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
