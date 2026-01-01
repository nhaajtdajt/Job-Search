const UserRepository = require('../repositories/user.repo');
const EmployerRepository = require('../repositories/employer.repo');
const CompanyRepository = require('../repositories/company.repo');
const JobRepository = require('../repositories/job.repo');
const { createClient } = require('@supabase/supabase-js');
const environment = require('../configs/environment.config');
const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

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
   */
  static async getUsers(page = 1, limit = 10, filters = {}) {
    return await UserRepository.findAll(page, limit, filters);
  }

  /**
   * Update user status (block/unblock)
   * Updates both Supabase auth and local users table
   */
  static async updateUserStatus(userId, status) {
    // Update Supabase auth (ban/unban user)
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      ban_duration: status === 'blocked' ? '876000h' : '0s'
    });

    if (error) {
      throw new Error(`Failed to update user status: ${error.message}`);
    }

    // Also update status in local users table
    await db(MODULE.USERS)
      .where('user_id', userId)
      .update({ status });

    return { userId, status };
  }

  /**
   * Get all employers with pagination and filters
   * JOIN with company table to get company_name
   * Include job_count for each employer
   */
  static async getEmployers(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    // Build WHERE conditions
    let countQuery = db(MODULE.EMPLOYER);
    let dataQuery = db(MODULE.EMPLOYER)
      .select(
        'employer.*',
        'company.company_name',
        db.raw('(SELECT COUNT(*) FROM job WHERE job.employer_id = employer.employer_id) as job_count')
      )
      .leftJoin('company', 'employer.company_id', 'company.company_id');

    if (filters.status) {
      countQuery = countQuery.where('employer.status', filters.status);
      dataQuery = dataQuery.where('employer.status', filters.status);
    }

    const [{ total }] = await countQuery.count('* as total');

    const data = await dataQuery
      .orderBy('employer.employer_id', 'asc')
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
   * Update employer status (verify or suspend)
   * @param {number} employerId - Employer ID
   * @param {string} status - 'verified' or 'suspended'
   */
  static async updateEmployerStatus(employerId, status) {
    const { EMPLOYER_STATUS } = require('../constants/employer-status');

    // Validate status
    const validStatuses = Object.values(EMPLOYER_STATUS);
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be: ${validStatuses.join(' or ')}`);
    }

    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    const updated = await EmployerRepository.update(employerId, { status });
    return updated;
  }

  /**
   * Get all companies with pagination
   * Also get job count for each company
   */
  static async getCompanies(page = 1, limit = 10) {
    const { offset } = parsePagination(page, limit);

    const [{ total }] = await db(MODULE.COMPANY).count('* as total');

    // Get companies with job count
    const data = await db(MODULE.COMPANY)
      .select(
        'company.*',
        db.raw('(SELECT COUNT(*) FROM job j INNER JOIN employer e ON j.employer_id = e.employer_id WHERE e.company_id = company.company_id) as job_count')
      )
      .orderBy('company.company_id', 'asc')
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
   * JOIN with employer and company tables
   */
  static async getJobs(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    // Build WHERE conditions
    let countQuery = db(MODULE.JOB);
    let dataQuery = db(MODULE.JOB)
      .select(
        'job.*',
        'employer.full_name as employer_name',
        'employer.email as employer_email',
        'company.company_name',
        'company.logo_url as company_logo'
      )
      .leftJoin('employer', 'job.employer_id', 'employer.employer_id')
      .leftJoin('company', 'employer.company_id', 'company.company_id');

    if (filters.status) {
      countQuery = countQuery.where('job.status', filters.status);
      dataQuery = dataQuery.where('job.status', filters.status);
    }
    if (filters.job_type) {
      countQuery = countQuery.where('job.job_type', filters.job_type);
      dataQuery = dataQuery.where('job.job_type', filters.job_type);
    }

    const [{ total }] = await countQuery.count('* as total');

    const data = await dataQuery
      .orderBy('job.job_id', 'desc')
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
   * Delete job
   */
  static async deleteJob(jobId) {
    return await db(MODULE.JOB)
      .where('job_id', jobId)
      .del();
  }

  /**
   * Get statistics
   */
  static async getStatistics() {
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
