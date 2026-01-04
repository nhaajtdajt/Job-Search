import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus, 
  AlertCircle,
  Percent
} from 'lucide-react';
import { message } from 'antd';

// Components
import StatCard from '../../components/employer/StatCard';
import RecentApplications from '../../components/employer/RecentApplications';
import QuickActions from '../../components/employer/QuickActions';
import JobStatusOverview from '../../components/employer/JobStatusOverview';
import TimeRangeFilter from '../../components/employer/TimeRangeFilter';
import EmployerSidebarResponsive from '../../components/employer/EmployerSidebarResponsive';

// Loading & Error Components
import { CardSkeleton, ChartSkeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';

// Chart Components
import ApplicationTrendChart from '../../components/employer/ApplicationTrendChart';
import JobComparisonChart from '../../components/employer/JobComparisonChart';
import ApplicationStatusChart from '../../components/employer/ApplicationStatusChart';

// Services
import { jobService } from '../../services/jobService';

/**
 * Employer Dashboard
 * Overview page with statistics, recent applications, job performance, and charts
 * Enhanced with time range filter, status breakdown, pending applications, and data visualizations
 */
export default function EmployerDashboard() {
  // State for dashboard statistics
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    expiredJobs: 0,
    draftJobs: 0,
    totalViews: 0,
    totalApplications: 0,
    pendingApplications: 0,
    conversionRate: 0,
  });
  
  // State for jobs list (for charts)
  const [jobsList, setJobsList] = useState([]);
  
  // State for time range filter
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const navigate = useNavigate();

  /**
   * Load dashboard data based on selected time range
   * Uses useCallback to prevent unnecessary re-renders
   */
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch jobs list for charts
      const jobsResponse = await jobService.getEmployerJobs({ limit: 100 });
      const jobs = jobsResponse?.data || jobsResponse || [];
      setJobsList(jobs);
      
      // Fetch dashboard stats
      const dashboardStats = await jobService.getDashboardStats({ timeRange });
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      message.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  // Load data when component mounts or timeRange changes
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /**
   * Handle time range change
   * Updates state which triggers data refetch via useEffect
   */
  const handleTimeRangeChange = useCallback((newRange) => {
    setTimeRange(newRange);
  }, []);

  /**
   * Navigate to pending applications
   */
  const handlePendingClick = useCallback(() => {
    navigate('/employer/applications?status=pending');
  }, [navigate]);

  // Main statistics cards configuration
  const mainStatCards = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      label: 'Tổng tin tuyển dụng',
      value: stats.totalJobs,
      change: `Trong ${timeRange === '7d' ? '7 ngày' : timeRange === '30d' ? '30 ngày' : '90 ngày'} qua`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      label: 'Tổng ứng viên',
      value: stats.totalApplications,
      change: 'Đã ứng tuyển',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      label: 'Tổng lượt xem',
      value: stats.totalViews,
      change: 'Lượt xem tin tuyển dụng',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <Percent className="w-8 h-8" />,
      label: 'Tỷ lệ chuyển đổi',
      value: `${stats.conversionRate}%`,
      change: 'Ứng tuyển / Lượt xem',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Responsive with mobile drawer */}
      <EmployerSidebarResponsive 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Dashboard Nhà tuyển dụng
                </h1>
                <p className="text-gray-600 mt-1">
                  Xin chào! Chào mừng trở lại với bảng điều khiển của bạn
                </p>
              </div>
            <div className="flex items-center gap-4">
              {/* Time Range Filter */}
              <TimeRangeFilter 
                value={timeRange} 
                onChange={handleTimeRangeChange}
                disabled={loading}
              />
              <Link
                to="/employer/jobs/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl btn-smooth transform hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5 transition-transform duration-200" />
                Đăng tin mới
              </Link>
            </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pending Applications Alert - Highlighted if > 0 */}
        {stats.pendingApplications > 0 && (
          <div 
            onClick={handlePendingClick}
            className="mb-6 p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-[1.02] card-smooth"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Ứng viên chờ xử lý</h3>
                  <p className="text-white/80 text-sm">Có {stats.pendingApplications} ứng viên đang chờ phản hồi của bạn</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{stats.pendingApplications}</span>
                <span className="text-white/80">→</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStatCards.map((stat, idx) => (
            <StatCard
              key={idx}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              color={stat.color}
              isLoading={loading}
            />
          ))}
        </div>

        {/* Job Status Overview */}
        <div className="mb-8">
          <JobStatusOverview 
            activeJobs={stats.activeJobs}
            expiredJobs={stats.expiredJobs}
            draftJobs={stats.draftJobs}
            isLoading={loading}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ApplicationTrendChart 
            jobs={jobsList} 
            timeRange={timeRange} 
            isLoading={loading} 
          />
          <JobComparisonChart 
            jobs={jobsList} 
            isLoading={loading} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recent Applications (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <RecentApplications limit={5} />
          </div>

          {/* Right Column - Quick Actions, Pipeline Chart & Tips */}
          <div className="space-y-6">
            {/* Application Status Chart (Donut) */}
            <ApplicationStatusChart 
              statusData={stats.statusBreakdown}
              totalApplications={stats.totalApplications}
              isLoading={loading}
            />
            
            <QuickActions />
            
            {/* Tips Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-md p-6 text-white">
              <h3 className="font-bold text-lg mb-3">💡 Mẹo tuyển dụng</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>• Phản hồi ứng viên trong 24h để tăng tỷ lệ thành công</li>
                <li>• Cập nhật tin tuyển dụng thường xuyên</li>
                <li>• Mô tả công việc chi tiết và rõ ràng</li>
                <li>• Đăng tin vào đầu tuần để tăng tiếp cận</li>
              </ul>
            </div>
            
            {/* Conversion Rate Info */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Hiệu suất tổng quan
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tỷ lệ chuyển đổi</span>
                  <span className={`font-bold ${stats.conversionRate >= 5 ? 'text-green-600' : stats.conversionRate >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {stats.conversionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${stats.conversionRate >= 5 ? 'bg-green-500' : stats.conversionRate >= 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(stats.conversionRate * 10, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  {stats.conversionRate >= 5 
                    ? '🎉 Tuyệt vời! Tỷ lệ chuyển đổi của bạn rất tốt.' 
                    : stats.conversionRate >= 2 
                      ? '👍 Tốt! Có thể cải thiện thêm.'
                      : '💪 Hãy cải thiện mô tả công việc để thu hút thêm ứng viên.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
