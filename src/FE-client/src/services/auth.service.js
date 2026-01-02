import api from './api';

/**
 * Auth Service
 * Handles authentication API calls
 */
export const authService = {
  /**
   * Register new user
   * @param {Object} userData - { email, password, name, role, phone, ... }
   * @returns {Promise<Object>} { user, accessToken, refreshToken }
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data.data;
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} { user, accessToken, refreshToken }
   */
  async login(email, password, loginType = 'job_seeker') {
    const response = await api.post('/auth/login', { email, password, loginType });
    return response.data.data;
  },

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} { accessToken, refreshToken }
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    return response.data.data;
  },

  /**
   * Forgot password
   * @param {string} email - User email
   * @returns {Promise<Object>} { token, email, message }
   */
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data.data;
  },

  /**
   * Reset password
   * @param {string} email - User email
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} { token, email, message }
   */
  async resetPassword(email, newPassword) {
    const response = await api.post('/auth/reset-password', { email, newPassword });
    return response.data.data;
  },

  /**
   * Verify email
   * @param {string} token - Verification token
   * @param {string} email - User email (optional)
   * @returns {Promise<void>}
   */
  async verifyEmail(token, email = null) {
    const response = await api.post('/auth/verify-email', { token, email });
    return response.data;
  },

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async resendVerification(email) {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  /**
   * Social login callback
   * @param {string} accessToken - Supabase access token
   * @param {string} provider - Provider name ('google' or 'facebook')
   * @returns {Promise<Object>} { user, accessToken, refreshToken }
   */
  async socialLoginCallback(accessToken, provider = 'google') {
    const response = await api.post('/auth/social/callback', { accessToken, provider });
    return response.data.data;
  },
};

