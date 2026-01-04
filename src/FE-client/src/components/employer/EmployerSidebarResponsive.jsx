import { useState, useEffect, useRef, memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  BarChart3,
  LayoutDashboard,
  Bell,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  Building2,
  User,
  Settings
} from 'lucide-react';
import notificationService from '../../services/notificationService';

/**
 * MobileDrawer Component
 * Slide-in sidebar drawer for mobile devices
 */
const MobileDrawer = memo(function MobileDrawer({ 
  isOpen, 
  onClose, 
  children 
}) {
  const drawerRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <aside 
        ref={drawerRef}
        className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        {children}
      </aside>
    </div>
  );
});

/**
 * EmployerSidebarResponsive Component
 * Responsive sidebar with mobile drawer support
 */
export default function EmployerSidebarResponsive({ 
  collapsed = false, 
  onToggle,
  className = ''
}) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    {
      label: 'Hồ sơ công ty',
      icon: <Building2 className="w-5 h-5" />,
      to: '/employer/company',
    },
    {
      label: 'Cài đặt',
      icon: <Settings className="w-5 h-5" />,
      to: '/employer/settings',
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const NavContent = ({ isMobile = false }) => (
    <>
      {/* Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b border-gray-100 ${isMobile ? 'pr-14' : ''}`}>
        {(!collapsed || isMobile) && (
          <span className="font-bold text-gray-800 text-lg">Quản lý</span>
        )}
        {!isMobile && (
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
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => isMobile && setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
              isActive(item.to, item.exact)
                ? 'bg-orange-50 text-orange-600 font-medium'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            title={collapsed && !isMobile ? item.label : undefined}
          >
            <span className={`relative ${isActive(item.to, item.exact) ? 'text-orange-600' : 'text-gray-500'}`}>
              {item.icon}
              {(collapsed && !isMobile) && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </span>
            {(!collapsed || isMobile) && (
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
    </>
  );

  return (
    <>
      {/* Mobile hamburger button - visible only on mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md lg:hidden border border-gray-200"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
        <NavContent isMobile={true} />
      </MobileDrawer>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } ${className}`}>
        <NavContent isMobile={false} />
      </aside>
    </>
  );
}

export { MobileDrawer };
