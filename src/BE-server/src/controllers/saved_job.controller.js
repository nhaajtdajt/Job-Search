const SavedJobService = require('../services/saved_job.service');
const HTTP_STATUS = require('../constants/http-status');
const ResponseHandler = require('../utils/response-handler');
const { BadRequestError } = require('../errors');
const { isPositiveInteger } = require('../utils/validation.util');

/**
 * Saved Job Controller
 * Handles HTTP requests for saved job endpoints
 */
class SavedJobController {
  /**
   * POST /api/users/saved-jobs
   * Save a job for the authenticated user
   * Body: { job_id }
   */
  static async saveJob(req, res, next) {
    try {
      const userId = req.user.user_id;
      const { job_id } = req.body;

      if (!job_id) {
        throw new BadRequestError('Job ID is required');
      }

      if (!isPositiveInteger(job_id)) {
        throw new BadRequestError('Invalid job ID');
      }

      const savedJob = await SavedJobService.saveJob(userId, parseInt(job_id, 10));

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
   * DELETE /api/users/saved-jobs/:jobId
   * Unsave a job for the authenticated user
   */
  static async unsaveJob(req, res, next) {
    try {
      const userId = req.user.user_id;
      const jobId = parseInt(req.params.jobId, 10);

      if (!isPositiveInteger(jobId)) {
        throw new BadRequestError('Invalid job ID');
      }

      const result = await SavedJobService.unsaveJob(userId, jobId);

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
   * GET /api/users/saved-jobs/:jobId/check
   * Check if a job is saved by the authenticated user
   */
  static async checkSaved(req, res, next) {
    try {
      const userId = req.user.user_id;
      const jobId = parseInt(req.params.jobId, 10);

      if (!isPositiveInteger(jobId)) {
        throw new BadRequestError('Invalid job ID');
      }

      const isSaved = await SavedJobService.isJobSaved(userId, jobId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Check completed',
        data: { is_saved: isSaved }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/users/saved-jobs
   * Get all saved jobs for the authenticated user with pagination
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

      const result = await SavedJobService.getSavedJobs(userId, page, limit);

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
   * GET /api/users/saved-jobs/count
   * Get count of saved jobs for the authenticated user
   */
  static async getSavedJobsCount(req, res, next) {
    try {
      const userId = req.user.user_id;
      const count = await SavedJobService.countSavedJobs(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Count retrieved successfully',
        data: { count }
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = SavedJobController;

