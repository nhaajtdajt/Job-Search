const StorageService = require('../services/storage.service');
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

      // TODO: Implement with CompanyRepository

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company retrieved successfully',
        data: {
          company_id: companyId,
          message: 'Company repository not yet implemented',
        },
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
      // TODO: Implement pagination and filters

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Companies retrieved successfully',
        data: {
          message: 'Company repository not yet implemented',
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CompanyController;
