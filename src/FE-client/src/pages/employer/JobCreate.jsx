import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import JobForm from '../../components/employer/JobForm';
import { ArrowLeft } from 'lucide-react';
import { message } from 'antd';

export default function JobCreate() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/employer/login');
    return null;
  }

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      
      // Prepare job data - map frontend field names to backend expected names
      const jobData = {
        job_title: formData.title,
        job_type: formData.job_type,
        description: formData.description || '',
        requirements: formData.requirements || '',
        benefits: formData.benefits || '',
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        expired_at: formData.deadline || null,
      };

      await jobService.createJob(jobData);
      message.success('Tạo tin tuyển dụng thành công!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      message.error(error.response?.data?.message || 'Tạo tin thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async (formData) => {
    try {
      setSaving(true);
      
      // Prepare job data - map frontend field names to backend expected names
      const jobData = {
        job_title: formData.title,
        job_type: formData.job_type,
        description: formData.description || '',
        requirements: formData.requirements || '',
        benefits: formData.benefits || '',
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        expired_at: formData.deadline || null,
      };

      await jobService.createJob(jobData);
      message.success('Đã lưu bản nháp!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error saving draft:', error);
      message.error(error.response?.data?.message || 'Lưu nháp thất bại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/employer/jobs')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Tạo tin tuyển dụng mới</h1>
          <p className="text-gray-600 mt-1">Điền đầy đủ thông tin để đăng tin tuyển dụng</p>
        </div>

        {/* Form */}
        <JobForm
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          saving={saving}
        />
      </div>
    </div>
  );
}
