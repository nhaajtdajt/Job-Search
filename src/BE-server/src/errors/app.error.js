class AppError extends Error {
  constructor(
    message = "Something went wrong",
    statusCode = 500,
    errors = null,
    isOperational = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
