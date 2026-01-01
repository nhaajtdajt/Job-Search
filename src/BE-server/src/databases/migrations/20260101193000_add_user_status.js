/**
 * Migration: Add status column to users table
 * 
 * This adds a status column to track user status (active/blocked)
 */
exports.up = async function (knex) {
    await knex.raw(`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
  `);

    // Add check constraint
    await knex.raw(`
    ALTER TABLE users 
    DROP CONSTRAINT IF EXISTS users_status_check;
    
    ALTER TABLE users 
    ADD CONSTRAINT users_status_check 
    CHECK (status IN ('active', 'blocked'));
  `);
};

exports.down = async function (knex) {
    await knex.raw(`
    ALTER TABLE users 
    DROP CONSTRAINT IF EXISTS users_status_check;
    
    ALTER TABLE users 
    DROP COLUMN IF EXISTS status;
  `);
};
