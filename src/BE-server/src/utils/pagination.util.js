/**
 * Pagination Utility
 * Helper functions for handling pagination in API responses
 */

/**
 * Default pagination values
 */
const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

/**
 * Parse and validate pagination parameters
 * @param {number|string} page - Page number (1-indexed)
 * @param {number|string} limit - Items per page
 * @returns {Object} Validated pagination parameters with offset
 * @example
 * const { page, limit, offset } = parsePagination(req.query.page, req.query.limit);
 */
const parsePagination = (page = PAGINATION_DEFAULTS.PAGE, limit = PAGINATION_DEFAULTS.LIMIT) => {
  const pageNum = Math.max(1, parseInt(page, 10) || PAGINATION_DEFAULTS.PAGE);
  const limitNum = Math.max(1, Math.min(PAGINATION_DEFAULTS.MAX_LIMIT, parseInt(limit, 10) || PAGINATION_DEFAULTS.LIMIT));
  const offset = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    offset,
  };
};

/**
 * Calculate pagination metadata for response
 * @param {number} page - Current page number (1-indexed)
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination metadata
 * @example
 * const pagination = calculatePagination(1, 10, 100);
 * // { page: 1, limit: 10, total: 100, totalPages: 10, hasNextPage: true, hasPrevPage: false }
 */
const calculatePagination = (page, limit, total) => {
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const totalNum = Number(total);
  const totalPages = Math.ceil(totalNum / limitNum);

  return {
    page: pageNum,
    limit: limitNum,
    total: totalNum,
    totalPages,
    hasNextPage: pageNum * limitNum < totalNum,
    hasPrevPage: pageNum > 1,
  };
};

/**
 * Format paginated response data
 * @param {Array} data - Array of items
 * @param {number} total - Total number of items
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Formatted response with data and pagination
 * @example
 * const result = formatPaginatedResponse(jobs, 100, 1, 10);
 * // { data: [...], pagination: { page: 1, limit: 10, total: 100, ... } }
 */
const formatPaginatedResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: calculatePagination(page, limit, total),
  };
};

module.exports = {
  PAGINATION_DEFAULTS,
  parsePagination,
  calculatePagination,
  formatPaginatedResponse,
};
