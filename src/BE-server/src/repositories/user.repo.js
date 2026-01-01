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
    // Use raw SQL to format date_of_birth as YYYY-MM-DD string to avoid timezone issues
    const user = await db(MODULE.USERS)
      .select(
        'user_id',
        'name',
        'gender',
        db.raw("COALESCE(to_char(date_of_birth, 'YYYY-MM-DD'), NULL) as date_of_birth"),
        'phone',
        'address',
        'avatar_url',
        'job_title',
        'current_level',
        'industry',
        'field',
        'experience_years',
        'current_salary',
        'education',
        'nationality',
        'marital_status',
        'country',
        'province',
        'desired_location',
        'desired_salary'
      )
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
      'avatar_url',
      // Professional information
      'job_title',
      'current_level',
      'industry',
      'field',
      'experience_years',
      'current_salary',
      'education',
      // Personal information
      'nationality',
      'marital_status',
      'country',
      'province',
      // Job preferences
      'desired_location',
      'desired_salary'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    await db(MODULE.USERS)
      .where('user_id', userId)
      .update(filteredData);

    // Fetch updated user with formatted date using raw SQL to avoid timezone issues
    const user = await db(MODULE.USERS)
      .select(
        'user_id',
        'name',
        'gender',
        db.raw("COALESCE(to_char(date_of_birth, 'YYYY-MM-DD'), NULL) as date_of_birth"),
        'phone',
        'address',
        'avatar_url',
        'job_title',
        'current_level',
        'industry',
        'field',
        'experience_years',
        'current_salary',
        'education',
        'nationality',
        'marital_status',
        'country',
        'province',
        'desired_location',
        'desired_salary'
      )
      .where('user_id', userId)
      .first();

    return user || null;
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

  /**
   * Find all users with pagination and filters (Admin only)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (role, status)
   * @returns {Object} Paginated users
   */
  static async findAll(page = 1, limit = 10, filters = {}) {
    const { parsePagination } = require('../utils/pagination.util');
    const { offset } = parsePagination(page, limit);

    let query = db(MODULE.USERS).select('*');
    
    // Note: role filter would need to be checked from auth.users table
    // For now, we'll just paginate users table
    
    const [{ total }] = await query.clone().count('* as total');
    
    const data = await query
      .orderBy('user_id', 'asc')
      .limit(limit)
      .offset(offset);
    
    return {
      data,
      total: parseInt(total, 10),
      page,
      limit
    };
  }

  /**
   * Find users by role
   * @param {string} role - User role (job_seeker, employer)
   * @returns {Array} List of users
   */
  static async findByRole(role) {
    return await db(MODULE.USERS)
      .select('user_id', 'name')
      .where('role', role);
  }
}

module.exports = UserRepository;
