import 'dotenv/config';

// ─── Environment Variable Loader ─────────────────────────────────────────────
// All environment variables are validated here at startup.
// The app will fail fast with a clear error if a required variable is missing.
// No credentials are hardcoded — everything comes from .env

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value || value.trim() === '') {
    throw new Error(
      `[Config] Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env and fill in the value.`
    );
  }
  return value.trim();
}

function optionalEnv(key: string, fallback: string): string {
  return process.env[key]?.trim() || fallback;
}

export const config = {
  // ── Application ────────────────────────────────────────────────────────────
  nodeEnv: optionalEnv('NODE_ENV', 'development') as
    | 'development'
    | 'production'
    | 'test',
  port: parseInt(optionalEnv('PORT', '4000'), 10),
  apiVersion: optionalEnv('API_VERSION', 'v1'),
  isDev: optionalEnv('NODE_ENV', 'development') === 'development',
  isProd: optionalEnv('NODE_ENV', 'development') === 'production',

  // ── Database (MongoDB) ─────────────────────────────────────────────────────
  // MONGODB_URI is required — must be set in .env
  mongodbUri: requireEnv('MONGODB_URI'),

  // ── CORS ───────────────────────────────────────────────────────────────────
  corsOrigins: optionalEnv(
    'CORS_ORIGINS',
    'http://localhost:5173,http://localhost:3000'
  )
    .split(',')
    .map((o) => o.trim()),

  // ── Security ───────────────────────────────────────────────────────────────
  jwtSecret: optionalEnv('JWT_SECRET', 'INSECURE_DEFAULT_CHANGE_IN_PRODUCTION'),
  jwtExpiresIn: optionalEnv('JWT_EXPIRES_IN', '7d'),

  // ── Logging ────────────────────────────────────────────────────────────────
  logLevel: optionalEnv('LOG_LEVEL', 'debug'),

  // ── Cloudinary (Backend only — API secret NEVER exposed to frontend) ────────
  // Values come from backend/.env — never hardcoded, never logged, never returned in API responses.
  cloudinaryCloudName: requireEnv('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey:    requireEnv('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: requireEnv('CLOUDINARY_API_SECRET'),
} as const;

export type Config = typeof config;
