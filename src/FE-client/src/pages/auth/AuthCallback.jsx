import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

export default function AuthCallback() {
  const { handleSocialCallback } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Prevent multiple executions - check if already processing or already logged in
    if (processing) {
      return;
    }

    // Check if user is already logged in (tokens exist) - if so, just redirect
    const existingToken = localStorage.getItem('accessToken');
    const existingUser = localStorage.getItem('user');

    if (existingToken && existingUser) {
      console.log('[AuthCallback] User already logged in, redirecting to home');
      navigate('/', { replace: true });
      return;
    }

    const processCallback = async () => {
      setProcessing(true);

      try {
        // Wait for Supabase to process the OAuth callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          // Wait a bit for the session to be available
          await new Promise(resolve => setTimeout(resolve, 1000));
          const { data: { session: retrySession }, error: retryError } = await supabase.auth.getSession();

          if (retryError || !retrySession) {
            throw new Error('Không thể lấy session từ OAuth callback');
          }
        }

        // Call backend to sync user and get JWT tokens
        // Note: handleSocialCallback will get the session again internally
        const result = await handleSocialCallback();

        console.log('[AuthCallback] Social login callback successful, tokens saved, redirecting to home');

        // Wait a bit longer to ensure:
        // 1. Tokens are fully saved in localStorage
        // 2. AuthContext state is updated
        // 3. Recent login is marked
        // This prevents race conditions with API calls on the home page
        await new Promise(resolve => setTimeout(resolve, 300));

        // Redirect to home after successful login
        navigate('/', { replace: true });
      } catch (error) {
        console.error('[AuthCallback] Social login callback error:', error);

        // Extract error message from various possible sources
        const errorMessage =
          error.response?.data?.message || // Backend API error
          error.response?.data?.error ||   // Alternative error format
          error.message ||                  // Standard error
          'Đăng nhập bằng tài khoản xã hội thất bại. Vui lòng thử lại.';

        // Clear any partial auth state from Supabase
        try {
          await supabase.auth.signOut();
        } catch (signOutError) {
          console.warn('Failed to sign out from Supabase:', signOutError);
        }

        // Redirect immediately to login page with error message
        navigate('/login', {
          replace: true,
          state: { error: errorMessage }
        });
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  // Only show loading UI (no error state needed since we redirect immediately)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang xử lý đăng nhập...</h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  );
}
