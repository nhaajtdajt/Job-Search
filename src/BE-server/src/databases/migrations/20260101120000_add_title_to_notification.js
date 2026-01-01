/**
 * Add title column to notification table
 */
exports.up = function (knex) {
    return knex.schema.alterTable('notification', function (table) {
        table.string('title', 255).nullable();
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('notification', function (table) {
        table.dropColumn('title');
    });
};
