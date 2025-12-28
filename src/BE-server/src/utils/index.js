/**
 * Utils Index
 * Re-export all utility functions for easier imports
 */

const ResponseHandler = require('./response-handler');
const { sanitizeUser, sanitizeUsers } = require('./sanitize-user');
const { 
  parsePagination, 
  calculatePagination, 
  formatPaginatedResponse,
  PAGINATION_DEFAULTS 
} = require('./pagination.util');
const {
  isValidEmail,
  isValidPhone,
  isValidUUID,
  isPositiveInteger,
  isValidDate,
} = require('./validation.util');
const {
  sanitizeInput,
  generateRandomId,
  slugify,
  capitalize,
} = require('./string.util');

module.exports = {
  // Response Handler
  ResponseHandler,
  
  // User Sanitization
  sanitizeUser,
  sanitizeUsers,
  
  // Pagination
  parsePagination,
  calculatePagination,
  formatPaginatedResponse,
  PAGINATION_DEFAULTS,
  
  // Validation
  isValidEmail,
  isValidPhone,
  isValidUUID,
  isPositiveInteger,
  isValidDate,
  
  // String Utils
  sanitizeInput,
  generateRandomId,
  slugify,
  capitalize,
};
