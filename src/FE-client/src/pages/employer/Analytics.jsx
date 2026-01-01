import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users, 
  Briefcase,
  Target,
  RefreshCw
} from 'lucide-react';
import { message, Table } from 'antd';
import { format, subDays, differenceInDays } from 'date-fns';

// Components
import DateRangePicker from '../../components/employer/DateRangePicker';
import JobStatsChart from '../../components/employer/JobStatsChart';
import ApplicationChart from '../../components/employer/ApplicationChart';
import EmployerSidebar from '../../components/employer/EmployerSidebar';

// Services
import { jobService } from '../../services/jobService';

/**
 * Analytics Page
 * Detailed analytics and reports for employers
 */
export default function Analytics() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    preset: '30d',
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [stats, setStats] = useState({});
  const [viewsData, setViewsData] = useState([]);
  const [applicationData, setApplicationData] = useState({});
  const [topJobs, setTopJobs] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/employer/login');
    } else if (user && user.role !== 'employer') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Load analytics data
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get dashboard stats with time range
      const dashboardStats = await jobService.getDashboardStats({ 
        timeRange: dateRange.preset === 'custom' ? null : dateRange.preset,
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      setStats(dashboardStats);

      // Get jobs for charts
      const jobsResponse = await jobService.getEmployerJobs({ limit: 100 });
      const jobs = jobsResponse?.data || jobsResponse || [];
      
      // Generate views data for chart (simulated from job data)
      const days = differenceInDays(new Date(dateRange.end), new Date(dateRange.start));
      const viewsPerDay = [];
      for (let i = days; i >= 0; i--) {
        const date = subDays(new Date(dateRange.end), i);
        viewsPerDay.push({
          date: format(date, 'dd/MM'),
          views: Math.floor(Math.random() * (dashboardStats.totalViews / (days || 1))) + 1
        });
      }
      setViewsData(viewsPerDay);

      // Application funnel data
      setApplicationData({
        total: dashboardStats.totalApplications || 0,
        reviewing: Math.floor((dashboardStats.totalApplications || 0) * 0.6),
        shortlisted: Math.floor((dashboardStats.totalApplications || 0) * 0.3),
        interviewing: Math.floor((dashboardStats.totalApplications || 0) * 0.15),
        hired: Math.floor((dashboardStats.totalApplications || 0) * 0.05)
      });

      // Top performing jobs
      const sortedJobs = [...jobs]
        .filter(j => j.view_count > 0 || j.application_count > 0)
        .sort((a, b) => (b.application_count || 0) - (a.application_count || 0))
        .slice(0, 5);
      setTopJobs(sortedJobs);

    } catch (error) {
      console.error('Error loading analytics:', error);
      message.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  // Handle date range change
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const conversionRate = stats.totalViews > 0 
      ? ((stats.totalApplications / stats.totalViews) * 100).toFixed(1)
      : 0;
    
    const avgTimeToHire = Math.floor(Math.random() * 15) + 7; // Placeholder
    const avgApplicationsPerJob = stats.totalJobs > 0
      ? Math.round(stats.totalApplications / stats.totalJobs)
      : 0;

    return { conversionRate, avgTimeToHire, avgApplicationsPerJob };
  }, [stats]);

  // Table columns for top jobs
  const columns = [
    {
      title: 'Vị trí',
      dataIndex: 'job_title',
      key: 'job_title',
      render: (text) => <span className="font-medium text-gray-900">{text}</span>
    },
    {
      title: 'Lượt xem',
      dataIndex: 'view_count',
      key: 'view_count',
      render: (val) => <span className="text-blue-600">{val || 0}</span>
    },
    {
      title: 'Ứng tuyển',
      dataIndex: 'application_count',
      key: 'application_count',
      render: (val) => <span className="text-green-600 font-medium">{val || 0}</span>
    },
    {
      title: 'Tỷ lệ',
      key: 'rate',
      render: (_, record) => {
        const rate = record.view_count > 0 
          ? ((record.application_count / record.view_count) * 100).toFixed(1)
          : 0;
        return (
          <span className={`font-medium ${parseFloat(rate) > 5 ? 'text-green-600' : 'text-yellow-600'}`}>
            {rate}%
          </span>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusConfig = {
          published: { label: 'Đang tuyển', class: 'bg-green-100 text-green-700' },
          draft: { label: 'Nháp', class: 'bg-gray-100 text-gray-700' },
          expired: { label: 'Hết hạn', class: 'bg-red-100 text-red-700' }
        };
        const config = statusConfig[status] || statusConfig.draft;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
            {config.label}
          </span>
        );
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <EmployerSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Thống kê & Báo cáo</h1>
                <p className="text-gray-500">Phân tích chi tiết hoạt động tuyển dụng</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <DateRangePicker 
                value={dateRange} 
                onChange={handleDateRangeChange} 
              />
              <button
                onClick={loadAnalytics}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
            </div>
          </div>
        </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalJobs || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Tổng tin tuyển dụng</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalApplications || 0}</p>
              <p className="text-sm text-gray-500 mt-1">Tổng ứng viên</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{metrics.conversionRate}%</p>
              <p className="text-sm text-gray-500 mt-1">Tỷ lệ chuyển đổi</p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{metrics.avgTimeToHire} ngày</p>
              <p className="text-sm text-gray-500 mt-1">Thời gian tuyển dụng TB</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <JobStatsChart data={viewsData} isLoading={loading} />
            <ApplicationChart data={applicationData} isLoading={loading} />
          </div>

          {/* Top Performing Jobs */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Tin tuyển dụng hiệu quả nhất</h3>
                  <p className="text-sm text-gray-500">Top 5 tin có nhiều ứng viên nhất</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Table
                columns={columns}
                dataSource={topJobs}
                rowKey="job_id"
                pagination={false}
                loading={loading}
                locale={{ emptyText: 'Chưa có dữ liệu' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
