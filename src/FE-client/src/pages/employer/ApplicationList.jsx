import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, RefreshCw, FileText, Clock, CheckCircle, XCircle, AlertCircle, FileSpreadsheet, Heart, Search, SortAsc, SortDesc, Loader2 } from 'lucide-react';
import { message, Input, Select, Empty, Pagination } from 'antd';

// Components
import ApplicationFilters from '../../components/employer/ApplicationFilters';
import ApplicationTable from '../../components/employer/ApplicationTable';
import EmployerSidebar from '../../components/employer/EmployerSidebar';
import CandidateCard from '../../components/employer/CandidateCard';

// Services
import applicationService from '../../services/applicationService';
import savedCandidateService from '../../services/savedCandidateService';

// Utils
import { exportApplicationsToExcel } from '../../utils/exportUtils';

/**
 * ApplicationList Page
 * View all applications with filtering, sorting, and bulk actions
 */
export default function ApplicationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('applications');
  
  // Ref to prevent double calls
  const isLoadingRef = useRef(false);
  
  // Initialize state from URL params
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    job_id: searchParams.get('job_id') || '',
    status: searchParams.get('status') || '',
    date_range: searchParams.get('date_range') || '',
  });
  
  // Initialize sort from URL
  const sortParam = searchParams.get('sort') || 'apply_date:desc';
  const [sortKey, sortDir] = sortParam.split(':');
  const [sortConfig, setSortConfig] = useState({
    key: sortKey || 'apply_date',
    direction: sortDir || 'desc'
  });
  
  // Initialize pagination from URL
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get('page')) || 1,
    limit: 20,
    total: 0
  });

  // Stats by status
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    shortlisted: 0,
    rejected: 0,
    hired: 0
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Saved Candidates state
  const [savedCandidates, setSavedCandidates] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);
  const [savedSearch, setSavedSearch] = useState('');
  const [savedSortBy, setSavedSortBy] = useState('saved_at');
  const [savedSortOrder, setSavedSortOrder] = useState('desc');
  const [savedPagination, setSavedPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  /**
   * Calculate stats from applications (or use API stats if available)
   */
  const calculateStats = useCallback((apps, response) => {
    // If API provides stats, use them
    if (response?.stats) {
      setStats(response.stats);
      return;
    }
    
    // Otherwise calculate from local data
    const newStats = {
      total: response?.total || apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      reviewing: apps.filter(a => a.status === 'reviewing').length,
      shortlisted: apps.filter(a => a.status === 'shortlisted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
      hired: apps.filter(a => a.status === 'hired').length
    };
    setStats(newStats);
  }, []);

  /**
   * Load applications with current filters and sorting
   * Uses ref lock to prevent double calls
   */
  const loadApplications = useCallback(async () => {
    // Prevent double calls
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sort: `${sortConfig.key}:${sortConfig.direction}`,
        ...filters
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      const response = await applicationService.getEmployerApplications(params);
      const appsList = response?.data || response || [];
      setApplications(Array.isArray(appsList) ? appsList : []);
      
      // Calculate stats
      calculateStats(Array.isArray(appsList) ? appsList : [], response);
      
      // Update pagination total from response
      if (response?.total !== undefined) {
        setPagination(prev => ({ ...prev, total: response.total }));
      } else if (response?.pagination?.total !== undefined) {
        setPagination(prev => ({ ...prev, total: response.pagination.total }));
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      message.error('Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [filters, sortConfig, pagination.page, pagination.limit, calculateStats]);

  // Load on mount and when dependencies change
  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // Sync URL params when filters, sort, or page changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    
    // Add pagination
    if (pagination.page > 1) {
      params.set('page', String(pagination.page));
    }
    
    // Add sort
    const sortStr = `${sortConfig.key}:${sortConfig.direction}`;
    if (sortStr !== 'apply_date:desc') {
      params.set('sort', sortStr);
    }
    
    setSearchParams(params, { replace: true });
  }, [filters, pagination.page, sortConfig, setSearchParams]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    setSelectedIds([]); // Clear selection
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (newSort) => {
    setSortConfig(newSort);
  };

  /**
   * Handle status change for single application
   */
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      message.success('Đã cập nhật trạng thái');
      // Update local state instead of refetching to avoid double calls
      setApplications(prev => prev.map(app => 
        (app.application_id === applicationId || app.id === applicationId)
          ? { ...app, status: newStatus }
          : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
    }
  };

  /**
   * Handle bulk action
   */
  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    
    try {
      await applicationService.bulkUpdateStatus(selectedIds, action);
      message.success(`Đã cập nhật ${selectedIds.length} ứng viên`);
      // Update local state
      setApplications(prev => prev.map(app => 
        selectedIds.includes(app.application_id || app.id)
          ? { ...app, status: action }
          : app
      ));
      setSelectedIds([]);
    } catch (error) {
      console.error('Error bulk updating:', error);
      message.error('Không thể thực hiện hành động');
    }
  };

  /**
   * Handle page change
   * Note: We preserve selected IDs across pages for bulk actions
   */
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    // Don't clear selection - preserve selected IDs across pages
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  // ========== SAVED CANDIDATES FUNCTIONS ==========
  
  const loadSavedCandidates = useCallback(async () => {
    try {
      setSavedLoading(true);
      const response = await savedCandidateService.getSavedCandidates({
        page: savedPagination.page,
        limit: savedPagination.limit,
        search: savedSearch,
        sortBy: savedSortBy,
        sortOrder: savedSortOrder
      });

      setSavedCandidates(response.data || []);
      setSavedPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0
      }));
    } catch (error) {
      console.error('Error loading saved candidates:', error);
      message.error('Không thể tải danh sách ứng viên đã lưu');
    } finally {
      setSavedLoading(false);
    }
  }, [savedPagination.page, savedPagination.limit, savedSearch, savedSortBy, savedSortOrder]);

  // Load saved candidates when tab changes
  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedCandidates();
    }
  }, [activeTab, loadSavedCandidates]);

  // Handle unsave
  const handleUnsave = (userId) => {
    setSavedCandidates(prev => prev.filter(c => c.user_id !== userId));
    setSavedPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  // Handle update notes
  const handleUpdateNotes = (userId, notes) => {
    setSavedCandidates(prev => prev.map(c => 
      c.user_id === userId ? { ...c, notes } : c
    ));
  };

  const savedSortOptions = [
    { value: 'saved_at', label: 'Ngày lưu' },
    { value: 'name', label: 'Tên' }
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-orange-500" />
                Quản lý ứng viên
              </h1>
              <p className="text-gray-600 mt-1">
                Xem và quản lý tất cả đơn ứng tuyển
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadApplications}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
              {selectedIds.length > 0 && (
                <button
                  onClick={() => {
                    const dataToExport = applications.filter(app => 
                      selectedIds.includes(app.application_id || app.id)
                    );
                    if (dataToExport.length > 0) {
                      exportApplicationsToExcel(dataToExport, 'ung_vien_da_chon');
                      message.success(`Đã xuất ${dataToExport.length} ứng viên ra file Excel`);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Xuất Excel ({selectedIds.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="mb-6 flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'applications'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tất cả ứng viên
              {stats.total > 0 && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                  {stats.total}
                </span>
              )}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === 'saved'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Ứng viên đã lưu
              {savedPagination.total > 0 && (
                <span className="px-2 py-0.5 bg-pink-100 text-pink-600 text-xs rounded-full">
                  {savedPagination.total}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'applications' ? (
          <>
            {/* Filters */}
            <ApplicationFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={() => handleFilterChange({ search: '', job_id: '', status: '', date_range: '' })}
            />

            {/* Stats Summary Cards */}
            <div className="mb-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.total || pagination.total}</p>
                    <p className="text-xs text-gray-500">Tổng cộng</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    <p className="text-xs text-gray-500">Chờ xử lý</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.reviewing}</p>
                    <p className="text-xs text-gray-500">Đang xem</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.shortlisted}</p>
                    <p className="text-xs text-gray-500">Duyệt</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">{stats.hired}</p>
                    <p className="text-xs text-gray-500">Đã tuyển</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    <p className="text-xs text-gray-500">Từ chối</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Active filters info */}
            {(filters.status || filters.date_range) && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                <span>Đang lọc:</span>
                {filters.status && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                    {filters.status}
                  </span>
                )}
                {filters.date_range && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                    {filters.date_range}
                  </span>
                )}
                {pagination.page > 1 && (
                  <span className="text-gray-400 ml-2">
                    Trang {pagination.page}/{totalPages}
                  </span>
                )}
              </div>
            )}

            {/* Application Table */}
            <ApplicationTable
              applications={applications}
              onStatusChange={handleStatusChange}
              onBulkAction={handleBulkAction}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              sortConfig={sortConfig}
              onSortChange={handleSortChange}
              isLoading={loading}
            />

            {/* Pagination */}
            {pagination.total > pagination.limit && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} / {pagination.total} ứng viên
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Trước
                  </button>
                  
                  {/* Page numbers */}
                  <div className="flex gap-1">
                    {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = idx + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = idx + 1;
                      } else if (pagination.page >= totalPages - 2) {
                        pageNum = totalPages - 4 + idx;
                      } else {
                        pageNum = pagination.page - 2 + idx;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 border rounded-lg text-sm ${
                            pagination.page === pageNum
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Saved Candidates Tab Content */
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <Input.Search
                    placeholder="Tìm kiếm theo tên..."
                    value={savedSearch}
                    onChange={(e) => setSavedSearch(e.target.value)}
                    onSearch={() => {
                      setSavedPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    allowClear
                    size="large"
                    prefix={<Search className="w-4 h-4 text-gray-400" />}
                  />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Select
                    value={savedSortBy}
                    onChange={setSavedSortBy}
                    options={savedSortOptions}
                    className="w-32"
                    size="large"
                  />
                  <button
                    onClick={() => setSavedSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="p-2.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                    title={savedSortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
                  >
                    {savedSortOrder === 'asc' ? (
                      <SortAsc className="w-5 h-5 text-gray-600" />
                    ) : (
                      <SortDesc className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={loadSavedCandidates}
                    disabled={savedLoading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${savedLoading ? 'animate-spin' : ''}`} />
                    Làm mới
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold text-gray-900">{savedPagination.total}</span> ứng viên đã lưu
              </p>
            </div>

            {/* Content */}
            {savedLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : savedCandidates.length === 0 ? (
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
                  {savedCandidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.user_id}
                      candidate={candidate}
                      onUnsave={handleUnsave}
                      onUpdateNotes={handleUpdateNotes}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {savedPagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      current={savedPagination.page}
                      total={savedPagination.total}
                      pageSize={savedPagination.limit}
                      onChange={(page) => setSavedPagination(prev => ({ ...prev, page }))}
                      showSizeChanger={false}
                      showTotal={(total, range) => `${range[0]}-${range[1]} / ${total} ứng viên`}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      </div>
    </div>
  );
}
