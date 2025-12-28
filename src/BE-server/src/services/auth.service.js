const { createClient } = require('@supabase/supabase-js');
const environment = require('../configs/environment.config');
const db = require('../databases/knex');
const JWTUtil = require('../utils/jwt.util');
const HashUtil = require('../utils/hash.util');
const EmailUtil = require('../utils/email.util');
const { BadRequestError, UnauthorizedError, NotFoundError, DuplicateError } = require('../errors');
const ROLES = require('../constants/role');

// Initialize Supabase client
const supabaseUrl = environment.SUPABASE_URL;
// For admin operations (createUser, etc.), we MUST use SERVICE_ROLE_KEY
// Anon key will NOT work for admin operations
const supabaseKey = environment.SUPABASE_SERVICE_ROLE_KEY || environment.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required');
}

// Validate that we have SERVICE_ROLE_KEY for admin operations
if (!environment.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY not found. Using SUPABASE_KEY instead.');
  console.warn('⚠️  Admin operations (register, etc.) may fail if SUPABASE_KEY is anon key.');
  console.warn('⚠️  Please set SUPABASE_SERVICE_ROLE_KEY in .env.development');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

/**
 * Auth Service
 * Handles authentication business logic with Supabase Auth integration
 */
class AuthService {
  /**
   * Register new user (Job Seeker or Employer)
   * @param {Object} userData - { email, password, name, role, ... }
   * @returns {Object} { user, tokens }
   */
  static async register(userData) {
    const { email, password, name, role = ROLES.JOB_SEEKER, ...additionalData } = userData;

    // Validate required fields
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    // Validate password strength
    const passwordValidation = HashUtil.validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      throw new BadRequestError(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Register user in Supabase Auth
    // Supabase will return error if user already exists
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email in development
      user_metadata: {
        full_name: name,
        role: role
      }
    });

    if (authError) {
      // Check for invalid API key error
      const errorMessage = authError.message?.toLowerCase() || '';
      const errorCode = authError.status || authError.code || '';
      
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
      
      throw new BadRequestError(authError.message || 'Failed to create user');
    }

    const userId = authData.user.id;

    // Create or update user profile in database
    // Note: Trigger handle_new_user() may have already created the user profile
    // So we need to handle both insert and update cases
    try {
      // Define allowed fields for users table (based on migration schema)
      const allowedFields = ['name', 'gender', 'date_of_birth', 'phone', 'address', 'avatar_url'];
      
      // Filter additionalData to only include allowed fields
      const userProfileData = {};
      if (name) userProfileData.name = name;
      
      Object.keys(additionalData).forEach(key => {
        if (allowedFields.includes(key)) {
          userProfileData[key] = additionalData[key];
        }
      });

      // Check if user profile already exists (created by trigger)
      const existingUser = await db('users').where('user_id', userId).first();
      
      if (existingUser) {
        // Update existing profile with additional data
        // Only update fields that are provided and different
        const updateData = {};
        Object.keys(userProfileData).forEach(key => {
          if (userProfileData[key] !== undefined && userProfileData[key] !== null) {
            updateData[key] = userProfileData[key];
          }
        });
        
        if (Object.keys(updateData).length > 0) {
          await db('users')
            .where('user_id', userId)
            .update(updateData);
        }
      } else {
        // Insert new profile
        await db('users').insert({
          user_id: userId,
          ...userProfileData
        });
      }
    } catch (dbError) {
      // Log detailed error for debugging
      console.error('Database error when creating user profile:', {
        error: dbError.message,
        code: dbError.code,
        detail: dbError.detail,
        constraint: dbError.constraint,
        userId: userId,
        additionalData: additionalData
      });
      
      // Rollback: delete auth user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (deleteError) {
        console.error('Failed to rollback auth user:', deleteError);
      }
      
      // Provide more detailed error message
      const errorMessage = dbError.detail || dbError.message || 'Failed to create user profile';
      throw new BadRequestError(`Failed to create user profile: ${errorMessage}`);
    }

    // Generate tokens
    const tokenPayload = {
      user_id: userId,
      email: authData.user.email,
      role: role
    };
    const tokens = JWTUtil.generateTokenPair(tokenPayload);

    return {
      user: {
        user_id: userId,
        email: authData.user.email,
        name: name,
        role: role
      },
      ...tokens
    };
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} { user, tokens }
   */
  static async login(email, password) {
    if (!email || !password) {
      throw new BadRequestError('Email and password are required');
    }

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const userId = authData.user.id;

    // Get user profile from database
    const user = await db('users')
      .where('user_id', userId)
      .first();

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    // Get user role (from employer table if exists, else job_seeker)
    let role = ROLES.JOB_SEEKER;
    const employer = await db('employer')
      .where('user_id', userId)
      .first();

    if (employer) {
      role = ROLES.EMPLOYER;
    }

    // Generate tokens
    const tokenPayload = {
      user_id: userId,
      email: authData.user.email,
      role: role
    };
    const tokens = JWTUtil.generateTokenPair(tokenPayload);

    return {
      user: {
        user_id: userId,
        email: authData.user.email,
        name: user.name,
        role: role,
        avatar_url: user.avatar_url
      },
      ...tokens
    };
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} { accessToken, refreshToken }
   */
  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = JWTUtil.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Get user from database to ensure still exists
    const user = await db('users')
      .where('user_id', decoded.user_id)
      .first();

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get user role
    let role = ROLES.JOB_SEEKER;
    const employer = await db('employer')
      .where('user_id', decoded.user_id)
      .first();

    if (employer) {
      role = ROLES.EMPLOYER;
    }

    // Generate new token pair
    const tokenPayload = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: role
    };
    const tokens = JWTUtil.generateTokenPair(tokenPayload);

    return tokens;
  }

  /**
   * Logout user (invalidate refresh token on client side)
   * @param {string} userId - User ID
   * @returns {boolean} Success status
   */
  static async logout(userId) {
    // In a real implementation, you might want to store refresh tokens
    // in a database and invalidate them here
    // For now, we just return success (client should delete tokens)
    return true;
  }

  /**
   * Request password reset
   * Generates a 6-digit token and sends it via email with token displayed in email content
   * @param {string} email - User email
   * @returns {Object} { token, message }
   */
  static async forgotPassword(email) {
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    // Check if user exists
    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new BadRequestError('Failed to find user');
    }

    const authUser = usersList.users.find(user => user.email === email);
    if (!authUser) {
      // Don't reveal if user exists or not for security
      // Still return success to prevent email enumeration
      return {
        token: this.generateResetToken(),
        message: 'If the email exists, a password reset token has been sent.',
        email: email
      };
    }

    // Generate random 6-digit reset token
    const resetToken = this.generateResetToken();

    console.log(`\n🔐 Password reset requested for: ${email}`);
    console.log(`🔐 Generated token: ${resetToken}`);

    // Send custom email with token displayed in email content
    const emailSent = await EmailUtil.sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      // If email config is not set, still return token in response
      console.warn('⚠️  Email not sent. Token returned in response only.');
      console.warn('⚠️  Please check:');
      console.warn('   1. EMAIL_USER and EMAIL_PASSWORD in .env.development');
      console.warn('   2. For Gmail: Use App Password, not regular password');
      console.warn('   3. Check console logs above for detailed error messages');
    } else {
      console.log(`✅ Password reset email sent successfully to: ${email}\n`);
    }

    return {
      token: resetToken,
      message: emailSent 
        ? 'Password reset token has been sent to your email.' 
        : 'Password reset token generated. Please check email configuration.',
      email: email
    };
  }

  /**
   * Reset password with email
   * Generates a random token, updates password, and returns the token
   * @param {string} email - User email
   * @param {string} newPassword - New password
   * @returns {Object} { token, message }
   */
  static async resetPassword(email, newPassword) {
    if (!email || !newPassword) {
      throw new BadRequestError('Email and new password are required');
    }

    // Validate password strength
    const passwordValidation = HashUtil.validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      throw new BadRequestError(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Find user by email using listUsers
    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new BadRequestError('Failed to find user');
    }

    const authUser = usersList.users.find(user => user.email === email);
    if (!authUser) {
      throw new NotFoundError('User with this email not found');
    }

    // Generate random reset token (32 characters)
    const resetToken = this.generateResetToken();

    // Update password in Supabase using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      authUser.id,
      {
        password: newPassword
      }
    );

    if (updateError) {
      throw new BadRequestError(updateError.message || 'Failed to reset password');
    }

    // Send token via email (using Supabase's reset password email)
    // The token is included in the redirect URL for testing purposes
    const { error: emailError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${environment.FRONTEND_URL}/reset-password?token=${resetToken}`,
    });

    // Even if email fails, we still return the token for testing
    if (emailError) {
      console.warn('Failed to send reset password email:', emailError);
    }

    return {
      token: resetToken,
      message: 'Password reset successful. Reset token has been sent to your email.',
      email: email
    };
  }

  /**
   * Generate random reset token
   * @returns {string} Random token (6 digits)
   */
  static generateResetToken() {
    // Generate 6-digit random number (000000 to 999999)
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    return token;
  }

  /**
   * Verify email
   * @param {string} token - Email verification token
   * @returns {boolean} Success status
   */
  static async verifyEmail(token) {
    if (!token) {
      throw new BadRequestError('Verification token is required');
    }

    // Verify email with Supabase
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return true;
  }

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {boolean} Success status
   */
  static async resendVerificationEmail(email) {
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return true;
  }
}

module.exports = AuthService;

