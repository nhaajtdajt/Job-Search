/**
 * User Service
 * Business logic for user profile management
 */

const UserRepository = require('../repositories/user.repo');
const ApplicationRepository = require('../repositories/application.repo');
const SavedJobRepository = require('../repositories/saved_job.repo');
const SavedSearchRepository = require('../repositories/saved_search.repo');
const StorageService = require('./storage.service');
const { NotFoundError, BadRequestError } = require('../errors');

class UserService {
  /**
   * Get user profile by ID
   * @param {string} userId - User ID
   * @returns {Object} User profile
   */
  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user
   */
  static async updateProfile(userId, updateData) {
    // Validate updateData - only allow certain fields
    const allowedFields = [
      'name', 'full_name', 'gender', 'date_of_birth', 
      'phone', 'address', 'bio', 'headline'
    ];
    
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const user = await UserRepository.update(userId, filteredData);
    
    if (!user) {
      throw new NotFoundError('User not found');
    }
    
    return user;
  }

  /**
   * Upload user avatar
   * @param {string} userId - User ID
   * @param {Buffer} fileBuffer - Image buffer
   * @returns {Object} Upload result with URL
   */
  static async uploadAvatar(userId, fileBuffer) {
    if (!fileBuffer) {
      throw new BadRequestError('No avatar file provided');
    }

    // Get old avatar URL to delete
    const user = await UserRepository.findById(userId);
    if (user && user.avatar_url) {
      try {
        await StorageService.deleteFile(user.avatar_url);
      } catch (err) {
        console.warn('Failed to delete old avatar:', err.message);
      }
    }

    // Upload new avatar
    const result = await StorageService.uploadAvatar(fileBuffer, userId, 'user');

    // Update database
    await UserRepository.update(userId, { avatar_url: result.url });

    return result;
  }

  /**
   * Delete user avatar
   * @param {string} userId - User ID
   */
  static async deleteAvatar(userId) {
    const user = await UserRepository.findById(userId);
    
    if (!user || !user.avatar_url) {
      throw new NotFoundError('No avatar found');
    }

    // Delete from storage
    await StorageService.deleteFile(user.avatar_url);

    // Update database
    await UserRepository.update(userId, { avatar_url: null });
  }

  /**
   * Get user statistics for overview page
   * @param {string} userId - User ID
   * @returns {Object} Statistics object
   */
  static async getStatistics(userId) {
    const [applicationsStats, savedJobsCount, savedSearchesCount] = await Promise.all([
      ApplicationRepository.getStatistics(userId),
      SavedJobRepository.countByUserId(userId),
      SavedSearchRepository.countByUserId(userId)
    ]);

    return {
      applications: applicationsStats?.total || 0,
      saved_jobs: savedJobsCount || 0,
      saved_searches: savedSearchesCount || 0
    };
  }
}

module.exports = UserService;
