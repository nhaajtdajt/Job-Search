const SavedRepository = require('../repositories/saved.repo');
const UserRepository = require('../repositories/user.repo');
const EmailService = require('./email.service');
const { getUserEmailById } = require('../utils/supabase.util');

/**
 * Job Match Service (Similarity Recommendation)
 * Suggests new jobs based on users' saved job history
 */
class JobMatchService {
    /**
     * Check if a new job is similar to jobs saved by users and notify them
     * @param {Object} job - The newly created job object with tag_ids and skill_ids
     */
    static async checkAndNotifyMatches(job) {
        try {
            console.log(`🔍 Checking job similarity for job ID: ${job.job_id}`);

            // Extract criteria
            const { job_type, tag_ids, skill_ids } = job;

            // Find users who saved similar jobs
            const results = await SavedRepository.findUsersWithSimilarSavedJobs(
                job_type,
                tag_ids || [],
                skill_ids || []
            );

            if (!results || results.length === 0) {
                console.log('📋 No users found with similar saved jobs');
                return;
            }

            console.log(`✅ Found ${results.length} users with similar saved job history`);

            // Send notifications
            await this.sendMatchNotifications(job, results);

        } catch (error) {
            console.error('❌ Error in job similarity check:', error.message);
        }
    }

    /**
     * Send email notifications to matched users
     * @param {Object} job - Job object
     * @param {Array} matchedUsers - List of { user_id }
     */
    static async sendMatchNotifications(job, matchedUsers) {
        const companyName = job.employer?.company?.company_name || 'Công ty';

        for (const { user_id } of matchedUsers) {
            try {
                // Get user info
                const user = await UserRepository.findById(user_id);
                const userEmail = await getUserEmailById(user_id);

                if (!userEmail) {
                    console.warn(`⚠️  Cannot send job match email: User ${user_id} email not found`);
                    continue;
                }

                // Send email
                await EmailService.sendJobMatchEmail(userEmail, {
                    userName: user?.name || 'Bạn',
                    searchName: 'Lịch sử lưu công việc', // Fallback for template
                    jobTitle: job.job_title,
                    companyName: companyName,
                    jobType: job.job_type,
                    salaryMin: job.salary_min,
                    salaryMax: job.salary_max,
                    jobId: job.job_id
                });

                console.log(`📧 Job recommendation email sent to user ${user_id}`);

            } catch (error) {
                console.error(`❌ Failed to send recommendation email to user ${user_id}:`, error.message);
            }
        }
    }
}

module.exports = JobMatchService;
