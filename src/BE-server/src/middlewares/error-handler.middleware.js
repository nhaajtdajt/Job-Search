const HTTP_STATUS = require('../constants/http-status');

/**
 * Error Handler Middleware
 * Global error handling - must be registered LAST in Express app
 */
class ErrorHandler {
  /**
   * Handle all errors thrown in the application
   * @param {Error} err - Error object
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   * @param {Function} next - Express next function
   */
  static handle(err, req, res, next) {
    console.error('Error:', err);

    // Handle Knex/Database errors
    if (err.code && err.message && !err.statusCode) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        status: HTTP_STATUS.BAD_REQUEST,
        message: 'Database error',
        error: err.message,
      });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'Invalid token',
        error: null,
      });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        status: HTTP_STATUS.UNAUTHORIZED,
        message: 'Token expired',
        error: null,
      });
    }

    // Handle custom AppError and its subclasses
    const status = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
      success: false,
      status,
      message,
      error: err.errors || null,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
}

module.exports = ErrorHandler;
