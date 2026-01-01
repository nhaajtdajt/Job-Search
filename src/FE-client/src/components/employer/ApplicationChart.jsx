import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { Users, ArrowRight } from 'lucide-react';

/**
 * ApplicationChart Component
 * Displays application funnel and conversion rates
 */
export default function ApplicationChart({ data = {}, isLoading = false }) {
  // Funnel data
  const funnelData = useMemo(() => {
    const stages = [
      { name: 'Ứng tuyển', value: data.total || 0, fill: '#3B82F6' },
      { name: 'Đang xem', value: data.reviewing || 0, fill: '#8B5CF6' },
      { name: 'Shortlist', value: data.shortlisted || 0, fill: '#F59E0B' },
      { name: 'Phỏng vấn', value: data.interviewing || 0, fill: '#10B981' },
      { name: 'Tuyển dụng', value: data.hired || 0, fill: '#22C55E' }
    ];
    return stages;
  }, [data]);

  // Conversion rates
  const conversionRates = useMemo(() => {
    const total = data.total || 0;
    if (total === 0) return [];

    return [
      {
        from: 'Ứng tuyển',
        to: 'Đang xem',
        rate: total > 0 ? ((data.reviewing || 0) / total * 100).toFixed(1) : 0
      },
      {
        from: 'Đang xem',
        to: 'Shortlist',
        rate: (data.reviewing || 0) > 0 ? ((data.shortlisted || 0) / (data.reviewing || 1) * 100).toFixed(1) : 0
      },
      {
        from: 'Shortlist',
        to: 'Tuyển dụng',
        rate: (data.shortlisted || 0) > 0 ? ((data.hired || 0) / (data.shortlisted || 1) * 100).toFixed(1) : 0
      }
    ];
  }, [data]);

  // Overall conversion rate
  const overallConversion = useMemo(() => {
    if (!data.total || data.total === 0) return 0;
    return ((data.hired || 0) / data.total * 100).toFixed(1);
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{payload[0].payload.name}</p>
          <p className="text-lg font-bold" style={{ color: payload[0].payload.fill }}>
            {payload[0].value} ứng viên
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
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Phễu tuyển dụng</h3>
            <p className="text-sm text-gray-500">Tỷ lệ chuyển đổi qua các giai đoạn</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600">{overallConversion}%</p>
          <p className="text-sm text-gray-500">Tỷ lệ tuyển dụng</p>
        </div>
      </div>

      {/* Funnel Chart */}
      <div className="h-48 mb-6">
        {funnelData.every(d => d.value === 0) ? (
          <div className="h-full flex items-center justify-center text-gray-400">
            Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ left: 20, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Conversion Rates */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Tỷ lệ chuyển đổi giữa các bước</p>
        <div className="grid grid-cols-3 gap-3">
          {conversionRates.map((rate, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                <span>{rate.from}</span>
                <ArrowRight className="w-3 h-3" />
                <span>{rate.to}</span>
              </div>
              <p className={`text-lg font-bold ${parseFloat(rate.rate) > 50 ? 'text-green-600' : parseFloat(rate.rate) > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                {rate.rate}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
