/**
 * ActivityChart Component
 * Interactive bar chart for user activity statistics
 */
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function ActivityChart({ data, className = '' }) {
  const navigate = useNavigate();
  const [hoveredBar, setHoveredBar] = useState(null);

  // Chart configuration
  const bars = [
    {
      key: 'applications',
      label: 'Việc đã ứng tuyển',
      value: data.applications || 0,
      color: 'bg-green-500',
      hoverColor: 'bg-green-600',
      link: '/user/applications',
    },
    {
      key: 'jobViews',
      label: 'Việc làm đã lưu',
      value: data.jobViews || data.saved_jobs || 0,
      color: 'bg-blue-500',
      hoverColor: 'bg-blue-600',
      link: '/user/saved-jobs',
    },
    {
      key: 'jobSearches',
      label: 'Tìm kiếm đã lưu',
      value: data.jobSearches || data.saved_searches || 0,
      color: 'bg-orange-500',
      hoverColor: 'bg-orange-600',
      link: '/user/saved-searches',
    },
  ];

  // Calculate max value for scaling
  const maxValue = Math.max(...bars.map(b => b.value), 1);
  const maxHeight = 180; // Maximum bar height in pixels
  const minHeight = 24; // Minimum bar height for visibility

  const getBarHeight = (value) => {
    if (value === 0) return minHeight;
    return Math.max(minHeight, (value / maxValue) * maxHeight);
  };

  const handleBarClick = (link) => {
    navigate(link);
  };

  return (
    <div className={`${className}`}>
      {/* Chart Area */}
      <div 
        className="h-56 flex items-end justify-center gap-8 mb-6 px-4"
        role="img"
        aria-label="Biểu đồ hoạt động của bạn"
      >
        {bars.map((bar, index) => (
          <div 
            key={bar.key}
            className="flex flex-col items-center gap-2 relative"
          >
            {/* Tooltip on hover */}
            {hoveredBar === bar.key && (
              <div 
                className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap animate-fadeIn z-10"
                role="tooltip"
              >
                {bar.label}: {bar.value}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
              </div>
            )}
            
            {/* Bar */}
            <button
              onClick={() => handleBarClick(bar.link)}
              onMouseEnter={() => setHoveredBar(bar.key)}
              onMouseLeave={() => setHoveredBar(null)}
              onFocus={() => setHoveredBar(bar.key)}
              onBlur={() => setHoveredBar(null)}
              className={`
                w-16 rounded-t-lg transition-all duration-300 cursor-pointer
                ${hoveredBar === bar.key ? bar.hoverColor : bar.color}
                hover:scale-105 focus-ring
              `}
              style={{ 
                height: `${getBarHeight(bar.value)}px`,
                animationDelay: `${index * 100}ms`
              }}
              aria-label={`${bar.label}: ${bar.value}. Nhấn để xem chi tiết.`}
            />
            
            {/* Value label */}
            <span 
              className={`
                text-sm font-medium transition-colors
                ${hoveredBar === bar.key ? 'text-gray-900' : 'text-gray-600'}
              `}
            >
              {bar.value}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        {bars.map(bar => (
          <button
            key={bar.key}
            onClick={() => handleBarClick(bar.link)}
            onMouseEnter={() => setHoveredBar(bar.key)}
            onMouseLeave={() => setHoveredBar(null)}
            className={`
              flex items-center gap-2 px-2 py-1 rounded transition-colors
              hover:bg-gray-100 focus-ring
              ${hoveredBar === bar.key ? 'bg-gray-100' : ''}
            `}
          >
            <div className={`w-3 h-3 rounded ${bar.color}`} />
            <span className="text-gray-700">{bar.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

ActivityChart.propTypes = {
  data: PropTypes.shape({
    applications: PropTypes.number,
    jobViews: PropTypes.number,
    saved_jobs: PropTypes.number,
    jobSearches: PropTypes.number,
    saved_searches: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
};
