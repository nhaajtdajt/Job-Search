const SavedSearchService = require('../services/saved_search.service');
const HTTP_STATUS = require('../constants/http-status');
const ResponseHandler = require('../utils/response-handler');
const { BadRequestError } = require('../errors');
const { isPositiveInteger } = require('../utils/validation.util');

/**
 * Saved Search Controller
 * Handles HTTP requests for saved search endpoints
 */
class SavedSearchController {
  /**
   * POST /api/users/saved-searches
   * Save a search for the authenticated user
   * Body: { name, filter }
   */
  static async saveSearch(req, res, next) {
    try {
      const userId = req.user.user_id;
      const { name, filter } = req.body;

      const savedSearch = await SavedSearchService.saveSearch(userId, { name, filter });

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Search saved successfully',
        data: savedSearch
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/users/saved-searches/:searchId
   * Delete a saved search for the authenticated user
   */
  static async deleteSearch(req, res, next) {
    try {
      const userId = req.user.user_id;
      const searchId = parseInt(req.params.searchId, 10);

      if (!isPositiveInteger(searchId)) {
        throw new BadRequestError('Invalid search ID');
      }

      const result = await SavedSearchService.deleteSearch(searchId, userId);

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
   * GET /api/users/saved-searches
   * Get all saved searches for the authenticated user with pagination
   * Query: ?page=1&limit=10
   */
  static async getSavedSearches(req, res, next) {
    try {
      const userId = req.user.user_id;
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      if (!isPositiveInteger(page)) {
        throw new BadRequestError('Invalid page (must be a positive integer)');
      }

      if (!isPositiveInteger(limit)) {
        throw new BadRequestError('Invalid limit (must be a positive integer)');
      }

      const result = await SavedSearchService.getSavedSearches(userId, page, limit);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Saved searches retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/users/saved-searches/count
   * Get count of saved searches for the authenticated user
   */
  static async getSavedSearchesCount(req, res, next) {
    try {
      const userId = req.user.user_id;
      const count = await SavedSearchService.countSavedSearches(userId);

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
   * PUT /api/users/saved-searches/:searchId
   * Update a saved search for the authenticated user
   */
  static async updateSearch(req, res, next) {
    try {
      const userId = req.user.user_id;
      const searchId = parseInt(req.params.searchId, 10);
      const updateData = req.body;

      if (!isPositiveInteger(searchId)) {
        throw new BadRequestError('Invalid search ID');
      }

      const updated = await SavedSearchService.updateSearch(searchId, userId, updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Saved search updated successfully',
        data: updated
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PATCH /api/users/saved-searches/:searchId/notification
   * Toggle email notification for a saved search
   */
  static async toggleNotification(req, res, next) {
    try {
      const userId = req.user.user_id;
      const searchId = parseInt(req.params.searchId, 10);
      const { email_notification } = req.body;

      if (!isPositiveInteger(searchId)) {
        throw new BadRequestError('Invalid search ID');
      }

      const updated = await SavedSearchService.toggleNotification(searchId, userId, email_notification);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: email_notification ? 'Notification enabled' : 'Notification disabled',
        data: updated
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/users/saved-searches/:searchId/jobs
   * Get matching jobs for a saved search
   */
  static async getMatchingJobs(req, res, next) {
    try {
      const userId = req.user.user_id;
      const searchId = parseInt(req.params.searchId, 10);

      if (!isPositiveInteger(searchId)) {
        throw new BadRequestError('Invalid search ID');
      }

      const result = await SavedSearchService.getMatchingJobs(searchId, userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Matching jobs retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = SavedSearchController;


