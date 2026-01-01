import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import JobStatusBadge from '../../components/employer/JobStatusBadge';
import JobActions from '../../components/employer/JobActions';
import { 
  Plus, 
  Search, 
  Filter,
  Briefcase,
  Eye,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { message, Modal } from 'antd';

export default function JobList() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    totalViews: 0,
    totalApplications: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (authLoading) return; // Don't redirect while loading
    if (!isAuthenticated) {
      navigate('/employer/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load jobs
  useEffect(() => {
    loadJobs();
  }, [pagination.page, statusFilter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const result = await jobService.getEmployerJobs(params);
      
      // Handle different response formats
      // Backend may return array directly, or { data: [], pagination: {} }
      let jobsList = [];
      if (Array.isArray(result)) {
        jobsList = result;
      } else if (result && Array.isArray(result.data)) {
        jobsList = result.data;
      } else if (result && Array.isArray(result.jobs)) {
        jobsList = result.jobs;
      }
      
      setJobs(jobsList);
      
      // Update pagination if available
      if (result && result.pagination) {
        setPagination(prev => ({
          ...prev,
          total: result.pagination.total || jobsList.length,
          totalPages: result.pagination.totalPages || 1,
        }));
      } else if (result && result.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          total: result.total || jobsList.length,
          totalPages: Math.ceil((result.total || jobsList.length) / pagination.limit),
        }));
      }

      // Calculate stats using status field
      setStats({
        total: jobsList.length,
        published: jobsList.filter(j => j.status === 'published').length,
        totalViews: jobsList.reduce((sum, j) => sum + (j.views || 0), 0),
        totalApplications: jobsList.reduce((sum, j) => sum + (j.applications_count || 0), 0),
      });
    } catch (error) {
      console.error('Error loading jobs:', error);
      message.error('Không thể tải danh sách tin tuyển dụng');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (jobId) => {
    try {
      await jobService.publishJob(jobId);
      message.success('Đã đăng tin tuyển dụng');
      loadJobs();
    } catch (error) {
      console.error('Error publishing job:', error);
      message.error(error.response?.data?.message || 'Không thể đăng tin');
    }
  };

  const handleExpire = async (jobId) => {
    try {
      await jobService.expireJob(jobId);
      message.success('Đã đóng tin tuyển dụng');
      loadJobs();
    } catch (error) {
      console.error('Error expiring job:', error);
      message.error(error.response?.data?.message || 'Không thể đóng tin');
    }
  };

  const handleDelete = async (jobId) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await jobService.deleteJob(jobId);
          message.success('Đã xóa tin tuyển dụng');
          loadJobs();
        } catch (error) {
          console.error('Error deleting job:', error);
          message.error(error.response?.data?.message || 'Không thể xóa tin');
        }
      },
    });
  };

  // Filter jobs - use job_title instead of title
  const filteredJobs = jobs.filter(job => 
    (job.job_title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tin tuyển dụng</h1>
            <p className="text-gray-600 mt-1">Quản lý tất cả tin tuyển dụng của bạn</p>
          </div>
          <Link
            to="/employer/jobs/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition"
          >
            <Plus className="w-5 h-5" />
            Tạo tin mới
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng tin</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Đang tuyển</p>
                <p className="text-2xl font-bold text-gray-900">{stats.published}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ứng viên</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="draft">Bản nháp</option>
                <option value="published">Đang tuyển</option>
                <option value="expired">Hết hạn</option>
                <option value="closed">Đã đóng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-visible">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lượt xem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ứng viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Chưa có tin tuyển dụng nào</p>
                      <Link
                        to="/employer/jobs/create"
                        className="inline-flex items-center gap-2 mt-4 text-orange-600 hover:text-orange-700 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Tạo tin đầu tiên
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job.job_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            to={`/employer/jobs/${job.job_id}/edit`}
                            className="text-sm font-medium text-gray-900 hover:text-orange-600"
                          >
                            {job.job_title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            {job.job_type || 'Chưa có loại hình'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <JobStatusBadge status={job.status || 'draft'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {job.views || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {job.applications_count || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {job.posted_at ? new Date(job.posted_at).toLocaleDateString('vi-VN') : 'Chưa đăng'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <JobActions
                          job={{...job, id: job.job_id}}
                          onPublish={() => handlePublish(job.job_id)}
                          onExpire={() => handleExpire(job.job_id)}
                          onDelete={() => handleDelete(job.job_id)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total} tin
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
