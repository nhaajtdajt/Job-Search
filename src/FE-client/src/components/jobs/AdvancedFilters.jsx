/**
 * AdvancedFilters Component
 * Comprehensive job search filters with collapsible sections
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { 
  ChevronDown, 
  ChevronUp,
  MapPin, 
  Clock, 
  DollarSign,
  Briefcase,
  GraduationCap,
  Building2,
  X,
  RotateCcw
} from 'lucide-react';

const JOB_TYPES = [
  { value: 'full-time', label: 'Toàn thời gian' },
  { value: 'part-time', label: 'Bán thời gian' },
  { value: 'contract', label: 'Hợp đồng' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Thực tập' },
  { value: 'remote', label: 'Làm từ xa' },
];

const EXPERIENCE_LEVELS = [
  { value: 'fresher', label: 'Fresher (0-1 năm)' },
  { value: 'junior', label: 'Junior (1-2 năm)' },
  { value: 'mid', label: 'Mid-level (2-5 năm)' },
  { value: 'senior', label: 'Senior (5+ năm)' },
  { value: 'lead', label: 'Lead/Manager' },
];

const SALARY_RANGES = [
  { value: '0-10', label: 'Dưới 10 triệu', min: 0, max: 10000000 },
  { value: '10-15', label: '10 - 15 triệu', min: 10000000, max: 15000000 },
  { value: '15-20', label: '15 - 20 triệu', min: 15000000, max: 20000000 },
  { value: '20-30', label: '20 - 30 triệu', min: 20000000, max: 30000000 },
  { value: '30-50', label: '30 - 50 triệu', min: 30000000, max: 50000000 },
  { value: '50+', label: 'Trên 50 triệu', min: 50000000, max: null },
];

const POSTED_WITHIN = [
  { value: '1', label: '24 giờ qua' },
  { value: '3', label: '3 ngày qua' },
  { value: '7', label: '7 ngày qua' },
  { value: '14', label: '14 ngày qua' },
  { value: '30', label: '30 ngày qua' },
];

function FilterSection({ title, icon: Icon, children, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-200 py-4 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 font-medium text-gray-900">
          <Icon className="w-4 h-4 text-gray-500" />
          {title}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function AdvancedFilters({ 
  filters = {}, 
  onFiltersChange,
  locations = [],
  industries = [],
}) {
  const [localFilters, setLocalFilters] = useState({
    job_types: [],
    experience_levels: [],
    salary_range: '',
    locations: [],
    posted_within: '',
    is_remote: false,
    ...filters,
  });

  useEffect(() => {
    setLocalFilters(prev => ({ ...prev, ...filters }));
  }, [filters]);

  const handleCheckboxChange = (field, value) => {
    const currentValues = localFilters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    const newFilters = { ...localFilters, [field]: newValues };
    setLocalFilters(newFilters);
    // Defer callback to avoid state update during render
    setTimeout(() => onFiltersChange?.(newFilters), 0);
  };

  const handleRadioChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    setTimeout(() => onFiltersChange?.(newFilters), 0);
  };

  const handleToggle = (field) => {
    const newFilters = { ...localFilters, [field]: !localFilters[field] };
    setLocalFilters(newFilters);
    setTimeout(() => onFiltersChange?.(newFilters), 0);
  };

  const handleReset = () => {
    const resetFilters = {
      job_types: [],
      experience_levels: [],
      salary_range: '',
      locations: [],
      posted_within: '',
      is_remote: false,
    };
    setLocalFilters(resetFilters);
    onFiltersChange?.(resetFilters);
  };

  const activeFiltersCount = 
    localFilters.job_types.length +
    localFilters.experience_levels.length +
    (localFilters.salary_range ? 1 : 0) +
    localFilters.locations.length +
    (localFilters.posted_within ? 1 : 0) +
    (localFilters.is_remote ? 1 : 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          Bộ lọc
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleReset}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div className="px-4">
        {/* Remote Toggle */}
        <div className="py-4 border-b border-gray-200">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="flex items-center gap-2 font-medium text-gray-900">
              <MapPin className="w-4 h-4 text-gray-500" />
              Làm việc từ xa
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={localFilters.is_remote}
                onChange={() => handleToggle('is_remote')}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                localFilters.is_remote ? 'bg-blue-600' : 'bg-gray-200'
              }`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform absolute top-0.5 ${
                  localFilters.is_remote ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </div>
            </div>
          </label>
        </div>

        {/* Job Types */}
        <FilterSection title="Loại công việc" icon={Briefcase}>
          {JOB_TYPES.map(type => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.job_types.includes(type.value)}
                onChange={() => handleCheckboxChange('job_types', type.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{type.label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Experience Level */}
        <FilterSection title="Kinh nghiệm" icon={GraduationCap}>
          {EXPERIENCE_LEVELS.map(level => (
            <label key={level.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={localFilters.experience_levels.includes(level.value)}
                onChange={() => handleCheckboxChange('experience_levels', level.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{level.label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Salary Range */}
        <FilterSection title="Mức lương" icon={DollarSign}>
          {SALARY_RANGES.map(range => (
            <label key={range.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="salary_range"
                checked={localFilters.salary_range === range.value}
                onChange={() => handleRadioChange('salary_range', range.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{range.label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Posted Within */}
        <FilterSection title="Thời gian đăng" icon={Clock} defaultOpen={false}>
          {POSTED_WITHIN.map(option => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="posted_within"
                checked={localFilters.posted_within === option.value}
                onChange={() => handleRadioChange('posted_within', option.value)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
            </label>
          ))}
        </FilterSection>

        {/* Locations - if provided */}
        {locations.length > 0 && (
          <FilterSection title="Địa điểm" icon={MapPin} defaultOpen={false}>
            {locations.slice(0, 10).map(location => (
              <label key={location.value || location} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.locations.includes(location.value || location)}
                  onChange={() => handleCheckboxChange('locations', location.value || location)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {location.label || location}
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* Industries - if provided */}
        {industries.length > 0 && (
          <FilterSection title="Ngành nghề" icon={Building2} defaultOpen={false}>
            {industries.slice(0, 10).map(industry => (
              <label key={industry.value || industry} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.industries?.includes(industry.value || industry)}
                  onChange={() => handleCheckboxChange('industries', industry.value || industry)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {industry.label || industry}
                </span>
              </label>
            ))}
          </FilterSection>
        )}
      </div>
    </div>
  );
}

AdvancedFilters.propTypes = {
  filters: PropTypes.object,
  onFiltersChange: PropTypes.func,
  locations: PropTypes.array,
  industries: PropTypes.array,
};

export default AdvancedFilters;
