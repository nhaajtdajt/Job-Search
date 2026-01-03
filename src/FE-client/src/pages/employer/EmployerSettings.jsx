import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { userService } from "../../services/user.service";
import {
  Bell,
  Lock,
  Shield,
  Globe,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  Trash2,
  AlertTriangle,
  Check,
  X,
} from "lucide-react";
import { Modal, Input, Switch, message, Tooltip } from "antd";

export default function EmployerSettings() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(false);

  // Password change state
  const [passwordModal, setPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Delete account modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Notification settings
    emailNotifications: true,
    applicationAlerts: true,
    newCandidateAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
    pushNotifications: true,
    smsNotifications: false,

    // Privacy settings
    profileVisibility: "public",
    showContactInfo: true,
    allowMessaging: true,

    // Security settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",

    // Preferences
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
    darkMode: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/employer/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Handle setting change
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    message.success("Đã cập nhật cài đặt");
  };

  // Password validation
  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordForm.newPassword)) {
      errors.newPassword = "Mật khẩu phải có chữ hoa, chữ thường và số";
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    try {
      setPasswordLoading(true);
      await userService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      message.success("Đổi mật khẩu thành công!");
      setPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      console.error("Error changing password:", error);
      message.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "XÓA TÀI KHOẢN") {
      message.error("Vui lòng nhập đúng cụm từ xác nhận");
      return;
    }

    try {
      setDeleteLoading(true);
      // API call to delete account would go here
      // await authService.deleteAccount();
      message.success("Tài khoản đã được xóa");
      await logout();
      navigate("/employer");
    } catch (error) {
      console.error("Error deleting account:", error);
      message.error("Không thể xóa tài khoản");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle logout all sessions
  const handleLogoutAllSessions = async () => {
    try {
      setLoading(true);
      // API call to logout all sessions
      // await authService.logoutAllSessions();
      message.success("Đã đăng xuất khỏi tất cả thiết bị");
      await logout();
      navigate("/employer/login");
    } catch (error) {
      console.error("Error logging out all sessions:", error);
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Tab configuration
  const tabs = [
    {
      id: "notifications",
      label: "Thông báo",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: "security",
      label: "Bảo mật",
      icon: <Lock className="w-5 h-5" />,
    },
    {
      id: "privacy",
      label: "Quyền riêng tư",
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "preferences",
      label: "Tùy chọn",
      icon: <Globe className="w-5 h-5" />,
    },
    {
      id: "account",
      label: "Tài khoản",
      icon: <AlertTriangle className="w-5 h-5" />,
    },
  ];

  // Render notification settings
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Thông báo qua Email</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingItem
            title="Thông báo qua email"
            description="Nhận tất cả thông báo quan trọng qua email"
            checked={settings.emailNotifications}
            onChange={(checked) => handleSettingChange("emailNotifications", checked)}
          />
          <SettingItem
            title="Thông báo ứng tuyển mới"
            description="Khi có ứng viên mới ứng tuyển vào tin tuyển dụng"
            checked={settings.applicationAlerts}
            onChange={(checked) => handleSettingChange("applicationAlerts", checked)}
          />
          <SettingItem
            title="Ứng viên tiềm năng"
            description="Gợi ý ứng viên phù hợp với vị trí đang tuyển"
            checked={settings.newCandidateAlerts}
            onChange={(checked) => handleSettingChange("newCandidateAlerts", checked)}
          />
          <SettingItem
            title="Báo cáo tuần"
            description="Nhận báo cáo tổng hợp hoạt động mỗi tuần"
            checked={settings.weeklyReports}
            onChange={(checked) => handleSettingChange("weeklyReports", checked)}
          />
          <SettingItem
            title="Email marketing"
            description="Nhận thông tin khuyến mãi và tính năng mới"
            checked={settings.marketingEmails}
            onChange={(checked) => handleSettingChange("marketingEmails", checked)}
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Thông báo đẩy</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingItem
            title="Thông báo trên trình duyệt"
            description="Nhận thông báo ngay trên trình duyệt"
            checked={settings.pushNotifications}
            onChange={(checked) => handleSettingChange("pushNotifications", checked)}
          />
          <SettingItem
            title="Thông báo SMS"
            description="Nhận thông báo quan trọng qua tin nhắn SMS"
            checked={settings.smsNotifications}
            onChange={(checked) => handleSettingChange("smsNotifications", checked)}
          />
        </div>
      </div>
    </div>
  );

  // Render security settings
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Password */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Mật khẩu</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Đổi mật khẩu</p>
              <p className="text-sm text-gray-500 mt-1">
                Cập nhật mật khẩu định kỳ để bảo vệ tài khoản
              </p>
            </div>
            <button
              onClick={() => setPasswordModal(true)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Bảo mật nâng cao</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingItem
            title="Xác thực hai yếu tố (2FA)"
            description="Thêm lớp bảo mật bằng mã xác thực khi đăng nhập"
            checked={settings.twoFactorAuth}
            onChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
            badge={settings.twoFactorAuth ? "Đang bật" : "Tắt"}
            badgeColor={settings.twoFactorAuth ? "green" : "gray"}
          />
          <SettingItem
            title="Cảnh báo đăng nhập"
            description="Nhận thông báo khi có đăng nhập từ thiết bị mới"
            checked={settings.loginAlerts}
            onChange={(checked) => handleSettingChange("loginAlerts", checked)}
          />
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Phiên đăng nhập</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Đăng xuất tất cả thiết bị</p>
              <p className="text-sm text-gray-500 mt-1">
                Đăng xuất khỏi tất cả các thiết bị đã đăng nhập
              </p>
            </div>
            <button
              onClick={handleLogoutAllSessions}
              disabled={loading}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng xuất tất cả"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render privacy settings
  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Quyền riêng tư hồ sơ</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Profile Visibility */}
          <div>
            <label className="block font-medium text-gray-900 mb-3">
              Hiển thị hồ sơ công ty
            </label>
            <div className="space-y-3">
              {[
                { value: "public", label: "Công khai", desc: "Tất cả mọi người có thể xem" },
                { value: "registered", label: "Chỉ người dùng đã đăng ký", desc: "Chỉ người dùng có tài khoản" },
                { value: "private", label: "Riêng tư", desc: "Chỉ bạn có thể xem" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition ${
                    settings.profileVisibility === option.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={settings.profileVisibility === option.value}
                    onChange={(e) => handleSettingChange("profileVisibility", e.target.value)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                  />
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          <SettingItem
            title="Hiển thị thông tin liên hệ"
            description="Cho phép ứng viên xem email và số điện thoại"
            checked={settings.showContactInfo}
            onChange={(checked) => handleSettingChange("showContactInfo", checked)}
          />
          <SettingItem
            title="Cho phép nhắn tin"
            description="Ứng viên có thể gửi tin nhắn trực tiếp"
            checked={settings.allowMessaging}
            onChange={(checked) => handleSettingChange("allowMessaging", checked)}
          />
        </div>
      </div>
    </div>
  );

  // Render preferences
  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-gray-900">Ngôn ngữ & Khu vực</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Language */}
          <div>
            <label className="block font-medium text-gray-900 mb-2">Ngôn ngữ</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange("language", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="vi">Tiếng Việt</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block font-medium text-gray-900 mb-2">Múi giờ</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange("timezone", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="Asia/Ho_Chi_Minh">Việt Nam (GMT+7)</option>
              <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
              <option value="Asia/Singapore">Singapore (GMT+8)</option>
              <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            {settings.darkMode ? (
              <Moon className="w-5 h-5 text-orange-500" />
            ) : (
              <Sun className="w-5 h-5 text-orange-500" />
            )}
            <h3 className="font-semibold text-gray-900">Giao diện</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingItem
            title="Chế độ tối"
            description="Sử dụng giao diện tối để giảm mỏi mắt"
            checked={settings.darkMode}
            onChange={(checked) => handleSettingChange("darkMode", checked)}
          />
        </div>
      </div>

      {/* Session Timeout */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Thời gian phiên đăng nhập</h3>
        </div>
        <div className="p-6">
          <label className="block font-medium text-gray-900 mb-2">
            Tự động đăng xuất sau
          </label>
          <select
            value={settings.sessionTimeout}
            onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="15">15 phút</option>
            <option value="30">30 phút</option>
            <option value="60">1 giờ</option>
            <option value="120">2 giờ</option>
            <option value="never">Không bao giờ</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render account settings (danger zone)
  const renderAccountSettings = () => (
    <div className="space-y-6">
      {/* Account Info */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Thông tin tài khoản</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loại tài khoản</p>
              <p className="font-medium text-gray-900">Nhà tuyển dụng</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="font-medium text-gray-900">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("vi-VN")
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <Check className="w-3 h-3" />
                Hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-200 bg-red-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-700">Vùng nguy hiểm</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Deactivate Account */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Tạm ngưng tài khoản</p>
              <p className="text-sm text-gray-500 mt-1">
                Tạm ẩn hồ sơ và tạm dừng hoạt động, có thể kích hoạt lại sau
              </p>
            </div>
            <button className="px-4 py-2 border border-yellow-400 text-yellow-700 rounded-lg hover:bg-yellow-50 transition font-medium">
              Tạm ngưng
            </button>
          </div>

          {/* Delete Account */}
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div>
              <p className="font-medium text-red-700">Xóa tài khoản vĩnh viễn</p>
              <p className="text-sm text-red-600 mt-1">
                Xóa hoàn toàn tài khoản và tất cả dữ liệu. Không thể hoàn tác!
              </p>
            </div>
            <button
              onClick={() => setDeleteModal(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
            >
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return renderNotificationSettings();
      case "security":
        return renderSecuritySettings();
      case "privacy":
        return renderPrivacySettings();
      case "preferences":
        return renderPreferences();
      case "account":
        return renderAccountSettings();
      default:
        return null;
    }
  };

  if (authLoading) {
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông báo, bảo mật và tùy chọn tài khoản
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24">
              <ul className="divide-y divide-gray-100">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-4 text-left transition ${
                        activeTab === tab.id
                          ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
                          : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                    >
                      <span
                        className={
                          activeTab === tab.id ? "text-orange-500" : "text-gray-400"
                        }
                      >
                        {tab.icon}
                      </span>
                      <span className="font-medium">{tab.label}</span>
                      <ChevronRight
                        className={`w-4 h-4 ml-auto ${
                          activeTab === tab.id ? "text-orange-500" : "text-gray-300"
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">{renderTabContent()}</div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-orange-500" />
            <span>Đổi mật khẩu</span>
          </div>
        }
        open={passwordModal}
        onCancel={() => {
          setPasswordModal(false);
          setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
          setPasswordErrors({});
        }}
        onOk={handleChangePassword}
        confirmLoading={passwordLoading}
        okText="Đổi mật khẩu"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-orange-500 hover:bg-orange-600" }}
      >
        <div className="py-4 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input.Password
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                placeholder="Nhập mật khẩu hiện tại"
                status={passwordErrors.currentPassword ? "error" : ""}
                iconRender={(visible) =>
                  visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
                }
              />
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Input.Password
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              placeholder="Nhập mật khẩu mới"
              status={passwordErrors.newPassword ? "error" : ""}
              iconRender={(visible) =>
                visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
              }
            />
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <Input.Password
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Nhập lại mật khẩu mới"
              status={passwordErrors.confirmPassword ? "error" : ""}
              iconRender={(visible) =>
                visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
              }
            />
            {passwordErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Xóa tài khoản vĩnh viễn</span>
          </div>
        }
        open={deleteModal}
        onCancel={() => {
          setDeleteModal(false);
          setDeleteConfirmText("");
        }}
        footer={[
          <button
            key="cancel"
            onClick={() => {
              setDeleteModal(false);
              setDeleteConfirmText("");
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium mr-2"
          >
            Hủy
          </button>,
          <button
            key="delete"
            onClick={handleDeleteAccount}
            disabled={deleteConfirmText !== "XÓA TÀI KHOẢN" || deleteLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteLoading ? "Đang xóa..." : "Xóa tài khoản"}
          </button>,
        ]}
      >
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-700 font-medium">⚠️ Cảnh báo: Hành động này không thể hoàn tác!</p>
            <ul className="text-red-600 text-sm mt-2 space-y-1 list-disc list-inside">
              <li>Tất cả tin tuyển dụng sẽ bị xóa</li>
              <li>Tất cả đơn ứng tuyển sẽ bị xóa</li>
              <li>Thông tin công ty sẽ bị xóa</li>
              <li>Bạn không thể khôi phục tài khoản</li>
            </ul>
          </div>
          <p className="text-gray-700 mb-3">
            Để xác nhận, vui lòng nhập <strong>XÓA TÀI KHOẢN</strong>
          </p>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Nhập XÓA TÀI KHOẢN để xác nhận"
            status={deleteConfirmText && deleteConfirmText !== "XÓA TÀI KHOẢN" ? "error" : ""}
          />
        </div>
      </Modal>
    </div>
  );
}

// Setting Item Component
function SettingItem({ title, description, checked, onChange, badge, badgeColor }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{title}</p>
          {badge && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                badgeColor === "green"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
      <Switch
        checked={checked}
        onChange={onChange}
        className={checked ? "bg-orange-500" : ""}
      />
    </div>
  );
}
