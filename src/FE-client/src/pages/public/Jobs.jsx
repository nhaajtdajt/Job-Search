/**
 * Jobs Page - Enhanced
 * Job search page with advanced filters, pagination, and API integration
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal,
  Loader2,
  Briefcase,
  X,
  ArrowUpDown
} from 'lucide-react';
import { message } from 'antd';
import { jobService } from '../../services/jobService';
import JobListItem from '../../components/jobs/JobListItem';
import AdvancedFilters from '../../components/jobs/AdvancedFilters';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'salary_desc', label: 'Lương cao nhất' },
  { value: 'salary_asc', label: 'Lương thấp nhất' },
  { value: 'relevance', label: 'Phù hợp nhất' },
];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Search state
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [filters, setFilters] = useState({
    job_types: searchParams.getAll('type') || [],
    experience_levels: searchParams.getAll('exp') || [],
    salary_range: searchParams.get('salary') || '',
    is_remote: searchParams.get('remote') === 'true',
  });

  // Load jobs from API
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        search: keyword || undefined,
        location: location || undefined,
        sort: sortBy,
        job_type: filters.job_types.length > 0 ? filters.job_types[0] : undefined,
        is_remote: filters.is_remote || undefined,
      };

      // Handle salary range
      if (filters.salary_range) {
        const [min, max] = filters.salary_range.split('-');
        if (min) params.salary_min = parseInt(min) * 1000000;
        if (max && max !== '+') params.salary_max = parseInt(max) * 1000000;
      }

      const response = await jobService.getJobs(params);
      // Handle different response formats
      const jobsData = response?.data || response || [];
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setTotalJobs(response?.pagination?.total || response?.total || jobsData.length || 0);
      setTotalPages(response?.pagination?.totalPages || Math.ceil((response?.total || jobsData.length) / 10) || 1);
    } catch (error) {
      console.error('Error loading jobs:', error);
      message.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, location, sortBy, filters]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (location) params.set('location', location);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (filters.is_remote) params.set('remote', 'true');
    filters.job_types.forEach(type => params.append('type', type));
    filters.experience_levels.forEach(exp => params.append('exp', exp));
    if (filters.salary_range) params.set('salary', filters.salary_range);
    
    setSearchParams(params, { replace: true });
  }, [keyword, location, sortBy, filters, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadJobs();
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleClearSearch = () => {
    setKeyword('');
    setLocation('');
    setFilters({
      job_types: [],
      experience_levels: [],
      salary_range: '',
      is_remote: false,
    });
    setPage(1);
  };

  const activeFiltersCount = 
    filters.job_types.length +
    filters.experience_levels.length +
    (filters.salary_range ? 1 : 0) +
    (filters.is_remote ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Tìm việc làm phù hợp với bạn
          </h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Chức danh, kỹ năng, công ty..."
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 text-gray-900"
              />
            </div>
            <div className="md:w-64 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Địa điểm"
                className="w-full pl-12 pr-4 py-3.5 rounded-lg border-0 focus:ring-2 focus:ring-blue-300 text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Tìm kiếm
            </button>
          </form>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Remote', 'Full-time', 'Part-time', 'Internship'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  if (tag === 'Remote') {
                    setFilters(prev => ({ ...prev, is_remote: !prev.is_remote }));
                  } else {
                    setFilters(prev => ({
                      ...prev,
                      job_types: prev.job_types.includes(tag)
                        ? prev.job_types.filter(t => t !== tag)
                        : [...prev.job_types, tag]
                    }));
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  (tag === 'Remote' && filters.is_remote) || filters.job_types.includes(tag)
                    ? 'bg-white text-blue-600'
                    : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </aside>

          {/* Jobs List */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {loading ? 'Đang tìm kiếm...' : `${totalJobs} việc làm`}
                </h2>
                {(keyword || location || activeFiltersCount > 0) && (
                  <button
                    onClick={handleClearSearch}
                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Xóa bộ lọc
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Bộ lọc
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Tags */}
            {(keyword || location || activeFiltersCount > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {keyword && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <Search className="w-3 h-3" />
                    {keyword}
                    <button onClick={() => setKeyword('')} className="ml-1 hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    <MapPin className="w-3 h-3" />
                    {location}
                    <button onClick={() => setLocation('')} className="ml-1 hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.is_remote && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Remote
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, is_remote: false }))}
                      className="ml-1 hover:text-purple-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.job_types.map(type => (
                  <span key={type} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    {type}
                    <button 
                      onClick={() => setFilters(prev => ({
                        ...prev,
                        job_types: prev.job_types.filter(t => t !== type)
                      }))}
                      className="ml-1 hover:text-orange-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Jobs List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Không tìm thấy việc làm
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm
                </p>
                <button
                  onClick={handleClearSearch}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <JobListItem key={job.job_id} job={job} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Trước
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium ${
                        page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Sau
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowMobileFilters(false)} 
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Bộ lọc</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
