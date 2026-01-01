const SearchService = require('../services/search.service');
const HTTP_STATUS = require('../constants/http-status');
const ResponseHandler = require('../utils/response-handler');
const { BadRequestError } = require('../errors');
const { isPositiveInteger } = require('../utils/validation.util');

/**
 * Search Controller
 * Handles HTTP requests for saved searches
 */
class SearchController {
  /**
   * POST /api/searches
   * Create saved search
   * Body: { search_name, filters }
   */
  static async createSavedSearch(req, res, next) {
    try {
      const userId = req.user.user_id;
      const searchData = req.body;

      const search = await SearchService.createSavedSearch(userId, searchData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Search saved successfully',
        data: search
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/searches
   * Get user's saved searches
   */
  static async getSavedSearches(req, res, next) {
    try {
      const userId = req.user.user_id;

      const searches = await SearchService.getSavedSearches(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Saved searches retrieved successfully',
        data: searches
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PUT /api/searches/:searchId
   * Update saved search
   * Body: { search_name?, filters? }
   */
  static async updateSavedSearch(req, res, next) {
    try {
      const searchId = parseInt(req.params.searchId, 10);
      const userId = req.user.user_id;
      const updateData = req.body;

      if (!isPositiveInteger(searchId)) {
        throw new BadRequestError('Invalid search ID');
      }

      const search = await SearchService.updateSavedSearch(searchId, userId, updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Search updated successfully',
        data: search
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/searches/:searchId
   * Delete saved search
   */
  static async deleteSavedSearch(req, res, next) {
    try {
      const searchId = parseInt(req.params.searchId, 10);
      const userId = req.user.user_id;

      if (!isPositiveInteger(searchId)) {
        throw new BadRequestError('Invalid search ID');
      }

      const result = await SearchService.deleteSavedSearch(searchId, userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: result.message,
        data: null
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = SearchController;
