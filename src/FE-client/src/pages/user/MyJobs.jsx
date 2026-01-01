import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { applicationService } from '../../services/application.service';
import { userService } from '../../services/user.service';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  FileText,
  Briefcase,
  Bell,
  Settings,
  Calendar,
  MapPin,
  DollarSign,
  X
} from 'lucide-react';
import { message } from 'antd';

export default function MyJobs() {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('applications'); // applications, saved, viewed, invitations
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [viewedJobs, setViewedJobs] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated or if user is employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (authUser && authUser.role === 'employer') {
      navigate('/employer/dashboard', { replace: true });
    }
  }, [isAuthenticated, authUser, navigate]);

  // Load data based on active tab
  useEffect(() => {
    if (!isAuthenticated) return;

    const loadData = async () => {
      setLoading(true);
      try {
        switch (activeTab) {
          case 'applications':
            const appsData = await applicationService.getUserApplications(1, 50);
            setApplications(appsData.data || []);
            break;
          case 'saved':
            const savedData = await userService.getSavedJobs(1, 50);
            setSavedJobs(savedData.data || []);
            break;
          case 'viewed':
            // For now, use saved jobs as viewed jobs (since saved_jobs also tracks views)
            const viewedData = await userService.getSavedJobs(1, 50);
            setViewedJobs(viewedData.data || []);
            break;
          case 'invitations':
            // TODO: Implement when API is available
            setInvitations([]);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab, isAuthenticated]);

  const handleUnsaveJob = async (jobId) => {
    try {
      await userService.unsaveJob(jobId);
      message.success('Đã bỏ lưu việc làm');
      // Reload saved jobs
      const savedData = await userService.getSavedJobs(1, 50);
      setSavedJobs(savedData.data || []);
    } catch (error) {
      console.error('Error unsaving job:', error);
      message.error('Không thể bỏ lưu việc làm. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thương lượng';
    if (min && max) return `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} đ/tháng`;
    if (min) return `Từ ${min.toLocaleString('vi-VN')} đ/tháng`;
    if (max) return `Đến ${max.toLocaleString('vi-VN')} đ/tháng`;
    return 'Thương lượng';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { text: 'Chờ xử lý', class: 'bg-yellow-100 text-yellow-800' },
      reviewing: { text: 'Đang xem xét', class: 'bg-blue-100 text-blue-800' },
      accepted: { text: 'Đã chấp nhận', class: 'bg-green-100 text-green-800' },
      rejected: { text: 'Đã từ chối', class: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const renderApplications = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (applications.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Bạn chưa ứng tuyển vị trí nào</p>
          <Link
            to="/jobs"
            className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors duration-200"
          >
            Tìm việc làm phù hợp
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {applications.map((app) => (
            <Link
              key={app.application_id}
              to={`/jobs/${app.job_id}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer card-smooth"
            >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{app.job?.job_title || 'N/A'}</h3>
                  {getStatusBadge(app.status)}
                </div>
                {app.job?.job_type && (
                  <p className="text-sm text-gray-600 mb-2">
                    {app.job.job_type}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Ứng tuyển: {formatDate(app.apply_date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  const renderSavedJobs = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (savedJobs.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
            <Briefcase className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Bạn chưa lưu việc làm nào</p>
          <Link
            to="/jobs"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Tìm việc làm phù hợp
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {savedJobs.map((savedJob) => {
          const job = savedJob.job;
          if (!job) return null;
          
          return (
            <div
              key={savedJob.job_id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 card-smooth"
            >
              <div className="flex items-start justify-between">
                <Link to={`/jobs/${job.job_id}`} className="flex-1 cursor-pointer">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.job_title}</h3>
                  {job.location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {(job.salary_min || job.salary_max) && (
                    <div className="flex items-center gap-1 text-sm text-orange-600 mb-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Đã lưu: {formatDate(savedJob.saved_at)}</span>
                  </div>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleUnsaveJob(job.job_id);
                  }}
                  className="ml-4 text-gray-400 hover:text-red-600 transition"
                  title="Bỏ lưu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderViewedJobs = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (viewedJobs.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4">Bạn chưa xem việc làm nào</p>
          <Link
            to="/jobs"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Tìm việc làm phù hợp
          </Link>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {viewedJobs.map((viewedJob) => {
          const job = viewedJob.job;
          if (!job) return null;
          
          return (
            <Link
              key={viewedJob.job_id}
              to={`/jobs/${job.job_id}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 cursor-pointer card-smooth"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.job_title}</h3>
              {job.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
              )}
              {(job.salary_min || job.salary_max) && (
                <div className="flex items-center gap-1 text-sm text-orange-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Đã xem: {formatDate(viewedJob.saved_at)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    );
  };

  const renderInvitations = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="inline-block bg-gray-100 rounded-full p-6 mb-4">
          <Bell className="w-12 h-12 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-4">Bạn chưa có thư mời ứng tuyển nào</p>
        <Link
          to="/jobs"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Tìm việc làm phù hợp
        </Link>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                    {authUser?.avatar_url ? (
                      <img 
                        src={authUser.avatar_url} 
                        alt={authUser.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{authUser?.name || 'Chưa cập nhật tên'}</h3>
                <p className="text-sm text-blue-100">{authUser?.job_title || 'Chưa cập nhật chức danh'}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="p-2">
                <Link
                  to="/overview"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:translate-x-1 cursor-pointer link-smooth"
                >
                  <FileText className="w-5 h-5 transition-transform duration-200" />
                  <span>Tổng Quan</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:translate-x-1 cursor-pointer mt-1 link-smooth"
                >
                  <FileText className="w-5 h-5 transition-transform duration-200" />
                  <span>Hồ Sơ Của Tôi</span>
                </Link>
                <Link
                  to="/my-jobs"
                  className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium transition-all duration-200 hover:bg-blue-100 hover:translate-x-1 cursor-pointer mt-1 link-smooth"
                >
                  <Briefcase className="w-5 h-5 transition-transform duration-200" />
                  <span>Việc Làm Của Tôi</span>
                </Link>
                <Link
                  to="/job-notifications"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:translate-x-1 cursor-pointer mt-1 link-smooth"
                >
                  <Bell className="w-5 h-5 transition-transform duration-200" />
                  <span>Thông Báo Việc Làm</span>
                </Link>
                <Link
                  to="/account-management"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-50 hover:translate-x-1 cursor-pointer mt-1 link-smooth"
                >
                  <Settings className="w-5 h-5 transition-transform duration-200" />
                  <span>Quản Lý Tài Khoản</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 p-6 border-b border-gray-200">Việc Làm Của Tôi</h1>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-6 py-4 font-medium text-sm transition-all duration-200 cursor-pointer relative ${
                      activeTab === 'applications'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Việc đã ứng tuyển
                  </button>
                  <button
                    onClick={() => setActiveTab('saved')}
                    className={`px-6 py-4 font-medium text-sm transition-all duration-200 cursor-pointer relative ${
                      activeTab === 'saved'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Việc đã lưu
                  </button>
                  <button
                    onClick={() => setActiveTab('viewed')}
                    className={`px-6 py-4 font-medium text-sm transition-all duration-200 cursor-pointer relative ${
                      activeTab === 'viewed'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Việc làm đã xem
                  </button>
                  <button
                    onClick={() => setActiveTab('invitations')}
                    className={`px-6 py-4 font-medium text-sm transition-all duration-200 cursor-pointer relative ${
                      activeTab === 'invitations'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Thư mời ứng tuyển
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'applications' && renderApplications()}
                {activeTab === 'saved' && renderSavedJobs()}
                {activeTab === 'viewed' && renderViewedJobs()}
                {activeTab === 'invitations' && renderInvitations()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

