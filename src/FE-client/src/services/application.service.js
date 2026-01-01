import api from './api';

/**
 * Application Service
 * Handles job application API calls
 */
export const applicationService = {
  /**
   * Get user's applications
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters { status }
   * @returns {Promise<Object>} Paginated applications
   */
  async getUserApplications(page = 1, limit = 10, filters = {}) {
    const response = await api.get('/applications', {
      params: { page, limit, ...filters }
    });
    return response.data.data;
  },

  /**
   * Get application by ID
   * @param {number} applicationId - Application ID
   * @returns {Promise<Object>} Application detail
   */
  async getApplicationById(applicationId) {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data.data;
  },

  /**
   * Submit a job application
   * @param {Object} applicationData - { job_id, resume_id, cover_letter }
   * @returns {Promise<Object>} Created application
   */
  async applyJob(applicationData) {
    const response = await api.post('/applications', applicationData);
    return response.data.data;
  },

  /**
   * Withdraw an application
   * @param {number} applicationId - Application ID
   * @returns {Promise<void>}
   */
  async withdrawApplication(applicationId) {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },
};

