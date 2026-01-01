import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Search, 
  SortAsc, 
  SortDesc, 
  Loader2,
  Heart,
  RefreshCw
} from 'lucide-react';
import { message, Input, Select, Empty, Pagination } from 'antd';
import CandidateCard from '../../components/employer/CandidateCard';
import savedCandidateService from '../../services/savedCandidateService';

/**
 * SavedCandidates Page
 * List and manage saved candidates for employers
 */
export default function SavedCandidates() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('saved_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  // Redirect if not authenticated or not employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/employer/login');
    } else if (user && user.role !== 'employer') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Load saved candidates
  const loadCandidates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await savedCandidateService.getSavedCandidates({
        page: pagination.page,
        limit: pagination.limit,
        search,
        sortBy,
        sortOrder
      });

      setCandidates(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }));
    } catch (error) {
      console.error('Error loading saved candidates:', error);
      message.error('Không thể tải danh sách ứng viên đã lưu');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, search, sortBy, sortOrder]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  // Handle unsave
  const handleUnsave = (userId) => {
    setCandidates(prev => prev.filter(c => c.user_id !== userId));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  // Handle update notes
  const handleUpdateNotes = (userId, notes) => {
    setCandidates(prev => prev.map(c => 
      c.user_id === userId ? { ...c, notes } : c
    ));
  };

  // Handle search
  const handleSearch = (value) => {
    setSearch(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Sort options
  const sortOptions = [
    { value: 'saved_at', label: 'Ngày lưu' },
    { value: 'name', label: 'Tên' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ứng viên đã lưu</h1>
                <p className="text-gray-500">Quản lý danh sách ứng viên tiềm năng</p>
              </div>
            </div>
            
            <button
              onClick={loadCandidates}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input.Search
                placeholder="Tìm kiếm theo tên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={handleSearch}
                allowClear
                size="large"
                prefix={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={sortOptions}
                className="w-32"
                size="large"
              />
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-5 h-5 text-gray-600" />
                ) : (
                  <SortDesc className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{pagination.total}</span> ứng viên
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12">
            <Empty
              image={<Users className="w-20 h-20 text-gray-300 mx-auto" />}
              description={
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Chưa có ứng viên nào được lưu
                  </p>
                  <p className="text-gray-500">
                    Lưu các ứng viên tiềm năng từ danh sách ứng tuyển để xem lại sau
                  </p>
                </div>
              }
            />
          </div>
        ) : (
          <>
            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.user_id}
                  candidate={candidate}
                  onUnsave={handleUnsave}
                  onUpdateNotes={handleUpdateNotes}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={pagination.page}
                  total={pagination.total}
                  pageSize={pagination.limit}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} ứng viên`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
