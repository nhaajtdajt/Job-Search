import PropTypes from 'prop-types';

/**
 * StatCard Component
 * Reusable statistic card for dashboard overview
 */
export default function StatCard({ icon, label, value, change, color = 'from-blue-500 to-blue-600', isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border border-gray-100 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gray-200 w-14 h-14"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 card-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${color} text-white transition-transform duration-200 hover:scale-110`}>
          {icon}
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">
        {label}
      </h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">
        {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
      </p>
      {change && (
        <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>
          {change}
        </p>
      )}
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  change: PropTypes.string,
  color: PropTypes.string,
  isLoading: PropTypes.bool,
};
