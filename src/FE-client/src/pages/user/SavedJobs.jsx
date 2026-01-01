/**
 * SavedJobs Page
 * Display all saved jobs for the current user
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  FileText, 
  Briefcase, 
  Bell, 
  Settings,
  Heart,
  Bookmark,
  MapPin,
  Building,
  DollarSign,
  Clock,
  Trash2,
  ExternalLink,
  Loader2,
  Search
} from 'lucide-react';
import { message } from 'antd';
import savedService from '../../services/savedService';

function SavedJobs() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Sidebar menu items
  const menuItems = [
    { icon: User, label: 'Tổng quan', path: '/user/overview' },
    { icon: FileText, label: 'Hồ sơ của tôi', path: '/user/profile' },
    { icon: FileText, label: 'Quản lý CV', path: '/user/resumes' },
    { icon: Briefcase, label: 'Việc làm của tôi', path: '/user/my-jobs' },
    { icon: Bookmark, label: 'Việc làm đã lưu', path: '/user/saved-jobs', active: true },
    { icon: Bell, label: 'Thông báo việc làm', path: '/user/job-notifications' },
    { icon: Settings, label: 'Quản lý tài khoản', path: '/user/account' },
  ];

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      const response = await savedService.getSavedJobs({ page: 1, limit: 20 });
      if (response.success) {
        setSavedJobs(response.data || []);
        setHasMore(response.pagination?.hasMore || false);
      }
    } catch (error) {
      console.error('Error loading saved jobs:', error);
      message.error('Không thể tải danh sách việc làm đã lưu');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId) => {
    try {
      await savedService.unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(item => item.job_id !== jobId));
      message.success('Đã bỏ lưu việc làm');
    } catch (error) {
      console.error('Error unsaving job:', error);
      message.error('Không thể bỏ lưu việc làm');
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const format = (num) => new Intl.NumberFormat('vi-VN').format(num);
    if (min && max) return `${format(min)} - ${format(max)} đ`;
    if (min) return `Từ ${format(min)} đ`;
    return `Đến ${format(max)} đ`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Filter saved jobs
  const filteredJobs = savedJobs.filter(item => {
    if (!searchTerm) return true;
    const job = item.job || item;
    return job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user?.name || 'Người dùng'}</p>
                    <p className="text-sm text-blue-100">Người tìm việc</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Việc làm đã lưu</h1>
                <p className="text-gray-600 mt-1">Quản lý các việc làm bạn quan tâm</p>
              </div>
              <Link
                to="/user/saved-searches"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Search className="w-4 h-4" />
                Tìm kiếm đã lưu
              </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm trong việc làm đã lưu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'Không tìm thấy việc làm' : 'Chưa lưu việc làm nào'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Thử thay đổi từ khóa tìm kiếm'
                    : 'Lưu các việc làm bạn quan tâm để xem lại sau'}
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Briefcase className="w-5 h-5" />
                  Tìm việc làm
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((item) => {
                  const job = item.job || item;
                  return (
                    <div
                      key={item.saved_job_id || job.job_id}
                      className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
                    >
                      <div className="flex gap-4">
                        {/* Company Logo */}
                        <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {job.company_logo ? (
                            <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
                          ) : (
                            <Building className="w-7 h-7 text-gray-400" />
                          )}
                        </div>

                        {/* Job Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link
                                to={`/jobs/${job.job_id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                              >
                                {job.title}
                              </Link>
                              <p className="text-blue-600 font-medium">{job.company_name}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUnsaveJob(job.job_id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Bỏ lưu"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                              <Link
                                to={`/jobs/${job.job_id}`}
                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Xem chi tiết"
                              >
                                <ExternalLink className="w-5 h-5" />
                              </Link>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {job.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              {formatSalary(job.salary_min, job.salary_max)}
                            </span>
                            {item.saved_at && (
                              <span className="flex items-center gap-1 text-gray-400">
                                <Clock className="w-4 h-4" />
                                Đã lưu {formatDate(item.saved_at)}
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            {job.job_type && (
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                                {job.job_type}
                              </span>
                            )}
                            {job.experience_level && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                                {job.experience_level}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Stats */}
            {!loading && savedJobs.length > 0 && (
              <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-100">
                <p className="text-sm text-pink-700">
                  Bạn đã lưu <strong>{savedJobs.length}</strong> việc làm
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default SavedJobs;
