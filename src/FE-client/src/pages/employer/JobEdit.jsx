import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';
import JobForm from '../../components/employer/JobForm';
import { ArrowLeft } from 'lucide-react';
import { message } from 'antd';

export default function JobEdit() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/employer/login');
    }
  }, [isAuthenticated, navigate]);

  // Load job data
  useEffect(() => {
    const loadJob = async () => {
      try {
        setLoading(true);
        const jobData = await jobService.getJobById(id);
        setJob(jobData);
      } catch (error) {
        console.error('Error loading job:', error);
        message.error('Không thể tải thông tin tin tuyển dụng');
        navigate('/employer/jobs');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      loadJob();
    }
  }, [isAuthenticated, id, navigate]);

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

      await jobService.updateJob(id, jobData);
      message.success('Cập nhật tin tuyển dụng thành công!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      message.error(error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
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

      await jobService.updateJob(id, jobData);
      message.success('Đã lưu thay đổi!');
      navigate('/employer/jobs');
    } catch (error) {
      console.error('Error saving draft:', error);
      message.error(error.response?.data?.message || 'Lưu thất bại.');
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

  if (!job) {
    return null;
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tuyển dụng</h1>
          <p className="text-gray-600 mt-1">{job.title}</p>
        </div>

        {/* Form - map backend field names to frontend for editing */}
        <JobForm
          initialData={{
            title: job.job_title || '',
            job_type: job.job_type || '',
            experience_level: job.experience_level || '',
            industry: job.industry || '',
            salary_min: job.salary_min || '',
            salary_max: job.salary_max || '',
            description: job.description || '',
            requirements: job.requirements || '',
            benefits: job.benefits || '',
            location: job.location || '',
            address: job.address || '',
            deadline: job.expired_at ? job.expired_at.split('T')[0] : '',
          }}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          saving={saving}
        />
      </div>
    </div>
  );
}
