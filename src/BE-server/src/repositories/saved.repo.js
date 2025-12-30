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
  /**
   * Find users who have saved jobs similar to the new job
   * Criteria: Same job_type AND (share at least one skill OR tag)
   * @param {string} jobType - Job type (e.g. 'full-time')
   * @param {Array<number>} tagIds - List of tag IDs from new job
   * @param {Array<string>} skillIds - List of skill IDs from new job
   * @returns {Array} List of distinct { user_id }
   */
  static async findUsersWithSimilarSavedJobs(jobType, tagIds, skillIds) {
    const query = db(MODULE.SAVED_JOB)
      .distinct('saved_job.user_id')
      .join(MODULE.JOB, 'saved_job.job_id', `${MODULE.JOB}.job_id`)
      .leftJoin(MODULE.JOB_SKILL, `${MODULE.JOB}.job_id`, `${MODULE.JOB_SKILL}.job_id`)
      .leftJoin(MODULE.JOB_TAG, `${MODULE.JOB}.job_id`, `${MODULE.JOB_TAG}.job_id`)
      .where(`${MODULE.JOB}.job_type`, jobType);

    query.andWhere(builder => {
      let hasCondition = false;

      if (skillIds && skillIds.length > 0) {
        builder.orWhereIn(`${MODULE.JOB_SKILL}.skill_id`, skillIds);
        hasCondition = true;
      }

      if (tagIds && tagIds.length > 0) {
        builder.orWhereIn(`${MODULE.JOB_TAG}.tag_id`, tagIds);
        hasCondition = true;
      }

      // If no skills/tags provided, we strictly require at least one match
      if (!hasCondition) {
        builder.whereRaw('1 = 0');
      }
    });

    return await query;
  }
}

module.exports = SavedRepository;
