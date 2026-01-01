import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../contexts/AuthContext';

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      // Optional: Poll for notifications every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      // response.data is { count: X } based on backend service
      const count = response.data?.count || 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  };

  const handleClick = () => {
    navigate('/user/notifications');
  };

  if (!isAuthenticated) return null;

  return (
    <button 
      onClick={handleClick}
      className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      title="Thông báo"
    >
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
}
