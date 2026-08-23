import { Request } from 'express';
import morgan from 'morgan';
import { config } from '../config/env';

// ─── Request Logger ───────────────────────────────────────────────────────────
// Uses morgan for HTTP request logging.
// In development: colourised "dev" format (method, url, status, response time)
// In production: compact "combined" format suitable for log aggregation

export const requestLogger = morgan(
  config.isDev ? 'dev' : 'combined',
  {
    // Skip successful health checks in production to reduce noise
    skip: (req, res) =>
      config.isProd &&
      res.statusCode === 200 &&
      (req as Request).originalUrl === '/api/health',
  }
);
