/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('job', function(table) {
    table.text('location');
    table.boolean('is_remote').defaultTo(false);
    table.string('experience_level', 50);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('job', function(table) {
    table.dropColumn('location');
    table.dropColumn('is_remote');
    table.dropColumn('experience_level');
  });
};
