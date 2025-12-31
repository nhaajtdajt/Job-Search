/**
 * Truncate all tables before seeding
 * This ensures a clean state for seeding
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  console.log('🗑️  Truncating all tables...');
  
  await knex.raw(`
    TRUNCATE TABLE
      application,
      resume_skill,
      resume_view,
      res_experience,
      res_education,
      resume,
      job_skill,
      job_location,
      job_tag,
      saved_job,
      notification,
      saved_search,
      job,
      employer,
      users,
      skill,
      tag,
      location,
      company
    CASCADE;
  `);
  
  console.log('✅ All tables truncated successfully!');
};
