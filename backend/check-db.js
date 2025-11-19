const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USERNAME || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'nest_auth',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function checkDatabase() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    // Vérifier les tables existantes
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nTables in database:');
    console.table(tablesRes.rows);
    
    // Vérifier les données dans la table clinics si elle existe
    if (tablesRes.rows.some(row => row.table_name === 'clinics')) {
      const clinicsRes = await client.query('SELECT * FROM clinics LIMIT 5');
      console.log('\nSample clinics data:');
      console.table(clinicsRes.rows);
    }
    
    client.release();
    await pool.end();
    console.log('\nDatabase check completed.');
  } catch (error) {
    console.error('Error checking database:', error);
    process.exit(1);
  }
}

checkDatabase();
