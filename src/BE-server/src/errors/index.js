// Re-export all error classes
const AppError = require('./app.error');
const BadRequestError = require('./badrequest.exception');
const UnauthorizedError = require('./unauthorized.exception');
const ForbiddenError = require('./forbidden.exception');
const NotFoundError = require('./notfound.exception');
const DuplicateError = require('./duplicate.exception');
const ValidationError = require('./validate.exception');

module.exports = {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  DuplicateError,
  ValidationError
};
