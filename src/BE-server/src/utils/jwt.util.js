const jwt = require('jsonwebtoken');
const environment = require('../configs/environment.config');

/**
 * JWT Utility
 * Handles JWT token generation, verification, and refresh
 */
class JWTUtil {
  /**
   * Generate access token
   * @param {Object} payload - Token payload (user_id, email, role, etc.)
   * @returns {string} JWT access token
   */
  static generateAccessToken(payload) {
    return jwt.sign(
      {
        ...payload,
        type: 'access'
      },
      environment.JWT_SECRET,
      {
        expiresIn: environment.JWT_EXPIRES_IN || '7d',
        issuer: 'job-search-api',
        audience: 'job-search-client'
      }
    );
  }

  /**
   * Generate refresh token
   * @param {Object} payload - Token payload
   * @returns {string} JWT refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(
      {
        ...payload,
        type: 'refresh'
      },
      environment.JWT_SECRET,
      {
        expiresIn: '30d', // Refresh token lasts longer
        issuer: 'job-search-api',
        audience: 'job-search-client'
      }
    );
  }

  /**
   * Generate both access and refresh tokens
   * @param {Object} payload - Token payload
   * @returns {Object} { accessToken, refreshToken }
   */
  static generateTokenPair(payload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload)
    };
  }

  /**
   * Verify token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid or expired
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, environment.JWT_SECRET, {
        issuer: 'job-search-api',
        audience: 'job-search-client'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - Refresh token
   * @returns {Object} Decoded token payload
   * @throws {Error} If token is invalid or not a refresh token
   */
  static verifyRefreshToken(token) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    return decoded;
  }

  /**
   * Decode token without verification (for debugging)
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static decodeToken(token) {
    return jwt.decode(token);
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {Date|null} Expiration date or null if invalid
   */
  static getTokenExpiration(token) {
    try {
      const decoded = this.decodeToken(token);
      return decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  }
}

module.exports = JWTUtil;

