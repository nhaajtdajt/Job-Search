// Utility functions và algorithms

/**
 * Pagination helper
 */
const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Max 100 items per page
  const offset = (pageNum - 1) * limitNum;

  return {
    page: pageNum,
    limit: limitNum,
    offset
  };
};

/**
 * Format pagination response
 */
const formatPaginationResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1
    }
  };
};

/**
 * Generate random ID (for resume_id, notification_id, etc.)
 */
const generateRandomId = (length = 7, prefix = '') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Sanitize input string
 */
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnamese format)
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

module.exports = {
  paginate,
  formatPaginationResponse,
  generateRandomId,
  sanitizeInput,
  isValidEmail,
  isValidPhone
};

