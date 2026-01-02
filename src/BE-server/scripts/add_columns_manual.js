require('dotenv').config({ path: '../.env.development' });
const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected. Altering table...');
    
    await client.query(`
      ALTER TABLE company 
      ADD COLUMN IF NOT EXISTS company_size VARCHAR(50),
      ADD COLUMN IF NOT EXISTS email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS founded_year INTEGER,
      ADD COLUMN IF NOT EXISTS banner_url TEXT;
    `);
    
    console.log('Columns added successfully.');
    
    // Optional: Update Test Company 21 with dummy data
    await client.query(`
      UPDATE company 
      SET 
        company_size = '1000+', 
        email = 'contact@techstar.com', 
        phone = '0901234567',
        founded_year = 2010,
        banner_url = 'https://via.placeholder.com/1200x400'
      WHERE company_name = 'TechStar Solutions'
    `);
    console.log('Updated TechStar Solutions data.');
    
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await client.end();
  }
}
run();
