import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { useNavigate, Link } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import applicationService from '../../services/applicationService';
import UserSidebar from '../../components/user/UserSidebar';
import AnimatedSection from '../../components/common/AnimatedSection';
import { 
  User, 
  Briefcase,
  FileText,
  Bell,
  Settings,
  Eye,
  Search,
  Paperclip,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { EmptyStateInline } from '../../components/common/EmptyState';
import ActivityChart from '../../components/user/ActivityChart';

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
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);

  // Redirect if not authenticated or if user is employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (authUser && authUser.role === 'employer') {
      navigate('/employer/dashboard', { replace: true });
    }
  }, [isAuthenticated, authUser, navigate]);

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

        // Load recent notifications
        try {
            const notifResponse = await notificationService.getNotifications(1, 4);
            setRecentNotifications(notifResponse.data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }

        // Load recent applications
        try {
            const appResponse = await applicationService.getMyApplications({ page: 1, limit: 4 });
            setRecentApplications(appResponse.data || appResponse || []);
        } catch (error) {
            console.error('Error loading applications:', error);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <UserSidebar>
            {/* Resume Search Status - Custom widget */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Cho phép tìm kiếm hồ sơ</h4>
              <p className="text-sm text-blue-700 mb-3">
                Hồ sơ chưa đủ điều kiện cho phép tìm kiếm
              </p>
              <Link 
                to="/user/profile" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Thiết Lập Hồ Sơ
              </Link>
            </div>
          </UserSidebar>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Tổng Quan</h1>
            </div>

            {/* Profile Completion Section */}
            <AnimatedSection direction="up" delay={0} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
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
                  to="/user/profile"
                  className="ml-6 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium whitespace-nowrap btn-smooth transform hover:scale-105 active:scale-95"
                >
                  Cập nhật hồ sơ
                </Link>
              </div>
            </AnimatedSection>

            {/* Activity Chart Section */}
            <AnimatedSection direction="up" delay={100} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Hoạt Động Của Bạn</h2>
              
              {/* Interactive Activity Chart */}
              <ActivityChart data={activityData} className="mb-6" />

              {/* Activity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <Link
                  to="/user/applications"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 card-smooth focus-ring"
                >
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activityData.applications}</p>
                    <p className="text-sm text-gray-600">Việc đã ứng tuyển</p>
                  </div>
                  <Briefcase className="w-6 h-6 text-gray-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                </Link>
                <Link
                  to="/user/saved-jobs"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 card-smooth focus-ring"
                >
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activityData.jobViews}</p>
                    <p className="text-sm text-gray-600">Việc làm đã lưu</p>
                  </div>
                  <Eye className="w-6 h-6 text-gray-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                </Link>
                <Link
                  to="/user/saved-searches"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 card-smooth focus-ring"
                >
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activityData.jobSearches}</p>
                    <p className="text-sm text-gray-600">Tìm kiếm đã lưu</p>
                  </div>
                  <Search className="w-6 h-6 text-gray-400 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                </Link>
              </div>
            </AnimatedSection>

            {/* Recent Activity Grid */}
            <AnimatedSection direction="up" delay={200} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Recent Notifications Widget */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Thông báo mới</h2>
                    <Link to="/user/notifications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Xem tất cả
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentNotifications.length > 0 ? (
                        recentNotifications.map((notification) => (
                            <div key={notification.notification_id || Math.random()} className={`flex gap-3 p-3 rounded-lg ${!notification.seen ? 'bg-blue-50' : 'hover:bg-gray-50'} transition`}>
                                <div className="mt-1">
                                    <Bell className={`w-4 h-4 ${!notification.seen ? 'text-blue-600' : 'text-gray-400'}`} />
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm ${!notification.seen ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                                        {notification.title || notification.note}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyStateInline
                          icon={Bell}
                          message="Chưa có thông báo mới"
                          className="py-6"
                        />
                    )}
                </div>
              </div>

              {/* Recent Applications Widget */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Ứng tuyển gần đây</h2>
                    <Link to="/user/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Xem tất cả
                    </Link>
                </div>
                <div className="space-y-4">
                    {recentApplications.length > 0 ? (
                        recentApplications.map((app) => (
                            <div key={app.application_id || Math.random()} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition">
                                <div>
                                    <p className="text-sm font-bold text-gray-900 line-clamp-1">
                                        {app.job_title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {app.company_name}
                                    </p>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                      ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                        app.status === 'accepted' || app.status === 'hired' ? 'bg-green-100 text-green-800' : 
                                        app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {app.status === 'pending' ? 'Đang chờ' :
                                         app.status === 'reviewing' ? 'Đang xem xét' :
                                         app.status === 'hired' || app.status === 'accepted' ? 'Đã nhận' :
                                         app.status === 'rejected' ? 'Từ chối' : app.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <EmptyStateInline
                          icon={Briefcase}
                          message="Chưa ứng tuyển công việc nào"
                          actionLabel="Tìm việc ngay"
                          onAction={() => navigate('/jobs')}
                          className="py-6"
                        />
                    )}
                </div>
              </div>
            </AnimatedSection>

            {/* Attached Resumes Section */}
            <AnimatedSection direction="up" delay={300} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                  to="/user/resumes"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Quản lý hồ sơ đính kèm
                </Link>
              </div>
            </AnimatedSection>
          </main>
        </div>
      </div>
    </div>
  );
}

