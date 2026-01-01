/**
 * ResumeForm Component
 * Main form for creating/editing resume basic info
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FileText, Save, Loader2 } from 'lucide-react';

function ResumeForm({ resume, onSave, isLoading = false, submitLabel = 'Lưu' }) {
  const [formData, setFormData] = useState({
    resume_title: '',
    summary: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (resume) {
      setFormData({
        resume_title: resume.resume_title || '',
        summary: resume.summary || '',
      });
    }
  }, [resume]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.resume_title.trim()) {
      newErrors.resume_title = 'Vui lòng nhập tiêu đề CV';
    } else if (formData.resume_title.length > 100) {
      newErrors.resume_title = 'Tiêu đề không được quá 100 ký tự';
    }
    
    if (!formData.summary.trim()) {
      newErrors.summary = 'Vui lòng nhập giới thiệu bản thân';
    } else if (formData.summary.length < 50) {
      newErrors.summary = 'Giới thiệu nên có ít nhất 50 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resume Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline-block mr-2" />
          Tiêu đề CV <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="resume_title"
          value={formData.resume_title}
          onChange={handleChange}
          placeholder="VD: CV Frontend Developer - 3 năm kinh nghiệm"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.resume_title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.resume_title ? (
          <p className="mt-1 text-sm text-red-500">{errors.resume_title}</p>
        ) : (
          <p className="mt-1 text-sm text-gray-500">
            Đặt tên giúp bạn phân biệt các CV khi ứng tuyển nhiều vị trí
          </p>
        )}
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Giới thiệu bản thân <span className="text-red-500">*</span>
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows={6}
          placeholder="Tóm tắt về bản thân, kinh nghiệm làm việc, kỹ năng nổi bật và mục tiêu nghề nghiệp của bạn..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
            errors.summary ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <div className="flex justify-between mt-1">
          {errors.summary ? (
            <p className="text-sm text-red-500">{errors.summary}</p>
          ) : (
            <p className="text-sm text-gray-500">
              Mô tả ngắn gọn về bản thân và mục tiêu nghề nghiệp
            </p>
          )}
          <span className={`text-sm ${formData.summary.length < 50 ? 'text-orange-500' : 'text-gray-400'}`}>
            {formData.summary.length} ký tự
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

ResumeForm.propTypes = {
  resume: PropTypes.shape({
    resume_id: PropTypes.string,
    resume_title: PropTypes.string,
    summary: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  submitLabel: PropTypes.string,
};

export default ResumeForm;
