const { body } = require('express-validator');

/**
 * Auth Validators
 * Validation rules for authentication endpoints
 */

/**
 * Register validation rules
 */
exports.register = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)'),

  body('full_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

  body('role')
    .optional()
    .isIn(['job_seeker', 'employer']).withMessage('Role must be either job_seeker or employer')
];

/**
 * Login validation rules
 */
exports.login = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Forgot password validation rules
 */
exports.forgotPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
];

/**
 * Reset password validation rules
 */
exports.resetPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character (@$!%*?&)')
];

/**
 * Verify email validation rules
 */
exports.verifyEmail = [
  body('token')
    .notEmpty().withMessage('Verification token is required'),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
];

/**
 * Resend verification email validation rules
 */
exports.resendVerification = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
];

/**
 * Refresh token validation rules
 */
exports.refreshToken = [
  body('refreshToken')
    .notEmpty().withMessage('Refresh token is required')
];
