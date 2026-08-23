import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

// ─── API Error Class ──────────────────────────────────────────────────────────
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ApiError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Global Error Handler ─────────────────────────────────────────────────────
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message =
    err instanceof ApiError
      ? err.message
      : config.isProd
      ? 'An unexpected error occurred.'
      : err.message;

  const response: Record<string, unknown> = {
    success: false,
    error: {
      message,
      statusCode,
    },
  };

  // Include stack trace in development only
  if (config.isDev && !(err instanceof ApiError)) {
    response.error = {
      ...(response.error as Record<string, unknown>),
      stack: err.stack,
    };
  }

  if (!config.isProd) {
    console.error(`[ErrorHandler] ${statusCode} — ${message}`);
  }

  res.status(statusCode).json(response);
};

// ─── 404 Handler ──────────────────────────────────────────────────────────────
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
