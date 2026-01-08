const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Admin Repository
 * Database operations for admin dashboard
 */
class AdminRepository {
  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Update user status in local database
   * @param {string} userId - User UUID
   * @param {string} status - Status to set
   */
  static async updateUserStatus(userId, status) {
    return await db(MODULE.USERS)
      .where('user_id', userId)
      .update({ status });
  }

  // ============================================
  // EMPLOYER OPERATIONS
  // ============================================

  /**
   * Find all employers with pagination and filters
   * Includes company name and job count
   */
  static async findEmployers(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    // Build base queries
    let countQuery = db(MODULE.EMPLOYER)
      .leftJoin('company', 'employer.company_id', 'company.company_id');

    let dataQuery = db(MODULE.EMPLOYER)
      .select(
        'employer.*',
        'company.company_name',
        db.raw('(SELECT COUNT(*) FROM job WHERE job.employer_id = employer.employer_id) as job_count')
      )
      .leftJoin('company', 'employer.company_id', 'company.company_id');

    // Apply filters
    if (filters.status) {
      countQuery = countQuery.where('employer.status', filters.status);
      dataQuery = dataQuery.where('employer.status', filters.status);
    }

    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      countQuery = countQuery.where('employer.full_name', 'ILIKE', searchPattern);
      dataQuery = dataQuery.where('employer.full_name', 'ILIKE', searchPattern);
    }

    // Execute queries
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

  // ============================================
  // COMPANY OPERATIONS
  // ============================================

  /**
   * Find all companies with pagination and filters
   * Includes job count
   */
  static async findCompanies(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    let countQuery = db(MODULE.COMPANY);
    let dataQuery = db(MODULE.COMPANY)
      .select(
        'company.*',
        db.raw('(SELECT COUNT(*) FROM job j INNER JOIN employer e ON j.employer_id = e.employer_id WHERE e.company_id = company.company_id) as job_count')
      );

    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      countQuery = countQuery.where('company_name', 'ILIKE', searchPattern);
      dataQuery = dataQuery.where('company_name', 'ILIKE', searchPattern);
    }

    const [{ total }] = await countQuery.count('* as total');

    const data = await dataQuery
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

  // ============================================
  // JOB OPERATIONS
  // ============================================

  /**
   * Find all jobs with pagination and filters
   * Includes employer and company info
   */
  static async findJobs(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    let countQuery = db(MODULE.JOB)
      .leftJoin('employer', 'job.employer_id', 'employer.employer_id')
      .leftJoin('company', 'employer.company_id', 'company.company_id');

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

    // Apply filters
    if (filters.status) {
      countQuery = countQuery.where('job.status', filters.status);
      dataQuery = dataQuery.where('job.status', filters.status);
    }

    if (filters.job_type) {
      countQuery = countQuery.where('job.job_type', filters.job_type);
      dataQuery = dataQuery.where('job.job_type', filters.job_type);
    }

    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      countQuery = countQuery.where('job.job_title', 'ILIKE', searchPattern);
      dataQuery = dataQuery.where('job.job_title', 'ILIKE', searchPattern);
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
   * Delete job by ID
   */
  static async deleteJob(jobId) {
    return await db(MODULE.JOB)
      .where('job_id', jobId)
      .del();
  }

  // ============================================
  // STATISTICS OPERATIONS
  // ============================================

  /**
   * Get dashboard statistics counts
   */
  static async getStatsCounts() {
    const [userCount] = await db(MODULE.USERS).count('* as count');
    const [employerCount] = await db(MODULE.EMPLOYER).count('* as count');
    const [companyCount] = await db(MODULE.COMPANY).count('* as count');
    const [jobCount] = await db(MODULE.JOB).where('status', 'published').count('* as count');
    const [applicationCount] = await db(MODULE.APPLICATION).count('* as count');
    const [suspendedCount] = await db(MODULE.EMPLOYER).where('status', 'suspended').count('* as count');
    const [pendingAppsCount] = await db(MODULE.APPLICATION).where('status', 'pending').count('* as count');

    return {
      users: parseInt(userCount.count, 10),
      employers: parseInt(employerCount.count, 10),
      companies: parseInt(companyCount.count, 10),
      jobs: parseInt(jobCount.count, 10),
      applications: parseInt(applicationCount.count, 10),
      suspended: parseInt(suspendedCount.count, 10),
      pendingApplications: parseInt(pendingAppsCount.count, 10)
    };
  }

  // ============================================
  // ANALYTICS OPERATIONS
  // ============================================

  /**
   * Get job count grouped by date
   */
  static async getJobCountByDate(startDate, endDate, groupBy = 'day') {
    if (groupBy === 'month') {
      return await db(MODULE.JOB)
        .select(
          db.raw("TO_CHAR(posted_at, 'YYYY-MM') as month_key"),
          db.raw("TO_CHAR(posted_at, 'Mon') as month")
        )
        .count('* as count')
        .where('posted_at', '>=', startDate)
        .where('posted_at', '<=', endDate)
        .whereNotNull('posted_at')
        .groupByRaw("TO_CHAR(posted_at, 'YYYY-MM'), TO_CHAR(posted_at, 'Mon')")
        .orderByRaw("TO_CHAR(posted_at, 'YYYY-MM')");
    }

    // Group by day
    return await db(MODULE.JOB)
      .select(db.raw("DATE(posted_at AT TIME ZONE 'Asia/Ho_Chi_Minh') as date"))
      .count('* as count')
      .where('posted_at', '>=', startDate)
      .where('posted_at', '<=', endDate)
      .whereNotNull('posted_at')
      .groupByRaw("DATE(posted_at AT TIME ZONE 'Asia/Ho_Chi_Minh')")
      .orderByRaw("DATE(posted_at AT TIME ZONE 'Asia/Ho_Chi_Minh')");
  }

  /**
   * Get application count grouped by month
   */
  static async getApplicationCountByMonth(startDate, endDate) {
    return await db(MODULE.APPLICATION)
      .select(
        db.raw("TO_CHAR(apply_date, 'YYYY-MM') as month_key"),
        db.raw("TO_CHAR(apply_date, 'Mon') as month")
      )
      .count('* as total')
      .where('apply_date', '>=', startDate)
      .where('apply_date', '<=', endDate)
      .groupByRaw("TO_CHAR(apply_date, 'YYYY-MM'), TO_CHAR(apply_date, 'Mon')")
      .orderByRaw("TO_CHAR(apply_date, 'YYYY-MM')");
  }

  /**
   * Get interviewed application count grouped by month
   */
  static async getInterviewedCountByMonth(startDate, endDate) {
    return await db(MODULE.APPLICATION)
      .select(
        db.raw("TO_CHAR(apply_date, 'YYYY-MM') as month_key")
      )
      .count('* as interviewed')
      .where('apply_date', '>=', startDate)
      .where('apply_date', '<=', endDate)
      .whereIn('status', ['interview', 'offer', 'hired'])
      .groupByRaw("TO_CHAR(apply_date, 'YYYY-MM')")
      .orderByRaw("TO_CHAR(apply_date, 'YYYY-MM')");
  }

  /**
   * Get job type distribution
   */
  static async getJobTypeStats() {
    return await db(MODULE.JOB)
      .select('job_type')
      .count('* as count')
      .groupBy('job_type')
      .orderBy('count', 'desc');
  }

  /**
   * Get top companies by job count
   */
  static async getTopCompaniesByJobs(limit = 5) {
    return await db('company')
      .select(
        'company.company_id',
        'company.company_name',
        'company.logo_url'
      )
      .count('job.job_id as job_count')
      .leftJoin('employer', 'company.company_id', 'employer.company_id')
      .leftJoin('job', 'employer.employer_id', 'job.employer_id')
      .groupBy('company.company_id', 'company.company_name', 'company.logo_url')
      .orderBy('job_count', 'desc')
      .limit(limit);
  }

  /**
   * Get application counts by company IDs
   */
  static async getApplicationCountsByCompanies(companyIds) {
    return await db('application')
      .select('employer.company_id')
      .count('* as application_count')
      .join('job', 'application.job_id', 'job.job_id')
      .join('employer', 'job.employer_id', 'employer.employer_id')
      .whereIn('employer.company_id', companyIds)
      .groupBy('employer.company_id');
  }
}

module.exports = AdminRepository;
