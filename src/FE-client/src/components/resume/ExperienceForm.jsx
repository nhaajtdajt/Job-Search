/**
 * ExperienceForm Component
 * Form for adding/editing work experience entries in resume
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Briefcase, X, Save, Loader2 } from 'lucide-react';

function ExperienceForm({ experience, onSave, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (experience) {
      setFormData({
        job_title: experience.job_title || '',
        company_name: experience.company_name || '',
        start_date: experience.start_date ? experience.start_date.split('T')[0] : '',
        end_date: experience.end_date ? experience.end_date.split('T')[0] : '',
        is_current: !experience.end_date,
        description: experience.description || '',
      });
    }
  }, [experience]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Clear end_date when is_current is checked
      ...(name === 'is_current' && checked ? { end_date: '' } : {}),
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Vui lòng nhập vị trí công việc';
    }
    if (!formData.company_name.trim()) {
      newErrors.company_name = 'Vui lòng nhập tên công ty';
    }
    if (formData.start_date && formData.end_date && !formData.is_current) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        job_title: formData.job_title,
        company_name: formData.company_name,
        start_date: formData.start_date || null,
        end_date: formData.is_current ? null : (formData.end_date || null),
        description: formData.description,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-green-600" />
        <h4 className="font-medium text-gray-900">
          {experience ? 'Chỉnh sửa kinh nghiệm' : 'Thêm kinh nghiệm làm việc'}
        </h4>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vị trí công việc <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleChange}
            placeholder="VD: Frontend Developer"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.job_title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.job_title && (
            <p className="mt-1 text-sm text-red-500">{errors.job_title}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên công ty <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="VD: FPT Software"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.company_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-500">{errors.company_name}</p>
          )}
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày bắt đầu
          </label>
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày kết thúc
          </label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            disabled={formData.is_current}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.end_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.end_date && (
            <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
          )}
          <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="is_current"
              checked={formData.is_current}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            Đang làm việc tại đây
          </label>
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả công việc
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Mô tả trách nhiệm, thành tựu và kỹ năng sử dụng trong công việc..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Tip: Liệt kê các thành tựu cụ thể với con số sẽ gây ấn tượng hơn với nhà tuyển dụng
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4 inline-block mr-1" />
          Hủy
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {experience ? 'Cập nhật' : 'Thêm'}
        </button>
      </div>
    </form>
  );
}

ExperienceForm.propTypes = {
  experience: PropTypes.shape({
    experience_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    job_title: PropTypes.string,
    company_name: PropTypes.string,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    description: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default ExperienceForm;
