import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock,
  User,
  FileText,
  Briefcase,
  Settings,
  Bookmark,
  Search,
  Filter
} from 'lucide-react';
import { message, Tooltip } from 'antd';

export default function Notifications() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  // Sidebar menu items (reused from SavedSearches for consistency)
  const menuItems = [
    { icon: User, label: 'Tổng quan', path: '/user/overview' },
    { icon: FileText, label: 'Hồ sơ của tôi', path: '/user/profile' },
    { icon: FileText, label: 'Quản lý CV', path: '/user/resumes' },
    { icon: Briefcase, label: 'Việc làm của tôi', path: '/user/my-jobs' },
    { icon: Bell, label: 'Thông báo', path: '/user/notifications', active: true },
    { icon: Settings, label: 'Quản lý tài khoản', path: '/user/account' },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadNotifications();
  }, [isAuthenticated, navigate]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      if (response && response.data) {
        setNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      message.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => 
        n.notification_id === id ? { ...n, seen: true } : n
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
      message.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
      message.error('Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.notification_id !== id));
      message.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Có lỗi xảy ra khi xóa');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // If less than 24 hours, show relative time
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours > 0) return `${hours} giờ trước`;
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes} phút trước`;
    }

    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.seen) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.seen).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white truncate max-w-[150px]">{user?.name || 'Người dùng'}</p>
                    <p className="text-sm text-blue-100">Người tìm việc</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    Thông báo
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </h1>
                  <p className="text-gray-500 mt-1">Cập nhật tin tức mới nhất từ hệ thống</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        filter === 'all' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setFilter('unread')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        filter === 'unread' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Chưa đọc
                    </button>
                  </div>
                  <Tooltip title="Đánh dấu tất cả là đã đọc">
                    <button
                      onClick={handleMarkAllAsRead}
                      className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <CheckCheck className="w-5 h-5" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* List */}
              <div className="divide-y divide-gray-100">
                {loading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Đang tải thông báo...</p>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Không có thông báo nào</h3>
                    <p className="text-gray-500 mt-2">Bạn sẽ nhận được thông báo khi có cập nhật mới.</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification) => (
                    <div 
                      key={notification.notification_id} 
                      className={`p-5 transition-colors hover:bg-gray-50 group ${
                        !notification.seen ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full flex-shrink-0 ${
                          !notification.seen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Bell className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-base ${!notification.seen ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                            {notification.note}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(notification.created_at)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.seen && (
                            <Tooltip title="Đánh dấu đã đọc">
                              <button
                                onClick={() => handleMarkAsRead(notification.notification_id)}
                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          )}
                          <Tooltip title="Xóa thông báo">
                            <button
                              onClick={() => handleDelete(notification.notification_id)}
                              className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
