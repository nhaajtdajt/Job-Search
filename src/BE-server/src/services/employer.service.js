/**
 * Employer Service
 * Business logic for employer profile management
 */

const EmployerRepository = require('../repositories/employer.repo');
const StorageService = require('./storage.service');
const { NotFoundError, BadRequestError } = require('../errors');

class EmployerService {
  /**
   * Get employer profile by ID
   * @param {number} employerId - Employer ID
   * @returns {Object} Employer profile
   */
  static async getProfile(employerId) {
    const employer = await EmployerRepository.findById(employerId);
    
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }
    
    return employer;
  }

  /**
   * Update employer profile
   * @param {number} employerId - Employer ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated employer
   */
  static async updateProfile(employerId, updateData) {
    // Validate updateData - only allow certain fields
    const allowedFields = [
      'full_name', 'email', 'role', 'phone', 'company_id'
    ];
    
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const employer = await EmployerRepository.update(employerId, filteredData);
    
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }
    
    return employer;
  }

  /**
   * Upload employer avatar
   * @param {number} employerId - Employer ID
   * @param {Buffer} fileBuffer - Image buffer
   * @returns {Object} Upload result with URL
   */
  static async uploadAvatar(employerId, fileBuffer) {
    if (!fileBuffer) {
      throw new BadRequestError('No avatar file provided');
    }

    // Get old avatar URL to delete
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
      fileBuffer, 
      employerId.toString(), 
      'employer'
    );

    // Update database
    await EmployerRepository.update(employerId, { avatar_url: result.url });

    return result;
  }

  /**
   * Delete employer avatar
   * @param {number} employerId - Employer ID
   */
  static async deleteAvatar(employerId) {
    const employer = await EmployerRepository.findById(employerId);
    
    if (!employer || !employer.avatar_url) {
      throw new NotFoundError('No avatar found');
    }

    // Delete from storage
    await StorageService.deleteFile(employer.avatar_url);

    // Update database
    await EmployerRepository.update(employerId, { avatar_url: null });
  }

  /**
   * Get employer by user ID
   * @param {string} userId - User ID
   * @returns {Object} Employer profile
   */
  static async getByUserId(userId) {
    const employer = await EmployerRepository.findByUserId(userId);
    return employer;
  }
}

module.exports = EmployerService;
