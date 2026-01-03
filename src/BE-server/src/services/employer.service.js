/**
 * Employer Service
 * Business logic for employer profile management
 */

const EmployerRepository = require('../repositories/employer.repo');
const StorageService = require('./storage.service');
const { NotFoundError, BadRequestError } = require('../errors');
const db = require('../databases/knex');
const MODULE = require('../constants/module');

class EmployerService {
  /**
   * Get employer profile by ID or User ID
   * @param {number|string} employerIdOrUserId - Employer ID or User ID
   * @returns {Object} Employer profile with statistics
   */
  static async getProfile(employerIdOrUserId) {
    // Try findById first (works if employerIdOrUserId is employer_id)
    let employer = await EmployerRepository.findById(employerIdOrUserId);
    
    // Fallback: try findByUserId (if employerIdOrUserId is user_id)
    if (!employer) {
      employer = await EmployerRepository.findByUserId(employerIdOrUserId);
    }
    
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    // Get statistics for employer
    const stats = await this.getEmployerStatistics(employer.employer_id);
    
    return {
      ...employer,
      ...stats
    };
  }

  /**
   * Get employer statistics (total jobs, applications, views)
   * @param {number} employerId - Employer ID
   * @returns {Object} Statistics
   */
  static async getEmployerStatistics(employerId) {
    // Count total jobs
    const [jobsResult] = await db(MODULE.JOB)
      .where('employer_id', employerId)
      .count('job_id as total');
    
    // Count total applications for all jobs of this employer
    const [applicationsResult] = await db(MODULE.APPLICATION)
      .join(MODULE.JOB, 'application.job_id', 'job.job_id')
      .where('job.employer_id', employerId)
      .count('application.application_id as total');
    
    // Sum total views from all jobs
    const [viewsResult] = await db(MODULE.JOB)
      .where('employer_id', employerId)
      .sum('views as total');

    return {
      total_jobs: parseInt(jobsResult?.total || 0, 10),
      total_applications: parseInt(applicationsResult?.total || 0, 10),
      total_views: parseInt(viewsResult?.total || 0, 10)
    };
  }

  /**
   * Update employer profile
   * @param {number|string} employerIdOrUserId - Employer ID or User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated employer
   */
  static async updateProfile(employerIdOrUserId, updateData) {
    // Try to find employer by ID first, then by userId
    let employer = await EmployerRepository.findById(employerIdOrUserId);
    
    if (!employer) {
      // Fallback: try to find by user_id
      employer = await EmployerRepository.findByUserId(employerIdOrUserId);
    }
    
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }
    
    const employerId = employer.employer_id;
    
    // Validate updateData - only allow certain fields
    // Map 'name' to 'full_name' for frontend compatibility
    if (updateData.name && !updateData.full_name) {
      updateData.full_name = updateData.name;
    }
    
    const allowedFields = [
      'full_name', 'email', 'role', 'phone', 'company_id', 'position', 'department'
    ];
    
    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const updatedEmployer = await EmployerRepository.update(employerId, filteredData);
    
    if (!updatedEmployer) {
      throw new NotFoundError('Employer not found after update');
    }
    
    return updatedEmployer;
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
