const AuthService = require('../services/auth.service');
const ResponseHandler = require('../utils/response-handler');

/**
 * Auth Controller
 * Handles HTTP requests for authentication endpoints
 */
class AuthController {
  /**
   * POST /api/auth/register
   * Register new user
   */
  static async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      return ResponseHandler.created(res, {
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login user
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return ResponseHandler.success(res, {
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout user
   */
  static async logout(req, res, next) {
    try {
      const userId = req.user?.user_id;
      await AuthService.logout(userId);
      return ResponseHandler.success(res, {
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh-token
   * Refresh access token
   */
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshToken(refreshToken);
      return ResponseHandler.success(res, {
        message: 'Token refreshed successfully',
        data: tokens
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Request password reset - returns 6-digit token
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.forgotPassword(email);
      return ResponseHandler.success(res, {
        message: result.message,
        data: {
          token: result.token,
          email: result.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Reset password with email and new password
   * Returns a random token that was sent via email
   */
  static async resetPassword(req, res, next) {
    try {
      const { email, newPassword } = req.body;
      const result = await AuthService.resetPassword(email, newPassword);
      return ResponseHandler.success(res, {
        message: result.message,
        data: {
          token: result.token,
          email: result.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-email
   * Verify email address using token from forgot password
   */
  static async verifyEmail(req, res, next) {
    try {
      const { token, email } = req.body;
      await AuthService.verifyEmail(token, email);
      return ResponseHandler.success(res, {
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/resend-verification
   * Resend verification email with 6-digit token
   */
  static async resendVerificationEmail(req, res, next) {
    try {
      const { email } = req.body;
      const result = await AuthService.resendVerificationEmail(email);
      return ResponseHandler.success(res, {
        message: result.message,
        data: {
          token: result.token,
          email: result.email
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/social/callback
   * Handle social login callback (Google, Facebook)
   */
  static async socialLoginCallback(req, res, next) {
    try {
      const { accessToken, provider } = req.body;
      
      if (!accessToken) {
        return ResponseHandler.error(res, {
          status: 400,
          message: 'Access token is required'
        });
      }

      const result = await AuthService.socialLoginCallback(accessToken, provider);
      return ResponseHandler.success(res, {
        message: 'Social login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

