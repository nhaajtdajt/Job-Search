/**
 * Script to reset database by dropping all tables
 * WARNING: This will delete ALL data in the database
 * 
 * Usage: node scripts/reset-database.js
 */

require('dotenv').config({ path: '.env.development' });
const knex = require('knex');
const knexfile = require('../knexfile');

async function resetDatabase() {
  const db = knex(knexfile.development);

  try {
    console.log('🔄 Starting database reset...');

    // Drop trigger and function first
    await db.raw(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users`);
    await db.raw(`DROP FUNCTION IF EXISTS public.handle_new_user`);

    // Drop all tables in reverse order (respecting foreign key constraints)
    const tables = [
      'application',
      'resume_view',
      'saved_search',
      'job_skill',
      'resume_skill',
      'skill',
      'res_experience',
      'res_education',
      'resume',
      'notification',
      'saved_job',
      'job_location',
      'location',
      'job_tag',
      'tag',
      'job',
      'saved_candidate',  // Drop before employer (has FK to employer)
      'employer',
      'company',
      'users'
    ];

    for (const table of tables) {
      await db.schema.dropTableIfExists(table);
      console.log(`  ✓ Dropped table: ${table}`);
    }

    // Delete all migration records from knex_migrations table
    await db('knex_migrations').del();
    console.log('  ✓ Cleared migration records');

    console.log('✅ Database reset completed successfully!');
    console.log('💡 You can now run: npm run migrate:latest');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

resetDatabase();

