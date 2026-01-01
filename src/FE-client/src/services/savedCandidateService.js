/**
 * Saved Candidate Service
 * API calls for saved candidates management
 */

import api from './api';

const savedCandidateService = {
  /**
   * Get all saved candidates
   * @param {Object} params - Query params (page, limit, search, sortBy, sortOrder)
   * @returns {Promise<Object>} Paginated saved candidates
   */
  async getSavedCandidates(params = {}) {
    const response = await api.get('/saved-candidates', { params });
    return response.data;
  },

  /**
   * Save a candidate
   * @param {string} userId - User ID (candidate)
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Saved record
   */
  async saveCandidate(userId, notes = null) {
    const response = await api.post('/saved-candidates', { userId, notes });
    return response.data;
  },

  /**
   * Unsave a candidate
   * @param {string} userId - User ID (candidate)
   * @returns {Promise<Object>} Success response
   */
  async unsaveCandidate(userId) {
    const response = await api.delete(`/saved-candidates/${userId}`);
    return response.data;
  },

  /**
   * Check if candidate is saved
   * @param {string} userId - User ID (candidate)
   * @returns {Promise<Object>} { isSaved: boolean }
   */
  async checkSaved(userId) {
    const response = await api.get(`/saved-candidates/${userId}/check`);
    return response.data;
  },

  /**
   * Update notes for a saved candidate
   * @param {string} userId - User ID (candidate)
   * @param {string} notes - Notes to update
   * @returns {Promise<Object>} Updated record
   */
  async updateNotes(userId, notes) {
    const response = await api.patch(`/saved-candidates/${userId}/notes`, { notes });
    return response.data;
  },

  /**
   * Get count of saved candidates
   * @returns {Promise<Object>} { count: number }
   */
  async getCount() {
    const response = await api.get('/saved-candidates/count');
    return response.data;
  }
};

export default savedCandidateService;
