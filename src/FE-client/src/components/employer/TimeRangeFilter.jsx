import PropTypes from 'prop-types';

/**
 * TimeRangeFilter Component
 * Button group for filtering dashboard data by time range
 */

// Time range options configuration
const TIME_RANGE_OPTIONS = [
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '90d', label: '90 ngày' },
];

export default function TimeRangeFilter({ value = '30d', onChange, disabled = false }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
      {TIME_RANGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={`
            px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
            ${value === option.value
              ? 'bg-white text-orange-600 shadow-sm border border-orange-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

TimeRangeFilter.propTypes = {
  value: PropTypes.oneOf(['7d', '30d', '90d']),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

// Export options for external use
export { TIME_RANGE_OPTIONS };
