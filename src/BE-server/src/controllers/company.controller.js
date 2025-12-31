const StorageService = require('../services/storage.service');
const CompanyService = require('../services/company.service');
const CompanyRepository = require('../repositories/company.repo');
const JobService = require('../services/job.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');

/**
 * Company Controller
 * Handle company-related operations including logos and banners
 */
class CompanyController {
  /**
   * Upload company logo
   * POST /api/companies/:companyId/logo
   */
  static async uploadLogo(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError('No logo file provided');
      }

      const { companyId } = req.params;

      // TODO: Check if user has permission to update this company
      // const employer = await EmployerRepository.findById(req.user.employer_id);
      // if (employer.company_id !== parseInt(companyId)) {
      //   throw new ForbiddenError('Not authorized to update this company');
      // }

// TODO: Delete old logo
      // const company = await CompanyRepository.findById(companyId);
      // if (company && company.logo_url) {
      //   await StorageService.deleteOldFile(company.logo_url);
      // }

      // Upload new logo
      const result = await StorageService.uploadCompanyLogo(
        req.file.buffer,
        companyId
      );

      // TODO: Update database
      // await CompanyRepository.update(companyId, { logo_url: result.url });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company logo uploaded successfully',
        data: {
          logo_url: result.url,
          path: result.path,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Upload company banner
   * POST /api/companies/:companyId/banner
   */
  static async uploadBanner(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError('No banner file provided');
      }

      const { companyId } = req.params;

      // TODO: Check permission
      // TODO: Delete old banner
      
      // Upload new banner
      const result = await StorageService.uploadCompanyBanner(
        req.file.buffer,
        companyId
      );

      // TODO: Update database (need to add banner_url column to company table)
      // await CompanyRepository.update(companyId, { banner_url: result.url });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company banner uploaded successfully',
        data: {
          banner_url: result.url,
          path: result.path,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete company logo
   * DELETE /api/companies/:companyId/logo
   */
  static async deleteLogo(req, res, next) {
    try {
      const { companyId } = req.params;

      // TODO: Check permission
      // TODO: Get logo URL and delete
      // TODO: Update database

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company logo deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete company banner
   * DELETE /api/companies/:companyId/banner
   */
  static async deleteBanner(req, res, next) {
    try {
      const { companyId } = req.params;

      // TODO: Implement

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company banner deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get company details
   * GET /api/companies/:companyId
   */
  static async getById(req, res, next) {
    try {
      const { companyId } = req.params;

      const company = await CompanyService.getCompanyById(parseInt(companyId));

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company retrieved successfully',
        data: company,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get all companies
   * GET /api/companies
   */
  static async getAll(req, res, next) {
    try {
      const companies = await CompanyService.getAllCompanies();

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Companies retrieved successfully',
        data: companies,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Create company
   * POST /api/companies
   */
  static async create(req, res, next) {
    try {
      const companyData = req.body;

      const company = await CompanyService.createCompany(companyData);

      return ResponseHandler.created(res, {
        message: 'Company created successfully',
        data: company,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update company
   * PUT /api/companies/:companyId
   */
  static async update(req, res, next) {
    try {
      const { companyId } = req.params;
      const updateData = req.body;

      const company = await CompanyService.updateCompany(parseInt(companyId), updateData);

      if (!company) {
        throw new NotFoundError('Company not found');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company updated successfully',
        data: company,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete company
   * DELETE /api/companies/:companyId
   */
  static async delete(req, res, next) {
    try {
      const { companyId } = req.params;

      const deletedCount = await CompanyService.deleteCompany(parseInt(companyId));

      if (deletedCount === 0) {
        throw new NotFoundError('Company not found');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get jobs by company ID
   * GET /api/companies/:companyId/jobs
   */
  static async getCompanyJobs(req, res, next) {
    try {
      const { companyId } = req.params;

      // Check if company exists
      const company = await CompanyService.getCompanyById(parseInt(companyId));
      if (!company) {
        throw new NotFoundError('Company not found');
      }

      const jobs = await JobService.getJobsByCompany(parseInt(companyId));

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company jobs retrieved successfully',
        data: jobs,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CompanyController;
