const UserRepository = require('../repositories/user.repo');
const EmployerRepository = require('../repositories/employer.repo');
const CompanyRepository = require('../repositories/company.repo');
const JobRepository = require('../repositories/job.repo');
const { createClient } = require('@supabase/supabase-js');
const environment = require('../configs/environment.config');

// Initialize Supabase client for admin operations
const supabaseUrl = environment.SUPABASE_URL;
const supabaseKey = environment.SUPABASE_SERVICE_ROLE_KEY || environment.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

/**
 * Admin Service
 * Business logic for admin operations
 */
class AdminService {
  /**
   * Get all users with pagination and filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (role)
   */
  static async getUsers(page = 1, limit = 10, filters = {}) {
    return await UserRepository.findAll(page, limit, filters);
  }

  /**
   * Update user status (block/unblock)
   * @param {string} userId - User ID
   * @param {string} status - Status (active, blocked)
   */
  static async updateUserStatus(userId, status) {
    // Update in Supabase Auth
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: status === 'blocked' ? '876000h' : '0s' // ~100 years for blocked, 0 for active
    });

    if (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }

    return { userId, status };
  }

  /**
   * Get all employers with pagination and filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (status, company_id)
   */
  static async getEmployers(page = 1, limit = 10, filters = {}) {
    return await EmployerRepository.findAll(page, limit, filters);
  }

  /**
   * Verify employer
   * @param {number} employerId - Employer ID
   */
  static async verifyEmployer(employerId) {
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    const updated = await EmployerRepository.update(employerId, { status: 'verified' });
    return updated;
  }

  /**
   * Get all companies with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  static async getCompanies(page = 1, limit = 10) {
    const { parsePagination } = require('../utils/pagination.util');
    const { offset } = parsePagination(page, limit);
    const MODULE = require('../constants/module');
    const db = require('../databases/knex');

    const [{ total }] = await db(MODULE.COMPANY).count('* as total');
    
    const data = await db(MODULE.COMPANY)
      .select('*')
      .orderBy('company_id', 'asc')
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
   * Get all jobs with pagination and filters
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters
   */
  static async getJobs(page = 1, limit = 10, filters = {}) {
    return await JobRepository.findAll(page, limit, filters);
  }

  /**
   * Delete job
   * @param {number} jobId - Job ID
   */
  static async deleteJob(jobId) {
    const MODULE = require('../constants/module');
    const db = require('../databases/knex');
    
    return await db(MODULE.JOB)
      .where('job_id', jobId)
      .del();
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
    const MODULE = require('../constants/module');
    const db = require('../databases/knex');

    const [userCount] = await db(MODULE.USERS).count('* as count');
    const [employerCount] = await db(MODULE.EMPLOYER).count('* as count');
    const [companyCount] = await db(MODULE.COMPANY).count('* as count');
    const [jobCount] = await db(MODULE.JOB).count('* as count');
    const [applicationCount] = await db(MODULE.APPLICATION).count('* as count');

    return {
      users: parseInt(userCount.count, 10),
      employers: parseInt(employerCount.count, 10),
      companies: parseInt(companyCount.count, 10),
      jobs: parseInt(jobCount.count, 10),
      applications: parseInt(applicationCount.count, 10)
    };
  }
}

module.exports = AdminService;

