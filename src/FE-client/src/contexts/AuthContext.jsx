import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { userService } from '../services/user.service';
import { markRecentLogin } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser && accessToken) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            // Don't fetch profile immediately - use stored data
            // Profile will be fetched on demand when needed (e.g., when user visits profile page)
          } catch (parseError) {
            console.error('Error parsing user data:', parseError);
            // Invalid JSON - clear corrupted data
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Only clear if critical error
        if (error.name === 'SyntaxError') {
          localStorage.removeItem('user');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /**
   * Login user
   */
  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      // Save tokens FIRST before updating state
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Update state AFTER tokens are saved
      setUser(result.user);
      setIsAuthenticated(true);

      // Mark recent login to prevent immediate redirects
      markRecentLogin();

      console.log('Login successful, tokens saved');

      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Register user
   */
  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      
      // Save tokens
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Update state
      setUser(result.user);
      setIsAuthenticated(true);

      // Mark recent login to prevent immediate redirects
      markRecentLogin();

      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call logout API
      await authService.logout();
      console.log('[Auth] Logout API call successful');
    } catch (error) {
      console.error('[Auth] Logout API error (continuing with local cleanup):', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear state and localStorage (authService.logout already clears localStorage, but ensure it)
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear localStorage (double check)
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Clear Supabase session if exists (for social login)
      try {
        const { supabase } = await import('../config/supabase');
        await supabase.auth.signOut();
        console.log('[Auth] Supabase session cleared');
      } catch (supabaseError) {
        // Ignore Supabase errors (might not be logged in via Supabase)
        console.log('[Auth] Supabase signOut skipped (not logged in via Supabase)');
      }
      
      // Log successful logout
      console.log('[Auth] ✅ Logout completed successfully - User logged out');
      console.log('[Auth] All tokens and user data cleared from localStorage');
    }
  };

  /**
   * Update user profile
   */
  const updateUser = async (updateData) => {
    try {
      const updatedProfile = await userService.updateProfile(updateData);
      const updatedUser = {
        ...user,
        ...updatedProfile,
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Refresh user data from API
   */
  const refreshUser = async () => {
    try {
      const profile = await userService.getProfile();
      const updatedUser = {
        ...user,
        ...profile,
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Social login (Google/Facebook)
   */
  const socialLogin = async (provider = 'google') => {
    try {
      const { supabase } = await import('../config/supabase');
      
      // Sign in with OAuth provider
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }

      // The redirect will happen, so we return the redirect URL
      return data;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Handle social login callback
   */
  const handleSocialCallback = async () => {
    try {
      const { supabase } = await import('../config/supabase');
      
      // Get session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        throw new Error('Không thể lấy session từ OAuth callback');
      }

      // Get provider from session (try to detect from user metadata or default to google)
      const provider = session.provider_token ? 'google' : 'facebook'; // Simple detection
      
      // Call backend to sync user and get JWT tokens
      const result = await authService.socialLoginCallback(session.access_token, provider);

      // Save tokens FIRST - this is critical for API interceptor
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.user));

      // Mark recent login IMMEDIATELY after saving tokens
      // This prevents any API calls from triggering redirects
      markRecentLogin();

      // Update state AFTER tokens are saved
      setUser(result.user);
      setIsAuthenticated(true);

      console.log('Social login tokens saved and recent login marked');

      // Clear Supabase session (we're using our own JWT tokens)
      await supabase.auth.signOut();

      return result;
    } catch (error) {
      console.error('Social callback error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    socialLogin,
    handleSocialCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

