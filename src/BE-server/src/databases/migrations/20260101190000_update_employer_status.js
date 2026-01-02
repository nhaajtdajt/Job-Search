/**
 * Migration: Update employer status to only allow verified/suspended
 * 
 * This migration:
 * 1. Converts all non-suspended status values to 'verified'
 * 2. Sets default value for status column to 'verified'
 * 3. Adds check constraint to only allow 'verified' or 'suspended'
 */
exports.up = async function (knex) {
    // Update all existing records: anything not 'suspended' becomes 'verified'
    await knex('employer')
        .whereNot('status', 'suspended')
        .orWhereNull('status')
        .update({ status: 'verified' });

    // Set default value for status column
    await knex.schema.alterTable('employer', table => {
        table.string('status', 50).defaultTo('verified').alter();
    });

    // Add check constraint (PostgreSQL)
    await knex.raw(`
    ALTER TABLE employer 
    DROP CONSTRAINT IF EXISTS employer_status_check;
    
    ALTER TABLE employer 
    ADD CONSTRAINT employer_status_check 
    CHECK (status IN ('verified', 'suspended'));
  `);
};

exports.down = async function (knex) {
    // Remove check constraint
    await knex.raw(`
    ALTER TABLE employer 
    DROP CONSTRAINT IF EXISTS employer_status_check;
  `);

    // Remove default
    await knex.schema.alterTable('employer', table => {
        table.string('status', 50).alter();
    });
};
