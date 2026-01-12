/**
 * Migration: Add extra columns to job table
 * - industry: Job industry/field
 * - is_salary_visible: Whether salary is visible on job posting  
 * - address: Detailed address of work location
 */

exports.up = function(knex) {
  return knex.schema.alterTable('job', function(table) {
    table.string('industry', 100);
    table.boolean('is_salary_visible').defaultTo(true);
    table.text('address');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('job', function(table) {
    table.dropColumn('industry');
    table.dropColumn('is_salary_visible');
    table.dropColumn('address');
  });
};
