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
};
