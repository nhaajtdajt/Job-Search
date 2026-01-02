/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
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

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
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
