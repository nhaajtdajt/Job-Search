const SavedService = require('../services/saved.service');
const HTTP_STATUS = require('../constants/http-status');
const ResponseHandler = require('../utils/response-handler');
const { BadRequestError } = require('../errors');
const { isPositiveInteger } = require('../utils/validation.util');

/**
 * Saved Controller
 * Handles HTTP requests for saved jobs
 */
class SavedController {
  /**
   * POST /api/saved-jobs/:jobId
   * Save a job for user
   */
  static async saveJob(req, res, next) {
    try {
      const userId = req.user.user_id;
      const jobId = parseInt(req.params.jobId, 10);

      if (!isPositiveInteger(jobId)) {
        throw new BadRequestError('Invalid job ID');
      }

      const savedJob = await SavedService.saveJob(userId, jobId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Job saved successfully',
        data: savedJob
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/saved-jobs/:jobId
   * Remove saved job
   */
  static async unsaveJob(req, res, next) {
    try {
      const userId = req.user.user_id;
      const jobId = parseInt(req.params.jobId, 10);

      if (!isPositiveInteger(jobId)) {
        throw new BadRequestError('Invalid job ID');
      }

      const result = await SavedService.unsaveJob(userId, jobId);

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
   * GET /api/saved-jobs
   * Get user's saved jobs with pagination
   * Query: ?page=1&limit=10
   */
  static async getSavedJobs(req, res, next) {
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

      const result = await SavedService.getSavedJobs(userId, page, limit);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Saved jobs retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/saved-jobs/check/:jobId
   * Check if job is saved by user
   */
  static async checkJobSaved(req, res, next) {
    try {
      const userId = req.user.user_id;
      const jobId = parseInt(req.params.jobId, 10);

      if (!isPositiveInteger(jobId)) {
        throw new BadRequestError('Invalid job ID');
      }

      const result = await SavedService.checkJobSaved(userId, jobId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Check completed',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = SavedController;
