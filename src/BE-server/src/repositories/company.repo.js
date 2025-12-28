const db = require('../databases/knex');
const MODULE = require('../constants/module');

/**
 * Company Repository
 * Data access layer for Company table
 */
class CompanyRepository {
  /**
   * Find all companies
   * @returns {Array} Companies
   */
  static async findAll() {
    return await db(MODULE.COMPANY)
      .select('*')
      .orderBy('company_name', 'asc');
  }

  /**
   * Find company by ID
   * @param {number} companyId - Company ID
   * @returns {Object|null} Company object or null
   */
  static async findById(companyId) {
    const company = await db(MODULE.COMPANY)
      .select('*')
      .where('company_id', companyId)
      .first();
    
    return company || null;
  }

  /**
   * Update company
   * @param {number} companyId - Company ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated company
   */
  static async update(companyId, updateData) {
    // Filter allowed fields
    const allowedFields = [
      'company_name',
      'website',
      'address',
      'description',
      'logo_url',
      'banner_url'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const [company] = await db(MODULE.COMPANY)
      .where('company_id', companyId)
      .update(filteredData)
      .returning('*');
    
    return company;
  }

  /**
   * Create company
   * @param {Object} companyData - Company data
   * @returns {Object} Created company
   */
  static async create(companyData) {
    const [company] = await db(MODULE.COMPANY)
      .insert(companyData)
      .returning('*');
    
    return company;
  }

  /**
   * Delete company
   * @param {number} companyId - Company ID
   * @returns {number} Number of deleted rows
   */
  static async delete(companyId) {
    return await db(MODULE.COMPANY)
      .where('company_id', companyId)
      .del();
  }
}

module.exports = CompanyRepository;
