import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

// Status configuration with colors and labels
const STATUS_CONFIG = {
  pending: { label: 'Chờ xử lý', color: '#f59e0b' },
  reviewing: { label: 'Đang xem xét', color: '#3b82f6' },
  shortlisted: { label: 'Đã chọn', color: '#10b981' },
  rejected: { label: 'Từ chối', color: '#ef4444' },
  hired: { label: 'Đã tuyển', color: '#8b5cf6' },
};

/**
 * ApplicationStatusChart Component
 * Donut chart showing application status pipeline
 */
export default function ApplicationStatusChart({ 
  statusData = null, 
  totalApplications = 0,
  isLoading = false 
}) {
  /**
   * Prepare chart data from status counts
   * If no real data, generate simulated data based on totalApplications
   */
  const chartData = useMemo(() => {
    if (statusData) {
      // Use real data if provided
      return Object.entries(statusData).map(([status, count]) => ({
        name: STATUS_CONFIG[status]?.label || status,
        value: count,
        color: STATUS_CONFIG[status]?.color || '#9ca3af',
      })).filter(item => item.value > 0);
    }
    
    // Simulate data based on totalApplications
    if (totalApplications === 0) return [];
    
    // Typical distribution: 30% pending, 25% reviewing, 20% shortlisted, 15% rejected, 10% hired
    const distribution = {
      pending: 0.30,
      reviewing: 0.25,
      shortlisted: 0.20,
      rejected: 0.15,
      hired: 0.10,
    };
    
    return Object.entries(distribution).map(([status, ratio]) => ({
      name: STATUS_CONFIG[status].label,
      value: Math.round(totalApplications * ratio),
      color: STATUS_CONFIG[status].color,
    })).filter(item => item.value > 0);
  }, [statusData, totalApplications]);

  // Calculate total for center text
  const total = useMemo(() => 
    chartData.reduce((sum, item) => sum + item.value, 0), 
    [chartData]
  );

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold" style={{ color: data.color }}>{data.name}</p>
          <p className="text-sm text-gray-700">{data.value} ứng viên ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="h-48 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <PieIcon className="w-5 h-5 text-orange-500" />
        Pipeline ứng viên
      </h3>
      
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-gray-500">
          Chưa có dữ liệu ứng viên
        </div>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-2xl font-bold text-gray-900">{total}</p>
            <p className="text-xs text-gray-500">Tổng UV</p>
          </div>
        </div>
      )}
      
      {/* Quick stats */}
      {chartData.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Chờ xử lý:</span>
              <span className="font-semibold text-yellow-600">
                {chartData.find(d => d.name === 'Chờ xử lý')?.value || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đã tuyển:</span>
              <span className="font-semibold text-purple-600">
                {chartData.find(d => d.name === 'Đã tuyển')?.value || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ApplicationStatusChart.propTypes = {
  statusData: PropTypes.object,
  totalApplications: PropTypes.number,
  isLoading: PropTypes.bool,
};
