/**
 * Add metadata column to notification table
 * Stores JSON data like { application_id, job_id, user_id, type }
 */

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('notification', (table) => {
    table.jsonb('metadata').nullable().comment('JSON metadata: { type, application_id, job_id, etc. }');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('notification', (table) => {
    table.dropColumn('metadata');
  });
};
