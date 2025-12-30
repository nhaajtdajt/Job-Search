const SavedRepository = require('../repositories/saved.repo');
const JobRepository = require('../repositories/job.repo');
const { NotFoundError, BadRequestError } = require('../errors');

/**
 * Saved Service
 * Business logic for saved jobs
 */
class SavedService {
  /**
   * Save a job for user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Object} Saved job record
   */
  static async saveJob(userId, jobId) {
    // Validate job exists
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    // Check if already saved
    const alreadySaved = await SavedRepository.isSaved(userId, jobId);
    if (alreadySaved) {
      throw new BadRequestError('You have already saved this job');
    }

    const savedJob = await SavedRepository.saveJob(userId, jobId);
    return savedJob;
  }

  /**
   * Remove saved job
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Object} Success message
   */
  static async unsaveJob(userId, jobId) {
    // Check if job is saved
    const isSaved = await SavedRepository.isSaved(userId, jobId);
    if (!isSaved) {
      throw new NotFoundError('Job is not in your saved list');
    }

    await SavedRepository.unsaveJob(userId, jobId);
    return { message: 'Job removed from saved list' };
  }

  /**
   * Get user's saved jobs
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated saved jobs
   */
  static async getSavedJobs(userId, page = 1, limit = 10) {
    const result = await SavedRepository.findSavedJobs(userId, page, limit);
    return result;
  }

  /**
   * Check if job is saved by user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Object} { is_saved: boolean }
   */
  static async checkJobSaved(userId, jobId) {
    const isSaved = await SavedRepository.isSaved(userId, jobId);
    return { is_saved: isSaved };
  }
}

module.exports = SavedService;
