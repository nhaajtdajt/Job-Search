const cron = require('node-cron');
const CRON_CONFIG = require('../configs/cron.config');
const expireJobsJob = require('./expire-jobs.job');
const cleanupJob = require('./cleanup.job');

/**
 * Background Jobs Manager
 */
class JobsManager {
    static jobs = [];

    static init() {
        console.log('🕐 Initializing background jobs...');

        // Expire Jobs - Daily at midnight
        const expireJob = cron.schedule(CRON_CONFIG.EXPIRE_JOBS, async () => {
            try { await expireJobsJob(); }
            catch (e) { console.error('Expire job error:', e.message); }
        }, { timezone: 'Asia/Ho_Chi_Minh' });
        this.jobs.push({ name: 'ExpireJobs', job: expireJob });

        // Database Cleanup - Weekly Sunday 02:00
        const cleanup = cron.schedule(CRON_CONFIG.CLEANUP_DB, async () => {
            try { await cleanupJob(); }
            catch (e) { console.error('Cleanup job error:', e.message); }
        }, { timezone: 'Asia/Ho_Chi_Minh' });
        this.jobs.push({ name: 'Cleanup', job: cleanup });

        console.log('✅ Background jobs initialized:');
        console.log('   📌 ExpireJobs: Daily 00:00');
        console.log('   📌 Cleanup: Sunday 02:00');
    }

    static stop() {
        this.jobs.forEach(({ name, job }) => {
            job.stop();
            console.log(`⏹️ Stopped: ${name}`);
        });
    }

    static async runManually(jobName) {
        switch (jobName) {
            case 'expire': return await expireJobsJob();
            case 'cleanup': return await cleanupJob();
            default: throw new Error(`Unknown job: ${jobName}`);
        }
    }
}

module.exports = JobsManager;
