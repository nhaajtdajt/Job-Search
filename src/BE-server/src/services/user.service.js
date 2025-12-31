const UserRepository = require('../repositories/user.repo');
const ApplicationRepository = require('../repositories/application.repo');
const SavedJobRepository = require('../repositories/saved_job.repo');
const SavedSearchRepository = require('../repositories/saved_search.repo');
const StorageService = require('./storage.service');
const { NotFoundError } = require('../errors');

/**
 * User Service
 * Business logic for User operations
 */
class UserService {
  /**
   * Get user by ID
   * @param {string} userId - User UUID
   */
  static async getUserById(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User UUID
   * @param {Object} updateData - Data to update
   */
  static async updateUser(userId, updateData) {
    const user = await UserRepository.update(userId, updateData);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Upload user avatar
   * @param {string} userId - User UUID
   * @param {Buffer} fileBuffer - File buffer
   */
  static async uploadAvatar(userId, fileBuffer) {
    // Get current user to check for existing avatar
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete old avatar if exists
    if (user.avatar_url) {
      try {
        await StorageService.deleteFile(user.avatar_url);
      } catch (err) {
        console.warn('Failed to delete old avatar:', err.message);
      }
    }

    // Upload new avatar
    const result = await StorageService.uploadAvatar(
      fileBuffer,
      userId,
      'user'
    );

    // Update database
    await UserRepository.update(userId, { avatar_url: result.url });

    return result;
  }

  /**
   * Delete user avatar
   * @param {string} userId - User UUID
   */
  static async deleteAvatar(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.avatar_url) {
      throw new NotFoundError('No avatar found');
    }

    // Delete file from storage
    await StorageService.deleteFile(user.avatar_url);

    // Update database
    await UserRepository.update(userId, { avatar_url: null });
  }

  /**
   * Get user statistics (applications, saved jobs, saved searches)
   * @param {string} userId - User UUID
   */
  static async getStatistics(userId) {
    // Get counts for applications, saved jobs, and saved searches
    const [applicationsCount, savedJobsCount, savedSearchesCount] = await Promise.all([
      ApplicationRepository.getStatistics(userId).then(stats => stats.total),
      SavedJobRepository.countByUserId(userId),
      SavedSearchRepository.countByUserId(userId)
    ]);

    return {
      applications: applicationsCount || 0,
      saved_jobs: savedJobsCount || 0,
      saved_searches: savedSearchesCount || 0
    };
  }
}

module.exports = UserService;

