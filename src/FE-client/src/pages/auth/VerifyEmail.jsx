/**
 * VerifyEmail Page
 * Handles email verification after registration
 * Users are redirected here from the email verification link
 */
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { 
  Mail, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  Home,
  LogIn
} from 'lucide-react';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error, expired
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  // Get token and email from URL params
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token && email) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Link xác minh không hợp lệ. Vui lòng kiểm tra lại email.');
    }
  }, [token, email]);

  const verifyEmail = async () => {
    try {
      setStatus('loading');
      await authService.verifyEmail(token, email);
      setStatus('success');
      setMessage('Email của bạn đã được xác minh thành công!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email đã xác minh. Vui lòng đăng nhập.' } 
        });
      }, 3000);
    } catch (error) {
      console.error('Verify email error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage?.includes('expired') || errorMessage?.includes('hết hạn')) {
        setStatus('expired');
        setMessage('Link xác minh đã hết hạn. Vui lòng yêu cầu gửi lại.');
      } else {
        setStatus('error');
        setMessage(errorMessage || 'Không thể xác minh email. Vui lòng thử lại.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    
    try {
      setIsResending(true);
      await authService.resendVerificationEmail(email);
      setMessage('Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư.');
      setStatus('resent');
    } catch (error) {
      console.error('Resend verification error:', error);
      setMessage(error.response?.data?.message || 'Không thể gửi lại email. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xác minh email...</h2>
            <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
          </>
        );

      case 'success':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác minh thành công!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-500 mb-6">Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <LogIn className="w-5 h-5" />
              Đăng nhập ngay
            </Link>
          </>
        );

      case 'expired':
      case 'resent':
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
              <RefreshCw className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'resent' ? 'Đã gửi lại email' : 'Link đã hết hạn'}
            </h2>
            <p className="text-gray-600 mb-6">{message}</p>
            {email && status !== 'resent' && (
              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Gửi lại email xác minh
                  </>
                )}
              </button>
            )}
          </>
        );

      case 'error':
      default:
        return (
          <>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác minh thất bại</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {email && (
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  {isResending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                  Gửi lại email
                </button>
              )}
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                <Home className="w-5 h-5" />
                Về trang chủ
              </Link>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Logo */}
        <Link to="/" className="inline-block mb-8">
          <h1 className="text-3xl font-bold text-blue-600">viec24h</h1>
        </Link>

        {renderContent()}

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Cần hỗ trợ?{' '}
            <a href="mailto:support@viec24h.vn" className="text-blue-600 hover:text-blue-700 font-medium">
              Liên hệ chúng tôi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
