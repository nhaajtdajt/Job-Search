import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { message } from 'antd';
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  LayoutDashboard,
} from 'lucide-react';

export default function EmployerUserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      setIsOpen(false);
      await logout();
      message.success('Đăng xuất thành công!', 2);
      await new Promise(resolve => setTimeout(resolve, 200));
      navigate('/employer');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Có lỗi xảy ra khi đăng xuất', 2);
      setTimeout(() => {
        navigate('/employer');
      }, 2000);
    }
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
      to: '/employer/dashboard',
    },
    {
      label: 'Hồ Sơ Cá Nhân',
      icon: <User className="w-4 h-4" />,
      to: '/employer/profile',
    },
    {
      label: 'Thông Tin Công Ty',
      icon: <Building2 className="w-4 h-4" />,
      to: '/employer/company',
    },
    {
      label: 'Cài Đặt',
      icon: <Settings className="w-4 h-4" />,
      to: '/employer/settings',
      divider: true,
    },
    {
      label: 'Đăng xuất',
      icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
    },
  ];

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name || user.email}
            className="w-8 h-8 rounded-full object-cover border-2 border-white/30 transition-all duration-200 hover:border-white/50 hover:shadow-md"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white/30 transition-all duration-200 hover:bg-orange-600 hover:border-white/50 hover:shadow-md">
            <User className="w-5 h-5 text-white transition-transform duration-200 hover:scale-110" />
          </div>
        )}
        <span className="text-sm font-semibold text-gray-800 hidden sm:block transition-colors duration-200 hover:text-gray-900">
          {user.name || user.email?.split('@')[0]}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-800 hidden sm:block transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
          style={{
            animation: 'dropdownFadeIn 0.3s ease-out'
          }}
        >
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 transition-colors duration-200">
              {user.name || 'Nhà tuyển dụng'}
            </p>
            <p className="text-xs text-gray-500 mt-1 transition-colors duration-200">{user.email}</p>
            <Link
              to="/employer/profile"
              className="mt-3 inline-block w-full text-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg active:scale-95"
              onClick={() => setIsOpen(false)}
            >
              Cập nhật hồ sơ
            </Link>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.divider && <div className="border-t border-gray-200 my-1" />}
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 ease-in-out transform hover:translate-x-1 group"
                  >
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="transition-all duration-200">{item.label}</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 ease-in-out transform hover:translate-x-1 group text-left"
                  >
                    <span className="transition-transform duration-200 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="transition-all duration-200">{item.label}</span>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-200">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-700 transition-all duration-200 ease-in-out hover:underline"
            >
              Trợ giúp & Hỗ trợ
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
