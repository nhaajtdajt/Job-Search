const { createClient } = require('@supabase/supabase-js');
const environment = require('../configs/environment.config');
const db = require('../databases/knex');
const JWTUtil = require('../utils/jwt.util');
const HashUtil = require('../utils/hash.util');
const SupabaseErrorUtil = require('../utils/supabase-error.util');
const EmailService = require('./email.service');
const { BadRequestError, UnauthorizedError, NotFoundError, DuplicateError } = require('../errors');
const ROLES = require('../constants/role');
const { ADMIN_EMAILS } = require('../constants/admin');

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

// Separate Supabase client with ANON_KEY for user token verification
// This is needed for social login callback where we verify user tokens
const supabaseAnonKey = environment.SUPABASE_ANON_KEY || environment.SUPABASE_KEY;
const supabaseForUserAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// In-memory token storage for password reset tokens
// Format: { email: { token: string, expiresAt: timestamp, createdAt: timestamp } }
const resetTokens = new Map();
const TOKEN_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes

// Store verified emails (allowed to reset password)
// Format: { email: { verifiedAt: timestamp, expiresAt: timestamp } }
const verifiedEmails = new Map();
const VERIFIED_EMAIL_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes - email verification is valid for 10 minutes

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
    // Backend validator sends 'full_name', but we use 'name' internally
    const { email, password, full_name, name, role = ROLES.JOB_SEEKER, ...additionalData } = userData;
    const userName = full_name || name; // Support both 'full_name' (from validator) and 'name' (legacy)

    // Note: Input validation is handled by AuthValidator middleware
    // This service focuses on business logic only

    // Register user in Supabase Auth
    // Supabase will return error if user already exists
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email in development
      user_metadata: {
        full_name: userName,
        role: role
      }
    });

    if (authError) {
      SupabaseErrorUtil.handleSupabaseAuthError(authError, 'Failed to create user');
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

      if (userName) userProfileData.name = userName;

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

    // Create employer record if role is employer
    let employerId = null;
    if (role === ROLES.EMPLOYER) {
      try {
        // Check if employer already exists for this user
        const existingEmployer = await db('employer')
          .where('user_id', userId)
          .first();

        if (existingEmployer) {
          // Employer already exists, use existing ID
          employerId = existingEmployer.employer_id;
        } else {
          // Create new employer record
          const employerData = {
            user_id: userId,
            full_name: name || 'Employer',
            email: email,
            role: additionalData.employer_role || 'HR Manager',
            status: additionalData.status || 'Active',
            company_id: additionalData.company_id || null  // Nullable now
          };

          const [employer] = await db('employer')
            .insert(employerData)
            .returning('employer_id');

          employerId = employer.employer_id;
        }
      } catch (employerError) {
        console.error('Failed to create employer record:', employerError);

        // Rollback: delete user profile and auth user
        try {
          await db('users').where('user_id', userId).delete();
          await supabase.auth.admin.deleteUser(userId);
        } catch (rollbackError) {
          console.error('Failed to rollback user profile and auth:', rollbackError);
        }

        throw new BadRequestError(`Failed to create employer profile: ${employerError.message}`);
      }
    }

    // Generate tokens using helper method
    const tokenPayload = this.generateTokenPayload(userId, authData.user.email, role, employerId);
    const tokens = JWTUtil.generateTokenPair(tokenPayload);

    return {
      user: {
        user_id: userId,
        email: authData.user.email,
        name: userName,
        role: role,
        ...(employerId && { employer_id: employerId })
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
    // Note: Input validation is handled by AuthValidator middleware

    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      SupabaseErrorUtil.handleSupabaseAuthError(authError, 'Invalid email or password');
    }

    const userId = authData.user.id;

    // Get user profile from database
    const user = await db('users')
      .where('user_id', userId)
      .first();

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    // Determine user role based on email (admin) or employer table
    let role = ROLES.JOB_SEEKER;
    let employerId = null;
    let avatarUrl = user.avatar_url; // Default to user's avatar

    // Check 1: Is email in admin list?
    if (ADMIN_EMAILS.includes(email)) {
      role = ROLES.ADMIN;
    } else {
      // Check 2: Is user an employer?
      const employer = await db('employer')
        .where('user_id', userId)
        .first();

      if (employer) {
        role = ROLES.EMPLOYER;
        employerId = employer.employer_id;
        // Use user's avatar if available (primary source), fallback to employer's avatar
        avatarUrl = user.avatar_url || employer.avatar_url;
      }
    }

    // Generate tokens using helper method
    const tokenPayload = this.generateTokenPayload(userId, authData.user.email, role, employerId);
    const tokens = JWTUtil.generateTokenPair(tokenPayload);

    return {
      user: {
        user_id: userId,
        email: authData.user.email,
        name: user.name,
        role: role,
        avatar_url: avatarUrl,
        ...(employerId && { employer_id: employerId })
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

    // Get user role and employer_id if applicable
    let role = ROLES.JOB_SEEKER;
    let employerId = null;
    const employer = await db('employer')
      .where('user_id', decoded.user_id)
      .first();

    if (employer) {
      role = ROLES.EMPLOYER;
      employerId = employer.employer_id;
    }

    // Generate new token pair with employer_id if user is employer
    const tokenPayload = {
      user_id: decoded.user_id,
      email: decoded.email,
      role: role
    };

    // Add employer_id to token if user is employer
    if (employerId) {
      tokenPayload.employer_id = employerId;
    }

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

    // Check if user exists in Supabase Auth (covers both email/password and social login users)
    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new BadRequestError('Failed to find user');
    }

    const emailLower = email.toLowerCase();
    const authUser = usersList.users.find(user => user.email && user.email.toLowerCase() === emailLower);

    if (!authUser) {
      // User not found - throw error to inform that email is not registered
      throw new NotFoundError('Email này chưa được đăng ký trong hệ thống. Vui lòng kiểm tra lại email hoặc đăng ký tài khoản mới.');
    }

    // Try to get user details by ID to see full structure
    // Supabase Admin API might not return encrypted_password in listUsers()
    let userDetails = null;
    try {
      const { data: userData, error: getUserError } = await supabase.auth.admin.getUserById(authUser.id);
      if (!getUserError && userData && userData.user) {
        userDetails = userData.user;
      }
    } catch (error) {
      // Continue with authUser from list if getUserById fails
    }

    // Use userDetails if available, otherwise use authUser from list
    const userToCheck = userDetails || authUser;

    // Check if user has password (can reset password)
    // In Supabase, email/password users should have either:
    // 1. encrypted_password field (might not be available via Admin API for security)
    // 2. identity with provider = 'email' 
    // 3. app_metadata.provider = 'email' or no provider (default email/password)

    const hasPassword = userToCheck.encrypted_password && userToCheck.encrypted_password.length > 0;
    const hasEmailProvider = userToCheck.identities && Array.isArray(userToCheck.identities) && userToCheck.identities.some(
      identity => identity.provider === 'email'
    );

    // Check app_metadata for provider info
    const appMetadata = userToCheck.app_metadata || {};
    const provider = appMetadata.provider;

    // Check identities for social providers
    const hasSocialProvider = userToCheck.identities && Array.isArray(userToCheck.identities) && userToCheck.identities.some(
      identity => ['google', 'facebook', 'github', 'twitter', 'azure', 'linkedin'].includes(identity.provider)
    );

    // Social providers that don't have passwords
    const socialProviders = ['google', 'facebook', 'github', 'twitter', 'azure', 'linkedin'];
    const isSocialOnly = (provider && socialProviders.includes(provider.toLowerCase())) || (hasSocialProvider && !hasEmailProvider && !hasPassword);

    // Since Supabase Admin API might not return encrypted_password for security reasons,
    // we'll be more permissive: if user exists and is not clearly a social-only account, allow reset
    // Block only if we're CERTAIN it's social-only (has social provider AND no email provider AND no password)

    if (isSocialOnly) {
      // User is definitely social-only (has social provider and no email provider/password)
      throw new BadRequestError('Tài khoản này được đăng nhập bằng tài khoản xã hội (Google/Facebook) và không có mật khẩu để đặt lại. Vui lòng đăng nhập bằng tài khoản xã hội của bạn.');
    }

    // Generate random 6-digit reset token
    const resetToken = this.generateResetToken();

    // Store token in memory with expiry time
    const expiresAt = Date.now() + TOKEN_EXPIRY_TIME;
    resetTokens.set(email.toLowerCase(), {
      token: resetToken,
      expiresAt: expiresAt,
      createdAt: Date.now()
    });

    // Clean up expired tokens (optional cleanup)
    this.cleanupExpiredTokens();

    // Send custom email with token displayed in email content
    const emailSent = await EmailService.sendPasswordResetEmail(email, resetToken);

    if (!emailSent) {
      console.warn('⚠️  Email not sent. Token returned in response only.');
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

    const emailLower = email.toLowerCase();

    // Check if email has been verified (token was verified successfully)
    const verifiedData = verifiedEmails.get(emailLower);
    if (!verifiedData || verifiedData.expiresAt < Date.now()) {
      // Clean up expired verification
      if (verifiedData && verifiedData.expiresAt < Date.now()) {
        verifiedEmails.delete(emailLower);
      }
      throw new BadRequestError('Email verification required. Please verify your email token first.');
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

    const authUser = usersList.users.find(user => user.email.toLowerCase() === emailLower);
    if (!authUser) {
      throw new NotFoundError('User with this email not found');
    }

    // Remove verified email after password reset (one-time use)
    verifiedEmails.delete(emailLower);

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
   * Clean up expired tokens from memory
   */
  static cleanupExpiredTokens() {
    const now = Date.now();
    for (const [email, tokenData] of resetTokens.entries()) {
      if (tokenData.expiresAt < now) {
        resetTokens.delete(email);
      }
    }
    // Also cleanup expired verified emails
    for (const [email, verifiedData] of verifiedEmails.entries()) {
      if (verifiedData.expiresAt < now) {
        verifiedEmails.delete(email);
      }
    }
  }

  /**
   * Verify reset token
   * @param {string} email - User email
   * @param {string} token - Reset token
   * @returns {boolean} True if token is valid
   */
  static verifyResetToken(email, token) {
    if (!email || !token) {
      return false;
    }

    const emailLower = email.toLowerCase();
    const tokenData = resetTokens.get(emailLower);
    if (!tokenData) {
      return false;
    }

    // Normalize token (ensure string, trim whitespace)
    const normalizedToken = String(token).trim();
    const normalizedStoredToken = String(tokenData.token).trim();

    // Check if token matches
    if (normalizedStoredToken !== normalizedToken) {
      return false;
    }

    // Check if token has expired
    if (tokenData.expiresAt < Date.now()) {
      resetTokens.delete(emailLower);
      return false;
    }

    return true;
  }

  /**
   * Verify email using reset token from forgot password
   * This allows using the 6-digit token from forgot password flow
   * @param {string} token - Email verification token (6-digit from forgot password)
   * @param {string} email - User email (optional, will search all tokens if not provided)
   * @returns {boolean} Success status
   */
  static async verifyEmail(token, email = null) {
    if (!token) {
      throw new BadRequestError('Verification token is required');
    }

    // If email is provided, verify directly
    if (email) {
      const emailLower = email.toLowerCase();
      if (this.verifyResetToken(emailLower, token)) {
        // Token is valid, remove it (one-time use)
        resetTokens.delete(emailLower);

        // Mark email as verified (allows reset password for next 10 minutes)
        const verifiedExpiresAt = Date.now() + VERIFIED_EMAIL_EXPIRY_TIME;
        verifiedEmails.set(emailLower, {
          verifiedAt: Date.now(),
          expiresAt: verifiedExpiresAt
        });

        // Also verify email in Supabase if user exists
        try {
          const { data: usersList } = await supabase.auth.admin.listUsers();
          const authUser = usersList?.users?.find(user => user.email.toLowerCase() === emailLower);
          if (authUser && !authUser.email_confirmed_at) {
            // Update email confirmation status
            await supabase.auth.admin.updateUserById(authUser.id, {
              email_confirm: true
            });
          }
        } catch (error) {
          console.warn('Failed to update email confirmation in Supabase:', error.message);
          // Continue anyway as token verification succeeded
        }

        return true;
      }
    } else {
      // Search for token across all stored tokens
      this.cleanupExpiredTokens();

      for (const [storedEmail, tokenData] of resetTokens.entries()) {
        if (tokenData.token === token && tokenData.expiresAt >= Date.now()) {
          // Token found and valid, remove it (one-time use)
          resetTokens.delete(storedEmail);

          // Mark email as verified (allows reset password for next 10 minutes)
          const verifiedExpiresAt = Date.now() + VERIFIED_EMAIL_EXPIRY_TIME;
          verifiedEmails.set(storedEmail, {
            verifiedAt: Date.now(),
            expiresAt: verifiedExpiresAt
          });

          // Also verify email in Supabase if user exists
          try {
            const { data: usersList } = await supabase.auth.admin.listUsers();
            const authUser = usersList?.users?.find(user => user.email.toLowerCase() === storedEmail.toLowerCase());
            if (authUser && !authUser.email_confirmed_at) {
              await supabase.auth.admin.updateUserById(authUser.id, {
                email_confirm: true
              });
            }
          } catch (error) {
            console.warn('Failed to update email confirmation in Supabase:', error.message);
          }

          return true;
        }
      }
    }

    // If token not found in reset tokens, try Supabase OTP as fallback
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (!error) {
        return true;
      }
    } catch (error) {
      // Supabase OTP verification failed, continue to throw error
    }

    throw new BadRequestError('Email verification token is invalid or has expired');
  }

  /**
   * Resend verification email
   * Generates a 6-digit token and sends it via email (consistent with forgot password flow)
   * @param {string} email - User email
   * @returns {Object} { token, message } - Returns token for consistency with forgot password
   */
  static async resendVerificationEmail(email) {
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
        message: 'If the email exists, a verification email has been sent.',
        email: email
      };
    }

    // Generate random 6-digit verification token (same as forgot password)
    const verificationToken = this.generateResetToken();

    // Store token in memory with expiry time (same storage as forgot password)
    const expiresAt = Date.now() + TOKEN_EXPIRY_TIME;
    resetTokens.set(email.toLowerCase(), {
      token: verificationToken,
      expiresAt: expiresAt,
      createdAt: Date.now()
    });

    // Clean up expired tokens
    this.cleanupExpiredTokens();

    // Send custom email with token displayed in email content
    const emailSent = await EmailUtil.sendPasswordResetEmail(email, verificationToken);

    if (!emailSent) {
      console.warn('⚠️  Email not sent. Token returned in response only.');
    }

    return {
      token: verificationToken,
      message: emailSent
        ? 'Verification email has been sent to your email.'
        : 'Verification token generated. Please check email configuration.',
      email: email
    };
  }

  /**
   * Social login callback
   * Handles OAuth callback from social providers (Google, Facebook)
   * @param {string} accessToken - Supabase access token from OAuth
   * @param {string} provider - Provider name ('google' or 'facebook')
   * @returns {Object} { user, tokens }
   */
  static async socialLoginCallback(accessToken, provider = 'google') {
    if (!accessToken) {
      throw new BadRequestError('Access token is required');
    }

    // Verify token with Supabase using ANON_KEY client (required for user token verification)
    // Service role key cannot verify user tokens from OAuth flow
    const { data: { user: authUser }, error: authError } = await supabaseForUserAuth.auth.getUser(accessToken);

    if (authError || !authUser) {
      console.error('Social login token verification error:', authError);
      throw new UnauthorizedError('Invalid or expired access token');
    }

    const userId = authUser.id;
    const email = authUser.email;
    const userMetadata = authUser.user_metadata || {};
    const appMetadata = authUser.app_metadata || {};

    // Extract user info from metadata
    const name = userMetadata.full_name || userMetadata.name || userMetadata.display_name || email?.split('@')[0];

    // Get avatar URL from multiple possible locations in Google OAuth response
    // Google OAuth may store avatar in different fields depending on configuration
    const avatarUrl =
      userMetadata.avatar_url ||
      userMetadata.picture ||
      userMetadata.photo_url ||
      userMetadata.avatar ||
      authUser.user_metadata?.avatar_url ||
      authUser.user_metadata?.picture ||
      authUser.user_metadata?.photo_url ||
      authUser.user_metadata?.avatar ||
      // Check identities for provider-specific data
      (authUser.identities && authUser.identities[0]?.identity_data?.avatar_url) ||
      (authUser.identities && authUser.identities[0]?.identity_data?.picture) ||
      null;


    // Check if user profile exists in database
    let user = await db('users')
      .where('user_id', userId)
      .first();

    // If user doesn't exist, create profile
    if (!user) {
      try {
        await db('users').insert({
          user_id: userId,
          name: name,
          avatar_url: avatarUrl,
          // Other fields can be null for social login users
        });
        user = await db('users')
          .where('user_id', userId)
          .first();
      } catch (dbError) {
        console.error('Error creating user profile:', dbError);
        // If insert fails (e.g., trigger already created it), try to fetch again
        user = await db('users')
          .where('user_id', userId)
          .first();

        if (!user) {
          throw new BadRequestError('Failed to create user profile');
        }
      }
    } else {
      // Update avatar if available and user doesn't have one (don't overwrite manual uploads)
      if (avatarUrl && !user.avatar_url) {
        await db('users')
          .where('user_id', userId)
          .update({ avatar_url: avatarUrl });
        user.avatar_url = avatarUrl;
      }

      // Update name if available and different
      if (name && user.name !== name) {
        await db('users')
          .where('user_id', userId)
          .update({ name: name });
        user.name = name;
      }
    }

    // Get user role (from employer table if exists, else job_seeker)
    let role = ROLES.JOB_SEEKER;
    let employerId = null;
    let finalAvatarUrl = user.avatar_url || avatarUrl; // Default: user's avatar or Google avatar
    
    const employer = await db('employer')
      .where('user_id', userId)
      .first();

    if (employer) {
      role = ROLES.EMPLOYER;
      employerId = employer.employer_id;
      // Priority for employer: employer.avatar_url > user.avatar_url > Google avatarUrl
      finalAvatarUrl = employer.avatar_url || user.avatar_url || avatarUrl;
    }

    // Generate tokens using helper method
    const tokenPayload = this.generateTokenPayload(userId, email, role, employerId);
    const tokens = JWTUtil.generateTokenPair(tokenPayload);

    return {
      user: {
        user_id: userId,
        email: email,
        name: user.name || name,
        role: role,
        avatar_url: finalAvatarUrl,
        ...(employerId && { employer_id: employerId })
      },
      ...tokens
    };
  }

  /**
   * Generate token payload for JWT
   * Helper method to centralize token generation logic
   * @private
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} role - User role
   * @param {number|null} employerId - Employer ID (if applicable)
   * @returns {Object} Token payload
   */
  static generateTokenPayload(userId, email, role, employerId = null) {
    const payload = {
      user_id: userId,
      email: email,
      role: role
    };

    // Add employer_id if user is employer
    if (employerId) {
      payload.employer_id = employerId;
    }

    return payload;
  }
}

module.exports = AuthService;

