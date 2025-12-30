const SearchRepository = require('../repositories/search.repo');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors');

/**
 * Search Service
 * Business logic for saved searches
 */
class SearchService {
  /**
   * Create saved search
   * @param {string} userId - User ID
   * @param {Object} searchData - { search_name, filters }
   * @returns {Object} Created search
   */
  static async createSavedSearch(userId, searchData) {
    const { search_name, filters } = searchData;

    // Validate required fields
    if (!search_name || !search_name.trim()) {
      throw new BadRequestError('Search name is required');
    }

    if (!filters || typeof filters !== 'object') {
      throw new BadRequestError('Search filters are required');
    }

    // Create search
    const searchToCreate = {
      user_id: userId,
      search_name: search_name.trim(),
      filters: JSON.stringify(filters),
      created_at: new Date()
    };

    const search = await SearchRepository.create(searchToCreate);
    
    // Parse filters back to object for response
    search.filters = JSON.parse(search.filters);
    
    return search;
  }

  /**
   * Get user's saved searches
   * @param {string} userId - User ID
   * @returns {Array} List of saved searches
   */
  static async getSavedSearches(userId) {
    const searches = await SearchRepository.findByUserId(userId);
    
    // Parse filters JSON for each search
    searches.forEach(search => {
      if (search.filters) {
        try {
          search.filters = JSON.parse(search.filters);
        } catch (e) {
          search.filters = {};
        }
      }
    });
    
    return searches;
  }

  /**
   * Update saved search
   * @param {number} searchId - Search ID
   * @param {string} userId - User ID (for ownership check)
   * @param {Object} updateData - { search_name?, filters? }
   * @returns {Object} Updated search
   */
  static async updateSavedSearch(searchId, userId, updateData) {
    // Check if search exists
    const search = await SearchRepository.findById(searchId);
    if (!search) {
      throw new NotFoundError(`Search with ID ${searchId} not found`);
    }

    // Check ownership
    const isOwner = await SearchRepository.isOwnedByUser(searchId, userId);
    if (!isOwner) {
      throw new ForbiddenError('You can only update your own searches');
    }

    // Prepare update data
    const dataToUpdate = {};
    
    if (updateData.search_name !== undefined) {
      if (!updateData.search_name.trim()) {
        throw new BadRequestError('Search name cannot be empty');
      }
      dataToUpdate.search_name = updateData.search_name.trim();
    }

    if (updateData.filters !== undefined) {
      if (typeof updateData.filters !== 'object') {
        throw new BadRequestError('Filters must be an object');
      }
      dataToUpdate.filters = JSON.stringify(updateData.filters);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new BadRequestError('No valid fields to update');
    }

    const updatedSearch = await SearchRepository.update(searchId, dataToUpdate);
    
    // Parse filters back to object
    if (updatedSearch.filters) {
      updatedSearch.filters = JSON.parse(updatedSearch.filters);
    }
    
    return updatedSearch;
  }

  /**
   * Delete saved search
   * @param {number} searchId - Search ID
   * @param {string} userId - User ID (for ownership check)
   * @returns {Object} Success message
   */
  static async deleteSavedSearch(searchId, userId) {
    // Check if search exists
    const search = await SearchRepository.findById(searchId);
    if (!search) {
      throw new NotFoundError(`Search with ID ${searchId} not found`);
    }

    // Check ownership
    const isOwner = await SearchRepository.isOwnedByUser(searchId, userId);
    if (!isOwner) {
      throw new ForbiddenError('You can only delete your own searches');
    }

    await SearchRepository.delete(searchId);
    return { message: 'Saved search deleted successfully' };
  }
}

module.exports = SearchService;
