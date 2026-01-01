/**
 * Add title column to notification table
 * Run: node src/scripts/add-notification-title.js
 */

require('dotenv').config({ path: '.env.development' });
const db = require('../databases/knex');

async function addTitleColumn() {
    try {
        console.log('🔄 Adding title column to notification table...');

        // Check if column already exists
        const result = await db.raw(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'notification' AND column_name = 'title'
        `);

        if (result.rows && result.rows.length > 0) {
            console.log('✅ Column "title" already exists!');
            process.exit(0);
        }

        // Add column
        await db.raw(`
            ALTER TABLE notification 
            ADD COLUMN title VARCHAR(255) NULL
        `);

        console.log('✅ Successfully added "title" column to notification table!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

addTitleColumn();
