require("dotenv").config({ path: '.env.development' });
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);

async function fixData() {
  try {
    console.log('Running data fix for filters...');
    
    // 1. Lowercase job_type
    // Note: knex.raw result structure depends on driver. usage of rowCount matches pg.
    const resType = await knex.raw(`UPDATE job SET job_type = LOWER(job_type)`);
    console.log('Job types updated.');

    // 2. Populate experience_level
    const resExp = await knex.raw(`
      UPDATE job
      SET experience_level = LOWER(sub.tag_name)
      FROM (
        SELECT jt.job_id, t.tag_name
        FROM job_tag jt
        JOIN tag t ON jt.tag_id = t.tag_id
        WHERE t.tag_name IN ('Fresher', 'Junior', 'Mid-level', 'Senior', 'Lead/Manager')
      ) AS sub
      WHERE job.job_id = sub.job_id
    `);
    console.log('Experience levels updated.');

    console.log('Success!');
    process.exit(0);
  } catch (err) {
    console.error('Error executing fix:', err);
    process.exit(1);
  }
}

fixData();
