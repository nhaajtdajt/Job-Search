const SavedRepository = require('../repositories/saved.repo');
const SavedSearchRepository = require('../repositories/saved_search.repo');
const UserRepository = require('../repositories/user.repo');
const EmailService = require('./email.service');
const NotificationService = require('./notification.service');
const { getUserEmailById } = require('../utils/supabase.util');
const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * Job Match Service (Similarity Recommendation + Saved Search Matching)
 * Notifies users when new jobs match their saved search settings or saved job history
 */
class JobMatchService {
    /**
     * Check if a new job matches users' criteria and notify them
     * @param {Object} job - The newly created job object with tag_ids and skill_ids
     */
    static async checkAndNotifyMatches(job) {
        try {
            console.log(`🔍 Checking job matches for job ID: ${job.job_id}`);

            // 1. Check saved search settings (Job Notifications)
            await this.checkSavedSearchMatches(job);

            // 2. Check similarity with saved jobs history
            await this.checkSimilarityMatches(job);

        } catch (error) {
            console.error('❌ Error in job matching:', error.message);
        }
    }

    /**
     * Check if job matches any saved search settings and notify users
     * @param {Object} job - Job object
     */
    static async checkSavedSearchMatches(job) {
        try {
            // Get all saved searches with active notification
            const savedSearches = await db(MODULE.SAVED_SEARCH)
                .select('*')
                .whereRaw("filter IS NOT NULL AND filter != '{}'");

            if (!savedSearches || savedSearches.length === 0) {
                console.log('📋 No saved searches to check');
                return;
            }

            console.log(`📋 Checking ${savedSearches.length} saved searches...`);

            // Get job locations for matching
            const jobLocations = await db(MODULE.JOB_LOCATION)
                .join(MODULE.LOCATION, 'job_location.location_id', 'location.location_id')
                .where('job_location.job_id', job.job_id)
                .select('location.location_name');
            const jobLocationNames = jobLocations.map(l => l.location_name.toLowerCase());

            // Get full job details (may have industry, rank not in the job object)
            const fullJob = await db(MODULE.JOB)
                .where('job_id', job.job_id)
                .first();

            // Get employer and company info
            const employer = await db(MODULE.EMPLOYER)
                .where('employer_id', job.employer_id)
                .first();
            let companyName = 'Công ty';
            let companyField = '';
            if (employer?.company_id) {
                const company = await db(MODULE.COMPANY)
                    .where('company_id', employer.company_id)
                    .first();
                companyName = company?.company_name || 'Công ty';
                companyField = company?.company_field || company?.company_type || '';
            }

            // Merge job data for matching
            const jobForMatching = {
                ...job,
                ...fullJob,
                company_field: companyField
            };

            const matchedUsers = [];

            for (const search of savedSearches) {
                try {
                    let filter = search.filter;
                    if (typeof filter === 'string') {
                        filter = JSON.parse(filter);
                    }

                    // Skip if notification is disabled
                    if (filter.is_active === false) continue;

                    // Check if job matches the search criteria
                    const matches = this.jobMatchesSearch(jobForMatching, filter, jobLocationNames);

                    if (matches) {
                        matchedUsers.push({
                            user_id: search.user_id,
                            search_name: search.name,
                            notify_via: filter.notify_via || 'both'
                        });
                    }
                } catch (e) {
                    console.error(`Error parsing saved search ${search.stt}:`, e.message);
                }
            }

            if (matchedUsers.length === 0) {
                console.log('📋 No matching saved searches found');
                return;
            }

            console.log(`✅ Found ${matchedUsers.length} users with matching saved search`);

            // Send notifications
            await this.sendSavedSearchNotifications(job, matchedUsers, companyName);

        } catch (error) {
            console.error('❌ Error checking saved search matches:', error.message);
        }
    }

    /**
     * Check if a job matches search criteria
     * @param {Object} job - Job object
     * @param {Object} filter - Saved search filter
     * @param {Array} jobLocationNames - Array of job location names (lowercase)
     * @returns {boolean} True if matches
     */
    static jobMatchesSearch(job, filter, jobLocationNames) {
        // Match job title/name (required)
        if (filter.search_query || filter.name) {
            const searchQuery = (filter.search_query || filter.name || '').toLowerCase();
            const jobTitle = (job.job_title || '').toLowerCase();
            
            // Simple keyword matching - check if search query is in job title
            if (!jobTitle.includes(searchQuery) && !searchQuery.split(' ').some(word => jobTitle.includes(word))) {
                return false;
            }
        }

        // Match location
        if (filter.location) {
            const searchLocation = filter.location.toLowerCase();
            if (!jobLocationNames.some(loc => loc.includes(searchLocation) || searchLocation.includes(loc))) {
                // Only fail if there are locations but none match
                if (jobLocationNames.length > 0) {
                    return false;
                }
            }
        }

        // Match salary (job salary_min should be >= user's minimum requirement)
        if (filter.salary_min && filter.salary_min > 0) {
            const jobSalaryMin = job.salary_min || 0;
            // Job should pay at least what user wants
            if (jobSalaryMin > 0 && jobSalaryMin < filter.salary_min) {
                return false;
            }
        }

        // Match level (job level/rank should match user's preference)
        if (filter.level) {
            const searchLevel = filter.level.toLowerCase();
            const jobLevel = (job.rank || job.level || '').toLowerCase();
            // Check for partial match (e.g., "Senior" matches "Senior (5+ năm)")
            if (jobLevel && !jobLevel.includes(searchLevel) && !searchLevel.includes(jobLevel)) {
                return false;
            }
        }

        // Match industry (job industry should match)
        if (filter.industry) {
            const searchIndustry = filter.industry.toLowerCase();
            const jobIndustry = (job.industry || '').toLowerCase();
            if (jobIndustry && !jobIndustry.includes(searchIndustry) && !searchIndustry.includes(jobIndustry)) {
                return false;
            }
        }

        // Match company_field (company type should match)
        if (filter.company_field) {
            const searchField = filter.company_field.toLowerCase();
            const companyField = (job.company_field || job.company_type || '').toLowerCase();
            if (companyField && !companyField.includes(searchField) && !searchField.includes(companyField)) {
                return false;
            }
        }

        // All criteria matched!
        return true;
    }

    /**
     * Send notifications to users with matching saved search
     * @param {Object} job - Job object
     * @param {Array} matchedUsers - List of { user_id, search_name, notify_via }
     * @param {string} companyName - Company name
     */
    static async sendSavedSearchNotifications(job, matchedUsers, companyName) {
        for (const { user_id, search_name, notify_via } of matchedUsers) {
            try {
                const user = await UserRepository.findById(user_id);
                const userName = user?.name || 'Bạn';

                // Send in-app notification (if notify_via is 'app' or 'both')
                if (notify_via === 'app' || notify_via === 'both') {
                    await NotificationService.createNotification(
                        user_id,
                        'Việc làm phù hợp!',
                        `Có việc làm mới phù hợp với tìm kiếm "${search_name}": ${job.job_title} tại ${companyName}.`,
                        {
                            type: 'job_match',
                            job_id: job.job_id,
                            search_name: search_name
                        }
                    );
                    console.log(`🔔 In-app notification sent to user ${user_id}`);
                }

                // Send email notification (if notify_via is 'email' or 'both')
                if (notify_via === 'email' || notify_via === 'both') {
                    const userEmail = await getUserEmailById(user_id);
                    if (userEmail) {
                        await EmailService.sendJobMatchEmail(userEmail, {
                            userName: userName,
                            searchName: search_name,
                            jobTitle: job.job_title,
                            companyName: companyName,
                            jobType: job.job_type,
                            salaryMin: job.salary_min,
                            salaryMax: job.salary_max,
                            jobId: job.job_id
                        });
                        console.log(`📧 Job match email sent to user ${user_id}`);
                    }
                }

            } catch (error) {
                console.error(`❌ Failed to notify user ${user_id}:`, error.message);
            }
        }
    }

    /**
     * Check similarity with saved jobs history (original logic)
     * @param {Object} job - Job object
     */
    static async checkSimilarityMatches(job) {
        try {
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

            // Send notifications (email only for backward compatibility)
            await this.sendSimilarityNotifications(job, results);

        } catch (error) {
            console.error('❌ Error in job similarity check:', error.message);
        }
    }

    /**
     * Send email notifications to matched users (similarity-based)
     * @param {Object} job - Job object
     * @param {Array} matchedUsers - List of { user_id }
     */
    static async sendSimilarityNotifications(job, matchedUsers) {
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

