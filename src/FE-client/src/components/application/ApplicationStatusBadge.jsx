/**
 * ApplicationStatusBadge Component
 * Displays application status with appropriate color and icon
 */
import PropTypes from 'prop-types';
import { 
  Clock, 
  Eye, 
  Star, 
  XCircle, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const STATUS_CONFIG = {
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  reviewing: {
    label: 'Đang xem xét',
    color: 'bg-blue-100 text-blue-800',
    icon: Eye,
  },
  shortlisted: {
    label: 'Được chọn',
    color: 'bg-purple-100 text-purple-800',
    icon: Star,
  },
  interview: {
    label: 'Phỏng vấn',
    color: 'bg-indigo-100 text-indigo-800',
    icon: AlertCircle,
  },
  offered: {
    label: 'Đã nhận offer',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  hired: {
    label: 'Đã tuyển',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Từ chối',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
  withdrawn: {
    label: 'Đã rút',
    color: 'bg-gray-100 text-gray-800',
    icon: XCircle,
  },
};

function ApplicationStatusBadge({ 
  status, 
  size = 'md',
  showIcon = true,
}) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Không xác định',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircle,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-sm',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${config.color} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}

ApplicationStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIcon: PropTypes.bool,
};

export default ApplicationStatusBadge;
