const HTTP_STATUS = require('../constants/http-status');

/**
 * Response Handler Utility
 * Standardizes all API responses with consistent format
 */
class ResponseHandler {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {Object} options - Response options
   * @param {number} options.status - HTTP status code (default: 200)
   * @param {string} options.message - Response message (default: "Success")
   * @param {*} options.data - Response data (default: null)
   * @returns {Object} Express response
   * @example
   * ResponseHandler.success(res, {
   *   status: HTTP_STATUS.OK,
   *   message: "Jobs retrieved successfully",
   *   data: jobs
   * });
   */
  static success(res, { status = HTTP_STATUS.OK, message = "Success", data = null } = {}) {
    return res.status(status).json({
      success: true,
      status,
      message,
      data,
    });
  }

  /**
   * Send created response (201)
   * @param {Object} res - Express response object
   * @param {Object} options - Response options
   * @param {string} options.message - Response message (default: "Created successfully")
   * @param {*} options.data - Response data (default: null)
   * @returns {Object} Express response
   */
  static created(res, { message = "Created successfully", data = null } = {}) {
    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      status: HTTP_STATUS.CREATED,
      message,
      data,
    });
  }

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {Object} options - Response options
   * @param {number} options.status - HTTP status code (default: 500)
   * @param {string} options.message - Error message (default: "Internal Server Error")
   * @param {*} options.error - Additional error data (default: null)
   * @returns {Object} Express response
   * @example
   * ResponseHandler.error(res, {
   *   status: HTTP_STATUS.BAD_REQUEST,
   *   message: "Invalid input",
   *   error: validationErrors
   * });
   */
  static error(res, { status = HTTP_STATUS.INTERNAL_SERVER_ERROR, message = "Internal Server Error", error = null } = {}) {
    return res.status(status).json({
      success: false,
      status,
      message,
      error,
    });
  }
}

module.exports = ResponseHandler;
