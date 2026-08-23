import mongoose from 'mongoose';
import { config } from '../config/env';

// ─── MongoDB Connection Service ───────────────────────────────────────────────
// Manages the Mongoose connection lifecycle.
// Uses MONGODB_URI from environment — no credentials are hardcoded here.

// ── Connection State ───────────────────────────────────────────────────────────

/**
 * Returns the current Mongoose connection ready state as a readable string.
 * 0 = disconnected | 1 = connected | 2 = connecting | 3 = disconnecting
 */
export function getConnectionState(): 'connected' | 'disconnected' | 'connecting' | 'disconnecting' {
  const states: Record<number, 'connected' | 'disconnected' | 'connecting' | 'disconnecting'> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] ?? 'disconnected';
}

/**
 * Returns true if Mongoose is currently connected to MongoDB.
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

// ── Connect ────────────────────────────────────────────────────────────────────

/**
 * Connects Mongoose to MongoDB using MONGODB_URI from environment config.
 * Safe to call multiple times — will no-op if already connected.
 */
export async function connectDatabase(): Promise<void> {
  if (isConnected()) {
    return; // Already connected — skip
  }

  mongoose.set('strictQuery', true);

  // Attach connection event listeners (once)
  mongoose.connection.once('open', () => {
    console.log('[MongoDB] ✓ Connection established');
  });

  mongoose.connection.on('error', (err: Error) => {
    console.error('[MongoDB] Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[MongoDB] Connection lost');
  });

  await mongoose.connect(config.mongodbUri, {
    // Recommended production settings
    serverSelectionTimeoutMS: 5000,  // Fail fast if no server in 5s
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
  });
}

// ── Disconnect ─────────────────────────────────────────────────────────────────

/**
 * Gracefully closes the Mongoose connection.
 * Called during SIGTERM / SIGINT shutdown.
 */
export async function disconnectDatabase(): Promise<void> {
  if (!isConnected()) return;
  await mongoose.connection.close();
  console.log('[MongoDB] Connection closed');
}

// ── Ping ───────────────────────────────────────────────────────────────────────

/**
 * Pings MongoDB to verify live connectivity.
 * Returns true if a round-trip succeeds, false otherwise.
 * Used by the /api/health endpoint.
 */
export async function pingDatabase(): Promise<boolean> {
  try {
    if (!isConnected()) return false;
    await mongoose.connection.db?.admin().ping();
    return true;
  } catch {
    return false;
  }
}

export default mongoose;
