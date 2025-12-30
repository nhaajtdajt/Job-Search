const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * Search Repository
 * Data access layer for saved_search table
 */
class SearchRepository {
  /**
   * Create saved search
   * @param {Object} searchData - Search data
   * @returns {Object} Created search
   */
  static async create(searchData) {
    const [search] = await db(MODULE.SAVED_SEARCH)
      .insert(searchData)
      .returning('*');
    
    return search;
  }

  /**
   * Get user's saved searches
   * @param {string} userId - User ID
   * @returns {Array} List of saved searches
   */
  static async findByUserId(userId) {
    const searches = await db(MODULE.SAVED_SEARCH)
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
    
    return searches;
  }

  /**
   * Find search by ID
   * @param {number} searchId - Search ID
   * @returns {Object|null} Search record
   */
  static async findById(searchId) {
    const search = await db(MODULE.SAVED_SEARCH)
      .where('search_id', searchId)
      .first();
    
    return search || null;
  }

  /**
   * Update saved search
   * @param {number} searchId - Search ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated search
   */
  static async update(searchId, updateData) {
    const [search] = await db(MODULE.SAVED_SEARCH)
      .where('search_id', searchId)
      .update(updateData)
      .returning('*');
    
    return search;
  }

  /**
   * Delete saved search
   * @param {number} searchId - Search ID
   * @returns {number} Number of deleted rows
   */
  static async delete(searchId) {
    return await db(MODULE.SAVED_SEARCH)
      .where('search_id', searchId)
      .del();
  }

  /**
   * Check if search belongs to user
   * @param {number} searchId - Search ID
   * @param {string} userId - User ID
   * @returns {boolean} True if user owns the search
   */
  static async isOwnedByUser(searchId, userId) {
    const search = await db(MODULE.SAVED_SEARCH)
      .select('search_id')
      .where({ search_id: searchId, user_id: userId })
      .first();
    
    return !!search;
  }
}

module.exports = SearchRepository;
