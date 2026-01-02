const AdminService = require('../services/admin.service');
const HTTP_STATUS = require('../constants/http-status');
const { NotFoundError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');

/**
 * Admin Controller
 * Handle admin-related operations
 */
class AdminController {
  /**
   * Get all users
   * GET /api/admin/users
   */
  static async getUsers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        role: req.query.role,
        status: req.query.status,
        search: req.query.search
      };

      const result = await AdminService.getUsers(page, limit, filters);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Users retrieved successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update user status
   * PUT /api/admin/users/:userId/status
   */
  static async updateUserStatus(req, res, next) {
    try {
      const { userId } = req.params;
      const { status } = req.body;

      if (!status || !['active', 'blocked'].includes(status)) {
        throw new Error('Invalid status. Must be "active" or "blocked"');
      }

      const result = await AdminService.updateUserStatus(userId, status);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'User status updated successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get all employers
   * GET /api/admin/employers
   */
  static async getEmployers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        status: req.query.status,
        company_id: req.query.company_id,
        search: req.query.search
      };

      const result = await AdminService.getEmployers(page, limit, filters);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Employers retrieved successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update employer status (verify/suspend)
   * PUT /api/admin/employers/:employerId/verify
   */
  static async verifyEmployer(req, res, next) {
    try {
      const { employerId } = req.params;
      const { status } = req.body; // 'verified' or 'suspended'

      const employer = await AdminService.updateEmployerStatus(parseInt(employerId), status);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: `Employer ${status === 'suspended' ? 'suspended' : 'verified'} successfully`,
        data: employer,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get all companies
   * GET /api/admin/companies
   */
  static async getCompanies(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        search: req.query.search
      };

      const result = await AdminService.getCompanies(page, limit, filters);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Companies retrieved successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get all jobs
   * GET /api/admin/jobs
   */
  static async getJobs(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const filters = {
        status: req.query.status,
        job_type: req.query.job_type,
        employer_id: req.query.employer_id,
        search: req.query.search
      };

      const result = await AdminService.getJobs(page, limit, filters);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Jobs retrieved successfully',
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete job
   * DELETE /api/admin/jobs/:jobId
   */
  static async deleteJob(req, res, next) {
    try {
      const { jobId } = req.params;

      const deletedCount = await AdminService.deleteJob(parseInt(jobId));

      if (deletedCount === 0) {
        throw new NotFoundError('Job not found');
      }

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Job deleted successfully',
        data: null,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get statistics
   * GET /api/admin/statistics
   */
  static async getStatistics(req, res, next) {
    try {
      const statistics = await AdminService.getStatistics();

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Statistics retrieved successfully',
        data: statistics,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Get analytics data for dashboard charts
   * GET /api/admin/analytics
   */
  static async getAnalytics(req, res, next) {
    try {
      const { timeRange } = req.query;
      const analytics = await AdminService.getAnalytics(timeRange || '7d');

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Analytics retrieved successfully',
        data: analytics,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = AdminController;

