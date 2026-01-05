const FollowedCompanyService = require('../services/followed_company.service');
const HTTP_STATUS = require('../constants/http-status');
const ResponseHandler = require('../utils/response-handler');
const { BadRequestError } = require('../errors');
const { isPositiveInteger } = require('../utils/validation.util');

/**
 * Followed Company Controller
 * Handles HTTP requests for followed company endpoints
 */
class FollowedCompanyController {
  /**
   * POST /api/followed-companies
   * Follow a company for the authenticated user
   * Body: { company_id }
   */
  static async followCompany(req, res, next) {
    try {
      const userId = req.user.user_id;
      const { company_id } = req.body;

      if (!company_id) {
        throw new BadRequestError('Company ID is required');
      }

      if (!isPositiveInteger(company_id)) {
        throw new BadRequestError('Invalid company ID');
      }

      const followedCompany = await FollowedCompanyService.followCompany(userId, parseInt(company_id, 10));

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Company followed successfully',
        data: followedCompany
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/followed-companies/:companyId
   * Unfollow a company for the authenticated user
   */
  static async unfollowCompany(req, res, next) {
    try {
      const userId = req.user.user_id;
      const companyId = parseInt(req.params.companyId, 10);

      if (!isPositiveInteger(companyId)) {
        throw new BadRequestError('Invalid company ID');
      }

      const result = await FollowedCompanyService.unfollowCompany(userId, companyId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: result.message,
        data: null
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/followed-companies/:companyId/toggle
   * Toggle follow status for a company
   */
  static async toggleFollow(req, res, next) {
    try {
      const userId = req.user.user_id;
      const companyId = parseInt(req.params.companyId, 10);

      if (!isPositiveInteger(companyId)) {
        throw new BadRequestError('Invalid company ID');
      }

      const result = await FollowedCompanyService.toggleFollow(userId, companyId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: result.message,
        data: { is_following: result.is_following }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/followed-companies/:companyId/check
   * Check if a company is followed by the authenticated user
   */
  static async checkFollowed(req, res, next) {
    try {
      const userId = req.user.user_id;
      const companyId = parseInt(req.params.companyId, 10);

      if (!isPositiveInteger(companyId)) {
        throw new BadRequestError('Invalid company ID');
      }

      const isFollowed = await FollowedCompanyService.isCompanyFollowed(userId, companyId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Check completed',
        data: { is_followed: isFollowed }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/followed-companies
   * Get all followed companies for the authenticated user with pagination
   * Query: ?page=1&limit=10
   */
  static async getFollowedCompanies(req, res, next) {
    try {
      const userId = req.user.user_id;
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      if (page < 1 || limit < 1) {
        throw new BadRequestError('Invalid pagination parameters');
      }

      const result = await FollowedCompanyService.getFollowedCompanies(userId, page, limit);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Followed companies retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/followed-companies/count
   * Get count of followed companies for authenticated user
   */
  static async getFollowedCompaniesCount(req, res, next) {
    try {
      const userId = req.user.user_id;
      const count = await FollowedCompanyService.countFollowedCompanies(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Count retrieved successfully',
        data: { count }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/companies/:companyId/followers/count
   * Get followers count for a company (public)
   */
  static async getFollowersCount(req, res, next) {
    try {
      const companyId = parseInt(req.params.companyId, 10);

      if (!isPositiveInteger(companyId)) {
        throw new BadRequestError('Invalid company ID');
      }

      const count = await FollowedCompanyService.getFollowersCount(companyId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Followers count retrieved successfully',
        data: { count }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/companies/:companyId/followers
   * Get all followers of a company with pagination (for employers)
   * Query: ?page=1&limit=10
   */
  static async getFollowers(req, res, next) {
    try {
      const companyId = parseInt(req.params.companyId, 10);
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      if (!isPositiveInteger(companyId)) {
        throw new BadRequestError('Invalid company ID');
      }

      if (page < 1 || limit < 1) {
        throw new BadRequestError('Invalid pagination parameters');
      }

      const result = await FollowedCompanyService.getFollowers(companyId, page, limit);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Followers retrieved successfully',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = FollowedCompanyController;
