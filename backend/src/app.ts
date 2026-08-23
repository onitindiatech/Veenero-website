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
import { publicBlogRouter, adminBlogRouter } from './routes/blog.routes';
import { publicHomeRouter, adminHomeRouter } from './routes/home.routes';
import { apiLimiter } from './middleware/rateLimit.middleware';

// ─── Express Application ──────────────────────────────────────────────────────

const app: Application = express();

// ── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// Use FRONTEND_URL as the primary allowed origin, fallback to corsOrigins list
const allowedOrigins = [
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL.trim()] : []),
  ...config.corsOrigins,
].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

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
app.use(`${API_PREFIX}/blog`, publicBlogRouter);
app.use(`${API_PREFIX}/admin/blog`, adminBlogRouter);
app.use(`${API_PREFIX}/home`, publicHomeRouter);
app.use(`${API_PREFIX}/admin/home`, adminHomeRouter);


// ── 404 Catch-All ─────────────────────────────────────────────────────────────
app.use(notFoundHandler);

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ─── Server Bootstrap ─────────────────────────────────────────────────────────

const startServer = async (): Promise<void> => {
  // ── Attempt MongoDB connection (non-fatal) ────────────────────────────────
  // Server starts regardless — health endpoint reports real DB status.
  // This allows the API to serve /api/health even before MongoDB is provisioned.
  console.log('[MongoDB] Attempting connection...');
  try {
    await connectDatabase();
    await seedDatabase();
  } catch (dbError) {
    console.warn('[MongoDB] ✗ Could not connect — server starting in degraded mode.');
    console.warn('[MongoDB] Set MONGODB_URI in .env to enable database features.');
    if (config.isDev) {
      console.warn('[MongoDB] Error:', (dbError as Error).message);
    }
  }

  // ── Start Express (always) ────────────────────────────────────────────────
  const server = app.listen(config.port, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║       VEENERO CMS API  v1.0.0          ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  Stack       : Express + MongoDB       ║`);
    console.log(`║  Environment : ${config.nodeEnv.padEnd(23)}║`);
    console.log(`║  Port        : ${String(config.port).padEnd(23)}║`);
    console.log(`║  Health      : /api/health             ║`);
    console.log('╚════════════════════════════════════════╝');
    console.log('');
  });

  // ── Graceful Shutdown ──────────────────────────────────────────────────────
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n[Server] ${signal} received — shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('[Server] Goodbye.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
};

startServer();

export default app;
