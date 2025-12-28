const { ForbiddenError } = require('../errors');
const ROLES = require('../constants/role');

/**
 * Role Middleware
 * Role-based access control middleware
 * Use after auth.middleware.authenticate
 */
class RoleMiddleware {
  /**
   * Check if user has required role(s)
   * @param {string|string[]} allowedRoles - Single role or array of allowed roles
   * @returns {Function} Express middleware function
   */
  static requireRole(allowedRoles) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new ForbiddenError('Authentication required'));
      }

      const userRole = req.user.role;
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (!rolesArray.includes(userRole)) {
        return next(new ForbiddenError(
          `Access denied. Required role: ${rolesArray.join(' or ')}`
        ));
      }

      next();
    };
  }

  /**
   * Require job_seeker role
   */
  static requireJobSeeker() {
    return this.requireRole(ROLES.JOB_SEEKER);
  }

  /**
   * Require employer role
   */
  static requireEmployer() {
    return this.requireRole(ROLES.EMPLOYER);
  }

  /**
   * Require admin role
   */
  static requireAdmin() {
    return this.requireRole(ROLES.ADMIN);
  }

  /**
   * Require employer or admin role
   */
  static requireEmployerOrAdmin() {
    return this.requireRole([ROLES.EMPLOYER, ROLES.ADMIN]);
  }

  /**
   * Require any authenticated user (job_seeker, employer, or admin)
   */
  static requireAny() {
    return (req, res, next) => {
      if (!req.user) {
        return next(new ForbiddenError('Authentication required'));
      }
      next();
    };
  }
}

module.exports = RoleMiddleware;

