/**
 * Company Service
 * Business logic for company management
 */

const CompanyRepository = require('../repositories/company.repo');
const EmployerRepository = require('../repositories/employer.repo');
const StorageService = require('./storage.service');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors');

class CompanyService {
  /**
   * Get all companies
   * @returns {Array} List of companies
   */
  static async getAll() {
    return await CompanyRepository.findAll();
  }

  /**
   * Get company by ID
   * @param {number} companyId - Company ID
   * @returns {Object} Company details
   */
  static async getById(companyId) {
    const company = await CompanyRepository.findById(companyId);
    
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    
    return company;
  }

  /**
   * Create a new company
   * @param {Object} companyData - Company data
   * @returns {Object} Created company
   */
  static async create(companyData) {
    // Validate required fields
    if (!companyData.company_name) {
      throw new BadRequestError('Company name is required');
    }

    return await CompanyRepository.create(companyData);
  }

  /**
   * Update company
   * @param {number} companyId - Company ID
   * @param {number} employerId - Employer ID (for permission check)
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated company
   */
  static async update(companyId, employerId, updateData) {
    // Check if employer belongs to this company
    const employer = await EmployerRepository.findById(employerId);
    if (!employer || parseInt(employer.company_id) !== parseInt(companyId)) {
      throw new ForbiddenError('Not authorized to update this company');
    }

    // Only allow certain fields to be updated
    const allowedFields = [
      'company_name', 'description', 'website', 'industry',
      'company_size', 'founded_year', 'address', 'phone', 'email'
    ];
    
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const company = await CompanyRepository.update(companyId, filteredData);
    
    if (!company) {
      throw new NotFoundError('Company not found');
    }
    
    return company;
  }

  /**
   * Delete company
   * @param {number} companyId - Company ID
   * @returns {boolean} Success status
   */
  static async delete(companyId) {
    const company = await CompanyRepository.findById(companyId);
    
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    // Delete logo and banner from storage if they exist
    if (company.logo_url) {
      try {
        await StorageService.deleteFile(company.logo_url);
      } catch (err) {
        console.warn('Failed to delete company logo:', err.message);
      }
    }

    if (company.banner_url) {
      try {
        await StorageService.deleteFile(company.banner_url);
      } catch (err) {
        console.warn('Failed to delete company banner:', err.message);
      }
    }

    await CompanyRepository.delete(companyId);
    return true;
  }

  /**
   * Upload company logo
   * @param {number} companyId - Company ID
   * @param {number|string} employerIdOrUserId - Employer ID or User ID (for permission check)
   * @param {Buffer} fileBuffer - Image buffer
   * @returns {Object} Upload result with URL
   */
  static async uploadLogo(companyId, employerIdOrUserId, fileBuffer) {
    if (!fileBuffer) {
      throw new BadRequestError('No logo file provided');
    }

    // Check permission - support both employer_id and user_id
    let employer = await EmployerRepository.findById(employerIdOrUserId);
    
    // If not found by employer_id, try to find by user_id
    if (!employer) {
      employer = await EmployerRepository.findByUserId(employerIdOrUserId);
    }
    
    console.log('[CompanyService.uploadLogo] Permission check:', {
      companyId,
      employerIdOrUserId,
      employer: employer ? { employer_id: employer.employer_id, company_id: employer.company_id } : null
    });

    if (!employer || parseInt(employer.company_id) !== parseInt(companyId)) {
      throw new ForbiddenError('Not authorized to update this company');
    }

    // Get old logo URL to delete
    const company = await CompanyRepository.findById(companyId);
    if (company && company.logo_url) {
      try {
        await StorageService.deleteFile(company.logo_url);
      } catch (err) {
        console.warn('Failed to delete old logo:', err.message);
      }
    }

    // Upload new logo
    const result = await StorageService.uploadCompanyLogo(fileBuffer, companyId);

    // Update database
    await CompanyRepository.update(companyId, { logo_url: result.url });

    return result;
  }

  /**
   * Delete company logo
   * @param {number} companyId - Company ID
   * @param {number} employerId - Employer ID (for permission check)
   */
  static async deleteLogo(companyId, employerId) {
    // Check permission
    const employer = await EmployerRepository.findById(employerId);
    if (!employer || parseInt(employer.company_id) !== parseInt(companyId)) {
      throw new ForbiddenError('Not authorized to update this company');
    }

    const company = await CompanyRepository.findById(companyId);
    if (!company || !company.logo_url) {
      throw new NotFoundError('No logo found');
    }

    // Delete from storage
    await StorageService.deleteFile(company.logo_url);

    // Update database
    await CompanyRepository.update(companyId, { logo_url: null });
  }

  /**
   * Upload company banner
   * @param {number} companyId - Company ID
   * @param {number|string} employerIdOrUserId - Employer ID or User ID (for permission check)
   * @param {Buffer} fileBuffer - Image buffer
   * @returns {Object} Upload result with URL
   */
  static async uploadBanner(companyId, employerIdOrUserId, fileBuffer) {
    if (!fileBuffer) {
      throw new BadRequestError('No banner file provided');
    }

    // Check permission - support both employer_id and user_id
    let employer = await EmployerRepository.findById(employerIdOrUserId);
    
    // If not found by employer_id, try to find by user_id
    if (!employer) {
      employer = await EmployerRepository.findByUserId(employerIdOrUserId);
    }
    
    console.log('[CompanyService.uploadBanner] Permission check:', {
      companyId,
      employerIdOrUserId,
      employer: employer ? { employer_id: employer.employer_id, company_id: employer.company_id } : null
    });

    if (!employer || parseInt(employer.company_id) !== parseInt(companyId)) {
      throw new ForbiddenError('Not authorized to update this company');
    }

    // Get old banner URL to delete
    const company = await CompanyRepository.findById(companyId);
    if (company && company.banner_url) {
      try {
        await StorageService.deleteFile(company.banner_url);
      } catch (err) {
        console.warn('Failed to delete old banner:', err.message);
      }
    }

    // Upload new banner
    const result = await StorageService.uploadCompanyBanner(fileBuffer, companyId);

    // Update database
    await CompanyRepository.update(companyId, { banner_url: result.url });

    return result;
  }

  /**
   * Delete company banner
   * @param {number} companyId - Company ID
   * @param {number} employerId - Employer ID (for permission check)
   */
  static async deleteBanner(companyId, employerId) {
    // Check permission
    const employer = await EmployerRepository.findById(employerId);
    if (!employer || parseInt(employer.company_id) !== parseInt(companyId)) {
      throw new ForbiddenError('Not authorized to update this company');
    }

    const company = await CompanyRepository.findById(companyId);
    if (!company || !company.banner_url) {
      throw new NotFoundError('No banner found');
    }

    // Delete from storage
    await StorageService.deleteFile(company.banner_url);

    // Update database
    await CompanyRepository.update(companyId, { banner_url: null });
  }
}

module.exports = CompanyService;
