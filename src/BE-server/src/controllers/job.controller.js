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
      if (req.query.search) filters.search = req.query.search;
      if (req.query.location) filters.location = req.query.location;
      if (req.query.sort) filters.sort = req.query.sort;
      if (req.query.job_type) filters.job_type = req.query.job_type;
      if (req.query.employer_id) filters.employer_id = req.query.employer_id;
      if (req.query.is_remote) filters.is_remote = req.query.is_remote === 'true';
      if (req.query.salary_min) filters.salary_min = parseInt(req.query.salary_min);
      if (req.query.salary_max) filters.salary_max = parseInt(req.query.salary_max);
      
      // Handle array filters (job_type could be array?)
      // Front-End sends 'job_type' as single or array currently? 
      // Jobs.jsx: params.append('type', type) -> ?type=Part-time&type=Remote... 
      // Express parses ?type=A&type=B as array.
      // So req.query.job_type might be array. Repo needs to handle that.
      // Wait, my update to Repo above uses `where('job_type', filters.job_type)`. 
      // If it's array, `where` might fail or handle it depending on Knex.
      // Safest is to use `whereIn` if array.

      // Let's checking req.query details more carefully.
      // Frontend sends 'type' param, but mapped to `job_type` in `params` object in JS, 
      // url params: `type=Full-time&type=Part-time`.
      // Express keys: req.query.type.
      
      // Controller maps:
      if (req.query.type) filters.job_type = req.query.type; 
      if (req.query.exp) filters.experience_level = req.query.exp;
      if (req.query.posted) filters.posted_within = req.query.posted;

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

  /**
   * POST /api/jobs
   * Create a new job posting (employer only)
   */
  static async createJob(req, res, next) {
    try {
      const employerId = req.user.employer_id; // From auth middleware
      const jobData = req.body;

      const job = await JobService.createJob(employerId, jobData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: "Job created successfully",
        data: job,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PUT /api/jobs/:jobId
   * Update job posting (employer only)
   */
  static async updateJob(req, res, next) {
    try {
      const { jobId } = req.params;
      const employerId = req.user.employer_id; // From auth middleware
      const updateData = req.body;

      const job = await JobService.updateJob(jobId, employerId, updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Job updated successfully",
        data: job,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/jobs/:jobId
   * Delete job posting (employer only)
   */
  static async deleteJob(req, res, next) {
    try {
      const { jobId } = req.params;
      const employerId = req.user.employer_id; // From auth middleware

      const result = await JobService.deleteJob(jobId, employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: result.message,
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/jobs/:jobId/publish
   * Publish a job posting (employer only)
   */
  static async publishJob(req, res, next) {
    try {
      const { jobId } = req.params;
      const employerId = req.user.employer_id; // From auth middleware

      const job = await JobService.publishJob(jobId, employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Job published successfully",
        data: job,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/jobs/:jobId/expire
   * Expire/close a job posting (employer only)
   */
  static async expireJob(req, res, next) {
    try {
      const { jobId } = req.params;
      const employerId = req.user.employer_id; // From auth middleware

      const job = await JobService.expireJob(jobId, employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Job expired successfully",
        data: job,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PUT /api/jobs/:jobId/views
   * Increment view counter for a job
   */
  static async incrementViews(req, res, next) {
    try {
      const { jobId } = req.params;
      const job = await JobService.incrementViews(jobId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "View counted successfully",
        data: job,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/employer/jobs
   * Get all jobs for the authenticated employer
   */
  static async getEmployerJobs(req, res, next) {
    try {
      const employerId = req.user.employer_id; // From auth middleware
      const jobs = await JobService.getJobsByEmployer(employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: "Employer jobs retrieved successfully",
        data: jobs,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = JobController;
