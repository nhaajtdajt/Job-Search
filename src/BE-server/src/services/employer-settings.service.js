/**
 * Employer Settings Service
 * Business logic for employer settings management
 */

const EmployerSettingsRepository = require('../repositories/employer-settings.repo');
const EmployerRepository = require('../repositories/employer.repo');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../errors');
const db = require('../databases/knex');

class EmployerSettingsService {
  /**
   * Get employer settings
   * @param {number} employerId - Employer ID
   * @returns {Object} Settings
   */
  static async getSettings(employerId) {
    // Verify employer exists
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    // Get or create settings
    const settings = await EmployerSettingsRepository.getOrCreate(employerId);
    
    // Format response
    return this.formatSettingsResponse(settings);
  }

  /**
   * Update employer settings
   * @param {number} employerId - Employer ID
   * @param {Object} updateData - Settings to update
   * @returns {Object} Updated settings
   */
  static async updateSettings(employerId, updateData) {
    // Verify employer exists
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    // Filter allowed fields
    const allowedFields = [
      // Notification settings
      'email_notifications',
      'application_alerts',
      'new_candidate_alerts',
      'weekly_reports',
      'marketing_emails',
      'push_notifications',
      'sms_notifications',
      // Privacy settings
      'profile_visibility',
      'show_contact_info',
      'allow_messaging',
      // Security settings
      'two_factor_auth',
      'login_alerts',
      'session_timeout',
      // Preferences
      'language',
      'timezone',
      'dark_mode'
    ];

    const filteredData = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    // Validate profile_visibility
    if (filteredData.profile_visibility) {
      const validOptions = ['public', 'registered', 'private'];
      if (!validOptions.includes(filteredData.profile_visibility)) {
        throw new BadRequestError('Invalid profile visibility option');
      }
    }

    // Validate session_timeout
    if (filteredData.session_timeout) {
      const validTimeouts = ['15', '30', '60', '120', 'never'];
      if (!validTimeouts.includes(filteredData.session_timeout)) {
        throw new BadRequestError('Invalid session timeout option');
      }
    }

    // Validate language
    if (filteredData.language) {
      const validLanguages = ['vi', 'en'];
      if (!validLanguages.includes(filteredData.language)) {
        throw new BadRequestError('Invalid language option');
      }
    }

    // Upsert settings
    const settings = await EmployerSettingsRepository.upsert(employerId, filteredData);
    
    return this.formatSettingsResponse(settings);
  }

  /**
   * Suspend employer account
   * @param {number} employerId - Employer ID
   * @param {string} reason - Suspension reason (optional)
   * @returns {Object} Updated employer
   */
  static async suspendAccount(employerId, reason = null) {
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    if (employer.account_status === 'deleted') {
      throw new BadRequestError('Cannot suspend a deleted account');
    }

    const [updated] = await db('employer')
      .where('employer_id', employerId)
      .update({
        account_status: 'suspended',
        suspended_at: db.fn.now(),
        suspension_reason: reason
      })
      .returning('*');

    return updated;
  }

  /**
   * Reactivate employer account
   * @param {number} employerId - Employer ID
   * @returns {Object} Updated employer
   */
  static async reactivateAccount(employerId) {
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    if (employer.account_status === 'deleted') {
      throw new BadRequestError('Cannot reactivate a deleted account');
    }

    const [updated] = await db('employer')
      .where('employer_id', employerId)
      .update({
        account_status: 'active',
        suspended_at: null,
        suspension_reason: null
      })
      .returning('*');

    return updated;
  }

  /**
   * Soft delete employer account
   * @param {number} employerId - Employer ID
   * @param {string} confirmText - Confirmation text (must be 'XÓA TÀI KHOẢN')
   * @returns {Object} Success status
   */
  static async deleteAccount(employerId, confirmText) {
    if (confirmText !== 'XÓA TÀI KHOẢN') {
      throw new BadRequestError('Invalid confirmation text');
    }

    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    // Soft delete - mark as deleted but keep data
    await db('employer')
      .where('employer_id', employerId)
      .update({
        account_status: 'deleted',
        deleted_at: db.fn.now(),
        status: 'suspended' // Also update the existing status field
      });

    // Optionally: Deactivate all jobs
    await db('job')
      .where('employer_id', employerId)
      .update({ status: 'expired' });

    return { success: true, message: 'Account deleted successfully' };
  }

  /**
   * Get account status
   * @param {number} employerId - Employer ID
   * @returns {Object} Account status info
   */
  static async getAccountStatus(employerId) {
    const employer = await EmployerRepository.findById(employerId);
    if (!employer) {
      throw new NotFoundError('Employer not found');
    }

    return {
      account_status: employer.account_status || 'active',
      suspended_at: employer.suspended_at,
      suspension_reason: employer.suspension_reason,
      deleted_at: employer.deleted_at
    };
  }

  /**
   * Format settings response
   * @param {Object} settings - Raw settings from DB
   * @returns {Object} Formatted settings
   */
  static formatSettingsResponse(settings) {
    return {
      // Notification settings
      emailNotifications: settings.email_notifications,
      applicationAlerts: settings.application_alerts,
      newCandidateAlerts: settings.new_candidate_alerts,
      weeklyReports: settings.weekly_reports,
      marketingEmails: settings.marketing_emails,
      pushNotifications: settings.push_notifications,
      smsNotifications: settings.sms_notifications,
      // Privacy settings
      profileVisibility: settings.profile_visibility,
      showContactInfo: settings.show_contact_info,
      allowMessaging: settings.allow_messaging,
      // Security settings
      twoFactorAuth: settings.two_factor_auth,
      loginAlerts: settings.login_alerts,
      sessionTimeout: settings.session_timeout,
      // Preferences
      language: settings.language,
      timezone: settings.timezone,
      darkMode: settings.dark_mode,
      // Meta
      updatedAt: settings.updated_at
    };
  }
}

module.exports = EmployerSettingsService;
