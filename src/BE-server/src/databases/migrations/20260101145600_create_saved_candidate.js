/**
 * Migration: Create saved_candidate table
 * Allows employers to save promising candidates for future reference
 */

exports.up = function(knex) {
  return knex.schema.createTable('saved_candidate', (table) => {
    // Composite primary key
    table.bigInteger('employer_id').notNullable()
      .references('employer_id').inTable('employer')
      .onDelete('CASCADE');
    table.uuid('user_id').notNullable()
      .references('user_id').inTable('users')
      .onDelete('CASCADE');
    
    // Additional fields
    table.text('notes'); // Optional notes about the candidate
    table.timestamp('saved_at').defaultTo(knex.fn.now());
    
    // Composite primary key
    table.primary(['employer_id', 'user_id']);
    
    // Indexes for performance
    table.index('employer_id');
    table.index('user_id');
    table.index('saved_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('saved_candidate');
};
