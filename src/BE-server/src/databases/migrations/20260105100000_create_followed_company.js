/**
 * Migration: Create followed_company table
 * Allows users (job seekers) to follow companies
 */

exports.up = function(knex) {
  return knex.schema.createTable('followed_company', (table) => {
    table.uuid('user_id').notNullable();
    table.bigInteger('company_id').notNullable();
    table.timestamp('followed_at', { useTz: true }).defaultTo(knex.fn.now());
    
    // Composite primary key
    table.primary(['user_id', 'company_id']);
    
    // Foreign key constraints
    table.foreign('user_id')
      .references('user_id')
      .inTable('users')
      .onDelete('CASCADE');
    
    table.foreign('company_id')
      .references('company_id')
      .inTable('company')
      .onDelete('CASCADE');
    
    // Index for faster queries
    table.index(['user_id'], 'followed_company_user_id_idx');
    table.index(['company_id'], 'followed_company_company_id_idx');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('followed_company');
};
