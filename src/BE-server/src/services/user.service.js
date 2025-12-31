const UserRepository = require('../repositories/user.repo');
const ApplicationRepository = require('../repositories/application.repo');
const SavedJobRepository = require('../repositories/saved_job.repo');
const SavedSearchRepository = require('../repositories/saved_search.repo');
const StorageService = require('./storage.service');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../errors');
const { createClient } = require('@supabase/supabase-js');
const environment = require('../configs/environment.config');
const HashUtil = require('../utils/hash.util');

// Initialize Supabase client for password operations
const supabaseUrl = environment.SUPABASE_URL;
const supabaseKey = environment.SUPABASE_SERVICE_ROLE_KEY || environment.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

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

  /**
   * Change user password (for authenticated users)
   * @param {string} userId - User UUID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  static async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new BadRequestError('Current password and new password are required');
    }

    // Validate password strength
    const passwordValidation = HashUtil.validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      throw new BadRequestError(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Get user email from database
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get user from Supabase to verify current password
    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new BadRequestError('Failed to verify current password');
    }

    const authUser = authUsers.users.find(u => u.id === userId);
    if (!authUser) {
      throw new NotFoundError('User not found in authentication system');
    }

    // Verify current password by attempting to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: authUser.email,
      password: currentPassword
    });

    if (signInError || !signInData) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Update password in Supabase using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        password: newPassword
      }
    );

    if (updateError) {
      throw new BadRequestError(updateError.message || 'Failed to change password');
    }

    return { message: 'Password changed successfully' };
  }
}

module.exports = UserService;

