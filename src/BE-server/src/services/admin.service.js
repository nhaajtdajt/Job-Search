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
    let countQuery = db(MODULE.EMPLOYER)
      .leftJoin('company', 'employer.company_id', 'company.company_id');
    let dataQuery = db(MODULE.EMPLOYER)
      .select(
        'employer.*',
        'company.company_name',
        db.raw('(SELECT COUNT(*) FROM job WHERE job.employer_id = employer.employer_id) as job_count')
      )
      .leftJoin('company', 'employer.company_id', 'company.company_id');

    // Status filter
    if (filters.status) {
      countQuery = countQuery.where('employer.status', filters.status);
      dataQuery = dataQuery.where('employer.status', filters.status);
    }

    // Search filter (only search by full_name)
    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      countQuery = countQuery.where('employer.full_name', 'ILIKE', searchPattern);
      dataQuery = dataQuery.where('employer.full_name', 'ILIKE', searchPattern);
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
   * Get all companies with pagination and filters
   * Also get job count for each company
   */
  static async getCompanies(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    // Base queries
    let countQuery = db(MODULE.COMPANY);
    let dataQuery = db(MODULE.COMPANY)
      .select(
        'company.*',
        db.raw('(SELECT COUNT(*) FROM job j INNER JOIN employer e ON j.employer_id = e.employer_id WHERE e.company_id = company.company_id) as job_count')
      );

    // Search filter (only search by company_name)
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

  /**
   * Get all jobs with pagination and filters
   * JOIN with employer and company tables
   */
  static async getJobs(page = 1, limit = 10, filters = {}) {
    const { offset } = parsePagination(page, limit);

    // Build WHERE conditions
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

    // Status filter
    if (filters.status) {
      countQuery = countQuery.where('job.status', filters.status);
      dataQuery = dataQuery.where('job.status', filters.status);
    }
    // Job type filter
    if (filters.job_type) {
      countQuery = countQuery.where('job.job_type', filters.job_type);
      dataQuery = dataQuery.where('job.job_type', filters.job_type);
    }
    // Search filter (only search by job_title)
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

  /**
   * Get analytics data for dashboard charts
   * @param {string} timeRange - '7d', '30d', '3m', '1y'
   */
  static async getAnalytics(timeRange = '7d') {
    const now = new Date();
    let startDate;
    let groupFormat;

    // Calculate date range based on timeRange
    switch (timeRange) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupFormat = 'day';
        break;
      case '3m':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        groupFormat = 'week';
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupFormat = 'month';
        break;
      default: // 7d - Start from most recent Monday
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // How many days back to Monday
        startDate = new Date(now);
        startDate.setDate(now.getDate() - daysToMonday - 7); // Go back to previous previous Monday to get full week
        startDate.setHours(0, 0, 0, 0);
        groupFormat = 'week7';
    }

    // Get user growth (using job posted_at as proxy for activity)
    const userGrowth = await this.getUserGrowthData(startDate, now, groupFormat);

    // Get application trends
    const applicationTrends = await this.getApplicationTrendsData(startDate, now, groupFormat);

    // Get job categories distribution
    const jobCategories = await this.getJobCategoryStats();

    // Get top companies
    const topCompanies = await this.getTopCompanies(5);

    return {
      userGrowth,
      applicationTrends,
      jobCategories,
      topCompanies
    };
  }

  /**
   * Get activity data based on time range
   * 7d: Mon-Sun (7 days)
   * 30d: Each day (30 days)
   * 3m: 3 months
   * 1y: 12 months
   */
  static async getUserGrowthData(startDate, endDate, groupFormat) {
    const dayNamesVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

    // Helper to format date as YYYY-MM-DD in local timezone
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (groupFormat === 'month') {
      // Group by month for 1 year view
      const result = await db(MODULE.JOB)
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

      // Fill in all 12 months
      const data = [];
      const currentMonth = new Date(startDate);
      while (currentMonth <= endDate) {
        const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
        const found = result.find(r => r.month_key === monthKey);
        data.push({
          day: monthNames[currentMonth.getMonth()],
          date: monthKey,
          users: found ? parseInt(found.count, 10) : 0
        });
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
      return data.slice(-12); // Last 12 months
    }

    if (groupFormat === 'week') {
      // Group by month for 3 months view
      const result = await db(MODULE.JOB)
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

      // Fill in 3 months
      const data = [];
      const currentMonth = new Date(startDate);
      while (currentMonth <= endDate) {
        const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
        const found = result.find(r => r.month_key === monthKey);
        data.push({
          day: monthNames[currentMonth.getMonth()],
          date: monthKey,
          users: found ? parseInt(found.count, 10) : 0
        });
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }
      return data.slice(-3); // Last 3 months
    }

    // Group by day
    const result = await db(MODULE.JOB)
      .select(db.raw("DATE(posted_at AT TIME ZONE 'Asia/Ho_Chi_Minh') as date"))
      .count('* as count')
      .where('posted_at', '>=', startDate)
      .where('posted_at', '<=', endDate)
      .whereNotNull('posted_at')
      .groupByRaw("DATE(posted_at AT TIME ZONE 'Asia/Ho_Chi_Minh')")
      .orderByRaw("DATE(posted_at AT TIME ZONE 'Asia/Ho_Chi_Minh')");

    // Create a map of existing data
    const dataMap = {};
    result.forEach(row => {
      const dateStr = formatLocalDate(new Date(row.date));
      dataMap[dateStr] = parseInt(row.count, 10);
    });

    // Fill in all days
    const data = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      const dateStr = formatLocalDate(currentDate);
      const dayOfWeek = currentDate.getDay(); // 0=Sun
      const dayName = dayNamesVi[dayOfWeek];
      const dayNum = currentDate.getDate();

      data.push({
        day: groupFormat === 'day' && data.length > 7 ? `${dayNum}/${currentDate.getMonth() + 1}` : dayName,
        date: dateStr,
        users: dataMap[dateStr] || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Return appropriate slice based on time range
    if (groupFormat === 'day') {
      return data.slice(-30); // Last 30 days for 30d
    }

    // For 7-day view (week7), return last 7 days starting from Monday
    if (groupFormat === 'week7') {
      // Find last Monday in data
      const last7 = data.slice(-7);
      // Reorder to start from Monday: T2, T3, T4, T5, T6, T7, CN
      const mondayIndex = last7.findIndex(d => d.day === 'T2');
      if (mondayIndex > 0) {
        return [...last7.slice(mondayIndex), ...last7.slice(0, mondayIndex)];
      }
      return last7;
    }

    return data.slice(-7);
  }

  /**
   * Get application trends by month
   */
  static async getApplicationTrendsData(startDate, endDate, groupFormat) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get applications grouped by month
    const result = await db(MODULE.APPLICATION)
      .select(
        db.raw("TO_CHAR(apply_date, 'YYYY-MM') as month_key"),
        db.raw("TO_CHAR(apply_date, 'Mon') as month")
      )
      .count('* as total')
      .where('apply_date', '>=', startDate)
      .where('apply_date', '<=', endDate)
      .groupByRaw("TO_CHAR(apply_date, 'YYYY-MM'), TO_CHAR(apply_date, 'Mon')")
      .orderByRaw("TO_CHAR(apply_date, 'YYYY-MM')");

    // Get interviewed applications
    const interviewedResult = await db(MODULE.APPLICATION)
      .select(
        db.raw("TO_CHAR(apply_date, 'YYYY-MM') as month_key")
      )
      .count('* as interviewed')
      .where('apply_date', '>=', startDate)
      .where('apply_date', '<=', endDate)
      .whereIn('status', ['interview', 'offer', 'hired'])
      .groupByRaw("TO_CHAR(apply_date, 'YYYY-MM')")
      .orderByRaw("TO_CHAR(apply_date, 'YYYY-MM')");

    // Create interviewed map
    const interviewedMap = {};
    interviewedResult.forEach(row => {
      interviewedMap[row.month_key] = parseInt(row.interviewed, 10);
    });

    // Combine data
    const data = result.map(row => ({
      month: row.month,
      total: parseInt(row.total, 10),
      interviewed: interviewedMap[row.month_key] || 0
    }));

    // If no data, return mock data
    if (data.length === 0) {
      return monthNames.slice(0, 6).map((month, index) => ({
        month,
        total: Math.floor(Math.random() * 3000 + 2000),
        interviewed: Math.floor(Math.random() * 1500 + 500)
      }));
    }

    return data;
  }

  /**
   * Get job category statistics
   */
  static async getJobCategoryStats() {
    const result = await db(MODULE.JOB)
      .select('job_type')
      .count('* as count')
      .groupBy('job_type')
      .orderBy('count', 'desc');

    const total = result.reduce((sum, row) => sum + parseInt(row.count, 10), 0);

    const colors = ['#3b82f6', '#22c55e', '#f97316', '#ef4444', '#8b5cf6'];
    const labels = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contract': 'Contract',
      'internship': 'Internship',
      'remote': 'Remote',
      'freelance': 'Freelance'
    };

    return result.map((row, index) => ({
      category: labels[row.job_type] || row.job_type,
      count: parseInt(row.count, 10),
      percentage: total > 0 ? Math.round((parseInt(row.count, 10) / total) * 100) : 0,
      color: colors[index % colors.length]
    }));
  }

  /**
   * Get top companies by job count and applications
   */
  static async getTopCompanies(limit = 5) {
    const result = await db('company')
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

    // Get application counts for each company
    const companyIds = result.map(r => r.company_id);
    const appCounts = await db('application')
      .select('employer.company_id')
      .count('* as application_count')
      .join('job', 'application.job_id', 'job.job_id')
      .join('employer', 'job.employer_id', 'employer.employer_id')
      .whereIn('employer.company_id', companyIds)
      .groupBy('employer.company_id');

    const appCountMap = {};
    appCounts.forEach(row => {
      appCountMap[row.company_id] = parseInt(row.application_count, 10);
    });

    return result.map(row => ({
      name: row.company_name,
      logo: row.logo_url,
      jobs: parseInt(row.job_count, 10),
      applications: appCountMap[row.company_id] || 0
    }));
  }
}

module.exports = AdminService;
