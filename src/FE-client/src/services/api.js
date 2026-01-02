import axios from 'axios';

// Base URL from environment variable or default
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8017/api';

// Track recent login to prevent immediate redirects
let recentLoginTime = 0;
const RECENT_LOGIN_THRESHOLD = 10000; // 10 seconds - increased for OAuth flow

// Export function to mark recent login
export const markRecentLogin = () => {
  recentLoginTime = Date.now();
  console.log('Recent login marked at:', new Date(recentLoginTime).toISOString());
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: {
    serialize: (params) => {
      const searchParams = new URLSearchParams();
      for (const key in params) {
        const value = params[key];
        if (value === null || value === undefined) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      }
      return searchParams.toString();
    },
  },
});

// Request interceptor: Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Get current path FIRST before any logic
      const currentPath = window.location.pathname;
      const isRootPath = currentPath === '/' || currentPath === '';
      const isAuthPage = currentPath === '/login' || 
                        currentPath === '/register' ||
                        currentPath === '/auth/callback';
      const timeSinceRecentLogin = Date.now() - recentLoginTime;
      const isRecentLogin = timeSinceRecentLogin < RECENT_LOGIN_THRESHOLD;
      const hasToken = !!localStorage.getItem('accessToken');
      
      // CRITICAL: If on home page, NEVER try to refresh or redirect - just reject silently
      // This prevents redirect loops after OAuth login
      // Homepage is a public page and should NEVER redirect to login
      if (isRootPath) {
        console.log('[API] Skipping token refresh - on home page (public page)', {
          pathname: currentPath,
          hasToken,
          isRecentLogin,
          timeSinceRecentLogin,
          url: originalRequest.url
        });
        return Promise.reject(error);
      }
      
      // If on auth pages or recent login, don't try to refresh
      // Just reject the error silently - user is on a safe page
      if (isAuthPage || isRecentLogin) {
        console.log('[API] Skipping token refresh - safe page or recent login', {
          pathname: currentPath,
          isRecentLogin,
          timeSinceRecentLogin,
          url: originalRequest.url
        });
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Try to refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;

        // Save new tokens
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - NEVER redirect from home page or after recent login
        // Re-check conditions in catch block (critical for preventing redirect loops)
        // IMPORTANT: Get fresh pathname in catch block - path might have changed
        const currentPath = window.location.pathname;
        const isRootPath = currentPath === '/' || currentPath === '';
        const isAuthPage = currentPath === '/login' || 
                          currentPath === '/register' ||
                          currentPath === '/auth/callback';
        const timeSinceRecentLogin = Date.now() - recentLoginTime;
        const isRecentLogin = timeSinceRecentLogin < RECENT_LOGIN_THRESHOLD;
        const isProfileCall = originalRequest.url?.includes('/users/profile') ||
                             originalRequest.url?.includes('/users/avatar');
        
        // CRITICAL: Never redirect if on home page - this fixes the redirect loop after OAuth login
        // Homepage is a PUBLIC page and should NEVER redirect to login, regardless of token status
        if (isRootPath) {
          console.log('[API] Skipping redirect - on home page (public page, never redirect)', {
            pathname: currentPath,
            isRecentLogin,
            timeSinceRecentLogin,
            url: originalRequest.url
          });
          return Promise.reject(refreshError);
        }
        
        // NEVER redirect if:
        // - On auth pages
        // - Recent login (within threshold)
        // - Profile calls (non-critical endpoints)
        if (isAuthPage || isRecentLogin || isProfileCall) {
          console.log('[API] Skipping redirect - safe conditions', {
            pathname: currentPath,
            isAuthPage,
            isRecentLogin,
            isProfileCall,
            timeSinceRecentLogin,
            url: originalRequest.url
          });
          return Promise.reject(refreshError);
        }
        
        // Final safety check: NEVER redirect if we have a token (might be valid but expired)
        // Only redirect if we truly have no token AND we're not on safe pages
        const hasToken = !!localStorage.getItem('accessToken');
        
        // If we have a token (even if expired), don't redirect - let user stay on page
        // They can manually refresh or try again
        if (hasToken) {
          console.log('[API] Skipping redirect - token exists (even if expired)', {
            pathname: currentPath,
            url: originalRequest.url
          });
          return Promise.reject(refreshError);
        }
        
        // Only redirect for other protected pages (not home, not auth, not recent login, no token)
        // This should rarely happen if checks above are working correctly
        console.warn('[API] Redirecting to login - token invalid on protected page', {
          pathname: currentPath,
          url: originalRequest.url,
          isRecentLogin,
          timeSinceRecentLogin,
          hasToken
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data, config = {}) => api.patch(url, data, config),
};

export default api;

