import api from './api';

/**
 * Employer Settings Service
 * Handles employer settings and account management API calls
 */
export const employerSettingsService = {
  /**
   * Get employer settings
   * @returns {Promise<Object>} Settings data
   */
  async getSettings() {
    const response = await api.get('/employers/settings');
    return response.data.data;
  },

  /**
   * Update employer settings
   * @param {Object} updateData - Settings to update
   * @returns {Promise<Object>} Updated settings
   */
  async updateSettings(updateData) {
    const response = await api.put('/employers/settings', updateData);
    return response.data.data;
  },

  /**
   * Update notification settings
   * @param {Object} notificationSettings - Notification settings
   * @returns {Promise<Object>} Updated settings
   */
  async updateNotificationSettings(notificationSettings) {
    return this.updateSettings({
      email_notifications: notificationSettings.emailNotifications,
      application_alerts: notificationSettings.applicationAlerts,
      new_candidate_alerts: notificationSettings.newCandidateAlerts,
      weekly_reports: notificationSettings.weeklyReports,
      marketing_emails: notificationSettings.marketingEmails,
      push_notifications: notificationSettings.pushNotifications,
      sms_notifications: notificationSettings.smsNotifications,
    });
  },

  /**
   * Update privacy settings
   * @param {Object} privacySettings - Privacy settings
   * @returns {Promise<Object>} Updated settings
   */
  async updatePrivacySettings(privacySettings) {
    return this.updateSettings({
      profile_visibility: privacySettings.profileVisibility,
      show_contact_info: privacySettings.showContactInfo,
      allow_messaging: privacySettings.allowMessaging,
    });
  },

  /**
   * Update security settings
   * @param {Object} securitySettings - Security settings
   * @returns {Promise<Object>} Updated settings
   */
  async updateSecuritySettings(securitySettings) {
    return this.updateSettings({
      two_factor_auth: securitySettings.twoFactorAuth,
      login_alerts: securitySettings.loginAlerts,
      session_timeout: securitySettings.sessionTimeout,
    });
  },

  /**
   * Update preferences
   * @param {Object} preferences - User preferences
   * @returns {Promise<Object>} Updated settings
   */
  async updatePreferences(preferences) {
    return this.updateSettings({
      language: preferences.language,
      timezone: preferences.timezone,
      dark_mode: preferences.darkMode,
    });
  },

  /**
   * Get account status
   * @returns {Promise<Object>} Account status
   */
  async getAccountStatus() {
    const response = await api.get('/employers/account/status');
    return response.data.data;
  },

  /**
   * Suspend account
   * @param {string} reason - Suspension reason (optional)
   * @returns {Promise<Object>} Result
   */
  async suspendAccount(reason = null) {
    const response = await api.post('/employers/account/suspend', { reason });
    return response.data.data;
  },

  /**
   * Reactivate account
   * @returns {Promise<Object>} Result
   */
  async reactivateAccount() {
    const response = await api.post('/employers/account/reactivate');
    return response.data.data;
  },

  /**
   * Delete account permanently
   * @param {string} confirmText - Must be 'XÓA TÀI KHOẢN'
   * @returns {Promise<Object>} Result
   */
  async deleteAccount(confirmText) {
    const response = await api.delete('/employers/account', {
      data: { confirmText }
    });
    return response.data;
  },
};
