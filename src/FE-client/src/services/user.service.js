import api from './api';

/**
 * User Service
 * Handles user-related API calls
 */
export const userService = {
  /**
   * Get user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  /**
   * Update user profile
   * @param {Object} updateData - Profile update data
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(updateData) {
    const response = await api.put('/users/profile', updateData);
    return response.data.data;
  },

  /**
   * Upload avatar
   * @param {File} file - Avatar image file
   * @returns {Promise<Object>} { avatar_url, path }
   */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Delete avatar
   * @returns {Promise<void>}
   */
  async deleteAvatar() {
    const response = await api.delete('/users/avatar');
    return response.data;
  },

  /**
   * Get user statistics for overview page
   * @returns {Promise<Object>} Statistics { applications, saved_jobs, saved_searches }
   */
  async getStatistics() {
    const response = await api.get('/users/statistics');
    return response.data.data;
  },

  /**
   * Save a job
   * @param {number} jobId - Job ID
   * @returns {Promise<Object>} Saved job record
   */
  async saveJob(jobId) {
    const response = await api.post('/users/saved-jobs', { job_id: jobId });
    return response.data.data;
  },

  /**
   * Unsave a job
   * @param {number} jobId - Job ID
   * @returns {Promise<void>}
   */
  async unsaveJob(jobId) {
    const response = await api.delete(`/users/saved-jobs/${jobId}`);
    return response.data;
  },

  /**
   * Check if a job is saved
   * @param {number} jobId - Job ID
   * @returns {Promise<boolean>} True if saved
   */
  async isJobSaved(jobId) {
    const response = await api.get(`/users/saved-jobs/${jobId}/check`);
    return response.data.data.is_saved;
  },

  /**
   * Get saved jobs
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated saved jobs
   */
  async getSavedJobs(page = 1, limit = 10) {
    const response = await api.get('/users/saved-jobs', {
      params: { page, limit }
    });
    return response.data.data;
  },

  /**
   * Save a search (job notification)
   * @param {Object} searchData - { name, filter } (name is the search query/job title, filter contains search criteria)
   * @returns {Promise<Object>} Saved search record
   */
  async saveSearch(searchData) {
    const response = await api.post('/users/saved-searches', searchData);
    return response.data.data;
  },

  /**
   * Get saved searches
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<Object>} Paginated saved searches
   */
  async getSavedSearches(page = 1, limit = 10) {
    const response = await api.get('/users/saved-searches', {
      params: { page, limit }
    });
    return response.data.data;
  },

  /**
   * Delete a saved search
   * @param {number} searchId - Saved search ID (stt field)
   * @returns {Promise<void>}
   */
  async deleteSavedSearch(searchId) {
    const response = await api.delete(`/users/saved-searches/${searchId}`);
    return response.data;
  },

  /**
   * Change user password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/users/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },
};

