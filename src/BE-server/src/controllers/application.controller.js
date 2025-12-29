const ApplicationService = require('../services/application.service');
const HTTP_STATUS = require('../constants/http-status');
const ResponseHandler = require('../utils/response-handler');
const { BadRequestError } = require('../errors');
const { isPositiveInteger } = require('../utils/validation.util');

/**
 * Application Controller
 * Handles HTTP requests for application endpoints
 */
class ApplicationController {
  /**
   * POST /api/applications
   * Submit a job application
   * Body: { job_id, resume_id }
   */
  static async applyJob(req, res, next) {
    try {
      const userId = req.user.user_id;  // From auth middleware
      const applicationData = req.body;

      const application = await ApplicationService.applyJob(userId, applicationData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.CREATED,
        message: 'Application submitted successfully',
        data: application
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/applications
   * Get user's application history with pagination
   * Query: ?page=1&limit=10&status=pending
   */
  static async getUserApplications(req, res, next) {
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

      const filters = {};
      if (req.query.status) {
        filters.status = req.query.status;
      }

      const result = await ApplicationService.getUserApplications(userId, page, limit, filters);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Applications retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/applications/:applicationId
   * Get application detail
   */
  static async getApplicationById(req, res, next) {
    try {
      const { applicationId } = req.params;
      const userId = req.user.user_id;

      const application = await ApplicationService.getApplicationById(applicationId, userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Application retrieved successfully',
        data: application
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PUT /api/applications/:applicationId
   * Update application (change resume)
   * Body: { resume_id }
   */
  static async updateApplication(req, res, next) {
    try {
      const { applicationId } = req.params;
      const userId = req.user.user_id;
      const updateData = req.body;

      const application = await ApplicationService.updateApplication(
        applicationId,
        userId,
        updateData
      );

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Application updated successfully',
        data: application
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * DELETE /api/applications/:applicationId
   * Withdraw application
   */
  static async withdrawApplication(req, res, next) {
    try {
      const { applicationId } = req.params;
      const userId = req.user.user_id;

      const result = await ApplicationService.withdrawApplication(applicationId, userId);

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
   * GET /api/applications/statistics
   * Get application statistics for user
   */
  static async getApplicationStatistics(req, res, next) {
    try {
      const userId = req.user.user_id;

      const stats = await ApplicationService.getApplicationStatistics(userId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/jobs/:jobId/applications
   * Get applications for a specific job (employer only)
   * Query: ?page=1&limit=10&status=pending
   */
  static async getJobApplications(req, res, next) {
    try {
      const { jobId } = req.params;
      const employerId = req.user.employer_id;  // From auth middleware
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      if (!isPositiveInteger(page)) {
        throw new BadRequestError('Invalid page (must be a positive integer)');
      }

      if (!isPositiveInteger(limit)) {
        throw new BadRequestError('Invalid limit (must be a positive integer)');
      }

      const filters = {};
      if (req.query.status) {
        filters.status = req.query.status;
      }

      const result = await ApplicationService.getJobApplications(
        jobId,
        employerId,
        page,
        limit,
        filters
      );

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Job applications retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /api/employer/applications
   * Get all applications for employer's jobs
   * Query: ?page=1&limit=10&status=pending&job_id=123
   */
  static async getEmployerApplications(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const page = req.query.page ? parseInt(req.query.page, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;

      if (!isPositiveInteger(page)) {
        throw new BadRequestError('Invalid page (must be a positive integer)');
      }

      if (!isPositiveInteger(limit)) {
        throw new BadRequestError('Invalid limit (must be a positive integer)');
      }

      const filters = {};
      if (req.query.status) {
        filters.status = req.query.status;
      }
      if (req.query.job_id) {
        filters.job_id = parseInt(req.query.job_id, 10);
      }

      const result = await ApplicationService.getEmployerApplications(
        employerId,
        page,
        limit,
        filters
      );

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employer applications retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * PUT /api/applications/:applicationId/status
   * Update application status (employer only)
   * Body: { status }
   */
  static async updateApplicationStatus(req, res, next) {
    try {
      const { applicationId } = req.params;
      const employerId = req.user.employer_id;
      const { status } = req.body;

      if (!status) {
        throw new BadRequestError('Status is required');
      }

      const application = await ApplicationService.updateApplicationStatus(
        applicationId,
        employerId,
        status
      );

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Application status updated successfully',
        data: application
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * POST /api/applications/:applicationId/notes
   * Add notes to an application (employer only)
   * Body: { notes }
   */
  static async addApplicationNotes(req, res, next) {
    try {
      const { applicationId } = req.params;
      const employerId = req.user.employer_id;
      const { notes } = req.body;

      if (!notes) {
        throw new BadRequestError('Notes are required');
      }

      const application = await ApplicationService.addApplicationNotes(
        applicationId,
        employerId,
        notes
      );

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Notes added successfully',
        data: application
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ApplicationController;
