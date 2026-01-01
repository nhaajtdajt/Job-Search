import { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Eye, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * JobStatsChart Component
 * Displays job views over time with trend analysis
 */
export default function JobStatsChart({ data = [], isLoading = false }) {
  // Calculate trend
  const trend = useMemo(() => {
    if (!data || data.length < 2) return { value: 0, isUp: true };
    
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint).reduce((sum, d) => sum + (d.views || 0), 0);
    const secondHalf = data.slice(midPoint).reduce((sum, d) => sum + (d.views || 0), 0);
    
    if (firstHalf === 0) return { value: 0, isUp: true };
    
    const change = ((secondHalf - firstHalf) / firstHalf) * 100;
    return { value: Math.abs(change).toFixed(1), isUp: change >= 0 };
  }, [data]);

  // Total views
  const totalViews = useMemo(() => {
    return data.reduce((sum, d) => sum + (d.views || 0), 0);
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-bold text-blue-600">
            {payload[0].value.toLocaleString()} lượt xem
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Lượt xem tin tuyển dụng</h3>
            <p className="text-sm text-gray-500">Theo thời gian</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
          <div className={`flex items-center gap-1 text-sm ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUp ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{trend.value}%</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#colorViews)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
