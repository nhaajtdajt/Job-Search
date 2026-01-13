/**
 * JobListItem Component
 * Enhanced job card for job listing with more details and actions
 */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  MapPin, 
  Clock, 
  Building2,
  Briefcase,
  Users
} from 'lucide-react';
import SaveJobButton from './SaveJobButton';

function JobListItem({ 
  job, 
  showSaveButton = true,
  compact = false,
}) {
  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const format = (num) => {
      if (num >= 1000000) return `${(num / 1000000).toFixed(0)}tr`;
      if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
      return num;
    };
    if (min && max) return `${format(min)} - ${format(max)}`;
    if (min) return `Từ ${format(min)}`;
    return `Đến ${format(max)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString('vi-VN');
  };

  const getJobTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-blue-100 text-blue-700',
      'Toàn thời gian': 'bg-blue-100 text-blue-700',
      'Part-time': 'bg-purple-100 text-purple-700',
      'Bán thời gian': 'bg-purple-100 text-purple-700',
      'Contract': 'bg-orange-100 text-orange-700',
      'Hợp đồng': 'bg-orange-100 text-orange-700',
      'Freelance': 'bg-green-100 text-green-700',
      'Tự do': 'bg-green-100 text-green-700',
      'Internship': 'bg-pink-100 text-pink-700',
      'Thực tập': 'bg-pink-100 text-pink-700',
      'Remote': 'bg-teal-100 text-teal-700',
      'Làm từ xa': 'bg-teal-100 text-teal-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  // Translate job type to Vietnamese
  const translateJobType = (type) => {
    const translations = {
      'Full-time': 'Toàn thời gian',
      'Part-time': 'Bán thời gian',
      'Contract': 'Hợp đồng',
      'Freelance': 'Tự do',
      'Internship': 'Thực tập',
      'Remote': 'Làm từ xa',
    };
    return translations[type] || type;
  };

  if (compact) {
    return (
      <Link 
        to={`/jobs/${job.job_id}`}
        className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-200 transition-all duration-200"
      >
        <div className="flex items-start gap-3">
          {/* Company Logo */}
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{job.job_title || job.title}</h3>
            <p className="text-sm text-gray-600">{job.company_name}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location || 'Chưa xác định'}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-xs font-medium text-green-600">VND</span>
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
            </div>
          </div>
          {showSaveButton && (
            <SaveJobButton jobId={job.job_id} initialSaved={job.is_saved} size="sm" />
          )}
        </div>
      </Link>
    );
  }

  return (
    <div 
      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 group"
      role="article"
      aria-label={`Việc làm: ${job.job_title || job.title} tại ${job.company_name}`}
    >
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:ring-2 group-hover:ring-blue-200 transition-all">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link 
                to={`/jobs/${job.job_id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1 focus-ring rounded"
              >
                {job.job_title || job.title}
              </Link>
              <Link 
                to={`/companies/${job.company_id}`}
                className="text-blue-600 hover:text-blue-700 font-medium focus-ring rounded"
              >
                {job.company_name}
              </Link>
            </div>
            {showSaveButton && (
              <SaveJobButton jobId={job.job_id} initialSaved={job.is_saved} size="md" />
            )}
          </div>

          {/* Level 1: Always visible - Core info */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400" aria-hidden="true" />
              <span>{job.location || 'Chưa xác định'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-green-600">VND</span>
              <span className="font-medium text-green-600">
                {formatSalary(job.salary_min, job.salary_max)}
              </span>
            </span>
            {/* Job type badge - always visible as it's important */}
            {job.job_type && (
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getJobTypeColor(job.job_type)}`}>
                {translateJobType(job.job_type)}
              </span>
            )}
          </div>

          {/* Level 2: Progressive disclosure - Show on hover with animation */}
          <div className="overflow-hidden transition-all duration-300 ease-out max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-3">
            <div className="flex flex-wrap items-center gap-2">
              {/* Urgent/Hot badges */}
              {job.is_urgent && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 animate-fadeIn">
                  🔥 Tuyển gấp
                </span>
              )}
              {job.is_hot && (
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-700 animate-fadeIn">
                  ⭐ Hot
                </span>
              )}
              {/* Experience level */}
              {job.experience_level && (
                <span className="flex items-center gap-1 text-xs text-gray-500 animate-fadeIn">
                  <Briefcase className="w-3 h-3" aria-hidden="true" />
                  {job.experience_level}
                </span>
              )}
              {/* Application count */}
              {job.application_count > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500 animate-fadeIn">
                  <Users className="w-3 h-3" aria-hidden="true" />
                  {job.application_count} ứng viên
                </span>
              )}
              {/* Skills - limited to 2 on hover */}
              {job.skills?.slice(0, 2).map((skill, index) => (
                <span 
                  key={skill} 
                  className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 animate-fadeIn stagger-${index + 1}`}
                >
                  {skill}
                </span>
              ))}
              {job.skills?.length > 2 && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-500 animate-fadeIn stagger-3">
                  +{job.skills.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-accessible-gray flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {formatDate(job.created_at)}
            </span>
            <Link
              to={`/jobs/${job.job_id}`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 focus-ring rounded px-1"
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

JobListItem.propTypes = {
  job: PropTypes.shape({
    job_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    job_title: PropTypes.string,
    title: PropTypes.string,
    company_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    company_name: PropTypes.string,
    company_logo: PropTypes.string,
    location: PropTypes.string,
    salary_min: PropTypes.number,
    salary_max: PropTypes.number,
    job_type: PropTypes.string,
    experience_level: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    application_count: PropTypes.number,
    is_saved: PropTypes.bool,
    is_urgent: PropTypes.bool,
    is_hot: PropTypes.bool,
    created_at: PropTypes.string,
  }).isRequired,
  showSaveButton: PropTypes.bool,
  compact: PropTypes.bool,
};

export default JobListItem;
