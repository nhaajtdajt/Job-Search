import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageTransition from '../components/common/PageTransition';
import {
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const menuItems = [
  {
    path: '/user/dashboard',
    label: 'Tổng quan',
    icon: <DashboardOutlined />
  },
  {
    path: '/user/profile',
    label: 'Hồ sơ cá nhân',
    icon: <UserOutlined />
  },
  {
    path: '/user/resumes',
    label: 'Quản lý CV',
    icon: <FileTextOutlined />
  },
  {
    path: '/user/applications',
    label: 'Việc làm đã ứng tuyển',
    icon: <FileTextOutlined />
  },
  {
    path: '/user/saved-jobs',
    label: 'Việc làm đã lưu',
    icon: <HeartOutlined />
  },
  {
    path: '/user/saved-searches',
    label: 'Tìm kiếm đã lưu',
    icon: <SearchOutlined />
  },
  {
    path: '/user/notifications',
    label: 'Thông báo',
    icon: <BellOutlined />
  },
  {
    path: '/user/settings',
    label: 'Cài đặt tài khoản',
    icon: <SettingOutlined />
  },
];

function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-20' : 'w-64'
          } bg-white shadow-lg transition-all duration-300 flex flex-col`}
      >
        {/* User Info */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.name || 'Người dùng'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {!collapsed && <span>Thu gọn</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogoutOutlined />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        <PageTransition animation="fade-slide" duration={450}>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
}

export default UserLayout;
