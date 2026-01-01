import api from './api';

/**
 * Application Service
 * Handles application-related API calls
 */
const applicationService = {
  /**
   * Get applications for employer's jobs
   * @param {Object} params - Query parameters { page, limit, status, sort }
   * @returns {Promise<Object>} Paginated applications list
   */
  async getEmployerApplications(params = {}) {
    try {
      const response = await api.get('/applications/employer', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error getting employer applications:', error);
      // Return empty array for graceful degradation
      return [];
    }
  },

  /**
   * Get applications for a specific job
   * @param {string} jobId - Job ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Applications for the job
   */
  async getJobApplications(jobId, params = {}) {
    const response = await api.get(`/jobs/${jobId}/applications`, { params });
    return response.data.data;
  },

  /**
   * Get user's own applications (job seeker)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} User's applications
   */
  async getMyApplications(params = {}) {
    const response = await api.get('/applications', { params });
    return response.data.data;
  },

  /**
   * Apply for a job
   * @param {string} jobId - Job ID
   * @param {Object} data - Application data { resume_id, cover_letter }
   * @returns {Promise<Object>} Created application
   */
  async applyForJob(jobId, data) {
    const response = await api.post(`/jobs/${jobId}/apply`, data);
    return response.data.data;
  },

  /**
   * Update application status (employer)
   * @param {string} applicationId - Application ID
   * @param {string} status - New status (pending, reviewing, shortlisted, rejected, hired)
   * @returns {Promise<Object>} Updated application
   */
  async updateApplicationStatus(applicationId, status) {
    const response = await api.put(`/applications/${applicationId}/status`, { status });
    return response.data.data;
  },

  /**
   * Get application by ID (for employer)
   * @param {string} applicationId - Application ID
   * @returns {Promise<Object>} Application details
   */
  async getApplicationById(applicationId) {
    // Use employer endpoint since this is called from employer pages
    const response = await api.get(`/applications/employer/${applicationId}`);
    return response.data.data;
  },

  /**
   * Delete/withdraw application
   * @param {string} applicationId - Application ID
   * @returns {Promise<void>}
   */
  async deleteApplication(applicationId) {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  },

  /**
   * Add note to application
   * @param {string} applicationId - Application ID
   * @param {string} note - Note content
   * @returns {Promise<Object>} Created note
   */
  async addNote(applicationId, note) {
    const response = await api.post(`/applications/${applicationId}/notes`, { note });
    return response.data.data;
  },

  /**
   * Get notes for application
   * @param {string} applicationId - Application ID
   * @returns {Promise<Array>} Notes list
   */
  async getNotes(applicationId) {
    try {
      const response = await api.get(`/applications/${applicationId}/notes`);
      return response.data.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Bulk update application status
   * @param {Array} applicationIds - Array of application IDs
   * @param {string} status - New status
   * @returns {Promise<Object>} Update result
   */
  async bulkUpdateStatus(applicationIds, status) {
    const response = await api.put('/applications/bulk-status', { 
      application_ids: applicationIds, 
      status 
    });
    return response.data.data;
  },

  /**
   * Get candidate profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Candidate profile with resume and history
   */
  async getCandidateProfile(userId) {
    try {
      const response = await api.get(`/users/${userId}/profile`);
      return response.data.data;
    } catch {
      return null;
    }
  },

  /**
   * Get candidate's application history
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Application history
   */
  async getCandidateHistory(userId) {
    try {
      const response = await api.get(`/users/${userId}/applications`);
      return response.data.data || [];
    } catch {
      return [];
    }
  },
};

export default applicationService;
