import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Briefcase,
  FileText,
  Bell,
  Settings,
  Eye,
  Search,
  Paperclip,
  BarChart3
} from 'lucide-react';

export default function Overview() {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState(15);
  const [activityData, setActivityData] = useState({
    applications: 0,
    jobViews: 0, // saved_jobs count
    jobSearches: 0 // saved_searches count
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load profile data and calculate completion
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await userService.getProfile();
        setProfile(profileData);
        
        // Calculate profile completion percentage
        const fields = [
          profileData.name,
          profileData.email || authUser?.email,
          profileData.phone,
          profileData.job_title,
          profileData.current_level,
          profileData.industry,
          profileData.experience_years,
          profileData.education,
          profileData.date_of_birth,
          profileData.gender,
          profileData.address,
          profileData.desired_location,
          profileData.desired_salary
        ];
        
        const filledFields = fields.filter(field => field !== null && field !== undefined && field !== '').length;
        const totalFields = fields.length;
        const completion = Math.round((filledFields / totalFields) * 100);
        setProfileCompletion(completion);
        
        // Load statistics from API
        try {
          const stats = await userService.getStatistics();
          setActivityData({
            applications: stats.applications || 0,
            jobViews: stats.saved_jobs || 0,
            jobSearches: stats.saved_searches || 0
          });
        } catch (statsError) {
          console.error('Error loading statistics:', statsError);
        }
        
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, authUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white/80" />
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">{profile?.name || 'Chưa cập nhật tên'}</h3>
                <p className="text-sm text-blue-100">{profile?.job_title || 'Chưa cập nhật chức danh'}</p>
              </div>
            </div>

            {/* Resume Search Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Cho phép tìm kiếm hồ sơ</h4>
              <p className="text-sm text-blue-700 mb-3">
                Hồ sơ chưa đủ điều kiện cho phép tìm kiếm
              </p>
              <Link 
                to="/profile" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Thiết Lập Hồ Sơ
              </Link>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="p-2">
                <Link
                  to="/overview"
                  className="flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg font-medium transition hover:bg-blue-100"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Tổng Quan</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <FileText className="w-5 h-5" />
                  <span>Hồ Sơ Của Tôi</span>
                </Link>
                <Link
                  to="/my-jobs"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Việc Làm Của Tôi</span>
                </Link>
                <Link
                  to="/job-notifications"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <Bell className="w-5 h-5" />
                  <span>Thông Báo Việc Làm</span>
                </Link>
                <Link
                  to="/account-management"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <Settings className="w-5 h-5" />
                  <span>Quản Lý Tài Khoản</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Tổng Quan</h1>
            </div>

            {/* Profile Completion Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-gray-700 mb-2">
                    Cập nhật hồ sơ của bạn để tìm hiểu thêm về con đường sự nghiệp tiếp theo của bạn.
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Hoàn chỉnh hồ sơ:</span>
                    <span className="text-sm font-semibold text-gray-900">
                      Mức độ hoàn chỉnh: {profileCompletion}%
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="ml-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium whitespace-nowrap"
                >
                  Cập nhật hồ sơ
                </Link>
              </div>
            </div>

            {/* Activity Chart Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Hoạt Động Của Bạn</h2>
              
              {/* Simple Chart Visualization */}
              <div className="mb-6">
                {(() => {
                  // Calculate bar heights based on actual data
                  const maxHeight = 200; // Maximum bar height in pixels
                  const minHeight = 20; // Minimum bar height for visibility
                  
                  // Find the maximum value for scaling
                  const maxValue = Math.max(
                    activityData.applications,
                    activityData.jobViews,
                    activityData.jobSearches,
                    1 // Minimum 1 to avoid division by zero
                  );
                  
                  // Calculate heights for each bar
                  const applicationsHeight = activityData.applications === 0 
                    ? minHeight 
                    : Math.max(minHeight, (activityData.applications / maxValue) * maxHeight);
                  
                  const jobViewsHeight = activityData.jobViews === 0 
                    ? minHeight 
                    : Math.max(minHeight, (activityData.jobViews / maxValue) * maxHeight);
                  
                  const jobSearchesHeight = activityData.jobSearches === 0 
                    ? minHeight 
                    : Math.max(minHeight, (activityData.jobSearches / maxValue) * maxHeight);
                  
                  return (
                    <div className="h-64 flex items-end justify-center gap-4 mb-4">
                      {/* Applications bar (green) */}
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="w-16 bg-green-500 rounded-t transition-all duration-300" 
                          style={{ height: `${applicationsHeight}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 font-medium">{activityData.applications}</span>
                      </div>
                      {/* Job Views bar (blue) */}
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="w-16 bg-blue-500 rounded-t transition-all duration-300" 
                          style={{ height: `${jobViewsHeight}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 font-medium">{activityData.jobViews}</span>
                      </div>
                      {/* Job Searches bar (orange) */}
                      <div className="flex flex-col items-center gap-2">
                        <div 
                          className="w-16 bg-orange-500 rounded-t transition-all duration-300" 
                          style={{ height: `${jobSearchesHeight}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 font-medium">{activityData.jobSearches}</span>
                      </div>
                    </div>
                  );
                })()}
                
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-700">Việc đã ứng tuyển</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-700">Lượt xem việc làm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-gray-700">Lượt tìm việc làm</span>
                  </div>
                </div>
              </div>

              {/* Activity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <Link
                  to="#"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activityData.applications}</p>
                    <p className="text-sm text-gray-600">Việc đã ứng tuyển</p>
                  </div>
                  <Briefcase className="w-6 h-6 text-gray-400" />
                </Link>
                <Link
                  to="#"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activityData.jobViews}</p>
                    <p className="text-sm text-gray-600">Lượt xem việc làm</p>
                  </div>
                  <Eye className="w-6 h-6 text-gray-400" />
                </Link>
                <Link
                  to="#"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activityData.jobSearches}</p>
                    <p className="text-sm text-gray-600">Lượt tìm việc làm</p>
                  </div>
                  <Search className="w-6 h-6 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Attached Resumes Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">HỒ SƠ ĐÍNH KÈM CỦA BẠN</h2>
              <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Paperclip className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">Bạn đã có CV?</p>
                  <p className="text-sm text-gray-600">
                    Tải lên CV để có thể ứng tuyển nhanh chóng
                  </p>
                </div>
                <Link
                  to="#"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Quản lý hồ sơ đính kèm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

