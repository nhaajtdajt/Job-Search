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
};

