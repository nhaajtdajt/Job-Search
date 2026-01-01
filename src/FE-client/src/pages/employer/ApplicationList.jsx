import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, RefreshCw, Download, FileText, Clock, CheckCircle, XCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { message } from 'antd';

// Components
import ApplicationFilters from '../../components/employer/ApplicationFilters';
import ApplicationTable from '../../components/employer/ApplicationTable';

// Services
import applicationService from '../../services/applicationService';

// Utils
import { exportApplicationsToExcel } from '../../utils/exportUtils';

/**
 * ApplicationList Page
 * View all applications with filtering, sorting, and bulk actions
 */
export default function ApplicationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
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

  return (
    <div className="min-h-screen bg-gray-50">
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
      </div>
    </div>
  );
}
