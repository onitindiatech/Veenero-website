/**
 * updateAdminPassword.ts
 * One-time script: reads ADMIN_EMAIL + ADMIN_PASSWORD from .env,
 * bcrypt-hashes the new password, and upserts the admin user in MongoDB.
 *
 * Run once after changing ADMIN_PASSWORD in .env:
 *   npx ts-node --transpile-only src/scripts/updateAdminPassword.ts
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User';

const SALT_ROUNDS = 12;

async function run(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Super Admin';

  if (!uri) throw new Error('MONGODB_URI not set in .env');
  if (!email) throw new Error('ADMIN_EMAIL not set in .env');
  if (!password) throw new Error('ADMIN_PASSWORD not set in .env');

  console.log('[updateAdminPassword] Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('[updateAdminPassword] Connected.');

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const existing = await UserModel.findOne({ email: email.toLowerCase().trim() });

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    existing.role = 'SUPER_ADMIN';
    existing.isActive = true;
    await existing.save();
    console.log(`[updateAdminPassword] ✓ Updated password for ${email}`);
  } else {
    await UserModel.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log(`[updateAdminPassword] ✓ Created admin user ${email}`);
  }

  await mongoose.disconnect();
  console.log('[updateAdminPassword] Done. Disconnected from MongoDB.');
  process.exit(0);
}

run().catch((err) => {
  console.error('[updateAdminPassword] FATAL:', err.message);
  process.exit(1);
});
