import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Filter, X, Search, Bookmark, BookmarkCheck, Briefcase } from 'lucide-react';
import { jobService } from '../../services/jobService';

// Status options for filtering
const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái', shortLabel: 'Tất cả' },
  { value: 'pending', label: 'Chờ xử lý', shortLabel: 'Mới' },
  { value: 'reviewing', label: 'Đang xem xét', shortLabel: 'Đang xem' },
  { value: 'shortlisted', label: 'Duyệt', shortLabel: 'Duyệt' },
  { value: 'interview', label: 'Phỏng vấn', shortLabel: 'Phỏng vấn' },
  { value: 'offer', label: 'Đã đề nghị', shortLabel: 'Đề nghị' },
  { value: 'hired', label: 'Đã tuyển', shortLabel: 'Đã tuyển' },
  { value: 'rejected', label: 'Từ chối', shortLabel: 'Từ chối' },
];

// Status tab colors
const STATUS_TAB_COLORS = {
  '': 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  pending: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  reviewing: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  shortlisted: 'bg-green-100 text-green-700 hover:bg-green-200',
  interview: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  offer: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  hired: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  rejected: 'bg-red-100 text-red-700 hover:bg-red-200',
};

const STATUS_TAB_ACTIVE_COLORS = {
  '': 'bg-gray-700 text-white',
  pending: 'bg-yellow-500 text-white',
  reviewing: 'bg-blue-500 text-white',
  shortlisted: 'bg-green-500 text-white',
  interview: 'bg-purple-500 text-white',
  offer: 'bg-indigo-500 text-white',
  hired: 'bg-emerald-500 text-white',
  rejected: 'bg-red-500 text-white',
};

// Date range options
const DATE_OPTIONS = [
  { value: '', label: 'Tất cả thời gian' },
  { value: '7d', label: '7 ngày qua' },
  { value: '30d', label: '30 ngày qua' },
  { value: '90d', label: '90 ngày qua' },
];

// Preset filters for quick access
const PRESET_FILTERS = [
  { id: 'new_7d', name: 'Ứng viên mới 7 ngày', filters: { status: 'pending', date_range: '7d' } },
  { id: 'not_reviewed', name: 'Chưa xem xét', filters: { status: 'pending' } },
  { id: 'shortlisted', name: 'Danh sách ngắn', filters: { status: 'shortlisted' } },
];

// Local storage key for saved filters
const SAVED_FILTERS_KEY = 'employer_saved_filters';

/**
 * ApplicationFilters Component
 * Filters for application list (job, status, date, search)
 */
export default function ApplicationFilters({ 
  filters = {}, 
  onFilterChange, 
  onReset,
  showJobFilter = true,
  selectedJobInfo = null, // { id, title, count }
  onClearJobFilter
}) {
  const [jobs, setJobs] = useState([]);
  const [localFilters, setLocalFilters] = useState({
    search: '',
    job_id: '',
    status: '',
    date_range: '',
    ...filters
  });
  const [savedFilters, setSavedFilters] = useState([]);
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

  // Load employer's jobs for filter dropdown
  useEffect(() => {
    if (showJobFilter) {
      loadJobs();
    }
  }, [showJobFilter]);

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SAVED_FILTERS_KEY);
    if (saved) {
      try {
        setSavedFilters(JSON.parse(saved));
      } catch {
        setSavedFilters([]);
      }
    }
  }, []);

  const loadJobs = async () => {
    try {
      const response = await jobService.getEmployerJobs({ limit: 100 });
      const jobsList = response?.data || response || [];
      setJobs(jobsList);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  // Update local filter and notify parent
  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Reset all filters
  const handleReset = () => {
    const resetFilters = { search: '', job_id: '', status: '', date_range: '' };
    setLocalFilters(resetFilters);
    onReset?.();
    onFilterChange(resetFilters);
  };

  // Apply preset filter
  const handleApplyPreset = (preset) => {
    const newFilters = { ...localFilters, ...preset.filters };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Apply saved filter
  const handleApplySavedFilter = (saved) => {
    const newFilters = { ...localFilters, ...saved.filters };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Save current filter
  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    
    const newSaved = {
      id: Date.now().toString(),
      name: newFilterName.trim(),
      filters: { ...localFilters }
    };
    
    const updated = [...savedFilters, newSaved];
    setSavedFilters(updated);
    localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(updated));
    setNewFilterName('');
    setShowSaveInput(false);
  };

  // Delete saved filter
  const handleDeleteSavedFilter = (filterId) => {
    const updated = savedFilters.filter(f => f.id !== filterId);
    setSavedFilters(updated);
    localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(updated));
  };

  // Check if any filter is active
  const hasActiveFilters = localFilters.search || localFilters.job_id || 
                           localFilters.status || localFilters.date_range;

  // Get selected job info from jobs list
  const getSelectedJobInfo = () => {
    if (selectedJobInfo) return selectedJobInfo;
    if (!localFilters.job_id) return null;
    const job = jobs.find(j => (j.job_id || j.id) == localFilters.job_id);
    return job ? { id: localFilters.job_id, title: job.job_title || job.title } : null;
  };

  const jobInfo = getSelectedJobInfo();

  return (
    <div className="space-y-4 mb-6">
      {/* Job Filter Badge */}
      {jobInfo && (
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-800 rounded-lg border border-orange-200">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium">Ứng viên cho: {jobInfo.title}</span>
            {jobInfo.count !== undefined && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                {jobInfo.count}
              </span>
            )}
            <button
              onClick={() => {
                handleFilterChange('job_id', '');
                onClearJobFilter?.();
              }}
              className="ml-1 p-0.5 hover:bg-orange-200 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Status Tabs - All options */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilterChange('status', option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              localFilters.status === option.value
                ? STATUS_TAB_ACTIVE_COLORS[option.value]
                : STATUS_TAB_COLORS[option.value]
            }`}
          >
            {option.shortLabel}
          </button>
        ))}
      </div>

      {/* Main Filters Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            Bộ lọc nâng cao
          </h3>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <>
                <button
                  onClick={() => setShowSaveInput(!showSaveInput)}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <Bookmark className="w-4 h-4" />
                  Lưu bộ lọc
                </button>
                <button
                  onClick={handleReset}
                  className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Xóa bộ lọc
                </button>
              </>
            )}
          </div>
        </div>

        {/* Save Filter Input */}
        {showSaveInput && (
          <div className="mb-4 flex gap-2">
            <input
              type="text"
              value={newFilterName}
              onChange={(e) => setNewFilterName(e.target.value)}
              placeholder="Tên bộ lọc..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSaveFilter}
              disabled={!newFilterName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Lưu
            </button>
            <button
              onClick={() => setShowSaveInput(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Hủy
            </button>
          </div>
        )}

        {/* Preset & Saved Filters */}
        {(PRESET_FILTERS.length > 0 || savedFilters.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 py-1">Bộ lọc nhanh:</span>
            {PRESET_FILTERS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition"
              >
                {preset.name}
              </button>
            ))}
            {savedFilters.map((saved) => (
              <div key={saved.id} className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full group">
                <BookmarkCheck className="w-3 h-3" />
                <button onClick={() => handleApplySavedFilter(saved)}>
                  {saved.name}
                </button>
                <button
                  onClick={() => handleDeleteSavedFilter(saved.id)}
                  className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-600 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search - Multi-field */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, kỹ năng..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
          
          {/* Job Filter */}
          {showJobFilter && !jobInfo && (
            <select
              value={localFilters.job_id}
              onChange={(e) => handleFilterChange('job_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            >
              <option value="">Tất cả tin tuyển dụng</option>
              {jobs.map((job) => (
                <option key={job.job_id || job.id} value={job.job_id || job.id}>
                  {job.job_title || job.title}
                </option>
              ))}
            </select>
          )}
          
          {/* Date Range Filter */}
          <select
            value={localFilters.date_range}
            onChange={(e) => handleFilterChange('date_range', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
          >
            {DATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

ApplicationFilters.propTypes = {
  filters: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  onReset: PropTypes.func,
  showJobFilter: PropTypes.bool,
  selectedJobInfo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    count: PropTypes.number,
  }),
  onClearJobFilter: PropTypes.func,
};

// Export constants for external use
export { STATUS_OPTIONS, DATE_OPTIONS, STATUS_TAB_COLORS, STATUS_TAB_ACTIVE_COLORS };
