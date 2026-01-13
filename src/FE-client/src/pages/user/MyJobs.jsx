import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import applicationService from '../../services/applicationService';
import { userService } from '../../services/user.service';
import { useNavigate, Link } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { 
  User, 
  FileText,
  Briefcase,
  Bell,
  Settings,
  Calendar,
  MapPin,
  X,
  Trash2
} from 'lucide-react';
import { message, Modal } from 'antd';

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

  const handleWithdrawApplication = async (applicationId, jobTitle) => {
    Modal.confirm({
      title: 'Xác nhận rút đơn ứng tuyển',
      content: `Bạn có chắc chắn muốn rút đơn ứng tuyển cho vị trí "${jobTitle}"? Hành động này không thể hoàn tác.`,
      okText: 'Rút đơn',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          setLoading(true);
          await applicationService.deleteApplication(applicationId);
          message.success('Đã rút đơn ứng tuyển thành công');
          // Reload applications
          const appsData = await applicationService.getUserApplications(1, 50);
          setApplications(appsData.data || []);
        } catch (error) {
          console.error('Error withdrawing application:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Không thể rút đơn ứng tuyển. Vui lòng thử lại.';
          message.error(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    });
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
        {applications.map((app) => {
          const canWithdraw = ['pending', 'reviewing'].includes(app.status?.toLowerCase());
          const jobTitle = app.job?.job_title || 'N/A';
          
          return (
            <div
              key={app.application_id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 card-smooth"
            >
              <div className="flex items-start justify-between">
                <Link
                  to={`/jobs/${app.job_id}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{jobTitle}</h3>
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
                </Link>
                {canWithdraw && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleWithdrawApplication(app.application_id, jobTitle);
                    }}
                    className="ml-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 flex items-center gap-2"
                    title="Rút đơn ứng tuyển"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Rút đơn</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
                      <span className="text-xs font-semibold">VND</span>
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
                  <span className="text-xs font-semibold">VND</span>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <UserSidebar />

          {/* Main Content */}
          <main className="flex-1">
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
          </main>
        </div>
      </div>
    </div>
  );
}

