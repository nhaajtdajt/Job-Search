/**
 * Migration: Add industry column to company table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Add industry column to company table
  await knex.raw(`
    ALTER TABLE company 
    ADD COLUMN IF NOT EXISTS industry VARCHAR(100);
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('company', function(table) {
    table.dropColumn('industry');
  });
};
