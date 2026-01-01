/**
 * Saved Candidate Service
 * Business logic for saved candidate management
 */

const SavedCandidateRepository = require('../repositories/saved_candidate.repo');
const UserRepository = require('../repositories/user.repo');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors');

class SavedCandidateService {
  /**
   * Save a candidate for an employer
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @param {string} notes - Optional notes
   * @returns {Object} Saved candidate record
   */
  static async saveCandidate(employerId, userId, notes = null) {
    if (!employerId) {
      throw new BadRequestError('Employer ID is required');
    }

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    // Verify candidate exists
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Candidate not found');
    }

    // Save the candidate
    const savedCandidate = await SavedCandidateRepository.save(employerId, userId, notes);

    return {
      ...savedCandidate,
      candidate: {
        user_id: user.user_id,
        name: user.name,
        avatar_url: user.avatar_url
      }
    };
  }

  /**
   * Unsave a candidate for an employer
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @returns {boolean} Success status
   */
  static async unsaveCandidate(employerId, userId) {
    if (!employerId) {
      throw new BadRequestError('Employer ID is required');
    }

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    const result = await SavedCandidateRepository.unsave(employerId, userId);
    
    if (result === 0) {
      throw new NotFoundError('Saved candidate not found');
    }

    return true;
  }

  /**
   * Check if a candidate is saved by employer
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @returns {Object} { isSaved: boolean }
   */
  static async checkSaved(employerId, userId) {
    if (!employerId || !userId) {
      return { isSaved: false };
    }

    const isSaved = await SavedCandidateRepository.isSaved(employerId, userId);
    return { isSaved };
  }

  /**
   * Get all saved candidates for an employer
   * @param {number} employerId - Employer ID
   * @param {Object} options - Query options (page, limit, search, sortBy, sortOrder)
   * @returns {Object} Paginated saved candidates
   */
  static async getSavedCandidates(employerId, options = {}) {
    if (!employerId) {
      throw new BadRequestError('Employer ID is required');
    }

    const result = await SavedCandidateRepository.findByEmployerId(employerId, options);
    return result;
  }

  /**
   * Update notes for a saved candidate
   * @param {number} employerId - Employer ID
   * @param {string} userId - User ID (candidate)
   * @param {string} notes - New notes
   * @returns {Object} Updated record
   */
  static async updateNotes(employerId, userId, notes) {
    if (!employerId) {
      throw new BadRequestError('Employer ID is required');
    }

    if (!userId) {
      throw new BadRequestError('User ID is required');
    }

    // Check if saved
    const isSaved = await SavedCandidateRepository.isSaved(employerId, userId);
    if (!isSaved) {
      throw new NotFoundError('Saved candidate not found');
    }

    const updated = await SavedCandidateRepository.updateNotes(employerId, userId, notes);
    return updated;
  }

  /**
   * Get count of saved candidates for an employer
   * @param {number} employerId - Employer ID
   * @returns {number} Count
   */
  static async getCount(employerId) {
    if (!employerId) {
      return 0;
    }

    return await SavedCandidateRepository.countByEmployerId(employerId);
  }
}

module.exports = SavedCandidateService;
