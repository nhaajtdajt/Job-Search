import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  RefreshCw,
  Users,
  Briefcase,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { message, Empty, Pagination } from 'antd';
import EmployerSidebar from '../../components/employer/EmployerSidebar';
import notificationService from '../../services/notificationService';

/**
 * EmployerNotifications Page
 * Display and manage notifications for employers
 */
export default function EmployerNotifications() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });
  const [filter, setFilter] = useState('all'); // all, unread, application, expiring

  // Redirect if not authenticated or not employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/employer/login');
    } else if (user && user.role !== 'employer') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(
        pagination.page,
        pagination.limit
      );

      let data = response.data?.data || response.data || [];
      
      // Apply local filter
      if (filter === 'unread') {
        data = data.filter(n => !n.seen);
      } else if (filter === 'application') {
        data = data.filter(n => 
          n.title?.toLowerCase().includes('ứng viên') || 
          n.note?.toLowerCase().includes('ứng tuyển')
        );
      } else if (filter === 'expiring') {
        data = data.filter(n => 
          n.title?.toLowerCase().includes('hết hạn') || 
          n.note?.toLowerCase().includes('hết hạn')
        );
      }

      setNotifications(data);
      setPagination(prev => ({
        ...prev,
        total: response.data?.total || response.total || data.length
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
      message.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filter]);

  // Load unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data?.count || response.count || 0);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, [loadNotifications, loadUnreadCount]);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.notification_id === notificationId ? { ...n, seen: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
      message.error('Không thể cập nhật');
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, seen: true })));
      setUnreadCount(0);
      message.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
      message.error('Không thể cập nhật');
    }
  };

  // Handle delete
  const handleDelete = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.notification_id !== notificationId));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      message.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Không thể xóa thông báo');
    }
  };

  // Get notification icon based on content
  const getNotificationIcon = (notification) => {
    const text = (notification.title || '').toLowerCase() + (notification.note || '').toLowerCase();
    
    if (text.includes('ứng viên') || text.includes('ứng tuyển')) {
      return <Users className="w-5 h-5 text-blue-500" />;
    } else if (text.includes('hết hạn') || text.includes('expired')) {
      return <Clock className="w-5 h-5 text-orange-500" />;
    } else if (text.includes('tin tuyển dụng') || text.includes('job')) {
      return <Briefcase className="w-5 h-5 text-green-500" />;
    }
    return <Bell className="w-5 h-5 text-gray-500" />;
  };

  // Check if notification is about new application
  const isApplicationNotification = (notification) => {
    // Check metadata first
    if (notification.metadata?.type === 'new_application') return true;
    // Fallback to text matching
    const text = (notification.title || '').toLowerCase() + (notification.note || '').toLowerCase();
    return text.includes('ứng viên') || text.includes('ứng tuyển');
  };

  // Check if notification is about job expiring
  const isJobExpiringNotification = (notification) => {
    const text = (notification.title || '').toLowerCase() + (notification.note || '').toLowerCase();
    return text.includes('hết hạn') || text.includes('expired');
  };

  // Get action label for notification
  const getNotificationActionLabel = (notification) => {
    if (isApplicationNotification(notification)) return 'Xem ứng viên';
    if (isJobExpiringNotification(notification)) return 'Xem tin tuyển dụng';
    return null;
  };

  // Handle notification click - navigate if actionable
  const handleNotificationClick = async (notification) => {
    // Mark as read first
    if (!notification.seen) {
      await handleMarkAsRead(notification.notification_id);
    }

    // Parse metadata if it's a string
    let metadata = notification.metadata;
    if (typeof metadata === 'string') {
      try {
        metadata = JSON.parse(metadata);
      } catch {
        metadata = null;
      }
    }

    // Navigate based on notification type
    if (metadata?.type === 'new_application' && metadata?.application_id) {
      // Navigate to specific application detail
      navigate(`/employer/applications/${metadata.application_id}`);
    } else if (isApplicationNotification(notification)) {
      // Fallback: go to applications list
      navigate('/employer/applications');
    } else if (isJobExpiringNotification(notification)) {
      // Go to jobs list
      if (metadata?.job_id) {
        navigate(`/employer/jobs/${metadata.job_id}/edit`);
      } else {
        navigate('/employer/jobs');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) return 'Vừa xong';
    // Less than 1 hour
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    // Less than 24 hours
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    // Less than 7 days
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const filterTabs = [
    { key: 'all', label: 'Tất cả', icon: Bell },
    { key: 'unread', label: 'Chưa đọc', icon: AlertCircle },
    { key: 'application', label: 'Ứng viên', icon: Users },
    { key: 'expiring', label: 'Sắp hết hạn', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EmployerSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                  <p className="text-gray-500">
                    {unreadCount > 0 
                      ? `${unreadCount} thông báo chưa đọc`
                      : 'Tất cả đã đọc'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
                <button
                  onClick={() => {
                    loadNotifications();
                    loadUnreadCount();
                  }}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Làm mới
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setFilter(tab.key);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                  filter === tab.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.key === 'unread' && unreadCount > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    filter === tab.key ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12">
              <Empty
                image={<Bell className="w-20 h-20 text-gray-300 mx-auto" />}
                description={
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      Không có thông báo nào
                    </p>
                    <p className="text-gray-500">
                      Thông báo mới sẽ xuất hiện ở đây
                    </p>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.notification_id}
                    className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                      !notification.seen ? 'bg-orange-50/50' : ''
                    } ${isApplicationNotification(notification) ? 'hover:bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !notification.seen ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {notification.title && (
                              <h4 className={`font-semibold ${
                                !notification.seen ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                            )}
                            <p className={`text-sm mt-1 ${
                              !notification.seen ? 'text-gray-700' : 'text-gray-500'
                            }`}>
                              {notification.note}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {formatDate(notification.created_at)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {!notification.seen && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full" />
                            )}
                            {getNotificationActionLabel(notification) && (
                              <span className="text-xs text-blue-500 font-medium flex items-center gap-1">
                                {getNotificationActionLabel(notification)}
                                <ChevronRight className="w-3 h-3" />
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.notification_id);
                              }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.total > pagination.limit && (
                <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
                  <Pagination
                    current={pagination.page}
                    total={pagination.total}
                    pageSize={pagination.limit}
                    onChange={(page) => setPagination(prev => ({ ...prev, page }))}
                    showSizeChanger={false}
                    showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
