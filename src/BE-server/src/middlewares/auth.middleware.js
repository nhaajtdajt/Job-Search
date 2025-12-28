const environment = require('../configs/environment.config');
const { UnauthorizedError, ForbiddenError } = require('../errors');

/**
 * Auth Middleware
 * Handles JWT authentication and role-based authorization
 */
class AuthMiddleware {
  /**
   * Authenticate user via JWT token
   * Extracts token from Authorization header or cookies
   */
  async authenticate(req, res, next) {
    try {
      // Get token from header or cookie
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : req.cookies?.accessToken;

      if (!token) {
        throw new UnauthorizedError("Access token required");
      }

      // Verify token using jsonwebtoken
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, environment.JWT_SECRET);
      
      // Attach user to request
      req.user = decoded;
      
      next();
    } catch (err) {
      if (err.name === 'JsonWebTokenError') {
        return next(new UnauthorizedError("Invalid token"));
      }
      if (err.name === 'TokenExpiredError') {
        return next(new UnauthorizedError("Token expired"));
      }
      next(err);
    }
  }

  /**
   * Authorize user based on roles
   * @param {Array<string>} allowedRoles - Roles that can access the route
   * @returns {Function} Express middleware function
   */
  authorize(allowedRoles = []) {
    return (req, res, next) => {
      if (!req.user) {
        return next(new UnauthorizedError("Authentication required"));
      }

      const userRole = req.user.role || req.user.role_name;
      
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return next(new ForbiddenError("Insufficient permissions"));
      }

      next();
    };
  }

  /**
   * Optional authentication - doesn't fail if no token
   * Useful for routes that work for both guests and authenticated users
   */
  async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : req.cookies?.accessToken;

      if (token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, environment.JWT_SECRET);
        req.user = decoded;
      }
      
      next();
    } catch (err) {
      // Token invalid but optional, continue without user
      req.user = null;
      next();
    }
  }
}

module.exports = new AuthMiddleware();
