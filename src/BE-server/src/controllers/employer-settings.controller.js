const EmployerSettingsService = require('../services/employer-settings.service');
const HTTP_STATUS = require('../constants/http-status');
const { BadRequestError } = require('../errors');
const ResponseHandler = require('../utils/response-handler');

/**
 * Employer Settings Controller
 * Handle employer settings and account management operations
 */
class EmployerSettingsController {
  /**
   * Get employer settings
   * GET /api/employers/settings
   */
  static async getSettings(req, res, next) {
    try {
      const employerId = req.user.employer_id;

      if (!employerId) {
        throw new BadRequestError('Employer ID not found in authentication');
      }

      const settings = await EmployerSettingsService.getSettings(employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Settings retrieved successfully',
        data: settings,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Update employer settings
   * PUT /api/employers/settings
   */
  static async updateSettings(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const updateData = req.body;

      if (!employerId) {
        throw new BadRequestError('Employer ID not found in authentication');
      }

      const settings = await EmployerSettingsService.updateSettings(employerId, updateData);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Settings updated successfully',
        data: settings,
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Suspend employer account
   * POST /api/employers/account/suspend
   */
  static async suspendAccount(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const { reason } = req.body;

      if (!employerId) {
        throw new BadRequestError('Employer ID not found in authentication');
      }

      const result = await EmployerSettingsService.suspendAccount(employerId, reason);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Account suspended successfully',
        data: { account_status: result.account_status },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Reactivate employer account
   * POST /api/employers/account/reactivate
   */
  static async reactivateAccount(req, res, next) {
    try {
      const employerId = req.user.employer_id;

      if (!employerId) {
        throw new BadRequestError('Employer ID not found in authentication');
      }

      const result = await EmployerSettingsService.reactivateAccount(employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Account reactivated successfully',
        data: { account_status: result.account_status },
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * Delete employer account
   * DELETE /api/employers/account
   */
  static async deleteAccount(req, res, next) {
    try {
      const employerId = req.user.employer_id;
      const { confirmText } = req.body;

      if (!employerId) {
        throw new BadRequestError('Employer ID not found in authentication');
      }

      const result = await EmployerSettingsService.deleteAccount(employerId, confirmText);

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
   * Get account status
   * GET /api/employers/account/status
   */
  static async getAccountStatus(req, res, next) {
    try {
      const employerId = req.user.employer_id;

      if (!employerId) {
        throw new BadRequestError('Employer ID not found in authentication');
      }

      const status = await EmployerSettingsService.getAccountStatus(employerId);

      return ResponseHandler.success(res, {
        status: HTTP_STATUS.OK,
        message: 'Account status retrieved successfully',
        data: status,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = EmployerSettingsController;
