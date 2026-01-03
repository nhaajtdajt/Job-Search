/**
 * Migration: Add user profile fields
 * This migration is now a NO-OP since columns are already in init schema
 * Keeping for migration history compatibility
 */

exports.up = async function(knex) {
  // Check if columns already exist (they do in init_job_search_schema)
  const hasJobTitle = await knex.schema.hasColumn('users', 'job_title');
  
  if (hasJobTitle) {
    console.log('  ⏭️  User profile fields already exist, skipping...');
    return;
  }

  // Only add if they don't exist (legacy support)
  return knex.schema.table('users', function(table) {
    table.string('job_title');
    table.string('current_level');
    table.string('industry');
    table.string('field');
    table.integer('experience_years');
    table.decimal('current_salary', 15, 2);
    table.string('education');
    table.string('nationality');
    table.string('marital_status');
    table.string('country');
    table.string('province');
    table.string('desired_location');
    table.decimal('desired_salary', 15, 2);
  });
};

exports.down = async function(knex) {
  // Check if columns exist before trying to drop
  const hasJobTitle = await knex.schema.hasColumn('users', 'job_title');
  
  if (!hasJobTitle) {
    console.log('  ⏭️  User profile fields do not exist, skipping...');
    return;
  }

  return knex.schema.table('users', function(table) {
    table.dropColumn('job_title');
    table.dropColumn('current_level');
    table.dropColumn('industry');
    table.dropColumn('field');
    table.dropColumn('experience_years');
    table.dropColumn('current_salary');
    table.dropColumn('education');
    table.dropColumn('nationality');
    table.dropColumn('marital_status');
    table.dropColumn('country');
    table.dropColumn('province');
    table.dropColumn('desired_location');
    table.dropColumn('desired_salary');
  });
};
