import { Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  BarChart3,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import notificationService from '../../services/notificationService';

/**
 * EmployerSidebar Component
 * Sidebar navigation for employer dashboard pages
 */
export default function EmployerSidebar({ collapsed = false, onToggle }) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Load unread count
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response.data?.count || response.count || 0);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };

    loadUnreadCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const navItems = [
    {
      label: 'Tổng quan',
      icon: <LayoutDashboard className="w-5 h-5" />,
      to: '/employer/dashboard',
      exact: true
    },
    {
      label: 'Tin tuyển dụng',
      icon: <Briefcase className="w-5 h-5" />,
      to: '/employer/jobs',
    },
    {
      label: 'Ứng viên',
      icon: <Users className="w-5 h-5" />,
      to: '/employer/applications',
    },
    {
      label: 'Thông báo',
      icon: <Bell className="w-5 h-5" />,
      to: '/employer/notifications',
      badge: unreadCount > 0 ? unreadCount : null
    },
    {
      label: 'Thống kê & Báo cáo',
      icon: <BarChart3 className="w-5 h-5" />,
      to: '/employer/analytics',
    },
  ];

  // Check if current path matches
  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {!collapsed && (
          <span className="font-bold text-gray-800">Quản lý</span>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title={collapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              isActive(item.to, item.exact)
                ? 'bg-orange-50 text-orange-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <span className={`relative ${isActive(item.to, item.exact) ? 'text-orange-600' : 'text-gray-500'}`}>
              {item.icon}
              {/* Badge for collapsed state */}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </span>
            {!collapsed && (
              <span className="flex-1 flex items-center justify-between">
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

