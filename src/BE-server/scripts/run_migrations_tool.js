require('dotenv').config({ path: '../.env.development' });
const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.development);

async function run() {
  try {
    const config = { directory: '../src/databases/migrations' };
    
    console.log('Checking migrations...');
    const [completed, pending] = await db.migrate.list(config);
    
    console.log('Completed migrations:', completed.length);
    if (pending.length > 0) {
        console.log('Pending migrations:', pending.map(m => m.file));
        console.log('Running latest...');
        await db.migrate.latest(config);
        console.log('Migrations run successfully!');
    } else {
        console.log('No pending migrations.');
    }
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await db.destroy();
  }
}

run();
