import api from './api';

/**
 * Company Service
 * Handles company-related API calls
 */
export const companyService = {
  /**
   * Get all companies (public)
   * @param {Object} params - Query parameters { page, limit, search }
   * @returns {Promise<Object>} Paginated companies list
   */
  async getAll(params = {}) {
    const response = await api.get('/companies', { params });
    return response.data.data;
  },

  /**
   * Get company by ID (public)
   * @param {string} companyId - Company ID
   * @returns {Promise<Object>} Company data
   */
  async getById(companyId) {
    const response = await api.get(`/companies/${companyId}`);
    return response.data.data;
  },

  /**
   * Get jobs by company ID
   * @param {string} companyId - Company ID
   * @returns {Promise<Array>} List of jobs
   */
  async getCompanyJobs(companyId) {
    const response = await api.get(`/companies/${companyId}/jobs`);
    return response.data.data; // Assuming controller returns { data: [] }
  },

  /**
   * Upload company logo
   * @param {string} companyId - Company ID
   * @param {File} file - Logo image file
   * @returns {Promise<Object>} { logo_url, path }
   */
  async uploadLogo(companyId, file) {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.post(`/companies/${companyId}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Upload company banner
   * @param {string} companyId - Company ID
   * @param {File} file - Banner image file
   * @returns {Promise<Object>} { banner_url, path }
   */
  async uploadBanner(companyId, file) {
    const formData = new FormData();
    formData.append('banner', file);
    
    const response = await api.post(`/companies/${companyId}/banner`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Delete company logo
   * @param {string} companyId - Company ID
   * @returns {Promise<void>}
   */
  async deleteLogo(companyId) {
    const response = await api.delete(`/companies/${companyId}/logo`);
    return response.data;
  },

  /**
   * Delete company banner
   * @param {string} companyId - Company ID
   * @returns {Promise<void>}
   */
  async deleteBanner(companyId) {
    const response = await api.delete(`/companies/${companyId}/banner`);
    return response.data;
  },

  /**
   * Update company information
   * @param {string} companyId - Company ID
   * @param {Object} updateData - Company data to update
   * @returns {Promise<Object>} Updated company
   */
  async update(companyId, updateData) {
    const response = await api.put(`/companies/${companyId}`, updateData);
    return response.data.data;
  },

  // ==========================================
  // Follow Company APIs
  // ==========================================

  /**
   * Toggle follow status for a company
   * @param {number} companyId - Company ID
   * @returns {Promise<Object>} { is_following: boolean }
   */
  async toggleFollow(companyId) {
    const response = await api.post(`/followed-companies/${companyId}/toggle`);
    return response.data.data;
  },

  /**
   * Check if a company is followed by current user
   * @param {number} companyId - Company ID
   * @returns {Promise<boolean>} true if followed
   */
  async checkIsFollowed(companyId) {
    try {
      const response = await api.get(`/followed-companies/${companyId}/check`);
      return response.data.data?.is_followed || false;
    } catch {
      return false;
    }
  },

  /**
   * Get all followed companies for current user
   * @param {Object} params - { page, limit }
   * @returns {Promise<Object>} Paginated followed companies
   */
  async getFollowedCompanies(params = {}) {
    const response = await api.get('/followed-companies', { params });
    return response.data;
  },

  /**
   * Get followers count for a company (public)
   * @param {number} companyId - Company ID
   * @returns {Promise<number>} Followers count
   */
  async getFollowersCount(companyId) {
    try {
      const response = await api.get(`/companies/${companyId}/followers/count`);
      return response.data.data?.count || 0;
    } catch {
      return 0;
    }
  },
};

