const FollowedCompanyRepository = require('../repositories/followed_company.repo');
const CompanyRepository = require('../repositories/company.repo');
const { NotFoundError, BadRequestError } = require('../errors');

/**
 * Followed Company Service
 * Business logic for followed companies
 */
class FollowedCompanyService {
  /**
   * Follow a company for a user
   * @param {string} userId - User ID
   * @param {number} companyId - Company ID
   * @returns {Object} Followed company record
   */
  static async followCompany(userId, companyId) {
    // Check if company exists
    const company = await CompanyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError(`Company with ID ${companyId} not found`);
    }

    // Follow the company (will update followed_at if already exists)
    const followedCompany = await FollowedCompanyRepository.follow(userId, companyId);

    return {
      ...followedCompany,
      company: {
        company_id: company.company_id,
        company_name: company.company_name,
        logo_url: company.logo_url
      }
    };
  }

  /**
   * Unfollow a company for a user
   * @param {string} userId - User ID
   * @param {number} companyId - Company ID
   * @returns {Object} Success message
   */
  static async unfollowCompany(userId, companyId) {
    const deleted = await FollowedCompanyRepository.unfollow(userId, companyId);
    
    if (deleted === 0) {
      throw new NotFoundError('Followed company not found');
    }

    return { message: 'Company unfollowed successfully' };
  }

  /**
   * Toggle follow status for a company
   * @param {string} userId - User ID
   * @param {number} companyId - Company ID
   * @returns {Object} Result with is_following status
   */
  static async toggleFollow(userId, companyId) {
    // Check if company exists
    const company = await CompanyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError(`Company with ID ${companyId} not found`);
    }

    const isFollowing = await FollowedCompanyRepository.isFollowed(userId, companyId);

    if (isFollowing) {
      await FollowedCompanyRepository.unfollow(userId, companyId);
      return { is_following: false, message: 'Company unfollowed successfully' };
    } else {
      await FollowedCompanyRepository.follow(userId, companyId);
      return { is_following: true, message: 'Company followed successfully' };
    }
  }

  /**
   * Check if a company is followed by user
   * @param {string} userId - User ID
   * @param {number} companyId - Company ID
   * @returns {boolean} True if followed
   */
  static async isCompanyFollowed(userId, companyId) {
    return await FollowedCompanyRepository.isFollowed(userId, companyId);
  }

  /**
   * Get all followed companies for a user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated followed companies
   */
  static async getFollowedCompanies(userId, page = 1, limit = 10) {
    return await FollowedCompanyRepository.findByUserId(userId, page, limit);
  }

  /**
   * Count followed companies for a user
   * @param {string} userId - User ID
   * @returns {number} Count of followed companies
   */
  static async countFollowedCompanies(userId) {
    return await FollowedCompanyRepository.countByUserId(userId);
  }

  /**
   * Get followers count for a company
   * @param {number} companyId - Company ID
   * @returns {number} Count of followers
   */
  static async getFollowersCount(companyId) {
    // Check if company exists
    const company = await CompanyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError(`Company with ID ${companyId} not found`);
    }

    return await FollowedCompanyRepository.countFollowers(companyId);
  }

  /**
   * Get all followers of a company with pagination
   * @param {number} companyId - Company ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated followers
   */
  static async getFollowers(companyId, page = 1, limit = 10) {
    // Check if company exists
    const company = await CompanyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError(`Company with ID ${companyId} not found`);
    }

    return await FollowedCompanyRepository.getFollowersByCompanyId(companyId, page, limit);
  }
}

module.exports = FollowedCompanyService;
