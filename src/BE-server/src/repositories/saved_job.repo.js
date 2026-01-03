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
    // Check if user exists in users table
    const userExists = await db(MODULE.USERS).where('user_id', userId).first();
    
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found in users table`);
    }
    
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

    // Enrich with job info and company info
    for (const savedJob of savedJobs) {
      const job = await db(MODULE.JOB)
        .select(
          'job.job_id', 
          'job.job_title', 
          'job.job_type', 
          'job.posted_at',
          'job.salary_min',
          'job.salary_max',
          'job.employer_id',
          'job.status',
          'job.expired_at'
        )
        .where('job.job_id', savedJob.job_id)
        .first();
      
      if (job) {
        // Get employer and company info
        const employer = await db(MODULE.EMPLOYER)
          .select('employer_id', 'company_id')
          .where('employer_id', job.employer_id)
          .first();
        
        if (employer && employer.company_id) {
          const company = await db(MODULE.COMPANY)
            .select('company_id', 'company_name', 'logo_url', 'address')
            .where('company_id', employer.company_id)
            .first();
          
          if (company) {
            job.company_id = company.company_id;
            job.company_name = company.company_name;
            job.company_logo = company.logo_url;
            job.company_address = company.address;
          }
        }
        
        // Get locations
        const locations = await db(MODULE.JOB_LOCATION)
          .join(MODULE.LOCATION, 'job_location.location_id', 'location.location_id')
          .select('location.location_name')
          .where('job_location.job_id', savedJob.job_id);
        
        job.location = locations.map(l => l.location_name).join(', ') || null;
      }
      
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

