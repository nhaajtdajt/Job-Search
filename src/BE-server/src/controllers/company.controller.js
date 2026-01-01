const CompanyService = require('../services/company.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError } = require('../errors');
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
      const employerId = req.user.employer_id;

      const result = await CompanyService.uploadLogo(companyId, employerId, req.file.buffer);

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
      const employerId = req.user.employer_id;

      const result = await CompanyService.uploadBanner(companyId, employerId, req.file.buffer);

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
      const employerId = req.user.employer_id;

      await CompanyService.deleteLogo(companyId, employerId);

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
      const employerId = req.user.employer_id;

      await CompanyService.deleteBanner(companyId, employerId);

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

      const company = await CompanyService.getById(companyId);

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
      const companies = await CompanyService.getAll();

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
   * Update company
   * PUT /api/companies/:companyId
   */
  static async update(req, res, next) {
    try {
      const { companyId } = req.params;
      const employerId = req.user.employer_id;
      const updateData = req.body;

      const company = await CompanyService.update(companyId, employerId, updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Company updated successfully',
        data: company,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = CompanyController;
