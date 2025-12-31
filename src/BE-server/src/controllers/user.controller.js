const StorageService = require('../services/storage.service');
const UserRepository = require('../repositories/user.repo');
const ApplicationRepository = require('../repositories/application.repo');
const SavedJobRepository = require('../repositories/saved_job.repo');
const SavedSearchRepository = require('../repositories/saved_search.repo');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError, NotFoundError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');

/**
 * User Controller
 * Handle user-related operations including profile and avatar
 */
class UserController {
  /**
   * Upload user avatar
   * POST /api/users/avatar
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   * @param {Function} next - Express next function
   */
  static async uploadAvatar(req, res, next) {
    try {
      // Check if file exists
      if (!req.file) {
        throw new BadRequestError('No avatar file provided');
      }

      // Get user ID from authenticated user
      const userId = req.user.user_id;

      if (!userId) {
        throw new BadRequestError('User ID not found in authentication');
      }

      // Get old avatar URL from database to delete
      const user = await UserRepository.findById(userId);
      if (user && user.avatar_url) {
        try {
          await StorageService.deleteFile(user.avatar_url);
        } catch (err) {
          console.warn('Failed to delete old avatar:', err.message);
        }
      }

      // Upload new avatar
      const result = await StorageService.uploadAvatar(
        req.file.buffer,
        userId,
        'user'
      );

      // Update database with new avatar URL
      await UserRepository.update(userId, { avatar_url: result.url });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Avatar uploaded successfully',
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
   * Delete user avatar
   * DELETE /api/users/avatar
   */
  static async deleteAvatar(req, res, next) {
    try {
      const userId = req.user.user_id;

      // Get avatar URL from database
      const user = await UserRepository.findById(userId);
      if (!user || !user.avatar_url) {
        throw new NotFoundError('No avatar found');
      }

      // Delete from storage
      await StorageService.deleteFile(user.avatar_url);

      // Update database
      await UserRepository.update(userId, { avatar_url: null });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Avatar deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get user profile
   * GET /api/users/profile
   */
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.user_id;

      const user = await UserRepository.findById(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update user profile
   * PUT /api/users/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.user_id;
      const updateData = req.body;

      const user = await UserRepository.update(userId, updateData);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get user statistics for overview page
   * GET /api/users/statistics
   */
  static async getStatistics(req, res, next) {
    try {
      const userId = req.user.user_id;

      // Get counts for applications, saved jobs, and saved searches
      const [applicationsCount, savedJobsCount, savedSearchesCount] = await Promise.all([
        ApplicationRepository.getStatistics(userId).then(stats => stats.total),
        SavedJobRepository.countByUserId(userId),
        SavedSearchRepository.countByUserId(userId)
      ]);

      const statistics = {
        applications: applicationsCount || 0,
        saved_jobs: savedJobsCount || 0,
        saved_searches: savedSearchesCount || 0
      };

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UserController;
