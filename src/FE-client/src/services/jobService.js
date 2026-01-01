import api from './api';

/**
 * Job Service
 * Handles job-related API calls for employers
 */
export const jobService = {
  /**
   * Get all jobs (public)
   * @param {Object} params - Query parameters { page, limit, search, status, etc }
   * @returns {Promise<Object>} Paginated jobs list
   */
  async getJobs(params = {}) {
    const response = await api.get('/jobs', { params });
    return response.data.data;
  },

  /**
   * Get employer's own jobs
   * @param {Object} params - Query parameters { page, limit, status }
   * @returns {Promise<Object>} Paginated jobs list
   */
  async getEmployerJobs(params = {}) {
    const response = await api.get('/jobs/my-jobs', { params });
    return response.data.data;
  },

  /**
   * Get job by ID
   * @param {string} jobId - Job ID
   * @returns {Promise<Object>} Job data
   */
  async getJobById(jobId) {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data.data;
  },

  /**
   * Create new job
   * @param {Object} jobData - Job data
   * @returns {Promise<Object>} Created job
   */
  async createJob(jobData) {
    const response = await api.post('/jobs', jobData);
    return response.data.data;
  },

  /**
   * Update job
   * @param {string} jobId - Job ID
   * @param {Object} jobData - Updated job data
   * @returns {Promise<Object>} Updated job
   */
  async updateJob(jobId, jobData) {
    const response = await api.put(`/jobs/${jobId}`, jobData);
    return response.data.data;
  },

  /**
   * Delete job
   * @param {string} jobId - Job ID
   * @returns {Promise<void>}
   */
  async deleteJob(jobId) {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  /**
   * Publish job
   * @param {string} jobId - Job ID
   * @returns {Promise<Object>} Updated job
   */
  async publishJob(jobId) {
    const response = await api.post(`/jobs/${jobId}/publish`);
    return response.data.data;
  },

  /**
   * Expire/close job
   * @param {string} jobId - Job ID
   * @returns {Promise<Object>} Updated job
   */
  async expireJob(jobId) {
    const response = await api.post(`/jobs/${jobId}/expire`);
    return response.data.data;
  },

  /**
   * Increment job views (public)
   * @param {string} jobId - Job ID
   * @returns {Promise<Object>} Updated view count
   */
  async incrementViews(jobId) {
    const response = await api.put(`/jobs/${jobId}/views`);
    return response.data.data;
  },

  /**
   * Get applications for a job
   * @param {string} jobId - Job ID
   * @param {Object} params - Query parameters { page, limit, status }
   * @returns {Promise<Object>} Paginated applications
   */
  async getJobApplications(jobId, params = {}) {
    const response = await api.get(`/jobs/${jobId}/applications`, { params });
    return response.data.data;
  },

  /**
   * Alias for getEmployerJobs (used by JobPerformance component)
   */
  async getMyJobs(params = {}) {
    return this.getEmployerJobs(params);
  },

  /**
   * Get dashboard statistics with optional time range filter
   * @param {Object} options - { timeRange: '7d' | '30d' | '90d' }
   * @returns {Promise<Object>} Dashboard stats
   */
  async getDashboardStats(options = {}) {
    try {
      const { timeRange = '30d' } = options;
      const jobs = await this.getEmployerJobs({ limit: 100 });
      const jobsList = jobs?.data || jobs || [];
      
      // Calculate date threshold based on timeRange
      const now = new Date();
      const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
      const days = daysMap[timeRange] || 30;
      const threshold = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      // Filter jobs by time range (based on posted_at)
      const filteredJobs = jobsList.filter(j => {
        if (!j.posted_at) return true; // Include jobs without posted_at
        return new Date(j.posted_at) >= threshold;
      });
      
      // Calculate job stats
      const totalJobs = filteredJobs.length;
      const activeJobs = filteredJobs.filter(j => j.status === 'published').length;
      const expiredJobs = filteredJobs.filter(j => j.status === 'expired').length;
      const draftJobs = filteredJobs.filter(j => j.status === 'draft').length;
      const totalViews = filteredJobs.reduce((sum, j) => sum + (j.views || 0), 0);
      
      // Fetch actual applications from API
      let totalApplications = 0;
      let pendingApplications = 0;
      let statusBreakdown = { pending: 0, reviewing: 0, shortlisted: 0, rejected: 0, hired: 0 };
      
      try {
        const applicationsResponse = await api.get('/applications/employer', { 
          params: { limit: 1000 } 
        });
        const applications = applicationsResponse?.data?.data?.data || 
                            applicationsResponse?.data?.data || [];
        
        totalApplications = applications.length;
        
        // Calculate status breakdown
        applications.forEach(app => {
          const status = app.status || 'pending';
          if (statusBreakdown.hasOwnProperty(status)) {
            statusBreakdown[status]++;
          } else {
            statusBreakdown.pending++; // Default unknown status to pending
          }
        });
        
        pendingApplications = statusBreakdown.pending;
      } catch (appError) {
        console.error('Error fetching applications for stats:', appError);
        // Fallback to estimated values from jobs
        totalApplications = filteredJobs.reduce((sum, j) => sum + (j.applications_count || 0), 0);
        pendingApplications = Math.floor(totalApplications * 0.3);
      }
      
      // Calculate conversion rate (applications / views * 100)
      const conversionRate = totalViews > 0 
        ? ((totalApplications / totalViews) * 100).toFixed(2) 
        : 0;
      
      return {
        totalJobs,
        activeJobs,
        expiredJobs,
        draftJobs,
        totalViews,
        totalApplications,
        pendingApplications,
        conversionRate: parseFloat(conversionRate),
        statusBreakdown, // Add status breakdown for charts
        timeRange
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return { 
        totalJobs: 0, 
        activeJobs: 0, 
        expiredJobs: 0,
        draftJobs: 0,
        totalViews: 0, 
        totalApplications: 0,
        pendingApplications: 0,
        conversionRate: 0,
        statusBreakdown: { pending: 0, reviewing: 0, shortlisted: 0, rejected: 0, hired: 0 },
        timeRange: options.timeRange || '30d'
      };
    }
  },
};
