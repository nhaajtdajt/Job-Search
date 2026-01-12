const rateLimit = require("express-rate-limit");

/**
 * Rate Limit Middleware
 * Protects API from abuse, DDoS, and brute-force attacks
 */

/**
 * Global Rate Limiter
 * Applied to ALL requests
 * Limit: 500 requests per 15 minutes per IP
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 500 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
    retryAfter: 15 * 60, // seconds
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/health" || req.path === "/";
  },
});

/**
 * Auth Rate Limiter
 * Stricter limit for authentication routes (login, register, password reset)
 * Limit: 10 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts, please try again after 15 minutes",
    retryAfter: 15 * 60,
  },
  skipSuccessfulRequests: false, // Count all requests, including successful ones
});

/**
 * API Rate Limiter
 * Moderate limit for general API endpoints
 * Limit: 100 requests per 15 minutes per IP
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "API rate limit exceeded, please try again after 15 minutes",
    retryAfter: 15 * 60,
  },
});

/**
 * Upload Rate Limiter
 * Very strict limit for file upload endpoints
 * Limit: 20 uploads per hour per IP
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many file uploads, please try again after 1 hour",
    retryAfter: 60 * 60,
  },
});

/**
 * Strict Rate Limiter
 * For sensitive operations (password reset, email verification)
 * Limit: 5 requests per 15 minutes per IP
 */
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests for this operation, please try again later",
    retryAfter: 15 * 60,
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
  apiLimiter,
  uploadLimiter,
  strictLimiter,
};
