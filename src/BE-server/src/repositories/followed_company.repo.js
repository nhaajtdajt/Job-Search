const db = require('../databases/knex');
const MODULE = require('../constants/module');
const { parsePagination } = require('../utils/pagination.util');

/**
 * Followed Company Repository
 * Data access layer for Followed Company table
 */
class FollowedCompanyRepository {
  /**
   * Follow a company for a user
   * @param {string} userId - User ID
   * @param {number} companyId - Company ID
   * @returns {Object} Followed company record
   */
  static async follow(userId, companyId) {
    // Check if user exists in users table
    const userExists = await db(MODULE.USERS).where('user_id', userId).first();
    
    if (!userExists) {
      throw new Error(`User with ID ${userId} not found in users table`);
    }
    
    const [followedCompany] = await db(MODULE.FOLLOWED_COMPANY)
      .insert({
        user_id: userId,
        company_id: companyId,
        followed_at: new Date()
      })
      .onConflict(['user_id', 'company_id'])
      .merge({ followed_at: new Date() }) // Update followed_at if already exists
      .returning('*');
    
    return followedCompany;
  }

  /**
   * Unfollow a company for a user
   * @param {string} userId - User ID
   * @param {number} companyId - Company ID
   * @returns {number} Number of deleted rows
   */
  static async unfollow(userId, companyId) {
    return await db(MODULE.FOLLOWED_COMPANY)
      .where({
        user_id: userId,
        company_id: companyId
      })
      .del();
  }

  /**
   * Check if a company is followed by user
   * @param {string} userId - User ID
   * @param {number} companyId - Company ID
   * @returns {boolean} True if followed
   */
  static async isFollowed(userId, companyId) {
    const followed = await db(MODULE.FOLLOWED_COMPANY)
      .where({
        user_id: userId,
        company_id: companyId
      })
      .first();
    
    return !!followed;
  }

  /**
   * Get all followed companies for a user with pagination
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated followed companies
   */
  static async findByUserId(userId, page = 1, limit = 10) {
    const { offset } = parsePagination(page, limit);

    const [{ total }] = await db(MODULE.FOLLOWED_COMPANY)
      .where('user_id', userId)
      .count('* as total');

    const followedCompanies = await db(MODULE.FOLLOWED_COMPANY)
      .select('followed_company.*')
      .where('followed_company.user_id', userId)
      .orderBy('followed_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Enrich with company info
    for (const followedCompany of followedCompanies) {
      const company = await db(MODULE.COMPANY)
        .select(
          'company.company_id',
          'company.company_name',
          'company.logo_url',
          'company.website',
          'company.address',
          'company.description',
          'company.industry',
          'company.company_size',
          'company.founded_year'
        )
        .where('company.company_id', followedCompany.company_id)
        .first();
      
      followedCompany.company = company;

      // Count active jobs for this company
      const [{ job_count }] = await db(MODULE.JOB)
        .join(MODULE.EMPLOYER, 'job.employer_id', 'employer.employer_id')
        .where('employer.company_id', followedCompany.company_id)
        .where('job.status', 'active')
        .count('* as job_count');
      
      followedCompany.active_jobs_count = parseInt(job_count, 10);
    }

    return {
      data: followedCompanies,
      pagination: {
        total: parseInt(total, 10),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(parseInt(total, 10) / limit)
      }
    };
  }

  /**
   * Count followed companies for a user
   * @param {string} userId - User ID
   * @returns {number} Count of followed companies
   */
  static async countByUserId(userId) {
    const [{ count }] = await db(MODULE.FOLLOWED_COMPANY)
      .where('user_id', userId)
      .count('* as count');
    
    return parseInt(count, 10);
  }

  /**
   * Get followers count for a company
   * @param {number} companyId - Company ID
   * @returns {number} Count of followers
   */
  static async countFollowers(companyId) {
    const [{ count }] = await db(MODULE.FOLLOWED_COMPANY)
      .where('company_id', companyId)
      .count('* as count');
    
    return parseInt(count, 10);
  }

  /**
   * Get all followers of a company with pagination
   * @param {number} companyId - Company ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} Paginated followers
   */
  static async getFollowersByCompanyId(companyId, page = 1, limit = 10) {
    const { offset } = parsePagination(page, limit);

    const [{ total }] = await db(MODULE.FOLLOWED_COMPANY)
      .where('company_id', companyId)
      .count('* as total');

    const followers = await db(MODULE.FOLLOWED_COMPANY)
      .select('followed_company.*', 'users.name', 'users.avatar_url', 'users.job_title')
      .join(MODULE.USERS, 'followed_company.user_id', 'users.user_id')
      .where('followed_company.company_id', companyId)
      .orderBy('followed_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      data: followers,
      pagination: {
        total: parseInt(total, 10),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(parseInt(total, 10) / limit)
      }
    };
  }
}

module.exports = FollowedCompanyRepository;
