/**
 * String Utility
 * Common string manipulation helper functions
 */

/**
 * Sanitize input string by trimming and removing potentially dangerous characters
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 * @example
 * sanitizeInput('  <script>alert("xss")</script>  ');
 * // 'scriptalert("xss")/script'
 */
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Generate a random alphanumeric ID
 * @param {number} length - Length of the ID (default: 7)
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Random ID
 * @example
 * generateRandomId(7, 'SK'); // 'SK1A2B3C4'
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
 * Convert string to slug format
 * @param {string} text - Text to convert
 * @returns {string} Slugified string
 * @example
 * slugify('Hello World!'); // 'hello-world'
 */
const slugify = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 * @example
 * capitalize('hello'); // 'Hello'
 */
const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

module.exports = {
  sanitizeInput,
  generateRandomId,
  slugify,
  capitalize,
};
