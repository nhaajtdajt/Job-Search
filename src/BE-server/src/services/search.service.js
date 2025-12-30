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

    // Create search (Map API fields to DB columns: search_name -> name, filters -> filter)
    const searchToCreate = {
      user_id: userId,
      name: search_name.trim(),
      filter: JSON.stringify(filters),
      created_at: new Date()
    };

    const search = await SearchRepository.create(searchToCreate);

    // Map back to API response format
    const response = {
      ...search,
      search_name: search.name,
      filters: JSON.parse(search.filter)
    };
    delete response.name;
    delete response.filter;

    return response;
  }

  /**
   * Get user's saved searches
   * @param {string} userId - User ID
   * @returns {Array} List of saved searches
   */
  static async getSavedSearches(userId) {
    const searches = await SearchRepository.findByUserId(userId);

    // Parse filters and map fields for response
    return searches.map(search => {
      let parsedFilters = {};
      if (search.filter) {
        try {
          parsedFilters = typeof search.filter === 'string'
            ? JSON.parse(search.filter)
            : search.filter;
        } catch (e) {
          parsedFilters = {};
        }
      }

      const response = {
        ...search,
        search_name: search.name,
        filters: parsedFilters
      };
      delete response.name;
      delete response.filter;

      return response;
    });
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

    // Prepare update data (Map API fields to DB columns)
    const dataToUpdate = {};

    if (updateData.search_name !== undefined) {
      if (!updateData.search_name.trim()) {
        throw new BadRequestError('Search name cannot be empty');
      }
      dataToUpdate.name = updateData.search_name.trim();
    }

    if (updateData.filters !== undefined) {
      if (typeof updateData.filters !== 'object') {
        throw new BadRequestError('Filters must be an object');
      }
      dataToUpdate.filter = JSON.stringify(updateData.filters);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new BadRequestError('No valid fields to update');
    }

    const updatedSearch = await SearchRepository.update(searchId, dataToUpdate);

    // Map back to API response format
    const response = {
      ...updatedSearch,
      search_name: updatedSearch.name,
      filters: updatedSearch.filter ? JSON.parse(updatedSearch.filter) : {}
    };
    delete response.name;
    delete response.filter;

    return response;
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
