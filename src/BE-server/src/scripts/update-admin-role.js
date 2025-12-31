/**
 * Quick script to update admin role
 * Run: node src/scripts/update-admin-role.js
 */

require('dotenv').config({ path: '.env.development' });
const knex = require('../databases/knex');

async function updateAdminRole() {
    try {
        const userId = 'a07207db-a612-48f4-b962-03dc9f3a6981';

        const result = await knex('users')
            .where('user_id', userId)
            .update({ role: 'admin' });

        console.log('✅ Updated rows:', result);

        // Verify
        const user = await knex('users').where('user_id', userId).first();
        console.log('✅ User role is now:', user.role);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateAdminRole();
