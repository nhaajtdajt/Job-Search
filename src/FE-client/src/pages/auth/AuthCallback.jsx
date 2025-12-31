import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

export default function AuthCallback() {
  const { handleSocialCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
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
        setError(error.message || 'Đăng nhập bằng mạng xã hội thất bại. Vui lòng thử lại.');
        
        // Only redirect to login if there's a real error
        // Don't redirect if user is already logged in (token exists)
        const hasToken = localStorage.getItem('accessToken');
        if (!hasToken) {
          setTimeout(() => {
            navigate('/login', { 
              state: { error: error.message || 'Đăng nhập bằng mạng xã hội thất bại. Vui lòng thử lại.' } 
            });
          }, 2000);
        } else {
          // User is logged in, just redirect to home
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1000);
        }
      } finally {
        setProcessing(false);
      }
    };

    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        {error ? (
          <>
            <div className="inline-block rounded-full h-12 w-12 bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium">{error}</p>
            <p className="text-gray-500 text-sm mt-2">Đang chuyển hướng...</p>
          </>
        ) : (
          <>
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang xử lý đăng nhập...</p>
          </>
        )}
      </div>
    </div>
  );
}
