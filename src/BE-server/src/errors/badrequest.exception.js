const AppError = require("./app.error");

class BadRequestError extends AppError {
  constructor(message = "Bad request", errors = null) {
    super(message, 400, errors);
  }
}

module.exports = BadRequestError;
