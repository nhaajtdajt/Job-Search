/**
 * ResumeList Page
 * Displays all resumes for the current user
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
  Plus,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { message } from 'antd';
import resumeService from '../../services/resumeService';
import ResumeCard from '../../components/resume/ResumeCard';

function ResumeList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sidebar menu items
  const menuItems = [
    { icon: User, label: 'Tổng quan', path: '/user/overview' },
    { icon: FileText, label: 'Hồ sơ của tôi', path: '/user/profile' },
    { icon: FileText, label: 'Quản lý CV', path: '/user/resumes', active: true },
    { icon: Briefcase, label: 'Việc làm của tôi', path: '/user/my-jobs' },
    { icon: Bell, label: 'Thông báo việc làm', path: '/user/job-notifications' },
    { icon: Settings, label: 'Quản lý tài khoản', path: '/user/account' },
  ];

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const response = await resumeService.getMyResumes();
      if (response.success) {
        setResumes(response.data || []);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
      message.error('Không thể tải danh sách CV');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      await resumeService.deleteResume(resumeId);
      message.success('Đã xóa CV thành công');
      setResumes(resumes.filter(r => r.resume_id !== resumeId));
    } catch (error) {
      console.error('Error deleting resume:', error);
      message.error('Không thể xóa CV');
    }
  };

  const handleSetDefault = async (resumeId) => {
    try {
      // TODO: Implement set default API
      message.success('Đã đặt làm CV mặc định');
      // Update local state
      setResumes(resumes.map(r => ({
        ...r,
        is_default: r.resume_id === resumeId
      })));
    } catch (error) {
      console.error('Error setting default resume:', error);
      message.error('Không thể đặt làm mặc định');
    }
  };

  // Filter and search resumes
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = !searchTerm || 
      resume.resume_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || resume.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* User Info */}
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img 
                        src={user.avatar_url} 
                        alt={user.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
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

              {/* Menu */}
              <nav className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
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
                <h1 className="text-2xl font-bold text-gray-900">Quản lý CV</h1>
                <p className="text-gray-600 mt-1">Quản lý và cập nhật các CV của bạn</p>
              </div>
              <Link
                to="/user/resumes/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Tạo CV mới
              </Link>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm CV..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang sử dụng</option>
                  <option value="draft">Bản nháp</option>
                  <option value="archived">Đã lưu trữ</option>
                </select>
              </div>
            </div>

            {/* Resume List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : filteredResumes.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Không tìm thấy CV' 
                    : 'Chưa có CV nào'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Thử thay đổi từ khóa hoặc bộ lọc'
                    : 'Tạo CV đầu tiên để bắt đầu ứng tuyển việc làm'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Link
                    to="/user/resumes/create"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Tạo CV mới
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredResumes.map((resume) => (
                  <ResumeCard
                    key={resume.resume_id}
                    resume={resume}
                    onDelete={handleDelete}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            )}

            {/* Stats */}
            {!loading && resumes.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-700">
                  Bạn có <strong>{resumes.length}</strong> CV • 
                  <strong> {resumes.filter(r => r.status === 'active').length}</strong> đang sử dụng
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ResumeList;
