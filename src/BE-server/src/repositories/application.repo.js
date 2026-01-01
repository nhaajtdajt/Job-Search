const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Application Repository
 * Data access layer for Application table
 */
class ApplicationRepository {
  /**
   * Create a new application
   * @param {Object} applicationData - Application data
   * @returns {Object} Created application
   */
  static async create(applicationData) {
    const [application] = await db(MODULE.APPLICATION)
      .insert(applicationData)
      .returning('*');
    
    return application;
  }

  /**
   * Find application by ID with related data
   * @param {number} applicationId - Application ID
   * @returns {Object|null} Application with job, resume, and user info
   */
  static async findById(applicationId) {
    const application = await db(MODULE.APPLICATION)
      .select('application.*')
      .where('application.application_id', applicationId)
      .first();

    if (!application) return null;

    // Get job info with company
    const job = await db(MODULE.JOB)
      .select('job.job_id', 'job.job_title', 'job.job_type', 'job.employer_id')
      .where('job.job_id', application.job_id)
      .first();

    if (job) {
      const employer = await db(MODULE.EMPLOYER)
        .select('employer_id', 'company_id', 'full_name')
        .where('employer_id', job.employer_id)
        .first();
      
      if (employer) {
        const company = await db(MODULE.COMPANY)
          .select('company_id', 'company_name', 'logo_url')
          .where('company_id', employer.company_id)
          .first();
        
        job.company = company || null;
      }
    }

    // Get resume info
    const resume = await db(MODULE.RESUME)
      .select('resume_id', 'resume_title', 'resume_url')
      .where('resume_id', application.resume_id)
      .first();

    // Get user info with email from auth.users
    const user = await db(MODULE.USERS)
      .leftJoin('auth.users as au', 'users.user_id', 'au.id')
      .select('users.user_id', 'users.name', 'au.email', 'users.phone', 'users.avatar_url')
      .where('users.user_id', application.user_id)
      .first();

    application.job = job || null;
    application.resume = resume || null;
    application.user = user || null;

    return application;
  }

  /**
   * Find all applications by user ID with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (status)
   * @returns {Object} Paginated applications
   */
  static async findByUserId(userId, page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    let query = db(MODULE.APPLICATION).where('user_id', userId);
    
    // Apply filters
    if (filters.status) {
      query = query.where('status', filters.status);
    }

    const [{ total }] = await query.clone().count('* as total');

    const data = await query
      .orderBy('apply_date', 'desc')
      .limit(limit)
      .offset(offset);

    // Enrich with job info
    for (const application of data) {
      const job = await db(MODULE.JOB)
        .select('job_id', 'job_title', 'job_type')
        .where('job_id', application.job_id)
        .first();
      application.job = job || null;
    }

    return {
      data,
      total: parseInt(total, 10),
      page,
      limit
    };
  }

  /**
   * Find applications by job ID with pagination
   * @param {number} jobId - Job ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (status)
   * @returns {Object} Paginated applications
   */
  static async findByJobId(jobId, page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    let query = db(MODULE.APPLICATION).where('job_id', jobId);
    
    // Apply filters
    if (filters.status) {
      query = query.where('status', filters.status);
    }

    const [{ total }] = await query.clone().count('* as total');

    const data = await query
      .orderBy('apply_date', 'desc')
      .limit(limit)
      .offset(offset);

    // Enrich with user and resume info
    for (const application of data) {
      // Get user with email from auth.users
      const user = await db(MODULE.USERS)
        .leftJoin('auth.users as au', 'users.user_id', 'au.id')
        .select('users.user_id', 'users.name', 'au.email', 'users.phone')
        .where('users.user_id', application.user_id)
        .first();
      
      const resume = await db(MODULE.RESUME)
        .select('resume_id', 'resume_title', 'resume_url')
        .where('resume_id', application.resume_id)
        .first();
      
      application.user = user || null;
      application.resume = resume || null;
    }

    return {
      data,
      total: parseInt(total, 10),
      page,
      limit
    };
  }

  /**
   * Find all applications for employer's jobs
   * @param {number} employerId - Employer ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (status, job_id)
   * @returns {Object} Paginated applications
   */
  static async findByEmployerId(employerId, page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    // Get all job IDs for this employer
    const employerJobs = await db(MODULE.JOB)
      .select('job_id')
      .where('employer_id', employerId);
    
    const jobIds = employerJobs.map(j => j.job_id);
    
    if (jobIds.length === 0) {
      return { data: [], total: 0, page, limit };
    }

    let query = db(MODULE.APPLICATION).whereIn('job_id', jobIds);
    
    // Apply filters
    if (filters.status) {
      query = query.where('status', filters.status);
    }
    if (filters.job_id) {
      query = query.where('job_id', filters.job_id);
    }

    const [{ total }] = await query.clone().count('* as total');

    const data = await query
      .orderBy('apply_date', 'desc')
      .limit(limit)
      .offset(offset);

    // Enrich with job, user, and resume info
    for (const application of data) {
      const job = await db(MODULE.JOB)
        .select('job_id', 'job_title', 'job_type')
        .where('job_id', application.job_id)
        .first();
      
      // Get user with email from auth.users
      const user = await db(MODULE.USERS)
        .leftJoin('auth.users as au', 'users.user_id', 'au.id')
        .select('users.user_id', 'users.name', 'au.email', 'users.phone')
        .where('users.user_id', application.user_id)
        .first();
      
      const resume = await db(MODULE.RESUME)
        .select('resume_id', 'resume_title', 'resume_url')
        .where('resume_id', application.resume_id)
        .first();
      
      application.job = job || null;
      application.user = user || null;
      application.resume = resume || null;
    }

    return {
      data,
      total: parseInt(total, 10),
      page,
      limit
    };
  }

  /**
   * Check if user already applied to a job
   * @param {string} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {boolean} True if already applied
   */
  static async hasApplied(userId, jobId) {
    const application = await db(MODULE.APPLICATION)
      .where({ user_id: userId, job_id: jobId })
      .first();
    
    return !!application;
  }

  /**
   * Check if application belongs to user
   * @param {number} applicationId - Application ID
   * @param {string} userId - User ID
   * @returns {boolean} True if user owns the application
   */
  static async isOwnedByUser(applicationId, userId) {
    const application = await db(MODULE.APPLICATION)
      .select('application_id')
      .where({ application_id: applicationId, user_id: userId })
      .first();
    
    return !!application;
  }

  /**
   * Update application
   * @param {number} applicationId - Application ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated application
   */
  static async update(applicationId, updateData) {
    // Add updated_at timestamp
    updateData.updated_at = new Date();

    const [application] = await db(MODULE.APPLICATION)
      .where('application_id', applicationId)
      .update(updateData)
      .returning('*');
    
    return application;
  }

  /**
   * Update application status
   * @param {number} applicationId - Application ID
   * @param {string} status - New status
   * @returns {Object} Updated application
   */
  static async updateStatus(applicationId, status) {
    const [application] = await db(MODULE.APPLICATION)
      .where('application_id', applicationId)
      .update({
        status,
        updated_at: new Date()
      })
      .returning('*');
    
    return application;
  }

  /**
   * Add or update notes for an application
   * @param {number} applicationId - Application ID
   * @param {string} notes - Notes to add
   * @returns {Object} Updated application
   */
  static async addNotes(applicationId, notes) {
    const [application] = await db(MODULE.APPLICATION)
      .where('application_id', applicationId)
      .update({
        notes,
        updated_at: new Date()
      })
      .returning('*');
    
    return application;
  }

  /**
   * Delete application
   * @param {number} applicationId - Application ID
   * @returns {number} Number of deleted rows
   */
  static async delete(applicationId) {
    return await db(MODULE.APPLICATION)
      .where('application_id', applicationId)
      .del();
  }

  /**
   * Get application statistics for a user
   * @param {string} userId - User ID
   * @returns {Object} Statistics object
   */
  static async getStatistics(userId) {
    const total = await db(MODULE.APPLICATION)
      .where('user_id', userId)
      .count('* as count')
      .first();

    const statusCounts = await db(MODULE.APPLICATION)
      .where('user_id', userId)
      .select('status')
      .count('* as count')
      .groupBy('status');

    const stats = {
      total: parseInt(total.count, 10),
      by_status: {}
    };

    statusCounts.forEach(row => {
      stats.by_status[row.status] = parseInt(row.count, 10);
    });

    return stats;
  }
}

module.exports = ApplicationRepository;
