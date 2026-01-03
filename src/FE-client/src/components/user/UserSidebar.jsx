/**
 * UserSidebar Component
 * Unified sidebar navigation for all user pages
 */
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  FileText, 
  Briefcase, 
  Bell, 
  Settings,
  Bookmark,
  Search,
  BarChart3
} from 'lucide-react';

// Menu items configuration - Single source of truth
const menuItems = [
  { 
    icon: BarChart3, 
    label: 'Tổng quan', 
    path: '/user/dashboard',
    aliases: ['/user', '/user/overview'] // Also highlight for these paths
  },
  { 
    icon: FileText, 
    label: 'Hồ sơ của tôi', 
    path: '/user/profile' 
  },
  { 
    icon: FileText, 
    label: 'Quản lý CV', 
    path: '/user/resumes',
    aliases: ['/user/resumes/create'] // Highlight for child routes
  },
  { 
    icon: Briefcase, 
    label: 'Việc làm của tôi', 
    path: '/user/applications',
    aliases: ['/user/my-jobs'] // Legacy alias
  },
  { 
    icon: Bookmark, 
    label: 'Việc làm đã lưu', 
    path: '/user/saved-jobs' 
  },
  { 
    icon: Search, 
    label: 'Tìm kiếm đã lưu', 
    path: '/user/saved-searches' 
  },
  { 
    icon: Bell, 
    label: 'Thông báo', 
    path: '/user/notifications' 
  },
  { 
    icon: Bell, 
    label: 'Thông báo việc làm', 
    path: '/user/job-notifications' 
  },
  { 
    icon: Settings, 
    label: 'Quản lý tài khoản', 
    path: '/user/settings',
    aliases: ['/user/account', '/user/account-management'] // Legacy aliases
  },
];

export default function UserSidebar({ className = '', children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Check if current path matches menu item
  const isActive = (item) => {
    const currentPath = location.pathname;
    
    // Exact match
    if (currentPath === item.path) return true;
    
    // Check aliases
    if (item.aliases?.some(alias => currentPath === alias)) return true;
    
    // Check if current path starts with the menu path (for nested routes)
    if (currentPath.startsWith(item.path + '/')) return true;
    
    return false;
  };

  return (
    <aside className={`w-64 flex-shrink-0 ${className}`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
        {/* User Info Header */}
        <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img 
                  src={user.avatar_url} 
                  alt={user.name || 'User'} 
                  className="w-12 h-12 rounded-full object-cover" 
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">
                {user?.name || 'Người dùng'}
              </p>
              <p className="text-sm text-blue-100">Người tìm việc</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      {/* Custom widgets - rendered after the main sidebar card */}
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </aside>
  );
}

// Export menuItems for use in other components if needed
export { menuItems };
