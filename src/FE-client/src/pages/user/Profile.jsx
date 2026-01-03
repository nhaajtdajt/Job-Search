import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/user.service';
import { useNavigate, Link } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save, 
  X, 
  Briefcase,
  FileText,
  Bell,
  Settings,
  Camera
} from 'lucide-react';
import { message } from 'antd';

export default function Profile() {
  const { user: authUser, updateUser, updateUserData, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated or if user is employer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (authUser && authUser.role === 'employer') {
      navigate('/employer/dashboard', { replace: true });
    }
  }, [isAuthenticated, authUser, navigate]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await userService.getProfile();
        setProfile(profileData);
        
        // Initialize form data
        setFormData({
          name: profileData.name || '',
          email: authUser?.email || '',
          phone: profileData.phone || '',
          gender: profileData.gender || '',
          date_of_birth: profileData.date_of_birth || '',
          address: profileData.address || '',
        });

        // Set avatar preview
        if (profileData.avatar_url) {
          setAvatarPreview(profileData.avatar_url);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        message.error('Không thể tải thông tin profile');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated, authUser]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        message.error('Vui lòng chọn file hình ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        message.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);

      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url || null;
      if (avatarFile) {
        const avatarResult = await userService.uploadAvatar(avatarFile);
        avatarUrl = avatarResult.avatar_url;
      }

      // Update profile
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address,
      };

      // Remove empty fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const updatedProfile = await updateUser(updateData);
      
      // Update profile with new avatar_url if avatar was uploaded
      if (avatarUrl) {
        updatedProfile.avatar_url = avatarUrl;
        setAvatarPreview(avatarUrl);
        // Update avatar in AuthContext immediately so nav bar shows it
        updateUserData({ avatar_url: avatarUrl });
      }
      
      setProfile(updatedProfile);
      setIsEditing(false);
      setAvatarFile(null);
      message.success('Cập nhật profile thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error(error.response?.data?.message || 'Cập nhật profile thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset form data to original profile
    setFormData({
      name: profile?.name || '',
      email: authUser?.email || '',
      phone: profile?.phone || '',
      gender: profile?.gender || '',
      date_of_birth: profile?.date_of_birth || '',
      address: profile?.address || '',
    });
    setAvatarFile(null);
    setAvatarPreview(profile?.avatar_url || null);
    setIsEditing(false);
  };

  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy thông tin profile</p>
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
            <UserSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {formData.name || 'Chưa cập nhật tên'}
                  </h2>
                  <p className="text-gray-500 mt-1">{authUser?.email || ''}</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium btn-smooth transform hover:scale-105 active:scale-95"
                  >
                    <Edit2 className="w-4 h-4 transition-transform duration-200" />
                    <span>Chỉnh Sửa</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium btn-smooth transform hover:scale-105 active:scale-95"
                    >
                      <X className="w-4 h-4 transition-transform duration-200" />
                      <span>Hủy</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium disabled:opacity-50 btn-smooth transform hover:scale-105 active:scale-95 disabled:transform-none"
                    >
                      <Save className="w-4 h-4 transition-transform duration-200" />
                      <span>{saving ? 'Đang lưu...' : 'Lưu'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {formData.name || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.email || 'Chưa cập nhật'}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {formData.phone || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {formData.gender === 'male' ? 'Nam' : 
                         formData.gender === 'female' ? 'Nữ' : 
                         formData.gender === 'other' ? 'Khác' : 
                         'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formatDateForInput(formData.date_of_birth)}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                        {formData.date_of_birth 
                          ? new Date(formData.date_of_birth).toLocaleDateString('vi-VN')
                          : 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="w-4 h-4" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        placeholder="Nhập địa chỉ"
                      />
                    ) : (
                      <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900 min-h-[60px]">
                        {formData.address || 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

