import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { message } from 'antd';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';
import { 
  connectSocket, 
  disconnectSocket, 
  subscribeToNotifications 
} from '../../services/socketService';

export default function NotificationBell() {
  const { isAuthenticated, session } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Load initial unread count
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      const count = response.data?.count || 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  }, []);

  // Handle new notification from WebSocket
  const handleNewNotification = useCallback((notification) => {
    console.log('[NotificationBell] New notification received:', notification);
    
    // Show toast notification
    message.info({
      content: notification.title || notification.note || 'Bạn có thông báo mới!',
      duration: 4,
      onClick: () => navigate('/user/notifications')
    });

    // Animate bell
    setHasNewNotification(true);
    setTimeout(() => setHasNewNotification(false), 2000);
  }, [navigate]);

  // Handle count update from WebSocket
  const handleCountUpdate = useCallback((count) => {
    console.log('[NotificationBell] Count updated:', count);
    setUnreadCount(count);
  }, []);

  // Connect to WebSocket when authenticated
  useEffect(() => {
    if (isAuthenticated && session?.access_token) {
      // Connect to WebSocket
      connectSocket(session.access_token);
      
      // Subscribe to notification events
      const unsubscribe = subscribeToNotifications(
        handleNewNotification,
        handleCountUpdate
      );

      // Load initial count
      loadUnreadCount();

      // Cleanup on unmount
      return () => {
        unsubscribe();
      };
    } else {
      // Disconnect when not authenticated
      disconnectSocket();
    }
  }, [isAuthenticated, session, loadUnreadCount, handleNewNotification, handleCountUpdate]);

  // Fallback polling (every 60 seconds) as backup
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(loadUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, loadUnreadCount]);

  const handleClick = () => {
    navigate('/user/notifications');
  };

  if (!isAuthenticated) return null;

  return (
    <button 
      onClick={handleClick}
      className={`relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors ${
        hasNewNotification ? 'animate-bounce' : ''
      }`}
      title="Thông báo"
    >
      <Bell className={`w-6 h-6 ${hasNewNotification ? 'text-blue-500' : ''}`} />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
