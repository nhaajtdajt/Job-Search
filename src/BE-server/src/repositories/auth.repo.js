const db = require('../databases/knex');

/**
 * Auth Repository
 * Database operations for authentication module
 * Following: routes -> controllers -> services -> repo -> database
 */
class AuthRepository {
  // ============================================
  // USER OPERATIONS
  // ============================================

  /**
   * Find user by ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>} User object or null
   */
  static async findUserById(userId) {
    return await db('users')
      .where('user_id', userId)
      .first();
  }

  /**
   * Create user profile
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async createUser(userData) {
    await db('users').insert(userData);
    return await this.findUserById(userData.user_id);
  }

  /**
   * Update user profile
   * @param {string} userId - User UUID
   * @param {Object} updateData - Data to update
   * @returns {Promise<number>} Affected rows
   */
  static async updateUser(userId, updateData) {
    return await db('users')
      .where('user_id', userId)
      .update(updateData);
  }

  /**
   * Delete user profile
   * @param {string} userId - User UUID
   * @returns {Promise<number>} Affected rows
   */
  static async deleteUser(userId) {
    return await db('users')
      .where('user_id', userId)
      .delete();
  }

  // ============================================
  // EMPLOYER OPERATIONS
  // ============================================

  /**
   * Find employer by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>} Employer object or null
   */
  static async findEmployerByUserId(userId) {
    return await db('employer')
      .where('user_id', userId)
      .first();
  }

  /**
   * Find employer by ID
   * @param {number} employerId - Employer ID
   * @returns {Promise<Object|null>} Employer object or null
   */
  static async findEmployerById(employerId) {
    return await db('employer')
      .where('employer_id', employerId)
      .first();
  }

  /**
   * Create employer record
   * @param {Object} employerData - Employer data
   * @returns {Promise<Object>} Created employer
   */
  static async createEmployer(employerData) {
    const [employer] = await db('employer')
      .insert(employerData)
      .returning('*');
    return employer;
  }

  /**
   * Update employer record
   * @param {string} userId - User UUID
   * @param {Object} updateData - Data to update
   * @returns {Promise<number>} Affected rows
   */
  static async updateEmployerByUserId(userId, updateData) {
    return await db('employer')
      .where('user_id', userId)
      .update(updateData);
  }

  // ============================================
  // COMPANY OPERATIONS
  // ============================================

  /**
   * Find company by name
   * @param {string} companyName - Company name
   * @returns {Promise<Object|null>} Company object or null
   */
  static async findCompanyByName(companyName) {
    return await db('company')
      .where('company_name', companyName)
      .first();
  }

  /**
   * Find company by ID
   * @param {number} companyId - Company ID
   * @returns {Promise<Object|null>} Company object or null
   */
  static async findCompanyById(companyId) {
    return await db('company')
      .where('company_id', companyId)
      .first();
  }

  /**
   * Create company
   * @param {Object} companyData - Company data
   * @returns {Promise<Object>} Created company
   */
  static async createCompany(companyData) {
    const [company] = await db('company')
      .insert(companyData)
      .returning('company_id');
    return company;
  }
}

module.exports = AuthRepository;
