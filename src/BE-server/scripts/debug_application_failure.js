require("dotenv").config({ path: '.env.development' });
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig.development);

async function debug() {
  try {
    console.log('--- Debugging Job 24 ---');
    
    // 1. Check Job 24
    const job = await knex('job').where('job_id', 24).first();
    if (!job) {
      console.log('Job 24 not found!');
    } else {
      console.log('Job 24 Found:');
      console.log('Title:', job.job_title);
      console.log('Expired At:', job.expired_at);
      console.log('Is Expired?', job.expired_at && new Date(job.expired_at) < new Date());
    }

    // 2. Check Applications for Job 24
    const apps = await knex('application').where('job_id', 24);
    console.log(`\nApplications count for Job 24: ${apps.length}`);
    apps.forEach(a => {
      console.log(`- User ${a.user_id}, Status: ${a.status}`);
    });

    console.log('\n--- Done ---');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debug();
