/**
 * Migration: Create employer_settings table for storing user preferences
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Create employer_settings table
  await knex.schema.createTable('employer_settings', (table) => {
    table.bigIncrements('setting_id').primary();
    table.bigInteger('employer_id').unsigned().notNullable().unique();
    
    // Notification settings
    table.boolean('email_notifications').defaultTo(true);
    table.boolean('application_alerts').defaultTo(true);
    table.boolean('new_candidate_alerts').defaultTo(true);
    table.boolean('weekly_reports').defaultTo(true);
    table.boolean('marketing_emails').defaultTo(false);
    table.boolean('push_notifications').defaultTo(true);
    table.boolean('sms_notifications').defaultTo(false);
    
    // Privacy settings
    table.string('profile_visibility', 20).defaultTo('public'); // public, registered, private
    table.boolean('show_contact_info').defaultTo(true);
    table.boolean('allow_messaging').defaultTo(true);
    
    // Security settings
    table.boolean('two_factor_auth').defaultTo(false);
    table.boolean('login_alerts').defaultTo(true);
    table.string('session_timeout', 10).defaultTo('30'); // minutes or 'never'
    
    // Preferences
    table.string('language', 10).defaultTo('vi');
    table.string('timezone', 50).defaultTo('Asia/Ho_Chi_Minh');
    table.boolean('dark_mode').defaultTo(false);
    
    // Timestamps
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    
    // Foreign key
    table.foreign('employer_id').references('employer_id').inTable('employer').onDelete('CASCADE');
  });

  // Add account_status column to employer table if not exists
  const hasStatus = await knex.schema.hasColumn('employer', 'account_status');
  if (!hasStatus) {
    await knex.schema.alterTable('employer', (table) => {
      table.string('account_status', 20).defaultTo('active'); // active, suspended, deleted
      table.timestamp('suspended_at').nullable();
      table.timestamp('deleted_at').nullable();
      table.text('suspension_reason').nullable();
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Drop employer_settings table
  await knex.schema.dropTableIfExists('employer_settings');
  
  // Remove account_status columns from employer
  const hasStatus = await knex.schema.hasColumn('employer', 'account_status');
  if (hasStatus) {
    await knex.schema.alterTable('employer', (table) => {
      table.dropColumn('account_status');
      table.dropColumn('suspended_at');
      table.dropColumn('deleted_at');
      table.dropColumn('suspension_reason');
    });
  }
};
