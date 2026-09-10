import dotenv from 'dotenv';
dotenv.config();
import { connectDatabase, disconnectDatabase } from '../services/mongodb.service';
import { seedDatabase } from '../services/seed.service';

async function main() {
  console.log('[Sync] Starting MongoDB sync...');
  await connectDatabase();
  await seedDatabase();
  await disconnectDatabase();
  console.log('[Sync] MongoDB sync complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('[Sync Error]', err);
  process.exit(1);
});
