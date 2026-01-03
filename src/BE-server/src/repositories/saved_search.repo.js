const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Saved Search Repository
 * Data access layer for Saved Search table
 */
class SavedSearchRepository {
  /**
   * Save a search for a user
   * @param {string} userId - User ID
   * @param {Object} searchData - { name, filter }
   * @returns {Object} Saved search record
   */
  static async save(userId, searchData) {
    const { name, filter } = searchData;
    
    const [savedSearch] = await db(MODULE.SAVED_SEARCH)
      .insert({
        user_id: userId,
        name: name || 'Tìm kiếm không tên',
        filter: filter ? JSON.stringify(filter) : null,
        created_at: new Date()
      })
      .returning('*');
    
    return savedSearch;
  }

  /**
   * Delete a saved search
   * @param {number} searchId - Saved search ID (stt)
   * @param {string} userId - User ID (for ownership check)
   * @returns {number} Number of deleted rows
   */
  static async delete(searchId, userId) {
    return await db(MODULE.SAVED_SEARCH)
      .where({
        stt: searchId,
        user_id: userId
      })
      .del();
  }

  /**
   * Get all saved searches for a user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated saved searches
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    const { offset } = parsePagination(page, limit);

    const [{ total }] = await db(MODULE.SAVED_SEARCH)
      .where('user_id', userId)
      .count('* as total');

    const savedSearches = await db(MODULE.SAVED_SEARCH)
      .select('*')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Parse filter JSON if exists
    savedSearches.forEach(search => {
      if (search.filter) {
        try {
          search.filter = JSON.parse(search.filter);
        } catch (e) {
          search.filter = null;
        }
      }
    });

    return {
      data: savedSearches,
      total: parseInt(total, 10),
      page,
      limit
    };
  }

  /**
   * Count saved searches for a user
   * @param {string} userId - User ID
   * @returns {number} Count of saved searches
   */
  static async countByUserId(userId) {
    const result = await db(MODULE.SAVED_SEARCH)
      .where('user_id', userId)
      .count('* as count')
      .first();
    
    return parseInt(result.count, 10);
  }

  /**
   * Find saved search by ID
   * @param {number} searchId - Saved search ID (stt)
   * @param {string} userId - User ID (for ownership check)
   * @returns {Object|null} Saved search or null
   */
  static async findById(searchId, userId) {
    const savedSearch = await db(MODULE.SAVED_SEARCH)
      .where({
        stt: searchId,
        user_id: userId
      })
      .first();
    
    if (!savedSearch) return null;

    // Parse filter JSON if exists
    if (savedSearch.filter) {
      try {
        savedSearch.filter = JSON.parse(savedSearch.filter);
      } catch (e) {
        savedSearch.filter = null;
      }
    }

    return savedSearch;
  }

  /**
   * Update saved search
   * @param {number} searchId - Saved search ID (stt)
   * @param {string} userId - User ID (for ownership check)
   * @param {Object} updateData - Data to update
   * @returns {Object|null} Updated saved search or null
   */
  static async update(searchId, userId, updateData) {
    // Prepare update data
    const data = {};
    if (updateData.name !== undefined) {
      data.name = updateData.name;
    }
    if (updateData.filter !== undefined) {
      data.filter = updateData.filter ? JSON.stringify(updateData.filter) : null;
    }
    if (updateData.email_notification !== undefined) {
      data.email_notification = updateData.email_notification;
    }

    const [updated] = await db(MODULE.SAVED_SEARCH)
      .where({
        stt: searchId,
        user_id: userId
      })
      .update(data)
      .returning('*');
    
    if (!updated) return null;

    // Parse filter JSON if exists
    if (updated.filter) {
      try {
        updated.filter = JSON.parse(updated.filter);
      } catch (e) {
        updated.filter = null;
      }
    }

    return updated;
  }

  /**
   * Toggle email notification for saved search
   * @param {number} searchId - Saved search ID (stt)
   * @param {string} userId - User ID (for ownership check)
   * @param {boolean} enabled - Enable or disable notification
   * @returns {Object|null} Updated saved search or null
   */
  static async toggleNotification(searchId, userId, enabled) {
    const [updated] = await db(MODULE.SAVED_SEARCH)
      .where({
        stt: searchId,
        user_id: userId
      })
      .update({ email_notification: enabled })
      .returning('*');
    
    return updated || null;
  }
}

module.exports = SavedSearchRepository;


