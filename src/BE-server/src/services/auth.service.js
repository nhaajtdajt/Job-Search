const { createClient } = require('@supabase/supabase-js');
const environment = require('../configs/environment.config');
const AuthRepository = require('../repositories/auth.repo');
const JWTUtil = require('../utils/jwt.util');
const HashUtil = require('../utils/hash.util');
const SupabaseErrorUtil = require('../utils/supabase-error.util');
const EmailService = require('./email.service');
const { BadRequestError, UnauthorizedError, NotFoundError, ForbiddenError } = require('../errors');
const ROLES = require('../constants/role');
const { ADMIN_EMAILS } = require('../constants/admin');

// Initialize Supabase client
const supabaseUrl = environment.SUPABASE_URL;
const supabaseKey = environment.SUPABASE_SERVICE_ROLE_KEY || environment.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required');
}

if (!environment.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY not found. Using SUPABASE_KEY instead.');
  console.warn('⚠️  Admin operations (register, etc.) may fail if SUPABASE_KEY is anon key.');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Separate Supabase client with ANON_KEY for user token verification
const supabaseAnonKey = environment.SUPABASE_ANON_KEY || environment.SUPABASE_KEY;
const supabaseForUserAuth = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// In-memory token storage
const resetTokens = new Map();
const TOKEN_EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes

const verifiedEmails = new Map();
const VERIFIED_EMAIL_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Auth Service
 * Handles authentication business logic with Supabase Auth integration
 * Following: routes -> controllers -> services -> repo -> database
 */
class AuthService {
  // ============================================
  // REGISTER
  // ============================================

  /**
   * Register new user (Job Seeker or Employer)
   */
  static async register(userData) {
    const { email, password, full_name, name, role = ROLES.JOB_SEEKER, ...additionalData } = userData;
    const userName = full_name || name;

    // Register in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: userName, role: role }
    });

    if (authError) {
      SupabaseErrorUtil.handleSupabaseAuthError(authError, 'Failed to create user');
    }

    const userId = authData.user.id;

    // Create user profile via repository
    try {
      const allowedFields = ['name', 'gender', 'date_of_birth', 'phone', 'address', 'avatar_url'];
      const userProfileData = { user_id: userId };
      if (userName) userProfileData.name = userName;

      Object.keys(additionalData).forEach(key => {
        if (allowedFields.includes(key)) {
          userProfileData[key] = additionalData[key];
        }
      });

      const existingUser = await AuthRepository.findUserById(userId);

      if (existingUser) {
        const updateData = {};
        Object.keys(userProfileData).forEach(key => {
          if (key !== 'user_id' && userProfileData[key] !== undefined && userProfileData[key] !== null) {
            updateData[key] = userProfileData[key];
          }
        });
        if (Object.keys(updateData).length > 0) {
          await AuthRepository.updateUser(userId, updateData);
        }
      } else {
        await AuthRepository.createUser(userProfileData);
      }
    } catch (dbError) {
      console.error('Database error when creating user profile:', dbError);
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (deleteError) {
        console.error('Failed to rollback auth user:', deleteError);
      }
      throw new BadRequestError(`Failed to create user profile: ${dbError.detail || dbError.message}`);
    }

    // Create employer if needed
    let employerId = null;
    if (role === ROLES.EMPLOYER) {
      employerId = await this.createEmployerForRegistration(userId, email, userName, additionalData);
      if (!employerId) {
        // Rollback
        await AuthRepository.deleteUser(userId);
        await supabase.auth.admin.deleteUser(userId);
        throw new BadRequestError('Failed to create employer profile');
      }
    }

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
   * Create employer record for registration
   * @private
   */
  static async createEmployerForRegistration(userId, email, userName, additionalData) {
    try {
      const existingEmployer = await AuthRepository.findEmployerByUserId(userId);
      if (existingEmployer) {
        return existingEmployer.employer_id;
      }

      // Create company if needed
      let companyId = additionalData.company_id || null;
      if (!companyId && additionalData.company_name) {
        companyId = await this.getOrCreateCompany(additionalData);
      }

      // Create employer
      const employerData = {
        user_id: userId,
        full_name: userName || 'Employer',
        email: email,
        role: additionalData.employer_role || 'HR Manager',
        status: additionalData.status || 'verified',
        company_id: companyId
      };

      try {
        const employer = await AuthRepository.createEmployer(employerData);
        return employer.employer_id;
      } catch (insertError) {
        if (insertError.code === '23505' || insertError.message.includes('duplicate key')) {
          const existing = await AuthRepository.findEmployerByUserId(userId);
          return existing ? existing.employer_id : null;
        }
        throw insertError;
      }
    } catch (error) {
      console.error('Failed to create employer record:', error);
      return null;
    }
  }

  /**
   * Get or create company
   * @private
   */
  static async getOrCreateCompany(additionalData) {
    try {
      const existingCompany = await AuthRepository.findCompanyByName(additionalData.company_name);
      if (existingCompany) {
        return existingCompany.company_id;
      }

      const newCompany = await AuthRepository.createCompany({
        company_name: additionalData.company_name,
        address: additionalData.company_address || additionalData.address || 'Chưa cập nhật',
        description: additionalData.company_description || null,
        website: additionalData.company_website || null,
        logo_url: additionalData.company_logo || null
      });
      return newCompany.company_id;
    } catch (error) {
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        const existing = await AuthRepository.findCompanyByName(additionalData.company_name);
        return existing ? existing.company_id : null;
      }
      throw error;
    }
  }

  // ============================================
  // LOGIN
  // ============================================

  /**
   * Login user
   */
  static async login(email, password, loginType = 'job_seeker') {
    // Block admin login from non-admin pages
    if (ADMIN_EMAILS.includes(email) && loginType !== 'admin') {
      throw new ForbiddenError('Tài khoản admin không thể đăng nhập từ trang này.');
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      SupabaseErrorUtil.handleSupabaseAuthError(authError, 'Invalid email or password');
    }

    const userId = authData.user.id;
    const userMetadata = authData.user.user_metadata || {};
    const name = userMetadata.full_name || userMetadata.name || email?.split('@')[0];

    // Get or create user profile via repository
    let user = await AuthRepository.findUserById(userId);

    if (!user) {
      try {
        user = await AuthRepository.createUser({ user_id: userId, name: name });
      } catch (dbError) {
        user = await AuthRepository.findUserById(userId);
        if (!user) {
          throw new NotFoundError('User profile not found and could not be created');
        }
      }
    }

    // Determine role
    let role = ROLES.JOB_SEEKER;
    let employerId = null;
    let avatarUrl = user.avatar_url;

    if (ADMIN_EMAILS.includes(email)) {
      role = ROLES.ADMIN;
    } else {
      const employer = await AuthRepository.findEmployerByUserId(userId);
      if (employer) {
        role = ROLES.EMPLOYER;
        employerId = employer.employer_id;
        avatarUrl = user.avatar_url || employer.avatar_url;
      }
    }

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

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken) {
    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required');
    }

    let decoded;
    try {
      decoded = JWTUtil.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await AuthRepository.findUserById(decoded.user_id);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    let role = ROLES.JOB_SEEKER;
    let employerId = null;
    const employer = await AuthRepository.findEmployerByUserId(decoded.user_id);

    if (employer) {
      role = ROLES.EMPLOYER;
      employerId = employer.employer_id;
    }

    const tokenPayload = { user_id: decoded.user_id, email: decoded.email, role: role };
    if (employerId) tokenPayload.employer_id = employerId;

    return JWTUtil.generateTokenPair(tokenPayload);
  }

  /**
   * Logout user
   */
  static async logout(userId) {
    return true;
  }

  // ============================================
  // PASSWORD RESET
  // ============================================

  /**
   * Request password reset
   */
  static async forgotPassword(email) {
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new BadRequestError('Failed to find user');
    }

    const emailLower = email.toLowerCase();
    const authUser = usersList.users.find(user => user.email && user.email.toLowerCase() === emailLower);

    if (!authUser) {
      throw new NotFoundError('Email này chưa được đăng ký trong hệ thống.');
    }

    // Check for social-only accounts
    const isSocialOnly = this.checkSocialOnlyAccount(authUser);
    if (isSocialOnly) {
      throw new BadRequestError('Tài khoản này được đăng nhập bằng tài khoản xã hội và không có mật khẩu để đặt lại.');
    }

    const resetToken = this.generateResetToken();
    const expiresAt = Date.now() + TOKEN_EXPIRY_TIME;
    resetTokens.set(emailLower, { token: resetToken, expiresAt, createdAt: Date.now() });

    this.cleanupExpiredTokens();

    const emailSent = await EmailService.sendPasswordResetEmail(email, resetToken);

    return {
      token: resetToken,
      message: emailSent ? 'Password reset token has been sent to your email.' : 'Password reset token generated.',
      email: email
    };
  }

  /**
   * Check if account is social-only
   * @private
   */
  static checkSocialOnlyAccount(authUser) {
    const hasPassword = authUser.encrypted_password && authUser.encrypted_password.length > 0;
    const hasEmailProvider = authUser.identities?.some(identity => identity.provider === 'email');
    const hasSocialProvider = authUser.identities?.some(
      identity => ['google', 'facebook', 'github', 'twitter', 'azure', 'linkedin'].includes(identity.provider)
    );
    const provider = authUser.app_metadata?.provider;
    const socialProviders = ['google', 'facebook', 'github', 'twitter', 'azure', 'linkedin'];

    return (provider && socialProviders.includes(provider.toLowerCase())) || 
           (hasSocialProvider && !hasEmailProvider && !hasPassword);
  }

  /**
   * Reset password
   */
  static async resetPassword(email, newPassword) {
    if (!email || !newPassword) {
      throw new BadRequestError('Email and new password are required');
    }

    const emailLower = email.toLowerCase();

    const verifiedData = verifiedEmails.get(emailLower);
    if (!verifiedData || verifiedData.expiresAt < Date.now()) {
      if (verifiedData) verifiedEmails.delete(emailLower);
      throw new BadRequestError('Email verification required. Please verify your email token first.');
    }

    const passwordValidation = HashUtil.validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      throw new BadRequestError(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new BadRequestError('Failed to find user');
    }

    const authUser = usersList.users.find(user => user.email.toLowerCase() === emailLower);
    if (!authUser) {
      throw new NotFoundError('User with this email not found');
    }

    verifiedEmails.delete(emailLower);

    const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, { password: newPassword });

    if (updateError) {
      throw new BadRequestError(updateError.message || 'Failed to reset password');
    }

    return { message: 'Password reset successful.', email: email };
  }

  // ============================================
  // EMAIL VERIFICATION
  // ============================================

  /**
   * Verify email using token
   */
  static async verifyEmail(token, email = null) {
    if (!token) {
      throw new BadRequestError('Verification token is required');
    }

    if (email) {
      const emailLower = email.toLowerCase();
      if (this.verifyResetToken(emailLower, token)) {
        resetTokens.delete(emailLower);
        verifiedEmails.set(emailLower, { verifiedAt: Date.now(), expiresAt: Date.now() + VERIFIED_EMAIL_EXPIRY_TIME });
        await this.updateEmailConfirmationInSupabase(emailLower);
        return true;
      }
    } else {
      this.cleanupExpiredTokens();
      for (const [storedEmail, tokenData] of resetTokens.entries()) {
        if (tokenData.token === token && tokenData.expiresAt >= Date.now()) {
          resetTokens.delete(storedEmail);
          verifiedEmails.set(storedEmail, { verifiedAt: Date.now(), expiresAt: Date.now() + VERIFIED_EMAIL_EXPIRY_TIME });
          await this.updateEmailConfirmationInSupabase(storedEmail);
          return true;
        }
      }
    }

    throw new BadRequestError('Email verification token is invalid or has expired');
  }

  /**
   * Update email confirmation in Supabase
   * @private
   */
  static async updateEmailConfirmationInSupabase(email) {
    try {
      const { data: usersList } = await supabase.auth.admin.listUsers();
      const authUser = usersList?.users?.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (authUser && !authUser.email_confirmed_at) {
        await supabase.auth.admin.updateUserById(authUser.id, { email_confirm: true });
      }
    } catch (error) {
      console.warn('Failed to update email confirmation in Supabase:', error.message);
    }
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email) {
    if (!email) {
      throw new BadRequestError('Email is required');
    }

    const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      throw new BadRequestError('Failed to find user');
    }

    const authUser = usersList.users.find(user => user.email === email);
    if (!authUser) {
      return { token: this.generateResetToken(), message: 'If the email exists, a verification email has been sent.', email };
    }

    const verificationToken = this.generateResetToken();
    const expiresAt = Date.now() + TOKEN_EXPIRY_TIME;
    resetTokens.set(email.toLowerCase(), { token: verificationToken, expiresAt, createdAt: Date.now() });

    this.cleanupExpiredTokens();

    const emailSent = await EmailService.sendPasswordResetEmail(email, verificationToken);

    return {
      token: verificationToken,
      message: emailSent ? 'Verification email has been sent.' : 'Verification token generated.',
      email
    };
  }

  // ============================================
  // SOCIAL LOGIN
  // ============================================

  /**
   * Social login callback
   */
  static async socialLoginCallback(accessToken, provider = 'google', accountType = 'job_seeker') {
    if (!accessToken) {
      throw new BadRequestError('Access token is required');
    }

    const { data: { user: authUser }, error: authError } = await supabaseForUserAuth.auth.getUser(accessToken);

    if (authError || !authUser) {
      throw new UnauthorizedError('Invalid or expired access token');
    }

    const userId = authUser.id;
    const email = authUser.email;
    const userMetadata = authUser.user_metadata || {};
    const name = userMetadata.full_name || userMetadata.name || userMetadata.display_name || email?.split('@')[0];
    const avatarUrl = this.extractAvatarFromMetadata(userMetadata, authUser);

    // Get or create user profile via repository
    let user = await AuthRepository.findUserById(userId);

    if (!user) {
      try {
        user = await AuthRepository.createUser({ user_id: userId, name, avatar_url: avatarUrl });
      } catch (dbError) {
        user = await AuthRepository.findUserById(userId);
        if (!user) {
          throw new BadRequestError('Failed to create user profile');
        }
      }
    } else {
      // Update avatar/name if needed
      const updateData = {};
      if (avatarUrl && !user.avatar_url) updateData.avatar_url = avatarUrl;
      if (name && user.name !== name) updateData.name = name;
      if (Object.keys(updateData).length > 0) {
        await AuthRepository.updateUser(userId, updateData);
        Object.assign(user, updateData);
      }
    }

    // Check employer
    let employer = await AuthRepository.findEmployerByUserId(userId);

    // Validate account type conflicts
    const userCreatedAt = new Date(authUser.created_at);
    const secondsSinceCreation = (new Date() - userCreatedAt) / 1000;
    const isExistingUser = secondsSinceCreation > 30;

    if (accountType === 'employer') {
      if (isExistingUser && !employer) {
        throw new BadRequestError('Tài khoản Google này đã được đăng nhập ở người tìm việc không thể sử dụng cho nhà tuyển dụng');
      }

      if (!employer) {
        employer = await AuthRepository.createEmployer({
          user_id: userId,
          full_name: user.name || name,
          email: email,
          role: 'HR Manager',
          status: 'verified',
          avatar_url: user.avatar_url || avatarUrl
        });
      }
    } else {
      if (employer) {
        throw new BadRequestError('Tài khoản Google này đã được đăng nhập ở nhà tuyển dụng không thể sử dụng cho người tìm việc');
      }
    }

    let role = accountType === 'employer' ? ROLES.EMPLOYER : ROLES.JOB_SEEKER;
    let employerId = employer ? employer.employer_id : null;
    let finalAvatarUrl = user.avatar_url || avatarUrl;

    if (employer) {
      role = ROLES.EMPLOYER;
      employerId = employer.employer_id;
      finalAvatarUrl = employer.avatar_url || user.avatar_url || avatarUrl;
    }

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
   * Extract avatar URL from metadata
   * @private
   */
  static extractAvatarFromMetadata(userMetadata, authUser) {
    return userMetadata.avatar_url ||
      userMetadata.picture ||
      userMetadata.photo_url ||
      userMetadata.avatar ||
      authUser.user_metadata?.avatar_url ||
      authUser.user_metadata?.picture ||
      (authUser.identities?.[0]?.identity_data?.avatar_url) ||
      (authUser.identities?.[0]?.identity_data?.picture) ||
      null;
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  static generateResetToken() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static cleanupExpiredTokens() {
    const now = Date.now();
    for (const [email, tokenData] of resetTokens.entries()) {
      if (tokenData.expiresAt < now) resetTokens.delete(email);
    }
    for (const [email, verifiedData] of verifiedEmails.entries()) {
      if (verifiedData.expiresAt < now) verifiedEmails.delete(email);
    }
  }

  static verifyResetToken(email, token) {
    if (!email || !token) return false;
    const tokenData = resetTokens.get(email.toLowerCase());
    if (!tokenData) return false;
    if (String(tokenData.token).trim() !== String(token).trim()) return false;
    if (tokenData.expiresAt < Date.now()) {
      resetTokens.delete(email.toLowerCase());
      return false;
    }
    return true;
  }

  static generateTokenPayload(userId, email, role, employerId = null) {
    const payload = { user_id: userId, email: email, role: role };
    if (employerId) payload.employer_id = employerId;
    return payload;
  }
}

module.exports = AuthService;
