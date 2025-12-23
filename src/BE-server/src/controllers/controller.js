// Base controller template
// Các controller khác có thể extend từ đây hoặc sử dụng pattern tương tự

/**
 * Example controller structure
 */
class BaseController {
  /**
   * Success response helper
   */
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Error response helper
   */
  static error(res, message = 'Error', statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }
}

module.exports = BaseController;

