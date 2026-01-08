import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';

/**
 * EmployerAuthCallback - Handles OAuth callback for employer Google login
 * This is separate from AuthCallback to handle employer-specific flow
 */
export default function EmployerAuthCallback() {
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
            try {
                const user = JSON.parse(existingUser);
                // If user is employer, redirect to employer dashboard
                if (user.role === 'employer') {
                    console.log('[EmployerAuthCallback] User already logged in as employer, redirecting to dashboard');
                    navigate('/employer/dashboard', { replace: true });
                } else {
                    // If user is not employer, redirect to employer login with error
                    console.log('[EmployerAuthCallback] User logged in but not as employer');
                    navigate('/employer/login', {
                        replace: true,
                        state: { error: 'Bạn đã đăng nhập với tài khoản người tìm việc. Vui lòng đăng xuất và đăng nhập lại với tài khoản nhà tuyển dụng.' }
                    });
                }
            } catch (e) {
                navigate('/employer/dashboard', { replace: true });
            }
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
                // Pass 'employer' as accountType to register/login as employer
                const result = await handleSocialCallback('employer');

                console.log('[EmployerAuthCallback] Social login callback successful, tokens saved, redirecting to employer dashboard');

                // Wait a bit longer to ensure:
                // 1. Tokens are fully saved in localStorage
                // 2. AuthContext state is updated
                // 3. Recent login is marked
                // This prevents race conditions with API calls on the dashboard
                await new Promise(resolve => setTimeout(resolve, 300));

                // Redirect to employer dashboard after successful login
                navigate('/employer/dashboard', { replace: true });
            } catch (error) {
                console.error('[EmployerAuthCallback] Social login callback error:', error);

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

                // Redirect immediately to employer login page with error message
                navigate('/employer/login', {
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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
            <div className="text-center max-w-md px-4">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang xử lý đăng nhập...</h2>
                <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
        </div>
    );
}
