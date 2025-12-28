const AppError = require("./app.error");

class ValidationError extends AppError {
  constructor(message = "Validation error", errors = null) {
    super(message, 422, errors);
  }
}

module.exports = ValidationError;
