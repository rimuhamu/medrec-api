import { clearDatabase, seedDatabase } from './seed-db';

async function main() {
  try {
    await clearDatabase();
    await seedDatabase();
    console.log('Seeding process completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding process failed:', error);
    process.exit(1);
  }
}

main();
