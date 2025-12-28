const StorageService = require('../services/storage.service');
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

      // TODO: Get old avatar URL from database to delete
      // const user = await UserRepository.findById(userId);
      // if (user && user.avatar_url) {
      //   await StorageService.deleteOldFile(user.avatar_url);
      // }

      // Upload new avatar
      const result = await StorageService.uploadAvatar(
        req.file.buffer,
        userId,
        'user'
      );

      // TODO: Update database with new avatar URL
      // await UserRepository.update(userId, { avatar_url: result.url });

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

      // TODO: Get avatar URL from database
      // const user = await UserRepository.findById(userId);
      // if (!user || !user.avatar_url) {
      //   throw new NotFoundError('No avatar found');
      // }

      // TODO: Delete from storage
      // await StorageService.deleteFile(user.avatar_url);

      // TODO: Update database
      // await UserRepository.update(userId, { avatar_url: null });

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

      // TODO: Implement with UserRepository
      // const user = await UserRepository.findById(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Profile retrieved successfully',
        data: {
          user_id: userId,
          message: 'User repository not yet implemented',
        },
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

      // TODO: Implement with UserRepository
      // const user = await UserRepository.update(userId, updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Profile updated successfully',
        data: {
          message: 'User repository not yet implemented',
        },
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UserController;
