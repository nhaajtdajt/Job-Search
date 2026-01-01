/**
 * EducationForm Component
 * Form for adding/editing education entries in resume
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GraduationCap, X, Save, Loader2 } from 'lucide-react';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

const degreeOptions = [
  'Trung học phổ thông',
  'Trung cấp',
  'Cao đẳng',
  'Cử nhân',
  'Kỹ sư',
  'Thạc sĩ',
  'Tiến sĩ',
  'Khác',
];

function EducationForm({ education, onSave, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    school_name: '',
    major: '',
    degree: '',
    start_year: '',
    end_year: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (education) {
      setFormData({
        school_name: education.school_name || '',
        major: education.major || '',
        degree: education.degree || '',
        start_year: education.start_year || '',
        end_year: education.end_year || '',
      });
    }
  }, [education]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.school_name.trim()) {
      newErrors.school_name = 'Vui lòng nhập tên trường';
    }
    if (!formData.major.trim()) {
      newErrors.major = 'Vui lòng nhập chuyên ngành';
    }
    if (!formData.degree) {
      newErrors.degree = 'Vui lòng chọn bằng cấp';
    }
    if (formData.start_year && formData.end_year) {
      if (parseInt(formData.end_year) < parseInt(formData.start_year)) {
        newErrors.end_year = 'Năm kết thúc phải sau năm bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        start_year: formData.start_year ? parseInt(formData.start_year) : null,
        end_year: formData.end_year ? parseInt(formData.end_year) : null,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-blue-600" />
        <h4 className="font-medium text-gray-900">
          {education ? 'Chỉnh sửa học vấn' : 'Thêm học vấn'}
        </h4>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* School Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên trường <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={handleChange}
            placeholder="VD: Đại học Bách Khoa TP.HCM"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.school_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.school_name && (
            <p className="mt-1 text-sm text-red-500">{errors.school_name}</p>
          )}
        </div>

        {/* Major */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chuyên ngành <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="major"
            value={formData.major}
            onChange={handleChange}
            placeholder="VD: Công nghệ thông tin"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.major ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.major && (
            <p className="mt-1 text-sm text-red-500">{errors.major}</p>
          )}
        </div>

        {/* Degree */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bằng cấp <span className="text-red-500">*</span>
          </label>
          <select
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.degree ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Chọn bằng cấp</option>
            {degreeOptions.map(degree => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
          {errors.degree && (
            <p className="mt-1 text-sm text-red-500">{errors.degree}</p>
          )}
        </div>

        {/* Start Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Năm bắt đầu
          </label>
          <select
            name="start_year"
            value={formData.start_year}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn năm</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* End Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Năm kết thúc
          </label>
          <select
            name="end_year"
            value={formData.end_year}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.end_year ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Đang học / Chọn năm</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.end_year && (
            <p className="mt-1 text-sm text-red-500">{errors.end_year}</p>
          )}
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
          {education ? 'Cập nhật' : 'Thêm'}
        </button>
      </div>
    </form>
  );
}

EducationForm.propTypes = {
  education: PropTypes.shape({
    education_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    school_name: PropTypes.string,
    major: PropTypes.string,
    degree: PropTypes.string,
    start_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    end_year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default EducationForm;
