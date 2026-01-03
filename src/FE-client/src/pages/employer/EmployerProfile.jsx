import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { employerService } from "../../services/employerService";
import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Edit2,
  Camera,
} from "lucide-react";
import { Modal, Input, message } from "antd";

export default function EmployerProfile() {
  const {
    user: authUser,
    isAuthenticated,
    updateUserData,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (authLoading) return; // Don't redirect while loading
    if (!isAuthenticated) {
      navigate("/employer/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load employer profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await employerService.getProfile();
        setProfile(profileData);

        // Initialize form data
        setFormData({
          name: profileData.full_name || profileData.name || "",
          email: authUser?.email || profileData.email || "",
          phone: profileData.phone || "",
          position: profileData.position || "",
          department: profileData.department || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        message.error("Không thể tải thông tin profile");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, authUser]);

  // Handle form input change
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const updateData = {
        name: formData.name,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
      };

      // Remove empty fields
      Object.keys(updateData).forEach((key) => {
        if (!updateData[key]) {
          delete updateData[key];
        }
      });

      const updatedProfile = await employerService.updateProfile(updateData);
      setProfile((prev) => ({ ...prev, ...updatedProfile }));
      setIsModalOpen(false);
      message.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      message.error("Chỉ hỗ trợ file ảnh (JPG, PNG, WebP)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error("File không được vượt quá 5MB");
      return;
    }

    try {
      setUploading(true);
      const result = await employerService.uploadAvatar(file);

      // Update local profile state
      setProfile((prev) => ({ ...prev, avatar_url: result.avatar_url }));

      // Update user in auth context immediately with the new avatar_url
      if (updateUserData && result.avatar_url) {
        updateUserData({ avatar_url: result.avatar_url });
      }

      message.success("Tải ảnh đại diện thành công!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      message.error("Tải ảnh thất bại");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

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
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin cá nhân của bạn
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="p-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || "Employer"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                {/* Avatar upload button */}
                <label className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-100 transition border border-gray-200">
                  <Camera className="w-4 h-4 text-orange-600" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* Name & Title */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile?.full_name || profile?.name || "Chưa cập nhật tên"}
                </h2>
                <p className="text-gray-600 mt-1">
                  {profile?.position || "Chưa cập nhật chức vụ"}
                  {profile?.department && ` - ${profile.department}`}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {authUser?.email || profile?.email}
                </p>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Thông tin liên hệ
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">
                    {authUser?.email || profile?.email || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Điện thoại</p>
                  <p className="text-gray-900 font-medium">
                    {profile?.phone || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Chức vụ</p>
                  <p className="text-gray-900 font-medium">
                    {profile?.position || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phòng ban</p>
                  <p className="text-gray-900 font-medium">
                    {profile?.department || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              Thống kê tài khoản
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl">
                <p className="text-sm text-blue-600 mb-1">Tin tuyển dụng</p>
                <p className="text-3xl font-bold text-blue-700">
                  {profile?.total_jobs || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl">
                <p className="text-sm text-green-600 mb-1">Ứng viên</p>
                <p className="text-3xl font-bold text-green-700">
                  {profile?.total_applications || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl">
                <p className="text-sm text-orange-600 mb-1">Lượt xem</p>
                <p className="text-3xl font-bold text-orange-700">
                  {profile?.total_views || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveProfile}
        confirmLoading={saving}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-orange-500 hover:bg-orange-600" }}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <Input value={formData.email} disabled className="bg-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chức vụ
            </label>
            <Input
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
              placeholder="VD: HR Manager, Trưởng phòng nhân sự..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phòng ban
            </label>
            <Input
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              placeholder="VD: Phòng nhân sự, Phòng tuyển dụng..."
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
