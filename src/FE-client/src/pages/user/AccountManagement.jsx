import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  FileText,
  Briefcase,
  Bell,
  Settings,
  Mail,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { message } from 'antd';

export default function AccountManagement() {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated - use useEffect to avoid setState during render
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrors({});
    
    // Validation
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 8 ký tự';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordData.newPassword.trim() !== passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Show success message first (while modal is still open)
      message.success('Đổi mật khẩu thành công!');
      
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
      
      // Close modal after a delay to ensure message is visible
      setTimeout(() => {
        setShowChangePasswordModal(false);
      }, 1500);
    } catch (error) {
      console.error('Change password error:', error);
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message || error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      
      // Handle specific error cases
      if (statusCode === 401 || errorMessage.toLowerCase().includes('current password') || errorMessage.toLowerCase().includes('incorrect')) {
        // Current password is incorrect - show error on currentPassword field
        const fieldError = errorMessage || 'Mật khẩu hiện tại không đúng';
        setErrors({ currentPassword: fieldError });
        message.error(fieldError);
      } else if (statusCode === 400 && errorMessage.toLowerCase().includes('password')) {
        // Password validation error - show on newPassword field
        setErrors({ newPassword: errorMessage });
        message.error(errorMessage);
      } else {
        // Other errors - show generic error message
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                    {authUser?.avatar_url ? (
                      <img 
                        src={authUser.avatar_url} 
                        alt={authUser.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{authUser?.name || 'Chưa cập nhật tên'}</h3>
                <p className="text-sm text-blue-100">{authUser?.job_title || 'Chưa cập nhật chức danh'}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="p-2">
                <Link
                  to="/overview"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-50 cursor-pointer"
                >
                  <FileText className="w-5 h-5" />
                  <span>Tổng Quan</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-50 cursor-pointer mt-1"
                >
                  <FileText className="w-5 h-5" />
                  <span>Hồ Sơ Của Tôi</span>
                </Link>
                <Link
                  to="/my-jobs"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-50 cursor-pointer mt-1"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Việc Làm Của Tôi</span>
                </Link>
                <Link
                  to="/job-notifications"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-50 cursor-pointer mt-1"
                >
                  <Bell className="w-5 h-5" />
                  <span>Thông Báo Việc Làm</span>
                </Link>
                <Link
                  to="/account-management"
                  className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium transition-colors duration-200 hover:bg-blue-100 cursor-pointer mt-1"
                >
                  <Settings className="w-5 h-5" />
                  <span>Quản Lý Tài Khoản</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản Lý Tài Khoản</h1>

              {/* Email Login & Password Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email đăng nhập & mật khẩu</h2>
                <div className="mb-4">
                  <p className="text-gray-700 mb-4">
                    Email truy cập hiện tại: <span className="font-medium">{authUser?.email || ''}</span>
                  </p>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer transition-colors duration-200"
                  >
                    Thay đổi mật khẩu
                  </button>
                </div>
              </div>

              {/* Email Notification Settings Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Cài đặt thông báo qua Email</h2>
                <p className="text-gray-600 text-sm mb-4">
                  Thông báo hỗ trợ bạn có việc làm phù hợp: theo dõi trạng thái ứng tuyển, nhà tuyển dụng xem hồ sơ,...
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer transition-colors duration-200">
                  Thiết lập
                </button>
              </div>

              {/* Search Settings Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt tìm kiếm</h2>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Luôn sắp xếp theo thứ tự liên quan nhất</label>
                  <button
                    type="button"
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
                  >
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Thay đổi mật khẩu</h2>
                  <button
                    onClick={() => {
                      setShowChangePasswordModal(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setErrors({});
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                  >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleChangePassword} className="p-6">
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className={`w-full px-4 py-3 pr-12 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer z-10"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setPasswordData({ ...passwordData, newPassword: newValue });
                      // Clear error when user types
                      if (errors.newPassword) {
                        setErrors({ ...errors, newPassword: '' });
                      }
                      // Clear confirmPassword error if passwords match
                      if (errors.confirmPassword && newValue.trim() === passwordData.confirmPassword.trim()) {
                        setErrors({ ...errors, confirmPassword: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 pr-12 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer z-10"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setPasswordData({ ...passwordData, confirmPassword: newValue });
                      // Clear error when user types
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 pr-12 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer z-10"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePasswordModal(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setErrors({});
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Đang xử lý...' : 'Thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

