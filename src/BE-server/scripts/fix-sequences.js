/**
 * Script to fix PostgreSQL sequences after seeding
 * This fixes "duplicate key value violates unique constraint" errors
 */

require('dotenv').config({ path: '.env.development' });
const knex = require('knex');
const knexfile = require('../knexfile');

const db = knex(knexfile.development);

async function fixSequences() {
  try {
    console.log('🔧 Fixing PostgreSQL sequences...');

    // List of tables with auto-increment primary keys
    const tables = [
      { table: 'employer', pk: 'employer_id' },
      { table: 'company', pk: 'company_id' },
      { table: 'job', pk: 'job_id' },
      { table: 'application', pk: 'application_id' },
      { table: 'resume', pk: 'resume_id' },
      { table: 'skill', pk: 'skill_id' },
      { table: 'tag', pk: 'tag_id' },
      { table: 'location', pk: 'location_id' },
      { table: 'notification', pk: 'notification_id' },
      { table: 'saved_job', pk: 'saved_job_id' },
      { table: 'saved_search', pk: 'saved_search_id' },
      { table: 'res_education', pk: 'res_education_id' },
      { table: 'res_experience', pk: 'res_experience_id' },
    ];

    for (const { table, pk } of tables) {
      try {
        // Check if table exists
        const exists = await db.schema.hasTable(table);
        if (!exists) {
          console.log(`  ⏭️  Table ${table} not found, skipping`);
          continue;
        }

        // Get max id
        const result = await db(table).max(`${pk} as max_id`).first();
        const maxId = result?.max_id || 0;

        // Reset sequence
        const sequenceName = `${table}_${pk}_seq`;
        await db.raw(`SELECT setval('${sequenceName}', COALESCE(?, 1), true)`, [maxId]);
        
        console.log(`  ✅ ${table}: sequence set to ${maxId}`);
      } catch (err) {
        // Sequence might not exist for this table
        console.log(`  ⚠️  ${table}: ${err.message}`);
      }
    }

    console.log('✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.destroy();
  }
}

fixSequences();
