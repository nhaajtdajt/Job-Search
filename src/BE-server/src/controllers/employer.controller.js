const StorageService = require('../services/storage.service');
const EmployerRepository = require('../repositories/employer.repo');
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

      // Delete old avatar
      const employer = await EmployerRepository.findById(employerId);
      if (employer && employer.avatar_url) {
        try {
          await StorageService.deleteFile(employer.avatar_url);
        } catch (err) {
          console.warn('Failed to delete old avatar:', err.message);
        }
      }

      // Upload new avatar
      const result = await StorageService.uploadAvatar(
        req.file.buffer,
        employerId.toString(),
        'employer'
      );

      // Update database
      await EmployerRepository.update(employerId, { avatar_url: result.url });

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

      // Implement with repository
      const employer = await EmployerRepository.findById(employerId);
      if (!employer || !employer.avatar_url) {
        throw new NotFoundError('No avatar found');
      }

      await StorageService.deleteFile(employer.avatar_url);
      await EmployerRepository.update(employerId, { avatar_url: null });

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

      const employer = await EmployerRepository.findById(employerId);

      if (!employer) {
        throw new NotFoundError('Employer not found');
      }

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

      const employer = await EmployerRepository.update(employerId, updateData);

      if (!employer) {
        throw new NotFoundError('Employer not found');
      }

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
