/**
 * Middlewares Index
 * Re-export all middlewares for easier imports
 */

const authMiddleware = require('./auth.middleware');
const ErrorHandler = require('./error-handler.middleware');
const ValidateMiddleware = require('./validate.middleware');
const { requestLogger, detailedLogger } = require('./logger.middleware');

module.exports = {
  authMiddleware,
  ErrorHandler,
  ValidateMiddleware,
  requestLogger,
  detailedLogger,
};
