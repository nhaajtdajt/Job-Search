import { memo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Search, 
  Bell,
  BookmarkX,
  Inbox,
  FolderOpen,
  Plus
} from 'lucide-react';

/**
 * EmptyState Component
 * Enhanced empty state with illustrations, actions, and tips
 */
export const EmptyState = memo(function EmptyState({
  variant = 'default', // jobs, applications, notifications, search, saved, documents
  title = 'Không có dữ liệu',
  description = 'Chưa có nội dung để hiển thị.',
  actionLabel = null,
  actionLink = null,
  onAction = null,
  tips = [],
  className = ''
}) {
  // Variant configurations with icons and colors
  const variants = {
    default: {
      icon: FolderOpen,
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-400',
      illustration: null
    },
    jobs: {
      icon: Briefcase,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
      defaultTitle: 'Chưa có tin tuyển dụng',
      defaultDescription: 'Tạo tin tuyển dụng đầu tiên để bắt đầu thu hút ứng viên.',
      defaultAction: 'Tạo tin mới',
      defaultActionLink: '/employer/jobs/create'
    },
    applications: {
      icon: Users,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      defaultTitle: 'Chưa có ứng viên',
      defaultDescription: 'Các ứng viên ứng tuyển sẽ xuất hiện ở đây.',
      defaultAction: 'Xem tin tuyển dụng',
      defaultActionLink: '/employer/jobs'
    },
    notifications: {
      icon: Bell,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      defaultTitle: 'Không có thông báo mới',
      defaultDescription: 'Bạn đã xem hết tất cả thông báo.'
    },
    search: {
      icon: Search,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      defaultTitle: 'Không tìm thấy kết quả',
      defaultDescription: 'Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm lại.'
    },
    saved: {
      icon: BookmarkX,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      defaultTitle: 'Chưa lưu mục nào',
      defaultDescription: 'Các mục bạn lưu sẽ xuất hiện ở đây để truy cập nhanh.'
    },
    documents: {
      icon: FileText,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-500',
      defaultTitle: 'Chưa có tài liệu',
      defaultDescription: 'Tải lên tài liệu đầu tiên để bắt đầu.'
    },
    inbox: {
      icon: Inbox,
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
      defaultTitle: 'Hộp thư trống',
      defaultDescription: 'Không có tin nhắn mới.'
    }
  };

  const config = variants[variant] || variants.default;
  const Icon = config.icon;
  
  const finalTitle = title || config.defaultTitle || variants.default.defaultTitle;
  const finalDescription = description || config.defaultDescription || variants.default.defaultDescription;
  const finalActionLabel = actionLabel || config.defaultAction;
  const finalActionLink = actionLink || config.defaultActionLink;

  return (
    <div className={`text-center py-12 px-6 ${className}`}>
      {/* Icon with animated background */}
      <div className={`w-20 h-20 mx-auto mb-6 rounded-full ${config.iconBg} flex items-center justify-center relative`}>
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
        {/* Decorative rings */}
        <div className={`absolute inset-0 rounded-full ${config.iconBg} opacity-50 animate-ping`} style={{ animationDuration: '3s' }} />
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {finalTitle}
      </h3>
      
      {/* Description */}
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        {finalDescription}
      </p>
      
      {/* Action Button */}
      {(finalActionLabel && (finalActionLink || onAction)) && (
        finalActionLink ? (
          <Link
            to={finalActionLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {finalActionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            {finalActionLabel}
          </button>
        )
      )}
      
      {/* Tips Section */}
      {tips.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 max-w-md mx-auto text-left">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Mẹo:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            {tips.map((tip, idx) => (
              <li key={idx}>• {tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

/**
 * EmptyStateInline Component
 * Compact empty state for inline use (tables, lists)
 */
export const EmptyStateInline = memo(function EmptyStateInline({
  icon: CustomIcon = FolderOpen,
  message = 'Không có dữ liệu',
  actionLabel = null,
  onAction = null,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 text-center ${className}`}>
      <CustomIcon className="w-12 h-12 text-gray-300 mb-3" />
      <p className="text-gray-500 mb-3">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
});

export default EmptyState;
