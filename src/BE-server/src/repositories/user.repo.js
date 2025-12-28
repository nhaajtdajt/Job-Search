const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * User Repository
 * Data access layer for User table
 */
class UserRepository {
  /**
   * Find user by ID
   * @param {string} userId - User UUID
   * @returns {Object|null} User object or null
   */
  static async findById(userId) {
    const user = await db(MODULE.USERS)
      .select('*')
      .where('user_id', userId)
      .first();
    
    return user || null;
  }

  /**
   * Update user profile
   * @param {string} userId - User UUID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user
   */
  static async update(userId, updateData) {
    // Filter allowed fields
    const allowedFields = [
      'name',
      'phone',
      'address',
      'date_of_birth',
      'gender',
      'avatar_url'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const [user] = await db(MODULE.USERS)
      .where('user_id', userId)
      .update(filteredData)
      .returning('*');
    
    return user;
  }

  /**
   * Create user profile
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  static async create(userData) {
    const [user] = await db(MODULE.USERS)
      .insert(userData)
      .returning('*');
    
    return user;
  }

  /**
   * Delete user
   * @param {string} userId - User UUID
   * @returns {number} Number of deleted rows
   */
  static async delete(userId) {
    return await db(MODULE.USERS)
      .where('user_id', userId)
      .del();
  }
}

module.exports = UserRepository;
