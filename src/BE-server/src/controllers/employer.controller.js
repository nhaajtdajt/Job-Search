const EmployerService = require('../services/employer.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');

/**
 * Employer Controller
 * Handle employer-related operations including profile and avatar
 */
class EmployerController {
  /**
   * Upload employer avatar
   * POST /api/employers/avatar
   */
  static async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError('No avatar file provided');
      }

      const employerId = req.user.employer_id;

      if (!employerId) {
        throw new BadRequestError('Employer ID not found in authentication');
      }

      const result = await EmployerService.uploadAvatar(employerId, req.file.buffer);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employer avatar uploaded successfully',
        data: {
          avatar_url: result.url,
          path: result.path,
        },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete employer avatar
   * DELETE /api/employers/avatar
   */
  static async deleteAvatar(req, res, next) {
    try {
      const employerId = req.user.employer_id;

      await EmployerService.deleteAvatar(employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employer avatar deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get employer profile
   * GET /api/employers/profile
   */
  static async getProfile(req, res, next) {
    try {
      const employerId = req.user.employer_id;

      const employer = await EmployerService.getProfile(employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employer profile retrieved successfully',
        data: employer,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update employer profile
   * PUT /api/employers/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const updateData = req.body;

      const employer = await EmployerService.updateProfile(employerId, updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employer profile updated successfully',
        data: employer,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = EmployerController;
