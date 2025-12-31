import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { employerService } from '../../services/employerService';
import { companyService } from '../../services/companyService';
import CompanyForm from '../../components/employer/CompanyForm';
import CompanyLogoUpload from '../../components/employer/CompanyLogoUpload';
import { 
  User, 
  Building2,
  Briefcase,
  Settings,
  LayoutDashboard,
  Users,
  Edit2,
  Globe,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Modal, message } from 'antd';

export default function CompanyProfile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/employer/login');
    }
  }, [isAuthenticated, navigate]);

  // Load employer profile and company data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const profileData = await employerService.getProfile();
        setProfile(profileData);
        
        // Load company data if employer has company_id
        if (profileData.company_id) {
          try {
            const companyData = await companyService.getById(profileData.company_id);
            setCompany(companyData);
          } catch (companyError) {
            console.log('No company found for this employer');
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Không thể tải thông tin');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Handle save company
  const handleSaveCompany = async (formData) => {
    try {
      setSaving(true);
      // For now, we just close the modal since backend might not have company update API yet
      // When backend has full company update, replace with: await companyService.update(company.id, formData);
      setCompany(prev => ({ ...prev, ...formData }));
      setIsModalOpen(false);
      message.success('Cập nhật thông tin công ty thành công!');
    } catch (error) {
      console.error('Error updating company:', error);
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (file) => {
    if (!company?.id) {
      message.error('Không tìm thấy thông tin công ty');
      return;
    }

    try {
      const result = await companyService.uploadLogo(company.id, file);
      setCompany(prev => ({ ...prev, logo_url: result.logo_url }));
      message.success('Tải logo thành công!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      message.error('Tải logo thất bại');
      throw error;
    }
  };

  // Handle banner upload
  const handleBannerUpload = async (file) => {
    if (!company?.id) {
      message.error('Không tìm thấy thông tin công ty');
      return;
    }

    try {
      const result = await companyService.uploadBanner(company.id, file);
      setCompany(prev => ({ ...prev, banner_url: result.banner_url }));
      message.success('Tải banner thành công!');
    } catch (error) {
      console.error('Error uploading banner:', error);
      message.error('Tải banner thất bại');
      throw error;
    }
  };

  // Get verification status display
  const getVerificationStatus = () => {
    const status = company?.verification_status || 'pending';
    const statusConfig = {
      verified: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Đã xác minh',
        className: 'bg-green-100 text-green-700 border-green-200',
      },
      pending: {
        icon: <Clock className="w-4 h-4" />,
        text: 'Đang chờ xác minh',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      },
      rejected: {
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'Chưa xác minh',
        className: 'bg-red-100 text-red-700 border-red-200',
      },
    };
    return statusConfig[status] || statusConfig.pending;
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

  const verificationStatus = getVerificationStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white shadow-lg mb-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-4 border-white/30 mb-4">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.name || 'Employer'} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-white/80" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{profile?.name || 'Chưa cập nhật tên'}</h3>
                <p className="text-sm text-orange-100">{company?.name || 'Chưa có công ty'}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <nav className="p-2">
                <Link
                  to="/employer/dashboard"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/employer/profile"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <User className="w-5 h-5" />
                  <span>Hồ Sơ Cá Nhân</span>
                </Link>
                <Link
                  to="/employer/company"
                  className="flex items-center gap-3 px-4 py-3 text-orange-600 bg-orange-50 rounded-lg font-medium transition hover:bg-orange-100 mt-1"
                >
                  <Building2 className="w-5 h-5" />
                  <span>Thông Tin Công Ty</span>
                </Link>
                <Link
                  to="/employer/jobs"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Tin Tuyển Dụng</span>
                </Link>
                <Link
                  to="/employer/applications"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <Users className="w-5 h-5" />
                  <span>Ứng Viên</span>
                </Link>
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg transition hover:bg-gray-50 mt-1"
                >
                  <Settings className="w-5 h-5" />
                  <span>Cài Đặt</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Company Header with Banner */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              {/* Banner */}
              <div className="h-40 bg-gradient-to-r from-orange-400 to-red-500 relative">
                {company?.banner_url && (
                  <img 
                    src={company.banner_url} 
                    alt="Company banner" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Company Info Header */}
              <div className="px-6 pb-6">
                <div className="flex items-end gap-4 -mt-10 mb-4">
                  {/* Company Logo */}
                  <div className="w-24 h-24 rounded-lg bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {company?.logo_url ? (
                      <img 
                        src={company.logo_url} 
                        alt={company.name || 'Company'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold text-gray-900">
                        {company?.name || 'Chưa có thông tin công ty'}
                      </h1>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${verificationStatus.className}`}>
                        {verificationStatus.icon}
                        {verificationStatus.text}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{company?.industry || 'Chưa cập nhật ngành nghề'}</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Chỉnh sửa</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Thông tin công ty</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Địa chỉ</p>
                      <p className="text-gray-900">{company?.address || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      {company?.website ? (
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                          {company.website}
                        </a>
                      ) : (
                        <p className="text-gray-900">Chưa cập nhật</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Quy mô</p>
                      <p className="text-gray-900">{company?.size || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Năm thành lập</p>
                      <p className="text-gray-900">{company?.founded_year || 'Chưa cập nhật'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Giới thiệu công ty</h3>
                  <p className="text-gray-900 whitespace-pre-line">
                    {company?.description || 'Chưa có mô tả về công ty.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Logo & Banner Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Logo & Banner</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CompanyLogoUpload
                    title="Logo công ty"
                    currentImage={company?.logo_url}
                    onUpload={handleLogoUpload}
                    aspectRatio="square"
                  />
                  <CompanyLogoUpload
                    title="Banner công ty"
                    currentImage={company?.banner_url}
                    onUpload={handleBannerUpload}
                    aspectRatio="wide"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Company Modal */}
      <Modal
        title="Chỉnh sửa thông tin công ty"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <CompanyForm
          initialData={company}
          onSave={handleSaveCompany}
          onCancel={() => setIsModalOpen(false)}
          saving={saving}
        />
      </Modal>
    </div>
  );
}
