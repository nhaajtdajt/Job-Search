import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';

// Colors for bars
const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4'];

/**
 * JobComparisonChart Component
 * Bar chart comparing views and applications per job
 */
export default function JobComparisonChart({ jobs = [], isLoading = false }) {
  /**
   * Prepare chart data from jobs
   * Sorts by total engagement (views + applications)
   */
  const chartData = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    return jobs
      .map(job => ({
        name: (job.job_title || job.title || 'Không tên').substring(0, 20) + 
              ((job.job_title || job.title || '').length > 20 ? '...' : ''),
        fullName: job.job_title || job.title || 'Không tên',
        views: job.views || 0,
        applications: job.applications_count || 0,
      }))
      .sort((a, b) => (b.views + b.applications) - (a.views + a.applications))
      .slice(0, 6); // Top 6 jobs
  }, [jobs]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.fullName}</p>
          <p className="text-sm text-blue-600">Lượt xem: {data.views.toLocaleString()}</p>
          <p className="text-sm text-orange-600">Ứng tuyển: {data.applications.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-500" />
        So sánh hiệu quả tin tuyển dụng
      </h3>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chưa có dữ liệu để hiển thị
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart 
            data={chartData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={{ stroke: '#e0e0e0' }}
              allowDecimals={false}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={100}
              tick={{ fontSize: 11, fill: '#666' }}
              tickLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
            <Bar 
              dataKey="views" 
              name="Lượt xem" 
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-views-${index}`} fill={COLORS[index % COLORS.length]} opacity={0.7} />
              ))}
            </Bar>
            <Bar 
              dataKey="applications" 
              name="Ứng tuyển" 
              fill="#f97316"
              radius={[0, 4, 4, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-apps-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

JobComparisonChart.propTypes = {
  jobs: PropTypes.array,
  isLoading: PropTypes.bool,
};
