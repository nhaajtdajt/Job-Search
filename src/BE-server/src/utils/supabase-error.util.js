const { BadRequestError, DuplicateError } = require('../errors');

/**
 * Supabase Error Utility
 * Centralized error handling for Supabase Auth operations
 */

/**
 * Handle Supabase Auth errors and throw appropriate custom errors
 * @param {Object} error - Supabase error object
 * @param {string} defaultMessage - Default error message if no specific match
 * @throws {BadRequestError|DuplicateError}
 */
const handleSupabaseAuthError = (error, defaultMessage = 'Authentication failed') => {
  if (!error) return;

  const errorMessage = error.message?.toLowerCase() || '';
  const errorCode = error.status || error.code || '';

  // Check for invalid API key error
  if (
    errorMessage.includes('invalid api key') ||
    errorMessage.includes('invalid key') ||
    errorMessage.includes('jwt') ||
    errorCode === 401
  ) {
    throw new BadRequestError(
      'Invalid API key. Please ensure SUPABASE_SERVICE_ROLE_KEY is set correctly in .env.development. ' +
      'Admin operations require SERVICE_ROLE_KEY, not anon key.'
    );
  }

  // Check if error is due to duplicate email
  if (
    errorMessage.includes('already registered') ||
    errorMessage.includes('already exists') ||
    errorMessage.includes('user already registered') ||
    errorMessage.includes('email address is already registered') ||
    errorCode === 422 || // Unprocessable Entity - often means duplicate
    errorCode === 'PGRST301' // PostgREST duplicate error
  ) {
    throw new DuplicateError('User with this email already exists');
  }

  // Check for weak password error
  if (
    errorMessage.includes('password') && 
    (errorMessage.includes('weak') || errorMessage.includes('strength'))
  ) {
    throw new BadRequestError('Password is too weak. Please use a stronger password.');
  }

  // Check for invalid credentials (login)
  if (
    errorMessage.includes('invalid credentials') ||
    errorMessage.includes('invalid login credentials') ||
    errorCode === 400
  ) {
    throw new BadRequestError('Invalid email or password');
  }

  // Default error
  throw new BadRequestError(error.message || defaultMessage);
};

/**
 * Check if Supabase is properly configured
 * @param {string} url - Supabase URL
 * @param {string} key - Supabase key
 * @returns {boolean} True if configured
 */
const isSupabaseConfigured = (url, key) => {
  if (!url || !key || url.includes('your-project') || key.includes('your-anon-key')) {
    return false;
  }
  return true;
};

module.exports = {
  handleSupabaseAuthError,
  isSupabaseConfigured
};
