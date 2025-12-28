/**
 * Validation Utility
 * Common validation helper functions
 */

/**
 * Check if a string is a valid email format
 * @param {string} email - Email string to validate
 * @returns {boolean} True if valid email format
 * @example
 * isValidEmail('test@example.com'); // true
 * isValidEmail('invalid-email'); // false
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Check if a string is a valid Vietnamese phone number
 * @param {string} phone - Phone string to validate
 * @returns {boolean} True if valid phone format
 * @example
 * isValidPhone('0901234567'); // true
 * isValidPhone('+84901234567'); // true
 */
const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Check if a string is a valid UUID format
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} True if valid UUID format
 * @example
 * isValidUUID('a0000000-0000-0000-0000-000000000001'); // true
 */
const isValidUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Check if a value is a valid positive integer
 * @param {*} value - Value to check
 * @returns {boolean} True if valid positive integer
 * @example
 * isPositiveInteger(5); // true
 * isPositiveInteger('5'); // true
 * isPositiveInteger(-1); // false
 */
const isPositiveInteger = (value) => {
  const num = parseInt(value, 10);
  return !Number.isNaN(num) && num > 0 && Number.isFinite(num);
};

/**
 * Check if a date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid date
 * @example
 * isValidDate('2025-12-28'); // true
 * isValidDate('invalid'); // false
 */
const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidUUID,
  isPositiveInteger,
  isValidDate,
};
