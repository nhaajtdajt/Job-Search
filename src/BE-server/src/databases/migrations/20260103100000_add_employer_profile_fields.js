/**
 * Migration: Add phone, position, department columns to employer table
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Use raw SQL with IF NOT EXISTS to prevent errors if columns were added manually
  await knex.raw(`
    ALTER TABLE employer 
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS position VARCHAR(100),
    ADD COLUMN IF NOT EXISTS department VARCHAR(100);
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('employer', function(table) {
    table.dropColumn('phone');
    table.dropColumn('position');
    table.dropColumn('department');
  });
};
