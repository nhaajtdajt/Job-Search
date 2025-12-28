const StorageService = require('../services/storage.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError, NotFoundError } = require('../errors');
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

      // TODO: Delete old avatar
      // const employer = await EmployerRepository.findById(employerId);
      // if (employer && employer.avatar_url) {
      //   await StorageService.deleteOldFile(employer.avatar_url);
      // }

      // Upload new avatar
      const result = await StorageService.uploadAvatar(
        req.file.buffer,
        employerId.toString(),
        'employer'
      );

      // TODO: Update database
      // await EmployerRepository.update(employerId, { avatar_url: result.url });

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

      // TODO: Implement with repository
      // const employer = await EmployerRepository.findById(employerId);
      // await StorageService.deleteFile(employer.avatar_url);
      // await EmployerRepository.update(employerId, { avatar_url: null });

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

      // TODO: Implement with EmployerRepository

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employer profile retrieved successfully',
        data: {
          employer_id: employerId,
          message: 'Employer repository not yet implemented',
        },
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

      // TODO: Implement

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employer profile updated successfully',
        data: { message: 'Repository not yet implemented' },
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = EmployerController;
