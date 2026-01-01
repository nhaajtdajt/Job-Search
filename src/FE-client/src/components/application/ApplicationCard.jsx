/**
 * ApplicationCard Component
 * Displays a job seeker's application with status and actions
 */
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  Building2, 
  MapPin, 
  Calendar,
  ExternalLink,
  Trash2,
  Eye
} from 'lucide-react';
import ApplicationStatusBadge from './ApplicationStatusBadge';

function ApplicationCard({ 
  application, 
  onWithdraw,
  showActions = true,
}) {
  const job = application.job || {};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return formatDate(dateString);
  };

  const canWithdraw = application.status === 'pending';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-200">
      <div className="flex gap-4">
        {/* Company Logo */}
        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {job.company_logo ? (
            <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-7 h-7 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Link 
                to={`/jobs/${job.job_id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
              >
                {job.title || 'Công việc'}
              </Link>
              <p className="text-blue-600 font-medium">{job.company_name || 'Công ty'}</p>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gray-400" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              Ứng tuyển: {getTimeAgo(application.applied_at)}
            </span>
          </div>

          {/* Resume used */}
          {application.resume?.title && (
            <p className="mt-2 text-sm text-gray-500">
              CV: <span className="font-medium text-gray-700">{application.resume.title}</span>
            </p>
          )}

          {/* Status Timeline */}
          {application.status_updated_at && application.status !== 'pending' && (
            <p className="mt-2 text-xs text-gray-500">
              Cập nhật trạng thái: {formatDate(application.status_updated_at)}
            </p>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
              <Link
                to={`/user/applications/${application.application_id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-4 h-4" />
                Xem chi tiết
              </Link>
              <Link
                to={`/jobs/${job.job_id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
                Xem việc làm
              </Link>
              {canWithdraw && onWithdraw && (
                <button
                  onClick={() => onWithdraw(application.application_id)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 ml-auto"
                >
                  <Trash2 className="w-4 h-4" />
                  Rút đơn
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ApplicationCard.propTypes = {
  application: PropTypes.shape({
    application_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
    applied_at: PropTypes.string,
    status_updated_at: PropTypes.string,
    job: PropTypes.shape({
      job_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string,
      company_name: PropTypes.string,
      company_logo: PropTypes.string,
      location: PropTypes.string,
    }),
    resume: PropTypes.shape({
      title: PropTypes.string,
    }),
  }).isRequired,
  onWithdraw: PropTypes.func,
  showActions: PropTypes.bool,
};

export default ApplicationCard;
