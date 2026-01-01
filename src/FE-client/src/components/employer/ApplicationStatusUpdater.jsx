import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, Check, Loader2 } from 'lucide-react';

// Status configuration with colors and labels
const STATUS_CONFIG = {
  pending: { 
    label: 'Chờ xử lý', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dotColor: 'bg-yellow-500'
  },
  reviewing: { 
    label: 'Đang xem xét', 
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500'
  },
  shortlisted: { 
    label: 'Duyệt', 
    color: 'bg-green-100 text-green-700 border-green-200',
    dotColor: 'bg-green-500'
  },
  interview: { 
    label: 'Phỏng vấn', 
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    dotColor: 'bg-purple-500'
  },
  offer: { 
    label: 'Đề nghị', 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    dotColor: 'bg-indigo-500'
  },
  hired: { 
    label: 'Đã tuyển', 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500'
  },
  rejected: { 
    label: 'Từ chối', 
    color: 'bg-red-100 text-red-700 border-red-200',
    dotColor: 'bg-red-500'
  },
};

// Status flow order
const STATUS_ORDER = ['pending', 'reviewing', 'shortlisted', 'interview', 'offer', 'hired', 'rejected'];

/**
 * ApplicationStatusUpdater Component
 * Dropdown to update application status with visual feedback
 */
export default function ApplicationStatusUpdater({ 
  currentStatus = 'pending', 
  onStatusChange,
  disabled = false,
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const currentConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.pending;

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const handleStatusSelect = async (newStatus) => {
    if (newStatus === currentStatus || disabled) return;
    
    setIsUpdating(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsUpdating(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || isUpdating}
        className={`
          inline-flex items-center gap-2 rounded-full border font-medium transition
          ${currentConfig.color}
          ${sizeClasses[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm'}
        `}
      >
        <span className={`w-2 h-2 rounded-full ${currentConfig.dotColor}`}></span>
        {currentConfig.label}
        {isUpdating ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* Dropdown */}
      {isOpen && !disabled && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
            {STATUS_ORDER.map((status) => {
              const config = STATUS_CONFIG[status];
              const isSelected = status === currentStatus;
              return (
                <button
                  key={status}
                  onClick={() => handleStatusSelect(status)}
                  className={`
                    w-full px-4 py-2 text-left text-sm flex items-center justify-between
                    ${isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'}
                    transition
                  `}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
                    {config.label}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-green-500" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

ApplicationStatusUpdater.propTypes = {
  currentStatus: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

// Export config for external use
export { STATUS_CONFIG, STATUS_ORDER };
