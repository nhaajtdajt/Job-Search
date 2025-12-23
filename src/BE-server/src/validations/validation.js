// Validation helpers

/**
 * Validate required fields
 */
const validateRequired = (data, requiredFields) => {
  const missingFields = requiredFields.filter(field => {
    const value = data[field];
    return value === undefined || value === null || value === '';
  });

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
};

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
};

/**
 * Validate phone number
 */
const validatePhone = (phone) => {
  const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    throw new Error('Invalid phone number format');
  }
};

/**
 * Validate UUID format
 */
const validateUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(uuid)) {
    throw new Error('Invalid UUID format');
  }
};

/**
 * Validate date format
 */
const validateDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date;
};

/**
 * Validate numeric range
 */
const validateNumericRange = (value, min, max) => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error('Value must be a number');
  }
  if (num < min || num > max) {
    throw new Error(`Value must be between ${min} and ${max}`);
  }
  return num;
};

module.exports = {
  validateRequired,
  validateEmail,
  validatePhone,
  validateUUID,
  validateDate,
  validateNumericRange
};

