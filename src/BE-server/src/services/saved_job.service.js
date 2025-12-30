const SavedJobRepository = require('../repositories/saved_job.repo');
const JobRepository = require('../repositories/job.repo');
const { NotFoundError, BadRequestError } = require('../errors');

/**
 * Saved Job Service
 * Business logic for saved jobs
 */
class SavedJobService {
  /**
   * Save a job for a user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Object} Saved job record
   */
  static async saveJob(userId, jobId) {
    // Check if job exists
    const job = await JobRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError(`Job with ID ${jobId} not found`);
    }

    // Save the job (will update saved_at if already exists)
    const savedJob = await SavedJobRepository.save(userId, jobId);

    return savedJob;
  }

  /**
   * Unsave a job for a user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Object} Success message
   */
  static async unsaveJob(userId, jobId) {
    const deleted = await SavedJobRepository.unsave(userId, jobId);
    
    if (deleted === 0) {
      throw new NotFoundError('Saved job not found');
    }

    return { message: 'Job unsaved successfully' };
  }

  /**
   * Check if a job is saved by user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {boolean} True if saved
   */
  static async isJobSaved(userId, jobId) {
    return await SavedJobRepository.isSaved(userId, jobId);
  }

  /**
   * Get all saved jobs for a user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated saved jobs
   */
  static async getSavedJobs(userId, page = 1, limit = 10) {
    return await SavedJobRepository.findByUserId(userId, page, limit);
  }

  /**
   * Count saved jobs for a user
   * @param {string} userId - User ID
   * @returns {number} Count of saved jobs
   */
  static async countSavedJobs(userId) {
    return await SavedJobRepository.countByUserId(userId);
  }
}

module.exports = SavedJobService;

