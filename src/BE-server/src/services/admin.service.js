const UserRepository = require('../repositories/user.repo');
const EmployerRepository = require('../repositories/employer.repo');
const AdminRepository = require('../repositories/admin.repo');
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
 * Following: routes -> controllers -> services -> repo -> database
 */
class AdminService {
  // ============================================
  // USER OPERATIONS
  // ============================================

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

    // Update status in local database via repository
    await AdminRepository.updateUserStatus(userId, status);

    return { userId, status };
  }

  // ============================================
  // EMPLOYER OPERATIONS
  // ============================================

  /**
   * Get all employers with pagination and filters
   */
  static async getEmployers(page = 1, limit = 10, filters = {}) {
    return await AdminRepository.findEmployers(page, limit, filters);
  }

  /**
   * Update employer status (verify or suspend)
   */
  static async updateEmployerStatus(employerId, status) {
    const { EMPLOYER_STATUS } = require('../constants/employer-status');

    // Validate status
    const validStatuses = Object.values(EMPLOYER_STATUS);
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be: ${validStatuses.join(' or ')}`);
    }

    // Check employer exists
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new Error('Employer not found');
    }

    // Update via existing employer repository
    const updated = await EmployerRepository.update(employerId, { status });
    return updated;
  }

  // ============================================
  // COMPANY OPERATIONS
  // ============================================

  /**
   * Get all companies with pagination and filters
   */
  static async getCompanies(page = 1, limit = 10, filters = {}) {
    return await AdminRepository.findCompanies(page, limit, filters);
  }

  // ============================================
  // JOB OPERATIONS
  // ============================================

  /**
   * Get all jobs with pagination and filters
   */
  static async getJobs(page = 1, limit = 10, filters = {}) {
    return await AdminRepository.findJobs(page, limit, filters);
  }

  /**
   * Delete job by ID
   */
  static async deleteJob(jobId) {
    return await AdminRepository.deleteJob(jobId);
  }

  // ============================================
  // STATISTICS
  // ============================================

  /**
   * Get dashboard statistics
   */
  static async getStatistics() {
    return await AdminRepository.getStatsCounts();
  }

  // ============================================
  // ANALYTICS
  // ============================================

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
      default: // 7d
        const dayOfWeek = now.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startDate = new Date(now);
        startDate.setDate(now.getDate() - daysToMonday - 7);
        startDate.setHours(0, 0, 0, 0);
        groupFormat = 'week7';
    }

    // Get data from repository and apply business logic
    const userGrowth = await this.processUserGrowthData(startDate, now, groupFormat);
    const applicationTrends = await this.processApplicationTrends(startDate, now);
    const jobCategories = await this.processJobCategoryStats();
    const topCompanies = await this.processTopCompanies(5);

    return {
      userGrowth,
      applicationTrends,
      jobCategories,
      topCompanies
    };
  }

  /**
   * Process user growth data from repository
   * Apply date formatting and fill missing dates
   */
  static async processUserGrowthData(startDate, endDate, groupFormat) {
    const dayNamesVi = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const monthNames = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];

    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Monthly view (3m or 1y)
    if (groupFormat === 'month' || groupFormat === 'week') {
      const result = await AdminRepository.getJobCountByDate(startDate, endDate, 'month');
      
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
      
      return groupFormat === 'week' ? data.slice(-3) : data.slice(-12);
    }

    // Daily view
    const result = await AdminRepository.getJobCountByDate(startDate, endDate, 'day');
    
    const dataMap = {};
    result.forEach(row => {
      const dateStr = formatLocalDate(new Date(row.date));
      dataMap[dateStr] = parseInt(row.count, 10);
    });

    const data = [];
    const currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= endDate) {
      const dateStr = formatLocalDate(currentDate);
      const dayOfWeek = currentDate.getDay();
      const dayName = dayNamesVi[dayOfWeek];
      const dayNum = currentDate.getDate();

      data.push({
        day: groupFormat === 'day' && data.length > 7 ? `${dayNum}/${currentDate.getMonth() + 1}` : dayName,
        date: dateStr,
        users: dataMap[dateStr] || 0
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (groupFormat === 'day') {
      return data.slice(-30);
    }

    // 7-day view
    if (groupFormat === 'week7') {
      const last7 = data.slice(-7);
      const mondayIndex = last7.findIndex(d => d.day === 'T2');
      if (mondayIndex > 0) {
        return [...last7.slice(mondayIndex), ...last7.slice(0, mondayIndex)];
      }
      return last7;
    }

    return data.slice(-7);
  }

  /**
   * Process application trends data
   */
  static async processApplicationTrends(startDate, endDate) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const result = await AdminRepository.getApplicationCountByMonth(startDate, endDate);
    const interviewedResult = await AdminRepository.getInterviewedCountByMonth(startDate, endDate);

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

    // Return mock data if empty
    if (data.length === 0) {
      return monthNames.slice(0, 6).map((month) => ({
        month,
        total: Math.floor(Math.random() * 3000 + 2000),
        interviewed: Math.floor(Math.random() * 1500 + 500)
      }));
    }

    return data;
  }

  /**
   * Process job category statistics
   */
  static async processJobCategoryStats() {
    const result = await AdminRepository.getJobTypeStats();

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
   * Process top companies data
   */
  static async processTopCompanies(limit = 5) {
    const result = await AdminRepository.getTopCompaniesByJobs(limit);

    // Get application counts
    const companyIds = result.map(r => r.company_id);
    const appCounts = await AdminRepository.getApplicationCountsByCompanies(companyIds);

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
