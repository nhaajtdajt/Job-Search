const AppError = require("./app.error");

class DuplicateError extends AppError {
  constructor(message = "Resource already exists") {
    super(message, 409);
  }
}

module.exports = DuplicateError;
