import dataSource from '../data-source';
import { seedHotelBeaumont } from './hotel-beaumont.seed';

async function run(): Promise<void> {
  await dataSource.initialize();
  try {
    await seedHotelBeaumont(dataSource);
    console.log('Seed complete: Hôtel Beaumont');
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exitCode = 1;
});
