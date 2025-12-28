const JobService = require('../services/job.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');
const { isPositiveInteger } = require('../utils/validation.util');

class JobController {
  /**
   * GET /api/jobs
   * Get jobs list with pagination and filters
   */
  static async getJobs(req, res, next) {
    try {
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      if (!isPositiveInteger(page)) {
        throw new BadRequestError("Invalid page (must be a positive integer)");
      }

      if (!isPositiveInteger(limit)) {
        throw new BadRequestError("Invalid limit (must be a positive integer)");
      }

      const filters = {};
      if (req.query.job_type) filters.job_type = req.query.job_type;
      if (req.query.employer_id) filters.employer_id = req.query.employer_id;

      const result = await JobService.getJobs(page, limit, filters);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Jobs retrieved successfully",
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/jobs/:jobId
   * Get job detail by ID
   */
  static async getJobById(req, res, next) {
    try {
      const { jobId } = req.params;
      const data = await JobService.getJobById(jobId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Job retrieved successfully",
        data,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = JobController;
