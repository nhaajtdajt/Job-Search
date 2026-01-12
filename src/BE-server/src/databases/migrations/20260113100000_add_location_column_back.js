/**
 * Migration: Add location column back to job table
 * This was accidentally dropped in a previous migration
 */

exports.up = function (knex) {
    return knex.schema.table('job', function (table) {
        table.text('location');
    });
};

exports.down = function (knex) {
    return knex.schema.table('job', function (table) {
        table.dropColumn('location');
    });
};
