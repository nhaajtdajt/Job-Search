/**
 * Migration: Add status column to job table
 * Status values: 'draft', 'published', 'expired'
 */

exports.up = function(knex) {
  return knex.schema.alterTable('job', function(table) {
    // Add status column with default 'draft'
    table.string('status', 20).defaultTo('draft');
  }).then(function() {
    // Update existing jobs based on current data
    return knex.raw(`
      UPDATE job SET status = 
        CASE 
          WHEN expired_at IS NOT NULL AND expired_at < NOW() THEN 'expired'
          WHEN posted_at IS NOT NULL THEN 'published'
          ELSE 'draft'
        END
    `);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('job', function(table) {
    table.dropColumn('status');
  });
};
