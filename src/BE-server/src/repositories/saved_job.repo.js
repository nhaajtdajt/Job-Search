const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Saved Job Repository
 * Data access layer for Saved Job table
 */
class SavedJobRepository {
  /**
   * Save a job for a user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Object} Saved job record
   */
  static async save(userId, jobId) {
    const [savedJob] = await db(MODULE.SAVED_JOB)
      .insert({
        user_id: userId,
        job_id: jobId,
        saved_at: new Date()
      })
      .onConflict(['user_id', 'job_id'])
      .merge({ saved_at: new Date() }) // Update saved_at if already exists
      .returning('*');
    
    return savedJob;
  }

  /**
   * Unsave a job for a user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {number} Number of deleted rows
   */
  static async unsave(userId, jobId) {
    return await db(MODULE.SAVED_JOB)
      .where({
        user_id: userId,
        job_id: jobId
      })
      .del();
  }

  /**
   * Check if a job is saved by user
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {boolean} True if saved
   */
  static async isSaved(userId, jobId) {
    const saved = await db(MODULE.SAVED_JOB)
      .where({
        user_id: userId,
        job_id: jobId
      })
      .first();
    
    return !!saved;
  }

  /**
   * Get all saved jobs for a user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated saved jobs
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    const { offset } = parsePagination(page, limit);

    const [{ total }] = await db(MODULE.SAVED_JOB)
      .where('user_id', userId)
      .count('* as total');

    const savedJobs = await db(MODULE.SAVED_JOB)
      .select('saved_job.*')
      .where('saved_job.user_id', userId)
      .orderBy('saved_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Enrich with job info
    for (const savedJob of savedJobs) {
      const job = await db(MODULE.JOB)
        .select('job_id', 'job_title', 'job_type', 'posted_at')
        .where('job_id', savedJob.job_id)
        .first();
      savedJob.job = job || null;
    }

    return {
      data: savedJobs,
      total: parseInt(total, 10),
      page,
      limit
    };
  }

  /**
   * Count saved jobs for a user
   * @param {string} userId - User ID
   * @returns {number} Count of saved jobs
   */
  static async countByUserId(userId) {
    const result = await db(MODULE.SAVED_JOB)
      .where('user_id', userId)
      .count('* as count')
      .first();
    
    return parseInt(result.count, 10);
  }
}

module.exports = SavedJobRepository;

