import { Request, Response } from 'express';
import { CmsPageModel } from '../models/CmsPage';
import { BlogPostModel } from '../models/BlogPost';
import { CareerModel } from '../models/Career';
import { LeadModel } from '../models/Lead';
import { JobApplicationModel } from '../models/JobApplication';
import { MediaModel } from '../models/Media';
import { HomePageSettingsModel } from '../models/HomePageSettings';
import { AboutPageSettingsModel } from '../models/AboutPageSettings';
import { SolutionsPageSettings } from '../models/SolutionsPageSettings';
import { ApproachPageSettingsModel } from '../models/ApproachPageSettings';
import { ImpactPageSettingsModel } from '../models/ImpactPageSettings';
import { ContactPageSettingsModel } from '../models/ContactPageSettings';
import { FooterSettingsModel } from '../models/FooterSettings';
import { SolutionDetailModel } from '../models/SolutionDetail';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';

interface ActivityTimelinePoint {
  date: string;
  name: string;
  contentEdits: number;
  inquiries: number;
}

interface ActivityEvent {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  timeRaw: number;
  type: 'content' | 'settings' | 'auth' | 'incident';
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const range = (req.query.range as string) || '30d';
    const days = range === '7d' ? 7 : range === '90d' ? 90 : 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    // Parallel aggregate count queries
    const [
      totalPages,
      publishedPages,
      draftPages,
      totalBlogPosts,
      publishedBlogPosts,
      totalCareers,
      openJobs,
      totalLeads,
      newLeads,
      totalApplications,
      pendingApplications,
      totalMedia,
      recentLeadsDocs,
      recentApplicationsDocs,
      recentPagesDocs,
      recentCareersDocs,
      recentBlogDocs,
      contactSettingsDoc,
    ] = await Promise.all([
      CmsPageModel.countDocuments(),
      CmsPageModel.countDocuments({ status: 'published' }),
      CmsPageModel.countDocuments({ status: 'draft' }),
      BlogPostModel.countDocuments({ deletedAt: null }),
      BlogPostModel.countDocuments({ status: 'PUBLISHED', deletedAt: null }),
      CareerModel.countDocuments({ deletedAt: null }),
      CareerModel.countDocuments({ status: { $in: ['PUBLISHED', 'ACTIVE'] }, deletedAt: null }),
      LeadModel.countDocuments(),
      LeadModel.countDocuments({ status: 'NEW' }),
      JobApplicationModel.countDocuments(),
      JobApplicationModel.countDocuments({ status: 'PENDING' }),
      MediaModel.countDocuments(),
      LeadModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      JobApplicationModel.find().sort({ createdAt: -1 }).limit(5).lean(),
      CmsPageModel.find().sort({ lastUpdated: -1 }).limit(10).lean(),
      CareerModel.find({ deletedAt: null }).sort({ updatedAt: -1 }).limit(5).lean(),
      BlogPostModel.find({ deletedAt: null }).sort({ updatedAt: -1 }).limit(5).lean(),
      ContactPageSettingsModel.findOne().lean(),
    ]);

    // Count FAQs in contact settings if available
    const faqCount = contactSettingsDoc?.faq?.items?.length || 0;

    // ── Build Activity Timeline from real database timestamps ─────────────────
    const dayMap: Record<string, { contentEdits: number; inquiries: number; dateObj: Date }> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      dayMap[dateKey] = {
        contentEdits: 0,
        inquiries: 0,
        dateObj: d,
      };
    }

    // Helper to bucket dates
    const tallyDate = (dateVal: any, type: 'contentEdits' | 'inquiries') => {
      if (!dateVal) return;
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return;
      const key = d.toISOString().split('T')[0];
      if (dayMap[key]) {
        dayMap[key][type]++;
      }
    };

    // Aggregate timestamp dates across collections within the date window
    const [
      leadsInWindow,
      appsInWindow,
      careersInWindow,
      blogsInWindow,
      mediaInWindow,
    ] = await Promise.all([
      LeadModel.find({ createdAt: { $gte: cutoffDate } }).select('createdAt').lean(),
      JobApplicationModel.find({ createdAt: { $gte: cutoffDate } }).select('createdAt').lean(),
      CareerModel.find({ updatedAt: { $gte: cutoffDate } }).select('updatedAt').lean(),
      BlogPostModel.find({ updatedAt: { $gte: cutoffDate } }).select('updatedAt').lean(),
      MediaModel.find({ createdAt: { $gte: cutoffDate } }).select('createdAt').lean(),
    ]);

    for (const lead of leadsInWindow) {
      tallyDate(lead.createdAt, 'inquiries');
    }
    for (const app of appsInWindow) {
      tallyDate(app.createdAt, 'inquiries');
    }
    for (const career of careersInWindow) {
      tallyDate(career.updatedAt, 'contentEdits');
    }
    for (const blog of blogsInWindow) {
      tallyDate(blog.updatedAt, 'contentEdits');
    }
    for (const med of mediaInWindow) {
      tallyDate(med.createdAt, 'contentEdits');
    }

    // Also tally CmsPages lastUpdated
    for (const p of recentPagesDocs) {
      if (p.lastUpdated) {
        tallyDate(p.lastUpdated, 'contentEdits');
      }
    }

    const timeline: ActivityTimelinePoint[] = Object.keys(dayMap).map((dateKey) => {
      const entry = dayMap[dateKey];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const displayName = `${monthNames[entry.dateObj.getMonth()]} ${entry.dateObj.getDate()}`;
      return {
        date: dateKey,
        name: displayName,
        contentEdits: entry.contentEdits,
        inquiries: entry.inquiries,
      };
    });

    // ── Build Recent Activity Feed from real database records ────────────────
    const activities: ActivityEvent[] = [];

    // Recent leads
    for (const l of recentLeadsDocs) {
      const d = new Date(l.createdAt);
      activities.push({
        id: `act-lead-${l._id}`,
        user: l.name || 'Website Visitor',
        action: `Submitted ${l.type === 'DEMO' ? 'demo request' : 'inquiry'}`,
        target: l.organization || l.inquiryType || 'Contact Form',
        timestamp: formatRelativeTime(d),
        timeRaw: d.getTime(),
        type: 'incident',
      });
    }

    // Recent job applications
    for (const a of recentApplicationsDocs) {
      const d = new Date(a.createdAt);
      activities.push({
        id: `act-app-${a._id}`,
        user: a.candidateName || 'Applicant',
        action: `Applied for position`,
        target: a.jobTitle,
        timestamp: formatRelativeTime(d),
        timeRaw: d.getTime(),
        type: 'incident',
      });
    }

    // Recent careers
    for (const c of recentCareersDocs) {
      const d = new Date(c.updatedAt || c.createdAt);
      activities.push({
        id: `act-career-${c._id}`,
        user: c.updatedBy || c.createdBy || 'Admin',
        action: `Updated job listing (${c.status.toLowerCase()})`,
        target: c.title,
        timestamp: formatRelativeTime(d),
        timeRaw: d.getTime(),
        type: 'content',
      });
    }

    // Recent blog posts
    for (const b of recentBlogDocs) {
      const d = new Date(b.updatedAt || b.createdAt);
      activities.push({
        id: `act-blog-${b._id}`,
        user: b.author || 'Author',
        action: `Updated post (${b.status.toLowerCase()})`,
        target: b.title,
        timestamp: formatRelativeTime(d),
        timeRaw: d.getTime(),
        type: 'content',
      });
    }

    // Recent pages
    for (const p of recentPagesDocs) {
      if (p.lastUpdated) {
        const d = new Date(p.lastUpdated);
        if (!isNaN(d.getTime())) {
          activities.push({
            id: `act-page-${p._id}`,
            user: p.updatedBy || 'Veenero Admin',
            action: `Modified page (${p.status})`,
            target: p.name,
            timestamp: formatRelativeTime(d),
            timeRaw: d.getTime(),
            type: 'content',
          });
        }
      }
    }

    // Sort combined activities descending by real time
    activities.sort((a, b) => b.timeRaw - a.timeRaw);
    const topActivities = activities.slice(0, 10);

    // ── Recent Leads formatted for Table ─────────────────────────────────────
    const formattedLeads = recentLeadsDocs.map((lead: any) => ({
      id: String(lead._id),
      name: lead.name,
      email: lead.email,
      company: lead.organization || 'Individual Inquiry',
      inquiryType: lead.inquiryType || 'General',
      type: lead.type,
      date: formatRelativeTime(new Date(lead.createdAt)),
      status: (lead.status || 'NEW').toLowerCase(),
    }));

    // ── Recent Applications formatted for Table ──────────────────────────────
    const formattedApplications = recentApplicationsDocs.map((app: any) => ({
      id: String(app._id),
      applicantName: app.candidateName,
      email: app.email,
      position: app.jobTitle,
      department: app.jobDepartment || 'General',
      appliedDate: formatRelativeTime(new Date(app.createdAt)),
      status: (app.status || 'PENDING').toLowerCase(),
    }));

    // ── Content Distribution ─────────────────────────────────────────────────
    const contentDistribution = [
      { name: 'Pages', count: totalPages, color: '#0f766e' },
      { name: 'Blog Posts', count: totalBlogPosts, color: '#0ea5e9' },
      { name: 'Careers', count: totalCareers, color: '#10b981' },
      { name: 'Media Assets', count: totalMedia, color: '#6366f1' },
      { name: 'Leads', count: totalLeads, color: '#f59e0b' },
      { name: 'Applications', count: totalApplications, color: '#ec4899' },
    ];

    // ── Page Status Distribution ─────────────────────────────────────────────
    const pageStatusDistribution = [
      { name: 'Published Pages', value: publishedPages, color: '#0f766e' },
      { name: 'Draft Pages', value: draftPages, color: '#0ea5e9' },
    ];

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      overview: {
        totalPages: {
          value: totalPages,
          label: 'Total System Pages',
          subtext: `${publishedPages} live, ${draftPages} draft`,
          trend: 'neutral',
        },
        publishedPages: {
          value: publishedPages,
          label: 'Published Pages',
          subtext: `${totalPages > 0 ? Math.round((publishedPages / totalPages) * 100) : 0}% of system pages`,
          trend: 'up',
        },
        draftPages: {
          value: draftPages,
          label: 'Draft Pages',
          subtext: `${draftPages} pending review`,
          trend: draftPages > 0 ? 'neutral' : 'up',
        },
        blogPosts: {
          value: totalBlogPosts,
          label: 'Blog / Insights',
          subtext: `${publishedBlogPosts} published posts`,
          trend: totalBlogPosts > 0 ? 'up' : 'neutral',
        },
        openJobs: {
          value: openJobs,
          label: 'Careers (Open Jobs)',
          subtext: `${totalCareers} total positions`,
          trend: openJobs > 0 ? 'up' : 'neutral',
        },
        contactLeads: {
          value: totalLeads,
          label: 'Contact Leads',
          subtext: `${newLeads} awaiting review`,
          trend: newLeads > 0 ? 'up' : 'neutral',
        },
        jobApplications: {
          value: totalApplications,
          label: 'Job Applications',
          subtext: `${pendingApplications} pending review`,
          trend: pendingApplications > 0 ? 'up' : 'neutral',
        },
        mediaAssets: {
          value: totalMedia,
          label: 'Media Assets',
          subtext: 'Cloudinary managed',
          trend: 'neutral',
        },
        faqs: {
          value: faqCount,
          label: 'Active FAQs',
          subtext: 'Public help questions',
          trend: 'neutral',
        },
      },
      pageStatus: pageStatusDistribution,
      contentDistribution,
      activityTimeline: timeline,
      recentActivity: topActivities,
      recentLeads: formattedLeads,
      recentApplications: formattedApplications,
      system: {
        databaseConnected: mongoose.connection.readyState === 1,
        serverUptime: Math.floor(process.uptime()),
        lastSynced: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    logger.error(`[DashboardController] Failed to aggregate stats: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: 'Unable to load dashboard statistics from database.',
        details: error.message,
      },
    });
  }
};

/**
 * Full CMS Data Backup & Export
 * Aggregates all CMS records into a structured JSON archive.
 */
export const exportCmsBackup = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      pages,
      blogs,
      careers,
      leads,
      applications,
      media,
      homeSettings,
      aboutSettings,
      solutionsSettings,
      approachSettings,
      impactSettings,
      contactSettings,
      footerSettings,
      solutionDetails,
    ] = await Promise.all([
      CmsPageModel.find().lean(),
      BlogPostModel.find().lean(),
      CareerModel.find().lean(),
      LeadModel.find().lean(),
      JobApplicationModel.find().lean(),
      MediaModel.find().lean(),
      HomePageSettingsModel.findOne().lean(),
      AboutPageSettingsModel.findOne().lean(),
      SolutionsPageSettings.findOne().lean(),
      ApproachPageSettingsModel.findOne().lean(),
      ImpactPageSettingsModel.findOne().lean(),
      ContactPageSettingsModel.findOne().lean(),
      FooterSettingsModel.findOne().lean(),
      SolutionDetailModel.find().lean(),
    ]);

    const backupPayload = {
      exportMetadata: {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        exportedBy: (req as any).user?.email || 'admin@veenerosolutions.com',
        service: 'Veenero CMS OS Control Center',
        environment: process.env.NODE_ENV || 'production',
        recordCounts: {
          pages: pages.length,
          blogs: blogs.length,
          careers: careers.length,
          leads: leads.length,
          applications: applications.length,
          media: media.length,
          solutionDetails: solutionDetails.length,
        },
      },
      content: {
        pages,
        blogs,
        careers,
        leads,
        applications,
        media,
        solutionDetails,
      },
      pageSettings: {
        home: homeSettings,
        about: aboutSettings,
        solutions: solutionsSettings,
        approach: approachSettings,
        impact: impactSettings,
        contact: contactSettings,
        footer: footerSettings,
      },
    };

    const filename = `veenero-cms-backup-${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(backupPayload, null, 2));
  } catch (error: any) {
    logger.error(`[DashboardController] Backup export failed: ${error.message}`);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to generate CMS backup.',
        details: error.message,
      },
    });
  }
};
