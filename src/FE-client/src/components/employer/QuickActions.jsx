import { Link } from 'react-router-dom';
import { Plus, FileText, Users, Building2, Settings } from 'lucide-react';

/**
 * QuickActions Component
 * Quick action buttons for employer dashboard
 */
export default function QuickActions() {
  const actions = [
    {
      icon: <Plus className="w-6 h-6" />,
      label: 'Đăng tin mới',
      description: 'Tạo tin tuyển dụng',
      to: '/employer/jobs/create',
      color: 'from-orange-500 to-red-500',
      hoverColor: 'from-orange-600 to-red-600',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: 'Tin tuyển dụng',
      description: 'Quản lý các tin đăng',
      to: '/employer/jobs',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Ứng viên',
      description: 'Xem danh sách ứng viên',
      to: '/employer/applications',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      label: 'Công ty',
      description: 'Cập nhật thông tin',
      to: '/employer/company',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Settings className="w-5 h-5 text-gray-500" />
        Thao tác nhanh
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, idx) => (
          <Link
            key={idx}
            to={action.to}
            className={`group p-4 rounded-xl bg-gradient-to-br ${action.color} hover:${action.hoverColor} text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition">
                {action.icon}
              </div>
              <div>
                <h3 className="font-semibold">{action.label}</h3>
                <p className="text-xs text-white/80">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
