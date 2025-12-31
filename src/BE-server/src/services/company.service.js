const CompanyRepository = require('../repositories/company.repo');

/**
 * Company Service
 * Business logic for Company operations
 */
class CompanyService {
  /**
   * Get all companies
   */
  static async getAllCompanies() {
    return await CompanyRepository.findAll();
  }

  /**
   * Get company by ID
   * @param {number} companyId - Company ID
   */
  static async getCompanyById(companyId) {
    return await CompanyRepository.findById(companyId);
  }

  /**
   * Create company
   * @param {Object} companyData - Company data
   */
  static async createCompany(companyData) {
    return await CompanyRepository.create(companyData);
  }

  /**
   * Update company
   * @param {number} companyId - Company ID
   * @param {Object} updateData - Data to update
   */
  static async updateCompany(companyId, updateData) {
    return await CompanyRepository.update(companyId, updateData);
  }

  /**
   * Delete company
   * @param {number} companyId - Company ID
   */
  static async deleteCompany(companyId) {
    return await CompanyRepository.delete(companyId);
  }
}

module.exports = CompanyService;

