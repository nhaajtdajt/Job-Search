const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * Database Cleanup Job
 * Removes old notifications weekly on Sunday at 02:00
 */
async function cleanupJob() {
    console.log('🧹 [CRON] Running: Database Cleanup...');
    const startTime = Date.now();

    try {
        // Delete notifications older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deleted = await db(MODULE.NOTIFICATION)
            .where('created_at', '<', thirtyDaysAgo)
            .del();

        console.log(`✅ [CRON] Deleted ${deleted} old notifications in ${Date.now() - startTime}ms`);
        return { deletedNotifications: deleted };
    } catch (error) {
        console.error('❌ [CRON] Cleanup failed:', error.message);
        throw error;
    }
}

module.exports = cleanupJob;
