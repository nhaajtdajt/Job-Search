/**
 * ApplyJobModal Component
 * Modal for applying to a job with resume selection and cover letter
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  X, 
  FileText, 
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react';
import { message } from 'antd';
import applicationService from '../../services/applicationService';
import resumeService from '../../services/resumeService';

function ApplyJobModal({ 
  isOpen, 
  onClose, 
  job,
  onSuccess,
}) {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [status, setStatus] = useState('form'); // form, submitting, success, error
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadResumes();
      setStatus('form');
      setError('');
      setCoverLetter('');
    }
  }, [isOpen]);

  const loadResumes = async () => {
    try {
      setLoadingResumes(true);
      const response = await resumeService.getResumes();
      const resumeList = response?.data || response || [];
      setResumes(Array.isArray(resumeList) ? resumeList : []);
      
      // Auto-select default resume
      const defaultResume = resumeList.find(r => r.is_default);
      if (defaultResume) {
        setSelectedResumeId(defaultResume.resume_id);
      } else if (resumeList.length > 0) {
        setSelectedResumeId(resumeList[0].resume_id);
      }
    } catch (error) {
      console.error('Error loading resumes:', error);
      setResumes([]);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedResumeId) {
      message.warning('Vui lòng chọn CV để ứng tuyển');
      return;
    }

    try {
      setStatus('submitting');
      setLoading(true);
      setError('');

      await applicationService.applyForJob(job.job_id, {
        resume_id: selectedResumeId,
        cover_letter: coverLetter || undefined,
      });

      setStatus('success');
      message.success('Ứng tuyển thành công!');
      
      // Call success callback after delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error applying for job:', error);
      setStatus('error');
      const errorMessage = error.response?.data?.message || error.message || 'Không thể ứng tuyển. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const format = (num) => new Intl.NumberFormat('vi-VN').format(num);
    if (min && max) return `${format(min)} - ${format(max)} đ`;
    if (min) return `Từ ${format(min)} đ`;
    return `Đến ${format(max)} đ`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Ứng tuyển công việc</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success State */}
          {status === 'success' && (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ứng tuyển thành công!</h3>
              <p className="text-gray-600">
                Hồ sơ của bạn đã được gửi đến nhà tuyển dụng. 
                Bạn sẽ nhận được thông báo khi có phản hồi.
              </p>
            </div>
          )}

          {/* Form State */}
          {status !== 'success' && (
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Job Info Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                      {job?.company_logo ? (
                        <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{job?.title}</h3>
                      <p className="text-sm text-blue-600">{job?.company_name}</p>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                        {job?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatSalary(job?.salary_min, job?.salary_max)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Lỗi</p>
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                {/* Resume Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Chọn CV để ứng tuyển <span className="text-red-500">*</span>
                  </label>
                  
                  {loadingResumes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>
                  ) : resumes.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-3">Bạn chưa có CV nào</p>
                      <a 
                        href="/user/resumes/create"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Tạo CV ngay
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {resumes.map(resume => (
                        <label 
                          key={resume.resume_id}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedResumeId === resume.resume_id
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="resume"
                            value={resume.resume_id}
                            checked={selectedResumeId === resume.resume_id}
                            onChange={() => setSelectedResumeId(resume.resume_id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <FileText className={`w-5 h-5 ${
                            selectedResumeId === resume.resume_id ? 'text-blue-600' : 'text-gray-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {resume.title || 'CV không tên'}
                            </p>
                            <p className="text-xs text-gray-500">
                              Cập nhật: {new Date(resume.updated_at).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          {resume.is_default && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
                              Mặc định
                            </span>
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-2">
                    Thư giới thiệu (không bắt buộc)
                  </label>
                  <textarea
                    id="coverLetter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Giới thiệu bản thân và lý do bạn phù hợp với vị trí này..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    maxLength={2000}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {coverLetter.length}/2000 ký tự
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 rounded-b-2xl">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedResumeId || resumes.length === 0}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Briefcase className="w-4 h-4" />
                      Ứng tuyển ngay
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

ApplyJobModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  job: PropTypes.shape({
    job_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    company_name: PropTypes.string,
    company_logo: PropTypes.string,
    location: PropTypes.string,
    salary_min: PropTypes.number,
    salary_max: PropTypes.number,
  }),
  onSuccess: PropTypes.func,
};

export default ApplyJobModal;
