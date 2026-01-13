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
import savedService from '../../services/savedService';
import { userService } from '../../services/user.service';
import { useAuth } from '../../contexts/AuthContext';
import JobListItem from '../../components/jobs/JobListItem';
import AdvancedFilters from '../../components/jobs/AdvancedFilters';
import SearchDropdown from '../../components/jobs/SearchDropdown';
import { SkeletonJobList } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'salary_desc', label: 'Lương cao nhất' },
  { value: 'salary_asc', label: 'Lương thấp nhất' },
  { value: 'relevance', label: 'Phù hợp nhất' },
];

export default function Jobs() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const [searchRefreshTrigger, setSearchRefreshTrigger] = useState(0);
  
  // Search state
  const [keyword, setKeyword] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [filters, setFilters] = useState({
    job_types: searchParams.getAll('type') || [],
    experience_levels: searchParams.getAll('exp') || [],
    salary_range: searchParams.get('salary') || '',
    is_remote: searchParams.get('remote') === 'true',
    posted_within: searchParams.get('posted') || '',
    skills: searchParams.get('skills') ? searchParams.get('skills').split(',') : [],
  });

  // Fetch saved job IDs for authenticated user
  useEffect(() => {
    const fetchSavedJobIds = async () => {
      if (!user) {
        setSavedJobIds(new Set());
        return;
      }
      try {
        const response = await savedService.getSavedJobs({ limit: 100 });
        // Response structure: { data: { data: [...], total, page, limit } }
        // or just { data: [...], total, page, limit }
        let savedJobs = response?.data?.data || response?.data || response || [];
        if (!Array.isArray(savedJobs)) savedJobs = [];
        const ids = new Set(savedJobs.map(item => item.job_id || item.job?.job_id).filter(Boolean));
        setSavedJobIds(ids);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };
    fetchSavedJobIds();
  }, [user]);

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
        type: filters.job_types.length > 0 ? filters.job_types : undefined,
        exp: filters.experience_levels.length > 0 ? filters.experience_levels : undefined,
        posted: filters.posted_within || undefined,
        is_remote: filters.is_remote || undefined,
        skills: filters.skills && filters.skills.length > 0 ? filters.skills.join(',') : undefined,
      };

      // Handle salary range
      if (filters.salary_range) {
        const [min, max] = filters.salary_range.split('-');
        if (min) params.salary_min = parseInt(min) * 1000000;
        if (max && max !== '+') params.salary_max = parseInt(max) * 1000000;
      }

      const response = await jobService.getJobs(params);
      // Handle different response formats
      let jobsData = response?.data || response || [];
      jobsData = Array.isArray(jobsData) ? jobsData : [];
      
      // Mark saved jobs and sort: saved jobs first
      const processedJobs = jobsData.map(job => ({
        ...job,
        is_saved: savedJobIds.has(job.job_id)
      }));
      
      // Sort: saved jobs first, then by original order
      processedJobs.sort((a, b) => {
        if (a.is_saved && !b.is_saved) return -1;
        if (!a.is_saved && b.is_saved) return 1;
        return 0;
      });
      
      setJobs(processedJobs);
      setTotalJobs(response?.pagination?.total || response?.total || jobsData.length || 0);
      setTotalPages(response?.pagination?.totalPages || Math.ceil((response?.total || jobsData.length) / 10) || 1);
    } catch (error) {
      console.error('Error loading jobs:', error);
      message.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  }, [page, keyword, location, sortBy, filters, savedJobIds]);

  // Initial load: only when component mounts with URL params
  useEffect(() => {
    // Load on initial mount if there are search params, otherwise load all jobs
    if (!hasInitialLoad) {
      const hasSearchParams = searchParams.get('q') || searchParams.get('location') || 
                              searchParams.getAll('type').length > 0 || 
                              searchParams.get('remote') === 'true';
      setHasInitialLoad(true);
      // Load jobs (with or without params)
      loadJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load jobs when filters change (but not when keyword/location changes - only on submit)
  useEffect(() => {
    if (hasInitialLoad) {
      // Only reload if filters changed (not keyword/location)
      const timer = setTimeout(() => {
        loadJobs();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.job_types?.join(',') || '', 
    filters.experience_levels?.join(',') || '', 
    filters.salary_range, 
    filters.posted_within, 
    filters.is_remote, 
    filters.skills?.join(',') || '', 
    sortBy, 
    page
  ]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (keyword) params.set('q', keyword);
    if (location) params.set('location', location);
    if (sortBy !== 'newest') params.set('sort', sortBy);
    if (filters.is_remote) params.set('remote', 'true');
    if (filters.job_types && Array.isArray(filters.job_types)) {
      filters.job_types.forEach(type => params.append('type', type));
    }
    if (filters.experience_levels && Array.isArray(filters.experience_levels)) {
      filters.experience_levels.forEach(exp => params.append('exp', exp));
    }
    if (filters.salary_range) params.set('salary', filters.salary_range);
    if (filters.posted_within) params.set('posted', filters.posted_within);
    
    setSearchParams(params, { replace: true });
  }, [keyword, location, sortBy, filters, setSearchParams]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    setHasInitialLoad(true);
    setIsSearchDropdownOpen(false);
    
    // Load jobs first
    loadJobs();
    
    // Auto-save search if user is authenticated and has keyword or location
    // Only save if there's a meaningful search (keyword or location)
    if (user && (keyword.trim() || location.trim())) {
      // Save search in background (don't block UI)
      (async () => {
        try {
          // Create search name from keyword or location
          let searchName = keyword.trim() || location.trim();
          if (keyword.trim() && location.trim()) {
            searchName = `${keyword.trim()} - ${location.trim()}`;
          }
          
          // Build filter object - only include non-empty values
          const filterData = {};
          
          if (keyword.trim()) {
            filterData.keyword = keyword.trim();
          }
          if (location.trim()) {
            filterData.location = location.trim();
          }
          if (filters.job_types && filters.job_types.length > 0) {
            filterData.job_type = filters.job_types[0];
          }
          if (filters.experience_levels && filters.experience_levels.length > 0) {
            filterData.experience_level = filters.experience_levels[0];
          }
          if (filters.is_remote) {
            filterData.is_remote = true;
          }
          if (filters.posted_within) {
            filterData.posted_within = filters.posted_within;
          }
          if (filters.skills && filters.skills.length > 0) {
            filterData.skills = filters.skills;
          }
          
          // Handle salary range
          if (filters.salary_range) {
            const [min, max] = filters.salary_range.split('-');
            if (min) filterData.salary_min = parseInt(min) * 1000000;
            if (max && max !== '+') filterData.salary_max = parseInt(max) * 1000000;
          }
          
          // Check if similar search already exists (only check keyword and location)
          try {
            const existingSearchesResponse = await savedService.getSavedSearches();
            
            // Handle different response formats
            let searches = [];
            if (Array.isArray(existingSearchesResponse)) {
              searches = existingSearchesResponse;
            } else if (existingSearchesResponse?.data) {
              if (Array.isArray(existingSearchesResponse.data)) {
                searches = existingSearchesResponse.data;
              } else if (existingSearchesResponse.data?.data && Array.isArray(existingSearchesResponse.data.data)) {
                searches = existingSearchesResponse.data.data;
              }
            }
            
            // Check for duplicate (same keyword and location)
            const isDuplicate = searches.some(search => {
              let searchFilter = search.filter;
              if (typeof searchFilter === 'string') {
                try {
                  searchFilter = JSON.parse(searchFilter);
                } catch (e) {
                  return false;
                }
              }
              
              const existingKeyword = searchFilter?.keyword || '';
              const existingLocation = searchFilter?.location || '';
              const newKeyword = filterData.keyword || '';
              const newLocation = filterData.location || '';
              
              return existingKeyword === newKeyword && existingLocation === newLocation;
            });
            
            // Only save if not duplicate
            if (!isDuplicate) {
              const saveResult = await userService.saveSearch({
                name: searchName,
                filter: filterData
              });
              console.log('Search saved successfully:', saveResult); // Debug log
              // Trigger refresh of saved searches dropdown
              setSearchRefreshTrigger(prev => prev + 1);
            } else {
              console.log('Search already exists, skipping save'); // Debug log
            }
          } catch (saveError) {
            console.warn('Failed to auto-save search:', saveError);
          }
        } catch (error) {
          // Silently fail - don't break search functionality
          console.warn('Failed to auto-save search:', error);
        }
      })();
    }
  };

  const handleSelectSavedSearch = async (savedSearch) => {
    // Parse filter if it's a JSON string
    let searchData = savedSearch;
    if (savedSearch.filter) {
      if (typeof savedSearch.filter === 'string') {
        try {
          const parsed = JSON.parse(savedSearch.filter);
          searchData = { ...savedSearch, ...parsed };
        } catch (e) {
          console.warn('Failed to parse filter:', e);
        }
      } else if (typeof savedSearch.filter === 'object') {
        // Filter is already an object
        searchData = { ...savedSearch, ...savedSearch.filter };
      }
    }

    // Extract search parameters
    const searchKeyword = searchData.keyword || '';
    const searchLocation = searchData.location || '';
    
    console.log('Selected saved search:', {
      savedSearch,
      searchData,
      keyword: searchKeyword,
      location: searchLocation
    });
    
    // Apply saved search data to state
    setKeyword(searchKeyword);
    setLocation(searchLocation);
    
    // Apply filters from saved search
    const newFilters = {
      job_types: searchData.job_type ? [searchData.job_type] : [],
      experience_levels: searchData.experience_level ? [searchData.experience_level] : [],
      salary_range: searchData.salary_min || searchData.salary_max 
        ? `${searchData.salary_min ? searchData.salary_min / 1000000 : ''}-${searchData.salary_max ? searchData.salary_max / 1000000 : '+'}`
        : '',
      is_remote: searchData.is_remote || false,
      posted_within: searchData.posted_within || '',
      skills: searchData.skills || [],
    };
    
    setFilters(newFilters);
    setPage(1);
    setHasInitialLoad(true);
    
    // Load jobs immediately with the saved search parameters
    // Don't wait for state update - use the values directly
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 10,
        search: searchKeyword || undefined,
        location: searchLocation || undefined,
        sort: sortBy,
        type: newFilters.job_types.length > 0 ? newFilters.job_types : undefined,
        exp: newFilters.experience_levels.length > 0 ? newFilters.experience_levels : undefined,
        posted: newFilters.posted_within || undefined,
        is_remote: newFilters.is_remote || undefined,
        skills: newFilters.skills && newFilters.skills.length > 0 ? newFilters.skills.join(',') : undefined,
      };

      // Handle salary range
      if (newFilters.salary_range) {
        const [min, max] = newFilters.salary_range.split('-');
        if (min) params.salary_min = parseInt(min) * 1000000;
        if (max && max !== '+') params.salary_max = parseInt(max) * 1000000;
      }

      const response = await jobService.getJobs(params);
      // Handle different response formats
      let jobsData = response?.data || response || [];
      jobsData = Array.isArray(jobsData) ? jobsData : [];
      
      // Mark saved jobs and sort: saved jobs first
      const processedJobs = jobsData.map(job => ({
        ...job,
        is_saved: savedJobIds.has(job.job_id)
      }));
      
      // Sort: saved jobs first, then by original order
      processedJobs.sort((a, b) => {
        if (a.is_saved && !b.is_saved) return -1;
        if (!a.is_saved && b.is_saved) return 1;
        return 0;
      });
      
      setJobs(processedJobs);
      setTotalJobs(response?.pagination?.total || response?.total || jobsData.length || 0);
      setTotalPages(response?.pagination?.totalPages || Math.ceil((response?.total || jobsData.length) / 10) || 1);
    } catch (error) {
      console.error('Error loading jobs:', error);
      message.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setHasInitialLoad(true);
  };

  const handleClearSearch = async () => {
    // Clear all search criteria
    setKeyword('');
    setLocation('');
    setSortBy('newest');
    setFilters({
      job_types: [],
      experience_levels: [],
      salary_range: '',
      is_remote: false,
      posted_within: '',
      skills: [],
    });
    setPage(1);
    setHasInitialLoad(true);
    
    // Clear URL params
    setSearchParams({}, { replace: true });
    
    // Load all jobs without any filters
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 10,
        sort: 'newest'
      };

      const response = await jobService.getJobs(params);
      let jobsData = response?.data || response || [];
      jobsData = Array.isArray(jobsData) ? jobsData : [];
      
      // Mark saved jobs
      const processedJobs = jobsData.map(job => ({
        ...job,
        is_saved: savedJobIds.has(job.job_id)
      }));
      
      // Sort: saved jobs first
      processedJobs.sort((a, b) => {
        if (a.is_saved && !b.is_saved) return -1;
        if (!a.is_saved && b.is_saved) return 1;
        return 0;
      });
      
      setJobs(processedJobs);
      setTotalJobs(response?.pagination?.total || response?.total || jobsData.length || 0);
      setTotalPages(response?.pagination?.totalPages || Math.ceil((response?.total || jobsData.length) / 10) || 1);
    } catch (error) {
      console.error('Error loading jobs:', error);
      message.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  const activeFiltersCount = 
    filters.job_types.length +
    filters.experience_levels.length +
    (filters.salary_range ? 1 : 0) +
    (filters.posted_within ? 1 : 0) +
    (filters.is_remote ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header - Premium glassmorphism design */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-6 sticky top-0 z-20 overflow-visible">
        {/* Animated background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title with fade animation */}
          <h1 className="text-xl md:text-2xl font-bold text-white mb-5 animate-fadeInUp text-center md:text-left">
            <span className="inline-block">Tìm việc làm</span>{' '}
            <span className="inline-block bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
              phù hợp với bạn
            </span>
          </h1>
          
          {/* Search Bar - Glassmorphism container */}
          <form 
            onSubmit={handleSearch} 
            className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-2 md:p-3 border border-white/20 shadow-2xl animate-fadeInUp stagger-1 z-30"
          >
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              {/* Keyword input */}
              <div className="flex-1 relative group z-30">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500 z-10" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => {
                    setKeyword(e.target.value);
                    // Auto-open dropdown when typing if user is logged in
                    if (user && e.target.value.trim()) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  onFocus={() => {
                    if (user) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  placeholder="Chức danh, kỹ năng, công ty..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 border-2 border-transparent 
                    text-gray-900 placeholder-gray-400 relative z-10
                    transition-all duration-300 ease-out
                    focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white
                    hover:bg-white hover:shadow-md"
                />
                <div className="absolute top-full left-0 right-0 z-[100]">
                  <SearchDropdown
                    isOpen={isSearchDropdownOpen}
                    onClose={() => setIsSearchDropdownOpen(false)}
                    onSelectSearch={handleSelectSavedSearch}
                    keyword={keyword}
                    refreshTrigger={searchRefreshTrigger}
                  />
                </div>
              </div>
              
              {/* Location input */}
              <div className="md:w-72 relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Địa điểm làm việc"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 border-2 border-transparent 
                    text-gray-900 placeholder-gray-400
                    transition-all duration-300 ease-out
                    focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white
                    hover:bg-white hover:shadow-md"
                />
              </div>
              
              {/* Search button with pulse effect */}
              <button
                type="submit"
                className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl 
                  transition-all duration-300 ease-out
                  hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02]
                  active:scale-[0.98]
                  flex items-center justify-center gap-2 overflow-hidden group"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Search className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Tìm kiếm</span>
              </button>
            </div>
          </form>

          {/* Quick filters with stagger animation */}
          <div className="flex flex-wrap gap-2 mt-3 animate-fadeInUp stagger-2">
            {[
              { label: 'Làm từ xa', value: 'remote' },
              { label: 'Toàn thời gian', value: 'full-time' },
              { label: 'Bán thời gian', value: 'part-time' },
              { label: 'Thực tập', value: 'internship' }
            ].map((item, index) => (
              <button
                key={item.value}
                onClick={() => {
                  if (item.value === 'remote') {
                    setFilters((prev) => ({ ...prev, is_remote: !prev.is_remote }));
                  } else {
                    setFilters((prev) => ({
                      ...prev,
                      job_types: prev.job_types.includes(item.value)
                        ? prev.job_types.filter((t) => t !== item.value)
                        : [...prev.job_types, item.value],
                    }));
                  }
                }}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium 
                  transition-all duration-300 ease-out
                  backdrop-blur-sm border
                  hover:scale-105 active:scale-95
                  ${
                    (item.value === 'remote' && filters.is_remote) ||
                    filters.job_types.includes(item.value)
                      ? 'bg-white text-blue-700 border-white shadow-lg shadow-white/20'
                      : 'bg-white/10 text-white border-white/30 hover:bg-white/20 hover:border-white/50'
                  }
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
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
              <SkeletonJobList count={5} />
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200">
                <EmptyState
                  variant="no-jobs-user"
                  onAction={handleClearSearch}
                />
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
