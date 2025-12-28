/**
 * Make employer.company_id nullable
 * This allows employers to register without having a company first
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('employer', table => {
    table.bigInteger('company_id').nullable().unsigned().alter();
  });
};

/**
 * Rollback: make company_id NOT NULL again
 * @param { import("knex").Knex } knex
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('employer', table => {
    table.bigInteger('company_id').notNullable().unsigned().alter();
  });
};
