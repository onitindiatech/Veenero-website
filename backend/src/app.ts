import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { connectDatabase, disconnectDatabase } from './services/mongodb.service';
import { seedDatabase } from './services/seed.service';

// Routes
import healthRouter from './routes/health.routes';
import cmsPageRouter from './routes/cmsPage.routes';
import authRouter from './routes/auth.routes';
import { publicRouter as publicCareerRouter, adminRouter as adminCareerRouter } from './routes/career.routes';
import { publicApplicationRouter, adminApplicationRouter } from './routes/application.routes';
import { publicBlogRouter, adminBlogRouter } from './routes/blog.routes';
import { adminMediaRouter, publicMediaRouter } from './routes/media.routes';

// Initialise Cloudinary SDK at server startup (validates credentials)
import './config/cloudinary';
import { publicHomeRouter, adminHomeRouter } from './routes/home.routes';
import { publicAboutRouter, adminAboutRouter } from './routes/about.routes';
import { publicSolutionsRouter, adminSolutionsRouter } from './routes/solutions.routes';
import { publicApproachRouter, adminApproachRouter } from './routes/approach.routes';
import { publicImpactRouter, adminImpactRouter } from './routes/impact.routes';
import { publicContactRouter, adminContactRouter, adminLeadsRouter } from './routes/contact.routes';
import { publicFooterRouter, adminFooterRouter } from './routes/footer.routes';
import { apiLimiter, resetAuthLimiter } from './middleware/rateLimit.middleware';
import { publicSolutionDetailRouter, adminSolutionDetailRouter } from './routes/solutionDetail.routes';
import aiRouter from './routes/ai.routes';
import adminDashboardRouter from './routes/dashboard.routes';
import { publicNavigationRouter, adminNavigationRouter } from './routes/navigation.routes';
import { publicGlobalSettingsRouter, adminGlobalSettingsRouter } from './routes/globalSettings.routes';
import adminSeoRouter from './routes/seo.routes';
import adminUserRouter from './routes/user.routes';
import adminActivityLogRouter from './routes/activityLog.routes';
import adminSettingsRouter from './routes/settings.routes';

// ─── Express Application ──────────────────────────────────────────────────────

const app: Application = express();

// Trust reverse proxy for correct client IP detection
app.set('trust proxy', 1);

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────────
// Canonical production origins that are ALWAYS permitted
const PRODUCTION_ORIGINS = [
  'https://veenerosolutions.com',
  'https://www.veenerosolutions.com',
];

// Local development origins
const LOCAL_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:8081',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
];

// Combine all sources: PRODUCTION_ORIGINS, FRONTEND_URL, CORS_ORIGINS, LOCAL_ORIGINS
const rawConfiguredOrigins = [
  ...PRODUCTION_ORIGINS,
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : []),
  ...config.corsOrigins,
  ...LOCAL_ORIGINS,
];

// Normalize and deduplicate origins, automatically ensuring both apex and www are allowed
const allowedOriginsSet = new Set<string>();
for (const raw of rawConfiguredOrigins) {
  if (!raw) continue;
  const clean = raw.trim().replace(/\/+$/, '');
  if (!clean) continue;
  allowedOriginsSet.add(clean);
  if (clean === 'https://veenerosolutions.com') {
    allowedOriginsSet.add('https://www.veenerosolutions.com');
  } else if (clean === 'https://www.veenerosolutions.com') {
    allowedOriginsSet.add('https://veenerosolutions.com');
  }
}

const allowedOrigins = Array.from(allowedOriginsSet);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, mobile apps, health checks)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.trim().replace(/\/+$/, '');

    // Allow if exact match in allowedOrigins
    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    // Explicit check for veenerosolutions.com and www.veenerosolutions.com
    if (
      cleanOrigin === 'https://veenerosolutions.com' ||
      cleanOrigin === 'https://www.veenerosolutions.com'
    ) {
      return callback(null, true);
    }

    // Do NOT pass new Error() which crashes Express with a 500 error handler
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'X-CSRF-Token',
  ],
  exposedHeaders: ['Set-Cookie', 'RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  credentials: true,
  maxAge: 86400, // 24 hours preflight cache
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Request Logging ───────────────────────────────────────────────────────────
app.use(requestLogger);

// ─── API Routes ───────────────────────────────────────────────────────────────
const API_PREFIX = `/api`;

// Apply general rate limiter to all API routes (health is excluded inside the limiter)
app.use(API_PREFIX, apiLimiter);

app.use(`${API_PREFIX}/health`, healthRouter);
app.use(`${API_PREFIX}/cms/pages`, cmsPageRouter);
app.use(`${API_PREFIX}/auth`, authRouter);
app.use(`${API_PREFIX}/careers`, publicCareerRouter);
app.use(`${API_PREFIX}/admin/careers`, adminCareerRouter);
app.use(`${API_PREFIX}/applications`, publicApplicationRouter);
app.use(`${API_PREFIX}/admin/applications`, adminApplicationRouter);
app.use(`${API_PREFIX}/admin/job-applications`, adminApplicationRouter);
app.use(`${API_PREFIX}/blog`, publicBlogRouter);
app.use(`${API_PREFIX}/admin/blog`, adminBlogRouter);
app.use(`${API_PREFIX}/home`, publicHomeRouter);
app.use(`${API_PREFIX}/admin/home`, adminHomeRouter);
app.use(`${API_PREFIX}/about`, publicAboutRouter);
app.use(`${API_PREFIX}/admin/about`, adminAboutRouter);
app.use(`${API_PREFIX}/solutions`, publicSolutionsRouter);
app.use(`${API_PREFIX}/admin/solutions`, adminSolutionsRouter);
app.use(`${API_PREFIX}/approach`, publicApproachRouter);
app.use(`${API_PREFIX}/admin/approach`, adminApproachRouter);
app.use(`${API_PREFIX}/impact`, publicImpactRouter);
app.use(`${API_PREFIX}/admin/impact`, adminImpactRouter);
app.use(`${API_PREFIX}/contact`, publicContactRouter);
app.use(`${API_PREFIX}/admin/contact`, adminContactRouter);
app.use(`${API_PREFIX}/admin/leads`, adminLeadsRouter);
app.use(`${API_PREFIX}/footer`, publicFooterRouter);
app.use(`${API_PREFIX}/admin/footer`, adminFooterRouter);
app.use(`${API_PREFIX}/media`, publicMediaRouter);
app.use(`${API_PREFIX}/admin/media`, adminMediaRouter);
app.use(`${API_PREFIX}/solutions-detail`, publicSolutionDetailRouter);
app.use(`${API_PREFIX}/admin/solutions-detail`, adminSolutionDetailRouter);
app.use(`${API_PREFIX}/admin/dashboard`, adminDashboardRouter);
app.use(`${API_PREFIX}/ai`, aiRouter);
app.use(`${API_PREFIX}/navigation`, publicNavigationRouter);
app.use(`${API_PREFIX}/admin/navigation`, adminNavigationRouter);
app.use(`${API_PREFIX}/global-settings`, publicGlobalSettingsRouter);
app.use(`${API_PREFIX}/admin/global-settings`, adminGlobalSettingsRouter);
app.use(`${API_PREFIX}/admin/seo`, adminSeoRouter);
app.use(`${API_PREFIX}/admin/users`, adminUserRouter);
app.use(`${API_PREFIX}/admin/activity-logs`, adminActivityLogRouter);
app.use(`${API_PREFIX}/admin/settings`, adminSettingsRouter);
app.use(`${API_PREFIX}/admin/contact-leads`, adminLeadsRouter);


// ── 404 Catch-All ─────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ─── Server Bootstrap ─────────────────────────────────────────────────────────

import { logger } from './utils/logger';

const startServer = async (): Promise<void> => {
  // ── Attempt MongoDB connection (non-fatal) ────────────────────────────────
  // Server starts regardless — health endpoint reports real DB status.
  // This allows the API to serve /api/health even before MongoDB is provisioned.
  logger.info('[MongoDB] Attempting connection...');
  try {
    await connectDatabase();
    await seedDatabase();
  } catch (dbError) {
    logger.warn('[MongoDB] Could not connect — server starting in degraded mode.');
    logger.warn('[MongoDB] Set MONGODB_URI in .env to enable database features.');
    if (config.isDev) {
      logger.warn(`[MongoDB] Error: ${(dbError as Error).message}`);
    }
    const retryTimer = setInterval(async () => {
      try {
        await connectDatabase();
        await seedDatabase();
        logger.success('[MongoDB] Reconnected and database seeded successfully.');
        clearInterval(retryTimer);
      } catch (err: any) {
        logger.warn(`[MongoDB] Background reconnection attempt: ${err.message}`);
      }
    }, 5000);
  }

  // ── Reset Rate Limiter Store on Startup ───────────────────────────────────
  // Ensures server always starts clean without stale locks in memory
  resetAuthLimiter();
  logger.info('[RateLimit] Authentication rate limit store initialized clean.');

  // ── Start Express (always) ────────────────────────────────────────────────
  const server = app.listen(config.port, () => {
    logger.box([
      `${logger.colors.bold}VEENERO CMS API v1.0.0${logger.colors.reset}${logger.colors.cyan}`,
      "",
      `Stack       : ${logger.colors.green}Express + MongoDB${logger.colors.cyan}`,
      `Environment : ${logger.colors.yellow}${config.nodeEnv.padEnd(19)}${logger.colors.cyan}`,
      `Port        : ${logger.colors.cyan}${String(config.port).padEnd(19)}${logger.colors.cyan}`,
      `Health      : ${logger.colors.blue}/api/health${logger.colors.cyan}`
    ]);
    logger.success('Server started successfully');
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`\n[Server] ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('[Server] Goodbye.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
};

startServer();

export default app;
