/**
 * ResumeStatusBadge Component
 * Displays status badge for resume (active, draft, etc.)
 */
import PropTypes from 'prop-types';

const statusConfig = {
  active: {
    label: 'Đang sử dụng',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    dotColor: 'bg-green-500',
  },
  draft: {
    label: 'Bản nháp',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    dotColor: 'bg-yellow-500',
  },
  archived: {
    label: 'Đã lưu trữ',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-600',
    dotColor: 'bg-gray-400',
  },
  default: {
    label: 'Mặc định',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    dotColor: 'bg-blue-500',
  },
};

function ResumeStatusBadge({ status = 'active', isDefault = false }) {
  // If this is the default resume, show default badge
  const config = isDefault ? statusConfig.default : (statusConfig[status] || statusConfig.active);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`}></span>
      {config.label}
    </span>
  );
}

ResumeStatusBadge.propTypes = {
  status: PropTypes.oneOf(['active', 'draft', 'archived']),
  isDefault: PropTypes.bool,
};

export default ResumeStatusBadge;
