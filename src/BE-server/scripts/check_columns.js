require('dotenv').config({ path: '../.env.development' });
const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

async function check() {
  try {
    const cols = await db.raw("SELECT column_name FROM information_schema.columns WHERE table_name = 'company'");
    console.log('Company Columns:', cols.rows.map(r => r.column_name));
    
    const jobs = await db.raw("SELECT column_name FROM information_schema.columns WHERE table_name = 'job'");
    console.log('Job Columns:', jobs.rows.map(r => r.column_name));

    const existing = await db('company').first();
    console.log('Existing Company:', existing);
  } catch(e) { console.error(e); }
  finally { await db.destroy(); }
}
check();
