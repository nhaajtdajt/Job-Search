import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService } from '../../services/notificationService';
import { subscribeToNotifications, getSocket, connectSocket } from '../../services/socketService';
import { useNavigate, Link } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  Clock,
  Filter,
  ChevronDown,
  ChevronUp,
  Mail,
  MailOpen
} from 'lucide-react';
import { message, Tooltip } from 'antd';

export default function Notifications() {
  const { user, isAuthenticated, session } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread
  const [isConnected, setIsConnected] = useState(false);
  const [expandedId, setExpandedId] = useState(null); // Track which notification is expanded

  // Handle new notification from WebSocket
  const handleNewNotification = useCallback((notification) => {
    console.log('[Notifications] New notification received:', notification);
    
    // Add new notification to the top of the list
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.notification_id === notification.notification_id);
      if (exists) return prev;
      
      return [notification, ...prev];
    });

    // Show success message
    message.info({
      content: 'Bạn có thông báo mới!',
      duration: 3
    });
  }, []);

  // Connect socket and subscribe to WebSocket events
  useEffect(() => {
    let unsubscribe = () => {};

    if (isAuthenticated && session?.access_token) {
      // Connect socket first
      const socket = connectSocket(session.access_token);
      
      // Then subscribe to events (subscribeToNotifications handles waiting for connection)
      unsubscribe = subscribeToNotifications(handleNewNotification, null);
      
      // Check connection status
      const checkConnection = () => {
        const socket = getSocket();
        setIsConnected(socket?.connected || false);
      };
      checkConnection();
      const interval = setInterval(checkConnection, 5000);
      
      return () => {
        clearInterval(interval);
        unsubscribe();
      };
    }

    return () => unsubscribe();
  }, [isAuthenticated, session, handleNewNotification]);

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

  const handleMarkAsRead = async (id, e) => {
    if (e) {
      e.stopPropagation();
    }
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

  const handleDelete = async (id, e) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.notification_id !== id));
      message.success('Đã xóa thông báo');
      // Close expanded view if deleting the expanded notification
      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Có lỗi xảy ra khi xóa');
    }
  };

  const handleToggleExpand = async (notification) => {
    const isExpanding = expandedId !== notification.notification_id;
    
    // Toggle expand
    setExpandedId(isExpanding ? notification.notification_id : null);
    
    // Mark as read when expanding an unread notification
    if (isExpanding && !notification.seen) {
      handleMarkAsRead(notification.notification_id);
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

  // Truncate text for preview
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.seen) 
    : notifications;

  const unreadCount = notifications.filter(n => !n.seen).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Using shared component */}
          <UserSidebar />

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
                  filteredNotifications.map((notification) => {
                    const isExpanded = expandedId === notification.notification_id;
                    const hasTitle = notification.title && notification.title.trim();
                    const displayTitle = hasTitle ? notification.title : 'Thông báo hệ thống';
                    
                    return (
                      <div 
                        key={notification.notification_id} 
                        className={`transition-all duration-200 cursor-pointer ${
                          !notification.seen ? 'bg-blue-50/50' : 'bg-white'
                        } hover:bg-gray-50`}
                        onClick={() => handleToggleExpand(notification)}
                      >
                        {/* Collapsed View (Gmail-style) */}
                        <div className={`p-4 ${isExpanded ? 'border-b border-gray-100' : ''}`}>
                          <div className="flex items-center gap-4">
                            {/* Mail Icon */}
                            <div className={`p-2 rounded-full flex-shrink-0 ${
                              !notification.seen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {notification.seen ? (
                                <MailOpen className="w-5 h-5" />
                              ) : (
                                <Mail className="w-5 h-5" />
                              )}
                            </div>
                            
                            {/* Title and Preview */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className={`text-base truncate ${
                                  !notification.seen ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                                }`}>
                                  {displayTitle}
                                </h3>
                                {!notification.seen && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              {!isExpanded && notification.note && (
                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                  {truncateText(notification.note)}
                                </p>
                              )}
                            </div>

                            {/* Time and Actions */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                {formatDate(notification.created_at)}
                              </span>
                              
                              {/* Action buttons */}
                              <div className="flex items-center gap-1">
                                {!notification.seen && (
                                  <Tooltip title="Đánh dấu đã đọc">
                                    <button
                                      onClick={(e) => handleMarkAsRead(notification.notification_id, e)}
                                      className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  </Tooltip>
                                )}
                                <Tooltip title="Xóa thông báo">
                                  <button
                                    onClick={(e) => handleDelete(notification.notification_id, e)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded View (Full Content) */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pl-16 animate-fadeIn">
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                              {notification.note ? (
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                  {notification.note}
                                </p>
                              ) : (
                                <p className="text-gray-400 italic">Không có nội dung chi tiết.</p>
                              )}
                              
                              {/* Action buttons based on notification type */}
                              {notification.metadata?.job_id && (
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/jobs/${notification.metadata.job_id}`);
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                  >
                                    <Bell className="w-4 h-4" />
                                    Xem công việc & Ứng tuyển
                                  </button>
                                </div>
                              )}
                              
                              {/* Application status link */}
                              {notification.metadata?.application_id && (
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate('/user/applications');
                                    }}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                  >
                                    <Check className="w-4 h-4" />
                                    Xem trạng thái ứng tuyển
                                  </button>
                                </div>
                              )}

                              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {formatDate(notification.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

