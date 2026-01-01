/**
 * ResumeCreate Page
 * Multi-step form for creating a new resume
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  FileText, 
  Briefcase, 
  Bell, 
  Settings,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  GraduationCap,
  Loader2,
  Check
} from 'lucide-react';
import { message } from 'antd';
import resumeService from '../../services/resumeService';
import ResumeForm from '../../components/resume/ResumeForm';
import EducationForm from '../../components/resume/EducationForm';
import ExperienceForm from '../../components/resume/ExperienceForm';

const STEPS = [
  { id: 1, title: 'Thông tin cơ bản', icon: FileText },
  { id: 2, title: 'Học vấn', icon: GraduationCap },
  { id: 3, title: 'Kinh nghiệm', icon: Briefcase },
  { id: 4, title: 'Hoàn tất', icon: Check },
];

function ResumeCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [resumeData, setResumeData] = useState({
    resume_title: '',
    summary: '',
  });
  const [resumeId, setResumeId] = useState(null);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  
  // Form visibility
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editingExperience, setEditingExperience] = useState(null);

  // Sidebar menu items
  const menuItems = [
    { icon: User, label: 'Tổng quan', path: '/user/overview' },
    { icon: FileText, label: 'Hồ sơ của tôi', path: '/user/profile' },
    { icon: FileText, label: 'Quản lý CV', path: '/user/resumes', active: true },
    { icon: Briefcase, label: 'Việc làm của tôi', path: '/user/my-jobs' },
    { icon: Bell, label: 'Thông báo việc làm', path: '/user/job-notifications' },
    { icon: Settings, label: 'Quản lý tài khoản', path: '/user/account' },
  ];

  // Step 1: Save basic info
  const handleSaveBasicInfo = async (data) => {
    try {
      setLoading(true);
      const response = await resumeService.createResume(data);
      // API returns { success: true, data: resume, ... }
      const resumeResult = response?.data || response;
      if (resumeResult?.resume_id) {
        setResumeId(resumeResult.resume_id);
        setResumeData(data);
        setCurrentStep(2);
        message.success('Đã lưu thông tin cơ bản');
      } else {
        message.error('Không thể tạo CV. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      message.error(error.response?.data?.message || 'Không thể tạo CV. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Add education
  const handleAddEducation = async (data) => {
    if (!resumeId) return;
    try {
      setLoading(true);
      const response = await resumeService.addEducation(resumeId, data);
      if (response.success) {
        setEducations([...educations, { ...data, education_id: response.data?.education_id || Date.now() }]);
        setShowEducationForm(false);
        message.success('Đã thêm học vấn');
      }
    } catch (error) {
      console.error('Error adding education:', error);
      message.error('Không thể thêm học vấn');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEducation = async (index) => {
    const edu = educations[index];
    if (edu.education_id && resumeId) {
      try {
        await resumeService.deleteEducation(resumeId, edu.education_id);
      } catch (error) {
        console.error('Error deleting education:', error);
      }
    }
    setEducations(educations.filter((_, i) => i !== index));
    message.success('Đã xóa học vấn');
  };

  // Step 3: Add experience
  const handleAddExperience = async (data) => {
    if (!resumeId) return;
    try {
      setLoading(true);
      const response = await resumeService.addExperience(resumeId, data);
      if (response.success) {
        setExperiences([...experiences, { ...data, experience_id: response.data?.experience_id || Date.now() }]);
        setShowExperienceForm(false);
        message.success('Đã thêm kinh nghiệm');
      }
    } catch (error) {
      console.error('Error adding experience:', error);
      message.error('Không thể thêm kinh nghiệm');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (index) => {
    const exp = experiences[index];
    if (exp.experience_id && resumeId) {
      try {
        await resumeService.deleteExperience(resumeId, exp.experience_id);
      } catch (error) {
        console.error('Error deleting experience:', error);
      }
    }
    setExperiences(experiences.filter((_, i) => i !== index));
    message.success('Đã xóa kinh nghiệm');
  };

  // Final step
  const handleComplete = () => {
    message.success('Tạo CV thành công!');
    navigate('/user/resumes');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>
            <ResumeForm 
              resume={resumeData}
              onSave={handleSaveBasicInfo}
              isLoading={loading}
              submitLabel="Tiếp tục"
            />
          </div>
        );

      case 2:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Học vấn</h2>
              {!showEducationForm && (
                <button
                  onClick={() => setShowEducationForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm học vấn
                </button>
              )}
            </div>

            {/* Education List */}
            {educations.length > 0 && (
              <div className="space-y-3 mb-4">
                {educations.map((edu, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{edu.school_name}</p>
                      <p className="text-sm text-gray-600">{edu.major} - {edu.degree}</p>
                      {edu.start_year && (
                        <p className="text-sm text-gray-500">
                          {edu.start_year} - {edu.end_year || 'Hiện tại'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEducation(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Education Form */}
            {showEducationForm && (
              <EducationForm
                education={editingEducation}
                onSave={handleAddEducation}
                onCancel={() => {
                  setShowEducationForm(false);
                  setEditingEducation(null);
                }}
                isLoading={loading}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Tiếp tục
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Kinh nghiệm làm việc</h2>
              {!showExperienceForm && (
                <button
                  onClick={() => setShowExperienceForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Thêm kinh nghiệm
                </button>
              )}
            </div>

            {/* Experience List */}
            {experiences.length > 0 && (
              <div className="space-y-3 mb-4">
                {experiences.map((exp, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">{exp.job_title}</p>
                      <p className="text-sm text-gray-600">{exp.company_name}</p>
                      {exp.start_date && (
                        <p className="text-sm text-gray-500">
                          {new Date(exp.start_date).toLocaleDateString('vi-VN')} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('vi-VN') : 'Hiện tại'}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteExperience(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Experience Form */}
            {showExperienceForm && (
              <ExperienceForm
                experience={editingExperience}
                onSave={handleAddExperience}
                onCancel={() => {
                  setShowExperienceForm(false);
                  setEditingExperience(null);
                }}
                isLoading={loading}
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                Tiếp tục
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">CV đã sẵn sàng!</h2>
            <p className="text-gray-600 mb-6">
              CV của bạn đã được tạo thành công. Bạn có thể chỉnh sửa và bổ sung thêm thông tin sau.
            </p>
            
            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 mb-2">{resumeData.resume_title}</h3>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{educations.length} học vấn</span>
                <span>{experiences.length} kinh nghiệm</span>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Chỉnh sửa
              </button>
              <button
                onClick={handleComplete}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{user?.name || 'Người dùng'}</p>
                    <p className="text-sm text-blue-100">Người tìm việc</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                {menuItems.map((item) => (
                  <Link key={item.path} to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Link to="/user/resumes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tạo CV mới</h1>
                <p className="text-gray-600">Hoàn thành các bước để tạo CV của bạn</p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center gap-2 ${
                      currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        currentStep > step.id ? 'bg-blue-600 text-white' :
                        currentStep === step.id ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-600' :
                        'bg-gray-100'
                      }`}>
                        {currentStep > step.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`font-medium hidden md:block ${
                        currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-12 md:w-24 h-1 mx-2 rounded ${
                        currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {renderStepContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ResumeCreate;
