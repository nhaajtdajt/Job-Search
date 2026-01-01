const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * Employer Repository
 * Data access layer for Employer table
 */
class EmployerRepository {
  /**
   * Find employer by ID
   * @param {number} employerId - Employer ID
   * @returns {Object|null} Employer object or null
   */
  static async findById(employerId) {
    const employer = await db(MODULE.EMPLOYER)
      .select('*')
      .where('employer_id', employerId)
      .first();

    if (!employer) return null;

    // Get company info if exists
    if (employer.company_id) {
      const company = await db(MODULE.COMPANY)
        .select('*')
        .where('company_id', employer.company_id)
        .first();

      employer.company = company || null;
    }

    return employer;
  }

  /**
   * Find employer by user ID
   * @param {string} userId - User UUID
   * @returns {Object|null} Employer object or null
   */
  static async findByUserId(userId) {
    const employer = await db(MODULE.EMPLOYER)
      .select('*')
      .where('user_id', userId)
      .first();

    return employer || null;
  }

  /**
   * Update employer profile
   * @param {number} employerId - Employer ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated employer
   */
  static async update(employerId, updateData) {
    // Filter allowed fields
    const allowedFields = [
      'full_name',
      'email',
      'role',
      'status',
      'avatar_url',
      'company_id'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const [employer] = await db(MODULE.EMPLOYER)
      .where('employer_id', employerId)
      .update(filteredData)
      .returning('*');

    return employer;
  }

  /**
   * Create employer profile
   * @param {Object} employerData - Employer data
   * @returns {Object} Created employer
   */
  static async create(employerData) {
    const { DEFAULT_EMPLOYER_STATUS } = require('../constants/employer-status');

    // Set default status if not provided
    const dataWithDefaults = {
      status: DEFAULT_EMPLOYER_STATUS,
      ...employerData
    };

    const [employer] = await db(MODULE.EMPLOYER)
      .insert(dataWithDefaults)
      .returning('*');

    return employer;
  }

  /**
   * Delete employer
   * @param {number} employerId - Employer ID
   * @returns {number} Number of deleted rows
   */
  static async delete(employerId) {
    return await db(MODULE.EMPLOYER)
      .where('employer_id', employerId)
      .del();
  }

  /**
   * Find all employers with pagination and filters (Admin only)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {Object} filters - Optional filters (status, company_id)
   * @returns {Object} Paginated employers
   */
  static async findAll(page = 1, limit = 10, filters = {}) {
    const { parsePagination } = require('../utils/pagination.util');
    const { offset } = parsePagination(page, limit);

    // Build WHERE conditions for both queries
    const buildConditions = (query) => {
      if (filters.status) {
        query = query.where('status', filters.status);
      }
      if (filters.company_id) {
        query = query.where('company_id', filters.company_id);
      }
      return query;
    };

    // Count query (separate)
    let countQuery = db(MODULE.EMPLOYER);
    countQuery = buildConditions(countQuery);
    const [{ total }] = await countQuery.count('* as total');

    // Data query (separate)
    let dataQuery = db(MODULE.EMPLOYER).select('*');
    dataQuery = buildConditions(dataQuery);
    const data = await dataQuery
      .orderBy('employer_id', 'asc')
      .limit(limit)
      .offset(offset);

    return {
      data,
      total: parseInt(total, 10),
      page,
      limit
    };
  }
}

module.exports = EmployerRepository;
