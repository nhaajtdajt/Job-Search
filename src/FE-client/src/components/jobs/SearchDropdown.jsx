/**
 * SearchDropdown Component
 * Displays saved searches dropdown when user focuses on search input
 */
import { useState, useEffect, useRef } from 'react';
import { Search, Clock, X } from 'lucide-react';
import savedService from '../../services/savedService';
import { useAuth } from '../../contexts/AuthContext';

function SearchDropdown({ 
  isOpen, 
  onClose, 
  onSelectSearch,
  keyword = '',
  refreshTrigger = 0
}) {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState([]);
  const [allSearches, setAllSearches] = useState([]); // Store all searches for filtering
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Load saved searches when dropdown opens or refreshTrigger changes
  useEffect(() => {
    if (isOpen && user) {
      loadSavedSearches();
    }
  }, [isOpen, user, refreshTrigger]);

  // Filter saved searches when keyword changes and auto-close if no matches
  useEffect(() => {
    if (isOpen && user && allSearches.length > 0) {
      if (keyword.trim()) {
        filterSearchesByKeyword();
        // Auto-close if no matches after filtering
        const hasMatches = allSearches.some(search => {
          let searchKeyword = '';
          let searchName = search.name || '';
          
          if (search.filter) {
            try {
              const filter = typeof search.filter === 'string' ? JSON.parse(search.filter) : search.filter;
              searchKeyword = filter.keyword || '';
            } catch (e) {
              // Ignore parse errors
            }
          }
          
          const keywordLower = keyword.toLowerCase().trim();
          return (searchName.toLowerCase().includes(keywordLower)) ||
                 (searchKeyword.toLowerCase().includes(keywordLower));
        });
        
        if (!hasMatches) {
          // Close dropdown if no matches found
          setTimeout(() => {
            onClose();
          }, 100);
        }
      } else {
        // Show all searches if no keyword
        setSavedSearches(allSearches.slice(0, 10));
      }
    }
  }, [keyword, isOpen, user, allSearches]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const loadSavedSearches = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await savedService.getSavedSearches();
      
      // Handle response format from backend
      // Backend returns: { success: true, status, message, data: { data: [...], total, page, limit } }
      // savedService.getSavedSearches() returns: response.data = { success: true, status, message, data: { data: [...], total, page, limit } }
      let searches = [];
      
      if (response?.data) {
        // If data is an array, use it directly
        if (Array.isArray(response.data)) {
          searches = response.data;
        } 
        // If data is an object with data property (paginated response)
        else if (response.data?.data && Array.isArray(response.data.data)) {
          searches = response.data.data;
        }
      } else if (Array.isArray(response)) {
        searches = response;
      }
      
      // Debug log to check response structure
      if (searches.length === 0) {
        console.log('No saved searches found. Response structure:', response);
      } else {
        console.log(`Loaded ${searches.length} saved searches`);
      }
      
      // Sort by most recent first
      searches.sort((a, b) => {
        const dateA = new Date(a.created_at || a.saved_at || 0);
        const dateB = new Date(b.created_at || b.saved_at || 0);
        return dateB - dateA;
      });
      
      // Store all searches for filtering
      setAllSearches(searches);
      
      // Filter by current keyword if provided
      filterSearchesByKeyword(searches);
    } catch (error) {
      console.error('Error loading saved searches:', error);
      setSavedSearches([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter searches by current keyword
  const filterSearchesByKeyword = (searchesToFilter = allSearches) => {
    if (!keyword.trim()) {
      // If no keyword, show all searches
      setSavedSearches(searchesToFilter.slice(0, 10));
      return;
    }

    const filtered = searchesToFilter.filter(search => {
      // Parse filter to get keyword
      let searchKeyword = '';
      let searchName = search.name || '';
      
      if (search.filter) {
        try {
          const filter = typeof search.filter === 'string' ? JSON.parse(search.filter) : search.filter;
          searchKeyword = filter.keyword || '';
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      const keywordLower = keyword.toLowerCase().trim();
      return (searchName.toLowerCase().includes(keywordLower)) ||
             (searchKeyword.toLowerCase().includes(keywordLower));
    });

    setSavedSearches(filtered.slice(0, 10));
  };

  const handleSelectSearch = (search) => {
    onSelectSearch(search);
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-[100] max-h-[500px] overflow-y-auto min-w-[500px]"
      style={{ position: 'absolute' }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Tìm kiếm đã lưu</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-sm text-gray-500">Đang tải...</p>
        </div>
      ) : savedSearches.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-base font-medium text-gray-700 mb-1">Chưa có tìm kiếm nào được lưu</p>
          <p className="text-sm text-gray-500">Lưu các tìm kiếm để sử dụng lại nhanh chóng</p>
        </div>
      ) : (
        <div className="py-2">
          {savedSearches.map((search) => {
            // Parse filter if it's a JSON string
            let searchData = search;
            if (search.filter && typeof search.filter === 'string') {
              try {
                const parsed = JSON.parse(search.filter);
                searchData = { ...search, ...parsed };
              } catch (e) {
                // Keep original if parse fails
              }
            }

            const displayName = searchData.name || searchData.keyword || 'Tìm kiếm không tên';
            const searchKeyword = searchData.keyword || '';
            const searchLocation = searchData.location || '';
            const jobType = searchData.job_type || '';

            return (
              <button
                key={search.saved_search_id || search.stt}
                onClick={() => handleSelectSearch(searchData)}
                className="w-full px-5 py-4 text-left hover:bg-blue-50 transition-all duration-200 border-b border-gray-100 last:border-b-0 group"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Clock className="w-5 h-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-gray-900 mb-2 line-clamp-1 leading-normal">
                      {displayName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {searchKeyword && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                          <Search className="w-3.5 h-3.5 text-gray-500" />
                          <span className="font-medium">{searchKeyword}</span>
                        </span>
                      )}
                      {searchLocation && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="font-medium">{searchLocation}</span>
                        </span>
                      )}
                      {jobType && (
                        <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          {jobType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;

