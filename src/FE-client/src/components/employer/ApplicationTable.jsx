import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  User,
  CheckSquare,
  Square,
  Briefcase,
  Calendar,
  Download,
  FileText,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import ApplicationStatusUpdater from './ApplicationStatusUpdater';
import ConfirmModal from '../common/ConfirmModal';
import { formatRelativeTime } from '../../utils/dateUtils';
import { exportApplicationsToExcel } from '../../utils/exportUtils';

// Status icons mapping
const STATUS_ICONS = {
  pending: { icon: Clock, color: 'text-yellow-500' },
  reviewing: { icon: AlertCircle, color: 'text-blue-500' },
  shortlisted: { icon: CheckCircle, color: 'text-green-500' },
  interview: { icon: User, color: 'text-purple-500' },
  offer: { icon: FileText, color: 'text-indigo-500' },
  hired: { icon: CheckCircle, color: 'text-emerald-500' },
  rejected: { icon: XCircle, color: 'text-red-500' },
};

/**
 * ApplicationTable Component
 * Sortable table displaying applications with bulk actions
 */
export default function ApplicationTable({ 
  applications = [], 
  onStatusChange,
  onBulkAction,
  selectedIds = [],
  onSelectionChange,
  sortConfig = { key: 'applied_at', direction: 'desc' },
  onSortChange,
  isLoading = false,
  onExportCSV,
  onDownloadCVs
}) {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    title: '',
    message: ''
  });
  const [isExporting, setIsExporting] = useState(false);

  // Handle sort click
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'desc' ? 'asc' : 'desc';
    onSortChange?.({ key, direction });
  };

  // Get current page application IDs
  const currentPageIds = applications.map(app => app.application_id || app.id);
  
  // Check if all items on current page are selected
  const allCurrentPageSelected = currentPageIds.length > 0 && 
    currentPageIds.every(id => selectedIds.includes(id));
  
  // Check if some (but not all) items on current page are selected
  const someCurrentPageSelected = currentPageIds.some(id => selectedIds.includes(id)) && 
    !allCurrentPageSelected;

  // Handle select all on current page
  const handleSelectAll = () => {
    if (allCurrentPageSelected) {
      // Deselect all items on current page, keep other pages' selections
      onSelectionChange?.(selectedIds.filter(id => !currentPageIds.includes(id)));
    } else {
      // Add all current page items to selection
      const newIds = [...new Set([...selectedIds, ...currentPageIds])];
      onSelectionChange?.(newIds);
    }
  };

  // Handle single selection
  const handleSelect = (id) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  // Handle bulk action with confirmation for dangerous actions
  const handleBulkActionClick = (action) => {
    if (action === 'rejected') {
      setConfirmModal({
        isOpen: true,
        action,
        title: 'Xác nhận từ chối',
        message: `Bạn sắp từ chối ${selectedIds.length} ứng viên. Hành động này không thể hoàn tác.`
      });
    } else {
      onBulkAction?.(action);
    }
  };

  // Confirm dangerous action
  const handleConfirmAction = () => {
    if (confirmModal.action) {
      onBulkAction?.(confirmModal.action);
    }
    setConfirmModal({ isOpen: false, action: null, title: '', message: '' });
  };

  // Export selected applications to Excel
  const handleExportExcel = async () => {
    if (selectedIds.length === 0) {
      return;
    }
    
    setIsExporting(true);
    try {
      // Filter only selected applications
      const dataToExport = applications.filter(app => 
        selectedIds.includes(app.application_id || app.id)
      );
      
      if (dataToExport.length > 0) {
        exportApplicationsToExcel(dataToExport, 'ung_vien_da_chon');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Get avatar initials
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // Get avatar color based on name
  const getAvatarColor = (name) => {
    if (!name) return 'from-gray-400 to-gray-500';
    const colors = [
      'from-orange-400 to-red-500',
      'from-blue-400 to-indigo-500',
      'from-green-400 to-teal-500',
      'from-purple-400 to-pink-500',
      'from-yellow-400 to-orange-500',
      'from-cyan-400 to-blue-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Sort indicator component
  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-orange-500" />
      : <ChevronDown className="w-4 h-4 text-orange-500" />;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Skeleton Header */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-4 p-4">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
            <div className="flex-1"></div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
        {/* Skeleton Rows */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-40 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-28 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Sticky Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-0 z-30 mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full px-3 py-1">
                <span className="text-white font-medium">
                  {selectedIds.length} ứng viên đã chọn
                </span>
              </div>
              <button
                onClick={() => onSelectionChange?.([])}
                className="text-white/80 hover:text-white text-sm underline"
              >
                Bỏ chọn
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkActionClick('reviewing')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition flex items-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                Đang xem
              </button>
              <button
                onClick={() => handleBulkActionClick('shortlisted')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Duyệt
              </button>
              <button
                onClick={() => handleBulkActionClick('rejected')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                Từ chối
              </button>
              <div className="w-px h-6 bg-white/30 mx-2"></div>
              <button
                onClick={handleExportExcel}
                disabled={isExporting || selectedIds.length === 0}
                className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition flex items-center gap-1 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Đang xuất...' : `Xuất Excel (${selectedIds.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={handleSelectAll} className="p-1" title={allCurrentPageSelected ? 'Bỏ chọn trang này' : 'Chọn tất cả trang này'}>
                    {allCurrentPageSelected ? (
                      <CheckSquare className="w-5 h-5 text-orange-500" />
                    ) : someCurrentPageSelected ? (
                      <div className="w-5 h-5 border-2 border-orange-500 rounded flex items-center justify-center">
                        <div className="w-2.5 h-0.5 bg-orange-500"></div>
                      </div>
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </th>
                <th 
                  onClick={() => handleSort('applicant_name')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  <span className="flex items-center gap-1">
                    Ứng viên
                    <SortIndicator columnKey="applicant_name" />
                  </span>
                </th>
                <th 
                  onClick={() => handleSort('job_title')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                >
                  <span className="flex items-center gap-1">
                    Vị trí
                    <SortIndicator columnKey="job_title" />
                  </span>
                </th>
                <th 
                  onClick={() => handleSort('applied_at')}
                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
              >
                <span className="flex items-center gap-1">
                  Ngày ứng tuyển
                  <SortIndicator columnKey="applied_at" />
                </span>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Chưa có ứng viên nào
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Hiện tại chưa có ai ứng tuyển vào vị trí này. Hãy chia sẻ link tuyển dụng để thu hút ứng viên!
                      </p>
                      <div className="flex justify-center gap-3">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                          <Share2 className="w-4 h-4" />
                          Chia sẻ tin tuyển dụng
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const appId = app.application_id || app.id;
                  const isSelected = selectedIds.includes(appId);
                  const applicantName = app.user?.name || app.applicant_name || 'Ứng viên';
                  const StatusIcon = STATUS_ICONS[app.status]?.icon || Clock;
                  const statusColor = STATUS_ICONS[app.status]?.color || 'text-gray-500';
                  
                  return (
                    <tr 
                      key={appId} 
                      className={`hover:bg-gray-50 transition ${isSelected ? 'bg-orange-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <button onClick={() => handleSelect(appId)} className="p-1">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-orange-500" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar with initials */}
                          <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(applicantName)} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                            {getInitials(applicantName)}
                          </div>
                          <div>
                            <Link 
                              to={`/employer/applications/${appId}`}
                              className="font-medium text-gray-900 hover:text-orange-600 transition"
                            >
                              {applicantName}
                            </Link>
                            <p className="text-sm text-gray-500">
                              {app.user?.email || app.email || ''}
                            </p>
                            {/* Skills tags if available */}
                            {app.skills && app.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {app.skills.slice(0, 3).map((skill, idx) => (
                                  <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {skill}
                                  </span>
                                ))}
                                {app.skills.length > 3 && (
                                  <span className="text-xs text-gray-400">+{app.skills.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          {app.job?.job_title || app.job_title || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {formatRelativeTime(app.apply_date || app.applied_at)}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <ApplicationStatusUpdater
                          currentStatus={app.status}
                          onStatusChange={(status) => onStatusChange?.(appId, status)}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/employer/applications/${appId}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, title: '', message: '' })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Xác nhận"
        variant="danger"
      />
    </>
  );
}

ApplicationTable.propTypes = {
  applications: PropTypes.array,
  onStatusChange: PropTypes.func,
  onBulkAction: PropTypes.func,
  selectedIds: PropTypes.array,
  onSelectionChange: PropTypes.func,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc'])
  }),
  onSortChange: PropTypes.func,
  isLoading: PropTypes.bool,
  onExportCSV: PropTypes.func,
  onDownloadCVs: PropTypes.func,
};
