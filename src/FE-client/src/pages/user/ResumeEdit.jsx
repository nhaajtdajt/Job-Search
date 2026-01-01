/**
 * ResumeEdit Page
 * Edit existing resume with all sections
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, 
  FileText, 
  Briefcase, 
  Bell, 
  Settings,
  ArrowLeft,
  Plus,
  Trash2,
  GraduationCap,
  Loader2,
  Save
} from 'lucide-react';
import { message } from 'antd';
import resumeService from '../../services/resumeService';
import ResumeForm from '../../components/resume/ResumeForm';
import EducationForm from '../../components/resume/EducationForm';
import ExperienceForm from '../../components/resume/ExperienceForm';

function ResumeEdit() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { resumeId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState(null);
  const [educations, setEducations] = useState([]);
  const [experiences, setExperiences] = useState([]);
  
  // Form states
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

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const response = await resumeService.getResumeById(resumeId);
      if (response.success && response.data) {
        setResume(response.data);
        setEducations(response.data.educations || []);
        setExperiences(response.data.experiences || []);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      message.error('Không thể tải CV');
      navigate('/user/resumes');
    } finally {
      setLoading(false);
    }
  };

  // Update basic info
  const handleUpdateBasicInfo = async (data) => {
    try {
      setSaving(true);
      await resumeService.updateResume(resumeId, data);
      setResume({ ...resume, ...data });
      message.success('Đã cập nhật thông tin');
    } catch (error) {
      console.error('Error updating resume:', error);
      message.error('Không thể cập nhật CV');
    } finally {
      setSaving(false);
    }
  };

  // Education handlers
  const handleAddEducation = async (data) => {
    try {
      setSaving(true);
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
      setSaving(false);
    }
  };

  const handleUpdateEducation = async (data) => {
    if (!editingEducation) return;
    try {
      setSaving(true);
      await resumeService.updateEducation(resumeId, editingEducation.education_id, data);
      setEducations(educations.map(edu => 
        edu.education_id === editingEducation.education_id ? { ...edu, ...data } : edu
      ));
      setEditingEducation(null);
      setShowEducationForm(false);
      message.success('Đã cập nhật học vấn');
    } catch (error) {
      console.error('Error updating education:', error);
      message.error('Không thể cập nhật học vấn');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (educationId) => {
    try {
      await resumeService.deleteEducation(resumeId, educationId);
      setEducations(educations.filter(edu => edu.education_id !== educationId));
      message.success('Đã xóa học vấn');
    } catch (error) {
      console.error('Error deleting education:', error);
      message.error('Không thể xóa học vấn');
    }
  };

  // Experience handlers
  const handleAddExperience = async (data) => {
    try {
      setSaving(true);
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
      setSaving(false);
    }
  };

  const handleUpdateExperience = async (data) => {
    if (!editingExperience) return;
    try {
      setSaving(true);
      await resumeService.updateExperience(resumeId, editingExperience.experience_id, data);
      setExperiences(experiences.map(exp => 
        exp.experience_id === editingExperience.experience_id ? { ...exp, ...data } : exp
      ));
      setEditingExperience(null);
      setShowExperienceForm(false);
      message.success('Đã cập nhật kinh nghiệm');
    } catch (error) {
      console.error('Error updating experience:', error);
      message.error('Không thể cập nhật kinh nghiệm');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (experienceId) => {
    try {
      await resumeService.deleteExperience(resumeId, experienceId);
      setExperiences(experiences.filter(exp => exp.experience_id !== experienceId));
      message.success('Đã xóa kinh nghiệm');
    } catch (error) {
      console.error('Error deleting experience:', error);
      message.error('Không thể xóa kinh nghiệm');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

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
          <main className="flex-1 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Link to="/user/resumes" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa CV</h1>
                <p className="text-gray-600">{resume?.resume_title}</p>
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Thông tin cơ bản
              </h2>
              <ResumeForm 
                resume={resume}
                onSave={handleUpdateBasicInfo}
                isLoading={saving}
                submitLabel="Lưu thay đổi"
              />
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Học vấn ({educations.length})
                </h2>
                {!showEducationForm && (
                  <button
                    onClick={() => { setShowEducationForm(true); setEditingEducation(null); }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </button>
                )}
              </div>

              {/* Education List */}
              {educations.map((edu) => (
                <div key={edu.education_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{edu.school_name}</p>
                    <p className="text-sm text-gray-600">{edu.major} - {edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.start_year} - {edu.end_year || 'Hiện tại'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingEducation(edu); setShowEducationForm(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEducation(edu.education_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {showEducationForm && (
                <EducationForm
                  education={editingEducation}
                  onSave={editingEducation ? handleUpdateEducation : handleAddEducation}
                  onCancel={() => { setShowEducationForm(false); setEditingEducation(null); }}
                  isLoading={saving}
                />
              )}

              {educations.length === 0 && !showEducationForm && (
                <p className="text-gray-500 text-center py-4">Chưa có thông tin học vấn</p>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  Kinh nghiệm ({experiences.length})
                </h2>
                {!showExperienceForm && (
                  <button
                    onClick={() => { setShowExperienceForm(true); setEditingExperience(null); }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm
                  </button>
                )}
              </div>

              {/* Experience List */}
              {experiences.map((exp) => (
                <div key={exp.experience_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{exp.job_title}</p>
                    <p className="text-sm text-gray-600">{exp.company_name}</p>
                    <p className="text-sm text-gray-500">
                      {exp.start_date && new Date(exp.start_date).toLocaleDateString('vi-VN')} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString('vi-VN') : 'Hiện tại'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditingExperience(exp); setShowExperienceForm(true); }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp.experience_id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {showExperienceForm && (
                <ExperienceForm
                  experience={editingExperience}
                  onSave={editingExperience ? handleUpdateExperience : handleAddExperience}
                  onCancel={() => { setShowExperienceForm(false); setEditingExperience(null); }}
                  isLoading={saving}
                />
              )}

              {experiences.length === 0 && !showExperienceForm && (
                <p className="text-gray-500 text-center py-4">Chưa có kinh nghiệm làm việc</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default ResumeEdit;
