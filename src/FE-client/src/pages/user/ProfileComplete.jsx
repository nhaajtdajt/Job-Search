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
  GraduationCap,
  Briefcase,
  FileText,
  Bell,
  Settings,
  X,
  BarChart3,
  DollarSign,
  ArrowLeft,
  Search,
  Camera
} from 'lucide-react';
import { Modal, Input, Select, Radio, message } from 'antd';
import { countries, vietnamProvinces } from '../../data/locationData';

const { TextArea } = Input;

export default function ProfileComplete() {
  const { user: authUser, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDesiredJobModalOpen, setIsDesiredJobModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [locationStep, setLocationStep] = useState('country'); // 'country', 'province'
  const [locationSearch, setLocationSearch] = useState('');
  const [formData, setFormData] = useState({
    // Personal info
    name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    country: '',
    province: '',
    nationality: '',
    marital_status: '',
    // Professional info
    job_title: '',
    current_level: '',
    industry: '',
    field: '',
    experience_years: '',
    current_salary: '',
    education: '',
    // Job preferences
    desired_location: '',
    desired_salary: '',
  });
  const [desiredJobData, setDesiredJobData] = useState({
    desired_location: '',
    desired_salary: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
        // date_of_birth is already formatted as YYYY-MM-DD from backend
        setFormData({
          name: profileData.name || '',
          email: authUser?.email || '',
          phone: profileData.phone || '',
          gender: profileData.gender || '',
          date_of_birth: profileData.date_of_birth || '',
          address: profileData.address || '',
          country: profileData.country || '',
          province: profileData.province || '',
          nationality: profileData.nationality || '',
          marital_status: profileData.marital_status || '',
          job_title: profileData.job_title || '',
          current_level: profileData.current_level || '',
          industry: profileData.industry || '',
          field: profileData.field || '',
          experience_years: profileData.experience_years || '',
          current_salary: profileData.current_salary || '',
          education: profileData.education || '',
          desired_location: profileData.desired_location || '',
          desired_salary: profileData.desired_salary || '',
        });

        setDesiredJobData({
          desired_location: profileData.desired_location || '',
          desired_salary: profileData.desired_salary || '',
        });
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
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If country changes and it's not Vietnam, clear province
    if (name === 'country' && value !== 'Việt Nam') {
      setFormData(prev => ({
        ...prev,
        province: ''
      }));
    }
  };
  
  // Handle location selection
  const handleLocationClick = () => {
    setLocationStep('country');
    setLocationSearch('');
    setIsLocationModalOpen(true);
  };
  
  const handleCountrySelect = (country) => {
    if (country === 'Việt Nam') {
      setFormData(prev => ({
        ...prev,
        country: country
      }));
      setLocationStep('province');
      setLocationSearch('');
    } else {
      setFormData(prev => ({
        ...prev,
        country: country,
        province: ''
      }));
      setIsLocationModalOpen(false);
    }
  };
  
  const handleProvinceSelect = (province) => {
    setFormData(prev => ({
      ...prev,
      province: province
    }));
    setIsLocationModalOpen(false);
  };
  
  const handleLocationBack = () => {
    if (locationStep === 'province') {
      setLocationStep('country');
      setLocationSearch('');
    }
  };
  
  // Get filtered locations based on current step
  const getFilteredLocations = () => {
    const search = locationSearch.toLowerCase();
    
    if (locationStep === 'country') {
      return countries.filter(c => c.toLowerCase().includes(search));
    } else if (locationStep === 'province') {
      return vietnamProvinces.filter(p => p.toLowerCase().includes(search));
    }
    return [];
  };
  
  // Get location display text
  const getLocationDisplayText = () => {
    if (formData.country && formData.country !== 'Việt Nam') {
      return formData.country;
    }
    if (formData.province) {
      return `${formData.province}, ${formData.country || 'Việt Nam'}`;
    }
    if (formData.country) {
      return formData.country;
    }
    return 'Chọn địa điểm';
  };
  
  // Get location modal title
  const getLocationModalTitle = () => {
    if (locationStep === 'country') return 'Chọn Quốc Gia';
    if (locationStep === 'province') return 'Chọn Tỉnh Thành';
    return 'Chọn Địa Điểm';
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      message.error('Chỉ hỗ trợ file ảnh (JPG, PNG, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('File không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await userService.uploadAvatar(file);
      setProfile(prev => ({ ...prev, avatar_url: result.avatar_url }));
      // Update user in auth context
      if (updateUser) {
        await updateUser({ avatar_url: result.avatar_url });
      }
      message.success('Tải ảnh đại diện thành công!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      message.error(error.response?.data?.message || 'Tải ảnh thất bại');
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  // Handle desired job change
  const handleDesiredJobChange = (name, value) => {
    setDesiredJobData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save basic info
  const handleSaveBasicInfo = async () => {
    try {
      setSaving(true);
      console.log('[Profile] Starting save...', formData);

      const updateData = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth || null,
        address: formData.address,
        country: formData.country,
        province: formData.province,
        nationality: formData.nationality,
        marital_status: formData.marital_status,
        job_title: formData.job_title,
        current_level: formData.current_level,
        industry: formData.industry,
        field: formData.field,
        experience_years: formData.experience_years !== '' && formData.experience_years !== null && formData.experience_years !== undefined 
          ? parseInt(formData.experience_years) 
          : null,
        current_salary: formData.current_salary ? parseFloat(formData.current_salary) : null,
        education: formData.education,
      };

      // Remove empty fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null || updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      console.log('[Profile] Update data:', updateData);

      const updatedUser = await updateUser(updateData);
      console.log('[Profile] Update user result:', updatedUser);
      
      // Fetch fresh profile to get all profile fields
      const profileData = await userService.getProfile();
      console.log('[Profile] Fetched profile:', profileData);
      
      setProfile(profileData);
      setIsModalOpen(false);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('[Profile] Error updating profile:', error);
      console.error('[Profile] Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      message.error(error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Handle save desired job
  const handleSaveDesiredJob = async () => {
    try {
      setSaving(true);

      const updateData = {
        desired_location: desiredJobData.desired_location,
        desired_salary: desiredJobData.desired_salary ? parseFloat(desiredJobData.desired_salary) : null,
      };

      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });

      await updateUser(updateData);
      // Fetch fresh profile to get all profile fields
      const profileData = await userService.getProfile();
      setProfile(profileData);
      setFormData(prev => ({ ...prev, ...updateData }));
      setIsDesiredJobModalOpen(false);
      message.success('Cập nhật công việc mong muốn thành công!');
    } catch (error) {
      console.error('Error updating desired job:', error);
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <UserSidebar />

          {/* Main Content */}
          <main className="flex-1">
            {/* Personal Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile?.name || 'Chưa cập nhật tên'}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {profile?.job_title || 'Chưa cập nhật chức danh'}
                    {(() => {
                      const expYears = profile?.experience_years;
                      if (expYears === null || expYears === undefined || expYears === '') {
                        return null;
                      }
                      const numYears = Number(expYears);
                      if (numYears === 0) {
                        return ' - Chưa có kinh nghiệm';
                      }
                      return ` - ${numYears} năm kinh nghiệm`;
                    })()}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Cấp bậc hiện tại</p>
                      <p className="text-gray-900">
                        {profile?.current_level ? 
                          (profile.current_level === 'intern' ? 'Thực tập sinh/Sinh viên' :
                           profile.current_level === 'fresh_graduate' ? 'Mới Tốt Nghiệp' :
                           profile.current_level === 'employee' ? 'Nhân viên' :
                           profile.current_level === 'manager' ? 'Trưởng phòng' :
                           profile.current_level === 'director' ? 'Giám Đốc và Cấp Cao Hơn' : profile.current_level)
                          : 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{authUser?.email || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="text-gray-900">
                        {profile?.province 
                          ? `${profile.province}, ${profile.country || 'Việt Nam'}`
                          : profile?.address || 'Chưa cập nhật'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Bằng cấp cao nhất</p>
                      <p className="text-gray-900">{profile?.education || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Điện thoại</p>
                      <p className="text-gray-900">{profile?.phone || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desired Job Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Công Việc Mong Muốn</h2>
                <button
                  onClick={() => setIsDesiredJobModalOpen(true)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nơi làm việc</p>
                    <p className="text-gray-900 font-medium">
                      {profile?.desired_location || 'Chưa cập nhật'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mức lương mong muốn (USD / tháng)</p>
                    <p className="text-gray-900 font-medium">
                      {profile?.desired_salary ? `${profile.desired_salary.toLocaleString('vi-VN')} USD` : 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modal: Basic Information */}
      <Modal
        title="Thông Tin Cơ Bản"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSaveBasicInfo}
        confirmLoading={saving}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ className: 'bg-orange-500 hover:bg-orange-600' }}
      >
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Chức Danh
              </label>
              <Input
                value={formData.job_title}
                onChange={(e) => handleChange('job_title', e.target.value)}
                placeholder="Nhập chức danh"
              />
            </div>

            {/* Current Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Cấp bậc hiện tại
              </label>
              <Select
                value={formData.current_level || undefined}
                onChange={(value) => handleChange('current_level', value)}
                placeholder="Vui lòng chọn..."
                className="w-full"
                options={[
                  { value: 'intern', label: 'Thực tập sinh/Sinh viên' },
                  { value: 'fresh_graduate', label: 'Mới Tốt Nghiệp' },
                  { value: 'employee', label: 'Nhân viên' },
                  { value: 'manager', label: 'Trưởng phòng' },
                  { value: 'director', label: 'Giám Đốc và Cấp Cao Hơn' },
                ]}
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Ngành nghề hiện tại
              </label>
              <Input
                value={formData.industry}
                onChange={(e) => handleChange('industry', e.target.value)}
                placeholder="Chọn ngành nghề"
              />
            </div>

            {/* Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Lĩnh vực hiện tại
              </label>
              <Input
                value={formData.field}
                onChange={(e) => handleChange('field', e.target.value)}
                placeholder="Chọn lĩnh vực công ty"
              />
            </div>

            {/* Experience Years */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Số Năm Kinh Nghiệm
              </label>
              <Input
                type="number"
                value={formData.experience_years}
                onChange={(e) => handleChange('experience_years', e.target.value)}
                placeholder="Nhập số năm"
                suffix="Năm"
              />
            </div>

            {/* Current Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức lương hiện tại
              </label>
              <Input
                type="number"
                value={formData.current_salary}
                onChange={(e) => handleChange('current_salary', e.target.value)}
                placeholder="Nhập mức lương"
                suffix="USD/tháng"
              />
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Bằng Cấp Cao Nhất
              </label>
              <Select
                value={formData.education || undefined}
                onChange={(value) => handleChange('education', value)}
                placeholder="Vui lòng chọn..."
                className="w-full"
                options={[
                  { value: 'high_school', label: 'Trung học phổ thông' },
                  { value: 'college', label: 'Cao đẳng' },
                  { value: 'bachelor', label: 'Đại học' },
                  { value: 'master', label: 'Thạc sĩ' },
                  { value: 'doctorate', label: 'Tiến sĩ' },
                ]}
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Quốc tịch
              </label>
              <Input
                value={formData.nationality}
                onChange={(e) => handleChange('nationality', e.target.value)}
                placeholder="Nhập quốc tịch"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Email
              </label>
              <Input
                value={formData.email}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Điện thoại
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                prefix={<span className="text-gray-500">+84</span>}
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Ngày sinh
              </label>
              <Input
                type="date"
                value={formData.date_of_birth || ''}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
                className="w-full"
              />
            </div>

            {/* Country/Province/District */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Quốc gia/ Tỉnh thành
              </label>
              <Input
                value={getLocationDisplayText()}
                onClick={handleLocationClick}
                placeholder="Chọn địa điểm"
                readOnly
                className="cursor-pointer"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <TextArea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Nhập địa chỉ"
                rows={3}
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Giới tính
              </label>
              <Radio.Group
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                className="flex gap-4"
              >
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> Tình trạng hôn nhân
              </label>
              <Radio.Group
                value={formData.marital_status}
                onChange={(e) => handleChange('marital_status', e.target.value)}
                className="flex gap-4"
              >
                <Radio value="single">Độc thân</Radio>
                <Radio value="married">Đã kết hôn</Radio>
              </Radio.Group>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            <span className="text-red-500">*</span> Thông tin bắt buộc
          </p>
        </div>
      </Modal>

      {/* Modal: Desired Job */}
      <Modal
        title="Công Việc Mong Muốn"
        open={isDesiredJobModalOpen}
        onCancel={() => setIsDesiredJobModalOpen(false)}
        onOk={handleSaveDesiredJob}
        confirmLoading={saving}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ className: 'bg-orange-500 hover:bg-orange-600' }}
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nơi làm việc
            </label>
            <Input
              value={desiredJobData.desired_location}
              onChange={(e) => handleDesiredJobChange('desired_location', e.target.value)}
              placeholder="Nhập nơi làm việc mong muốn"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức lương mong muốn (USD / tháng)
            </label>
            <Input
              type="number"
              value={desiredJobData.desired_salary}
              onChange={(e) => handleDesiredJobChange('desired_salary', e.target.value)}
              placeholder="Nhập mức lương mong muốn"
              suffix="USD/tháng"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Location Selection */}
      <Modal
        title={null}
        open={isLocationModalOpen}
        onCancel={() => setIsLocationModalOpen(false)}
        footer={null}
        width={500}
        closeIcon={<X className="w-5 h-5" />}
      >
        <div className="py-2">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            {locationStep !== 'country' && (
              <button
                onClick={handleLocationBack}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {getLocationModalTitle()}
            </h3>
          </div>

          {/* Search */}
          <div className="mb-4">
            <Input
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Tìm"
              className="w-full"
            />
          </div>

          {/* Location List */}
          <div className="max-h-[400px] overflow-y-auto">
            {getFilteredLocations().map((location, index) => (
              <button
                key={index}
                onClick={() => {
                  if (locationStep === 'country') {
                    handleCountrySelect(location);
                  } else if (locationStep === 'province') {
                    handleProvinceSelect(location);
                  }
                }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 rounded-lg transition text-left"
              >
                <span className="text-gray-900">{location}</span>
                {locationStep === 'country' && location === 'Việt Nam' ? (
                  <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
                ) : null}
              </button>
            ))}
            {getFilteredLocations().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

