const EmployerRepository = require('../repositories/employer.repo');
const StorageService = require('./storage.service');
const { NotFoundError } = require('../errors');

/**
 * Employer Service
 * Business logic for Employer operations
 */
class EmployerService {
  /**
   * Get employer by ID
   * @param {number} employerId - Employer ID
   */
  static async getEmployerById(employerId) {
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
   */
  static async updateEmployer(employerId, updateData) {
    const employer = await EmployerRepository.update(employerId, updateData);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }
    return employer;
  }

  /**
   * Upload employer avatar
   * @param {number} employerId - Employer ID
   * @param {Buffer} fileBuffer - File buffer
   */
  static async uploadAvatar(employerId, fileBuffer) {
    // Get current employer to check for existing avatar
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    // Delete old avatar if exists
    if (employer.avatar_url) {
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
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    if (!employer.avatar_url) {
      throw new NotFoundError('No avatar found');
    }

    // Delete file from storage
    await StorageService.deleteFile(employer.avatar_url);

    // Update database
    await EmployerRepository.update(employerId, { avatar_url: null });
  }
}

module.exports = EmployerService;

