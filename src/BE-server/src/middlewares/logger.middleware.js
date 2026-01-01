/**
 * Logger Middleware
 * Request logging for debugging and monitoring
 */

/**
 * Log incoming requests with timestamp, method and path
 * Disabled: console.log removed for cleaner output
 */
const requestLogger = (req, res, next) => {
  next();
};

/**
 * Detailed request logger with response time
 * Disabled: console.log removed for cleaner output
 */
const detailedLogger = (req, res, next) => {
  next();
};

module.exports = {
  requestLogger,
  detailedLogger,
};
