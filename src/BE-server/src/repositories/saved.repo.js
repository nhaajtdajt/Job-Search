const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Saved Repository
 * Data access layer for saved_job table
 */
class SavedRepository {
  /**
   * Save a job for user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Object} Created saved job record
   */
  static async saveJob(userId, jobId) {
    const [savedJob] = await db(MODULE.SAVED_JOB)
      .insert({
        user_id: userId,
        job_id: jobId,
        saved_at: new Date()
      })
      .returning('*');
    
    return savedJob;
  }

  /**
   * Remove saved job
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {number} Number of deleted rows
   */
  static async unsaveJob(userId, jobId) {
    return await db(MODULE.SAVED_JOB)
      .where({ user_id: userId, job_id: jobId })
      .del();
  }

  /**
   * Get user's saved jobs with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated saved jobs with job details
   */
  static async findSavedJobs(userId, page = 1, limit = 10) {
    const { offset } = parsePagination(page, limit);

    // Get total count
    const [{ total }] = await db(MODULE.SAVED_JOB)
      .where('user_id', userId)
      .count('* as total');

    // Get saved jobs with job details
    const data = await db(MODULE.SAVED_JOB)
      .select(
        'saved_job.*',
        'job.job_id',
        'job.job_title',
        'job.job_type',
        'job.salary_min',
        'job.salary_max',
        'job.posted_at',
        'job.expired_at'
      )
      .leftJoin('job', 'saved_job.job_id', 'job.job_id')
      .where('saved_job.user_id', userId)
      .orderBy('saved_job.saved_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: parseInt(total, 10),
      page,
      limit
    };
  }

  /**
   * Check if job is saved by user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {boolean} True if saved
   */
  static async isSaved(userId, jobId) {
    const saved = await db(MODULE.SAVED_JOB)
      .where({ user_id: userId, job_id: jobId })
      .first();
    
    return !!saved;
  }

  /**
   * Count user's saved jobs
   * @param {string} userId - User ID
   * @returns {number} Count of saved jobs
   */
  static async countSavedJobs(userId) {
    const [{ count }] = await db(MODULE.SAVED_JOB)
      .where('user_id', userId)
      .count('* as count');
    
    return parseInt(count, 10);
  }
}

module.exports = SavedRepository;
