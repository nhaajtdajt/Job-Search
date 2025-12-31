/**
 * Cron Schedule Configuration
 */
module.exports = {
    // Expire Jobs - Daily at midnight
    EXPIRE_JOBS: '0 0 * * *',

    // Database Cleanup - Weekly Sunday at 02:00
    CLEANUP_DB: '0 2 * * 0'
};
