const SavedSearchRepository = require('../repositories/saved_search.repo');
const { NotFoundError, BadRequestError } = require('../errors');

/**
 * Saved Search Service
 * Business logic for saved searches
 */
class SavedSearchService {
  /**
   * Save a search for a user
   * @param {string} userId - User ID
   * @param {Object} searchData - { name, filter }
   * @returns {Object} Saved search record
   */
  static async saveSearch(userId, searchData) {
    const { name, filter } = searchData;

    // Validate name
    if (!name || name.trim() === '') {
      throw new BadRequestError('Search name is required');
    }

    // Save the search
    const savedSearch = await SavedSearchRepository.save(userId, {
      name: name.trim(),
      filter: filter || null
    });

    return savedSearch;
  }

  /**
   * Delete a saved search
   * @param {number} searchId - Saved search ID
   * @param {string} userId - User ID
   * @returns {Object} Success message
   */
  static async deleteSearch(searchId, userId) {
    const deleted = await SavedSearchRepository.delete(searchId, userId);
    
    if (deleted === 0) {
      throw new NotFoundError('Saved search not found');
    }

    return { message: 'Saved search deleted successfully' };
  }

  /**
   * Get all saved searches for a user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated saved searches
   */
  static async getSavedSearches(userId, page = 1, limit = 10) {
    return await SavedSearchRepository.findByUserId(userId, page, limit);
  }

  /**
   * Count saved searches for a user
   * @param {string} userId - User ID
   * @returns {number} Count of saved searches
   */
  static async countSavedSearches(userId) {
    return await SavedSearchRepository.countByUserId(userId);
  }
}

module.exports = SavedSearchService;

