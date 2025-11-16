import { AppDataSource } from './data-source';

async function runMigrations() {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    
    const migrations = await AppDataSource.runMigrations();
    console.log('Migrations executed:', migrations);
  } catch (err) {
    console.error('Error during migration:', err);
  } finally {
    await AppDataSource.destroy();
  }
}

runMigrations();
