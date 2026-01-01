const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * Expire Jobs Job
 * Marks expired jobs as 'expired' daily at midnight
 */
async function expireJobsJob() {
    console.log('🔄 [CRON] Running: Expire Jobs...');
    const startTime = Date.now();

    try {
        const result = await db(MODULE.JOB)
            .where('expired_at', '<', new Date())
            .whereNot('status', 'expired')
            .update({
                status: 'expired',
                updated_at: new Date()
            });

        console.log(`✅ [CRON] Expired ${result} jobs in ${Date.now() - startTime}ms`);
        return { expiredCount: result };
    } catch (error) {
        console.error('❌ [CRON] Expire Jobs failed:', error.message);
        throw error;
    }
}

module.exports = expireJobsJob;
