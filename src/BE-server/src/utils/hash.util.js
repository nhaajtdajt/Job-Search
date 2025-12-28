const bcrypt = require('bcrypt');

/**
 * Hash Utility
 * Handles password hashing and verification using bcrypt
 */
class HashUtil {
  /**
   * Hash password
   * @param {string} password - Plain text password
   * @param {number} saltRounds - Number of salt rounds (default: 10)
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password, saltRounds = 10) {
    if (!password) {
      throw new Error('Password is required');
    }
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if password matches
   */
  static async comparePassword(password, hash) {
    if (!password || !hash) {
      return false;
    }
    return await bcrypt.compare(password, hash);
  }

  /**
   * Generate random password
   * @param {number} length - Password length (default: 12)
   * @returns {string} Random password
   */
  static generateRandomPassword(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} { valid: boolean, errors: string[] }
   */
  static validatePasswordStrength(password) {
    const errors = [];

    if (!password) {
      return { valid: false, errors: ['Password is required'] };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

module.exports = HashUtil;

