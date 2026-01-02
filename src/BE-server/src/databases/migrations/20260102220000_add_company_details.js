/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Use raw SQL with IF NOT EXISTS to prevent errors if columns were added manually
  await knex.raw(`
    ALTER TABLE company 
    ADD COLUMN IF NOT EXISTS banner_url TEXT,
    ADD COLUMN IF NOT EXISTS company_size VARCHAR(50),
    ADD COLUMN IF NOT EXISTS email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
    ADD COLUMN IF NOT EXISTS founded_year INTEGER;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('company', function(table) {
    table.dropColumn('banner_url');
    table.dropColumn('company_size');
    table.dropColumn('email');
    table.dropColumn('phone');
    table.dropColumn('founded_year');
  });
};
