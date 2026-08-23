import { Request, Response } from 'express';
import { config } from '../config/env';
import { pingDatabase, getConnectionState } from '../services/mongodb.service';

// ─── Health Check Controller ──────────────────────────────────────────────────

/**
 * GET /api/health
 *
 * Returns the operational status of the API and its dependencies.
 * Used by load balancers, monitoring tools, and the admin dashboard.
 *
 * Response shape:
 * {
 *   status: "ok" | "degraded",
 *   service: string,
 *   version: string,
 *   environment: string,
 *   timestamp: ISO string,
 *   uptime: number (seconds),
 *   database: "connected" | "disconnected" | "connecting" | "disconnecting"
 * }
 */
export const healthCheck = async (
  _req: Request,
  res: Response
): Promise<void> => {
  const dbAlive = await pingDatabase();
  const dbState = getConnectionState();

  const overallStatus = dbAlive ? 'ok' : 'degraded';
  const httpStatus = dbAlive ? 200 : 503;

  res.status(httpStatus).json({
    status: overallStatus,
    service: 'veenero-cms-api',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database: dbState,
  });
};
