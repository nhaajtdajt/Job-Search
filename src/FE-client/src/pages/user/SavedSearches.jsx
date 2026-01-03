/**
 * SavedSearches Page
 * Display and manage saved job searches
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import UserSidebar from '../../components/user/UserSidebar';
import { 
  Bookmark,
  Search,
  Plus,
  Trash2,
  Edit2,
  BellRing,
  BellOff,
  MapPin,
  DollarSign,
  Clock,
  Loader2,
  X
} from 'lucide-react';
import { message } from 'antd';
import savedService from '../../services/savedService';

function SavedSearches() {
  const { user } = useAuth();
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSearch, setEditingSearch] = useState(null);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      setLoading(true);
      const response = await savedService.getSavedSearches();
      // Response is the data directly (or { data: [...] } from API)
      const searches = Array.isArray(response) ? response : (response?.data || []);
      setSavedSearches(searches);
    } catch (error) {
      console.error('Error loading saved searches:', error);
      message.error('Không thể tải danh sách tìm kiếm đã lưu');
      setSavedSearches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotification = async (searchId, currentState) => {
    try {
      await savedService.toggleSearchNotification(searchId, !currentState);
      setSavedSearches(savedSearches.map(s => 
        s.saved_search_id === searchId 
          ? { ...s, email_notification: !currentState }
          : s
      ));
      message.success(currentState ? 'Đã tắt thông báo' : 'Đã bật thông báo email');
    } catch (error) {
      console.error('Error toggling notification:', error);
      message.error('Không thể cập nhật cài đặt thông báo');
    }
  };

  const handleDeleteSearch = async (searchId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tìm kiếm này?')) return;
    
    try {
      await savedService.deleteSavedSearch(searchId);
      setSavedSearches(savedSearches.filter(s => s.saved_search_id !== searchId));
      message.success('Đã xóa tìm kiếm');
    } catch (error) {
      console.error('Error deleting search:', error);
      message.error('Không thể xóa tìm kiếm');
    }
  };

  const buildSearchUrl = (search) => {
    const params = new URLSearchParams();
    if (search.keyword) params.append('q', search.keyword);
    if (search.location) params.append('location', search.location);
    if (search.job_type) params.append('type', search.job_type);
    if (search.salary_min) params.append('salary_min', search.salary_min);
    if (search.salary_max) params.append('salary_max', search.salary_max);
    return `/jobs?${params.toString()}`;
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const format = (num) => new Intl.NumberFormat('vi-VN').format(num);
    if (min && max) return `${format(min)} - ${format(max)} đ`;
    if (min) return `Từ ${format(min)} đ`;
    return `Đến ${format(max)} đ`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Using shared component */}
          <UserSidebar />

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tìm kiếm đã lưu</h1>
                <p className="text-gray-600 mt-1">Nhận thông báo khi có việc làm mới phù hợp</p>
              </div>
              <Link
                to="/user/saved-jobs"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                Việc làm đã lưu
              </Link>
            </div>

            {/* Saved Searches List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            ) : !Array.isArray(savedSearches) || savedSearches.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <Search className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chưa có tìm kiếm nào được lưu
                </h3>
                <p className="text-gray-600 mb-6">
                  Lưu các tìm kiếm để nhận thông báo email khi có việc làm mới phù hợp
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Search className="w-5 h-5" />
                  Tìm việc làm
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {savedSearches.map((search) => (
                  <div
                    key={search.saved_search_id}
                    className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-purple-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {search.name || search.keyword || 'Tìm kiếm không tên'}
                          </h3>
                          {search.email_notification && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                              <BellRing className="w-3 h-3" />
                              Đang bật thông báo
                            </span>
                          )}
                        </div>

                        {/* Search Criteria */}
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                          {search.keyword && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                              <Search className="w-3 h-3" />
                              {search.keyword}
                            </span>
                          )}
                          {search.location && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                              <MapPin className="w-3 h-3" />
                              {search.location}
                            </span>
                          )}
                          {search.job_type && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {search.job_type}
                            </span>
                          )}
                          {(search.salary_min || search.salary_max) && (
                            <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
                              <DollarSign className="w-3 h-3" />
                              {formatSalary(search.salary_min, search.salary_max)}
                            </span>
                          )}
                        </div>

                        {/* Matching Jobs Info */}
                        {search.matching_count > 0 && (
                          <p className="text-sm text-purple-600">
                            {search.matching_count} việc làm phù hợp
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleNotification(search.saved_search_id, search.email_notification)}
                          className={`p-2 rounded-lg transition-colors ${
                            search.email_notification 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={search.email_notification ? 'Tắt thông báo' : 'Bật thông báo'}
                        >
                          {search.email_notification ? (
                            <BellRing className="w-5 h-5" />
                          ) : (
                            <BellOff className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteSearch(search.saved_search_id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa tìm kiếm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Action */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        to={buildSearchUrl(search)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        <Search className="w-4 h-4" />
                        Xem kết quả tìm kiếm
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stats */}
            {!loading && savedSearches.length > 0 && (
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-700">
                  Bạn có <strong>{savedSearches.length}</strong> tìm kiếm đã lưu • 
                  <strong> {savedSearches.filter(s => s.email_notification).length}</strong> đang bật thông báo
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default SavedSearches;
