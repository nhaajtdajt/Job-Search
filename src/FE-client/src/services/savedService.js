/**
 * Saved Service
 * API service for saved jobs and saved searches
 */
import { apiService } from './api';

const savedService = {
  // ==========================================
  // Saved Jobs
  // ==========================================

  /**
   * Get all saved jobs for current user
   */
  getSavedJobs: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    const url = `/saved-jobs${queryString ? `?${queryString}` : ''}`;
    const response = await apiService.get(url);
    return response.data;
  },

  /**
   * Save a job
   * @param {string} jobId 
   */
  saveJob: async (jobId) => {
    const response = await apiService.post('/saved-jobs', { job_id: jobId });
    return response.data;
  },

  /**
   * Unsave a job
   * @param {string} jobId 
   */
  unsaveJob: async (jobId) => {
    const response = await apiService.delete(`/saved-jobs/${jobId}`);
    return response.data;
  },

  /**
   * Check if a job is saved
   * @param {string} jobId 
   */
  isJobSaved: async (jobId) => {
    try {
      const response = await apiService.get(`/saved-jobs/${jobId}/check`);
      return response.data?.isSaved || false;
    } catch {
      return false;
    }
  },

  // ==========================================
  // Saved Searches
  // ==========================================

  /**
   * Get all saved searches for current user
   */
  getSavedSearches: async () => {
    const response = await apiService.get('/saved-searches');
    return response.data;
  },

  /**
   * Save a search
   * @param {Object} searchData - { name, keyword, location, job_type, salary_min, salary_max, experience_level }
   */
  saveSearch: async (searchData) => {
    const response = await apiService.post('/saved-searches', searchData);
    return response.data;
  },

  /**
   * Update saved search
   * @param {string} searchId 
   * @param {Object} searchData 
   */
  updateSavedSearch: async (searchId, searchData) => {
    const response = await apiService.put(`/saved-searches/${searchId}`, searchData);
    return response.data;
  },

  /**
   * Delete saved search
   * @param {string} searchId 
   */
  deleteSavedSearch: async (searchId) => {
    const response = await apiService.delete(`/saved-searches/${searchId}`);
    return response.data;
  },

  /**
   * Toggle email notification for saved search
   * @param {string} searchId 
   * @param {boolean} enabled 
   */
  toggleSearchNotification: async (searchId, enabled) => {
    const response = await apiService.patch(`/saved-searches/${searchId}/notification`, { 
      email_notification: enabled 
    });
    return response.data;
  },

  /**
   * Get matching jobs for a saved search
   * @param {string} searchId 
   */
  getMatchingJobs: async (searchId) => {
    const response = await apiService.get(`/saved-searches/${searchId}/jobs`);
    return response.data;
  },
};

export default savedService;
