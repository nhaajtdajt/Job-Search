const UserService = require('../services/user.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');

/**
 * User Controller
 * Handle user-related operations including profile and avatar
 */
class UserController {
  /**
   * Upload user avatar
   * POST /api/users/avatar
   */
  static async uploadAvatar(req, res, next) {
    try {
      if (!req.file) {
        throw new BadRequestError('No avatar file provided');
      }

      const userId = req.user.user_id;

      if (!userId) {
        throw new BadRequestError('User ID not found in authentication');
      }

      const result = await UserService.uploadAvatar(userId, req.file.buffer);

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

      await UserService.deleteAvatar(userId);

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

      const user = await UserService.getProfile(userId);

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

      const user = await UserService.updateProfile(userId, updateData);

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

      const statistics = await UserService.getStatistics(userId);

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
