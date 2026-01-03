import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { useNavigate, Link } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { 
  User, 
  FileText,
  Briefcase,
  Bell,
  Settings,
  Plus,
  X,
  Trash2
} from 'lucide-react';
import { message } from 'antd';

export default function JobNotifications() {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    search_query: '',
    salary_min: '',
    salary_currency: 'VND',
    salary_period: 'monthly',
    level: '',
    location: '',
    industry: '',
    company_field: '',
    frequency: 'daily',
    notify_via: 'email',
    is_active: true
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated or if user is employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (authUser && authUser.role === 'employer') {
      navigate('/employer/dashboard', { replace: true });
    }
  }, [isAuthenticated, authUser, navigate]);

  // Load notifications (saved searches)
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await userService.getSavedSearches(1, 50);
        setNotifications(data.data || []);
      } catch (error) {
        console.error('Error loading notifications:', error);
        message.error('Không thể tải thông báo. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [isAuthenticated]);

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.search_query.trim()) {
      newErrors.search_query = 'Vui lòng nhập chức danh việc làm';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      const filters = {
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : undefined,
        salary_currency: formData.salary_currency,
        salary_period: formData.salary_period,
        level: formData.level || undefined,
        location: formData.location || undefined,
        industry: formData.industry || undefined,
        company_field: formData.company_field || undefined,
        frequency: formData.frequency,
        notify_via: formData.notify_via,
        is_active: formData.is_active
      };

      // Remove undefined fields
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

      await userService.saveSearch({
        name: formData.search_query,
        filter: filters
      });

      message.success('Tạo thông báo việc làm thành công!');
      setShowCreateModal(false);
      setFormData({
        search_query: '',
        salary_min: '',
        salary_currency: 'VND',
        salary_period: 'monthly',
        level: '',
        location: '',
        industry: '',
        company_field: '',
        frequency: 'daily',
        notify_via: 'email',
        is_active: true
      });
      setErrors({});

      // Reload notifications
      const data = await userService.getSavedSearches(1, 50);
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Error creating notification:', error);
      message.error('Tạo thông báo thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNotification = async (searchId) => {
    try {
      await userService.deleteSavedSearch(searchId);
      message.success('Đã xóa thông báo việc làm');
      // Reload notifications
      const data = await userService.getSavedSearches(1, 50);
      setNotifications(data.data || []);
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Không thể xóa thông báo. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <UserSidebar />

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Thông Báo Việc Làm</h1>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium cursor-pointer btn-smooth transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-5 h-5 transition-transform duration-200" />
                  Tạo Thông Báo Việc Làm Mới
                </button>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
                      <Bell className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">Bạn chưa tạo Thông báo việc làm nào</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Tạo Thông Báo Việc Làm Mới
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.stt}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 card-smooth"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {notification.name || 'Thông báo việc làm'}
                            </h3>
                            {notification.filter && (
                              <div className="text-sm text-gray-600 space-y-1">
                                {notification.filter.location && (
                                  <p>Địa điểm: {notification.filter.location}</p>
                                )}
                                {notification.filter.salary_min && (
                                  <p>
                                    Lương tối thiểu: {typeof notification.filter.salary_min === 'number' ? notification.filter.salary_min.toLocaleString('vi-VN') : notification.filter.salary_min}{' '}
                                    {notification.filter.salary_currency || 'VND'}/{notification.filter.salary_period === 'monthly' ? 'tháng' : 'năm'}
                                  </p>
                                )}
                                {notification.filter.level && (
                                  <p>Cấp bậc: {notification.filter.level}</p>
                                )}
                                {notification.filter.industry && (
                                  <p>Ngành nghề: {notification.filter.industry}</p>
                                )}
                                {notification.filter.frequency && (
                                  <p>
                                    Tần suất: {notification.filter.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}
                                  </p>
                                )}
                                {notification.filter.notify_via && (
                                  <p>
                                    Thông báo qua: {notification.filter.notify_via === 'email' ? 'Email' : notification.filter.notify_via === 'app' ? 'Ứng dụng' : 'Cả hai'}
                                  </p>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-500 mt-2">
                              Tạo lúc: {formatDate(notification.created_at)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteNotification(notification.stt)}
                            className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
                            title="Xóa thông báo"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col my-4">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">Tạo Thông Báo Việc Làm</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    search_query: '',
                    salary_min: '',
                    salary_currency: 'VND',
                    salary_period: 'monthly',
                    level: '',
                    location: '',
                    industry: '',
                    company_field: '',
                    frequency: 'daily',
                    notify_via: 'email',
                    is_active: true
                  });
                  setErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer p-1 hover:bg-gray-100 rounded"
                title="Đóng"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form - Scrollable */}
            <form id="create-notification-form" onSubmit={handleCreateNotification} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Job Title (Required) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chức danh việc làm <span className="text-red-500">(Bắt buộc)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.search_query}
                    onChange={(e) => setFormData({ ...formData, search_query: e.target.value })}
                    className={`w-full px-4 py-3 border ${errors.search_query ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                    placeholder="Nhập chức danh"
                  />
                  {errors.search_query && (
                    <p className="mt-1 text-sm text-red-600">{errors.search_query}</p>
                  )}
                </div>

                {/* Minimum Salary */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức lương tối thiểu</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.salary_min}
                      onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="0"
                    />
                    <select
                      value={formData.salary_currency}
                      onChange={(e) => setFormData({ ...formData, salary_currency: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="VND">VND</option>
                      <option value="USD">USD</option>
                    </select>
                    <select
                      value={formData.salary_period}
                      onChange={(e) => setFormData({ ...formData, salary_period: e.target.value })}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="monthly">Hàng tháng</option>
                      <option value="yearly">Hàng năm</option>
                    </select>
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cấp bậc</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Vui lòng chọn ...</option>
                    <option value="Intern">Thực tập sinh</option>
                    <option value="Fresher">Mới tốt nghiệp</option>
                    <option value="Junior">Nhân viên</option>
                    <option value="Middle">Chuyên viên</option>
                    <option value="Senior">Chuyên viên cao cấp</option>
                    <option value="Lead">Trưởng nhóm</option>
                    <option value="Manager">Quản lý</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa điểm</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Chọn địa điểm</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngành nghề</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Chọn ngành nghề</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</option>
                    <option value="Bất động sản">Bất động sản</option>
                    <option value="Giáo dục - Đào tạo">Giáo dục - Đào tạo</option>
                    <option value="Y tế">Y tế</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Company Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lĩnh vực công ty</label>
                  <select
                    value={formData.company_field}
                    onChange={(e) => setFormData({ ...formData, company_field: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Chọn lĩnh vực công ty</option>
                    <option value="Startup">Startup</option>
                    <option value="Outsource">Outsource</option>
                    <option value="Product">Product</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tần suất</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="daily"
                      checked={formData.frequency === 'daily'}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Hàng ngày</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="weekly"
                      checked={formData.frequency === 'weekly'}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Hàng tuần</span>
                  </label>
                </div>
              </div>

              {/* Notify Via */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Thông báo qua</label>
                <div className="flex gap-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={formData.notify_via === 'email'}
                      onChange={(e) => setFormData({ ...formData, notify_via: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="app"
                      checked={formData.notify_via === 'app'}
                      onChange={(e) => setFormData({ ...formData, notify_via: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Ứng dụng</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="both"
                      checked={formData.notify_via === 'both'}
                      onChange={(e) => setFormData({ ...formData, notify_via: e.target.value })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Cả hai</span>
                  </label>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Nhận thông báo</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.is_active ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      formData.is_active ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              </div>
            </form>

            {/* Footer - Fixed */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 flex-shrink-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    search_query: '',
                    salary_min: '',
                    salary_currency: 'VND',
                    salary_period: 'monthly',
                    level: '',
                    location: '',
                    industry: '',
                    company_field: '',
                    frequency: 'daily',
                    notify_via: 'email',
                    is_active: true
                  });
                  setErrors({});
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 cursor-pointer btn-smooth transform hover:scale-105 active:scale-95"
              >
                Hủy
              </button>
              <button
                type="submit"
                form="create-notification-form"
                disabled={saving}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer btn-smooth transform hover:scale-105 active:scale-95 disabled:transform-none"
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

