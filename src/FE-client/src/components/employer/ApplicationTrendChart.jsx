import { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

/**
 * ApplicationTrendChart Component
 * Line chart showing application/views trend over time
 */
export default function ApplicationTrendChart({ jobs = [], timeRange = '30d', isLoading = false }) {
  /**
   * Generate trend data based on jobs and timeRange
   * Groups data by day and calculates cumulative applications/views
   */
  const chartData = useMemo(() => {
    if (!jobs || jobs.length === 0) return [];

    // Calculate number of days based on timeRange
    const daysMap = { '7d': 7, '30d': 30, '90d': 90 };
    const days = daysMap[timeRange] || 30;
    
    // Generate date range
    const now = new Date();
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate applications and views for this day
      // In a real app, this would come from daily aggregated data
      // Here we simulate based on job creation dates
      let applications = 0;
      let views = 0;
      
      jobs.forEach(job => {
        const postedDate = job.posted_at ? new Date(job.posted_at).toISOString().split('T')[0] : null;
        if (postedDate && postedDate <= dateStr) {
          // Distribute applications/views across days since posting
          const daysSincePosted = Math.floor((date - new Date(job.posted_at)) / (1000 * 60 * 60 * 24));
          if (daysSincePosted >= 0 && daysSincePosted < 30) {
            // Simulate daily applications (decreasing over time)
            const dailyApps = Math.max(0, Math.floor((job.applications_count || 0) / 30 * (1 - daysSincePosted / 60)));
            const dailyViews = Math.max(0, Math.floor((job.views || 0) / 30 * (1 - daysSincePosted / 60)));
            applications += dailyApps;
            views += dailyViews;
          }
        }
      });
      
      data.push({
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        applications,
        views,
      });
    }
    
    return data;
  }, [jobs, timeRange]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        Xu hướng ứng tuyển & lượt xem
      </h3>
      
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chưa có dữ liệu để hiển thị
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#666' }}
              tickLine={{ stroke: '#e0e0e0' }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
            <Line 
              type="monotone" 
              dataKey="applications" 
              name="Ứng tuyển"
              stroke="#f97316" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#f97316' }}
              activeDot={{ r: 6, fill: '#f97316' }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              name="Lượt xem"
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

ApplicationTrendChart.propTypes = {
  jobs: PropTypes.array,
  timeRange: PropTypes.oneOf(['7d', '30d', '90d']),
  isLoading: PropTypes.bool,
};
