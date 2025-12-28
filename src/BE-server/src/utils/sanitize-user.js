/**
 * Sanitize User Utility
 * Remove sensitive fields from user objects before sending to client
 */

/**
 * List of sensitive fields to remove from user object
 * Based on common security practices for user data
 */
const SENSITIVE_FIELDS = ['password', 'refresh_token', 'reset_token', 'verification_token'];

/**
 * Remove sensitive fields from user object
 * @param {Object} user - User object from database
 * @returns {Object|null} - Sanitized user object or null if input is null/undefined
 * @example
 * const safeUser = sanitizeUser(userFromDB);
 * // { user_id: '...', name: '...', email: '...' } - without password
 */
const sanitizeUser = (user) => {
  if (!user) return null;

  const sanitized = { ...user };
  SENSITIVE_FIELDS.forEach(field => {
    delete sanitized[field];
  });

  return sanitized;
};

/**
 * Remove sensitive fields from array of users
 * @param {Array} users - Array of user objects
 * @returns {Array} - Array of sanitized user objects
 * @example
 * const safeUsers = sanitizeUsers(usersFromDB);
 */
const sanitizeUsers = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(sanitizeUser);
};

module.exports = {
  sanitizeUser,
  sanitizeUsers,
  SENSITIVE_FIELDS,
};
