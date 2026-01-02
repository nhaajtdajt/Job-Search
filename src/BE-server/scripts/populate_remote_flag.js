require("dotenv").config({ path: '.env.development' });
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);

async function run() {
  try {
    console.log('Populating is_remote flag...');

    const res = await knex.raw(`
      UPDATE job
      SET is_remote = true
      WHERE job_id IN (
        SELECT jt.job_id
        FROM job_tag jt
        JOIN tag t ON jt.tag_id = t.tag_id
        WHERE t.tag_name = 'Remote'
      )
    `);
    
    console.log('Updated remote jobs.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
