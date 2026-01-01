import api from './api';

/**
 * Employer Service
 * Handles employer-related API calls
 */
export const employerService = {
  /**
   * Get employer profile
   * @returns {Promise<Object>} Employer profile data
   */
  async getProfile() {
    const response = await api.get('/employers/profile');
    return response.data.data;
  },

  /**
   * Update employer profile
   * @param {Object} updateData - Profile update data
   * @returns {Promise<Object>} Updated employer profile
   */
  async updateProfile(updateData) {
    const response = await api.put('/employers/profile', updateData);
    return response.data.data;
  },

  /**
   * Upload employer avatar
   * @param {File} file - Avatar image file
   * @returns {Promise<Object>} { avatar_url, path }
   */
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/employers/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Delete employer avatar
   * @returns {Promise<void>}
   */
  async deleteAvatar() {
    const response = await api.delete('/employers/avatar');
    return response.data;
  },

  /**
   * Get all applications for employer's jobs
   * @param {Object} params - Query parameters { page, limit, status, job_id }
   * @returns {Promise<Object>} Paginated applications list
   */
  async getApplications(params = {}) {
    const response = await api.get('/employers/applications', { params });
    return response.data.data;
  },
};

