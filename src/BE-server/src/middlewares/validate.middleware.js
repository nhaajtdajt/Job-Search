const { ValidationError } = require('../errors');

/**
 * Validate Middleware
 * Processes validation results from express-validator
 */
class ValidateMiddleware {
  /**
   * Check validation results and throw error if invalid
   * Use after express-validator validation chains
   * @example
   * router.post("/users", 
   *   userValidator.create(), 
   *   ValidateMiddleware.handle, 
   *   userController.create
   * );
   */
  static handle(req, res, next) {
    // Check if express-validator is being used
    try {
      const { validationResult } = require("express-validator");
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err) => ({
          field: err.path || err.param,
          message: err.msg,
        }));
        
        throw new ValidationError("Validation failed", errorMessages);
      }
      
      next();
    } catch (err) {
      // If express-validator is not installed, just continue
      if (err.code === 'MODULE_NOT_FOUND') {
        return next();
      }
      next(err);
    }
  }
}

module.exports = ValidateMiddleware;
