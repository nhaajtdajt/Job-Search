import PropTypes from 'prop-types';
import { CheckCircle, XCircle, Clock, FileText } from 'lucide-react';

/**
 * JobStatusOverview Component
 * Displays job status breakdown with icons and colors
 */
export default function JobStatusOverview({ activeJobs = 0, expiredJobs = 0, draftJobs = 0, isLoading = false }) {
  const statuses = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      label: 'Đang hoạt động',
      value: activeJobs,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: <XCircle className="w-5 h-5" />,
      label: 'Hết hạn',
      value: expiredJobs,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Nháp',
      value: draftJobs,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="h-5 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-500" />
        Trạng thái tin tuyển dụng
      </h3>
      
      <div className="grid grid-cols-3 gap-4">
        {statuses.map((status, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${status.bgColor} ${status.borderColor} transition hover:shadow-md`}
          >
            <div className={`flex items-center gap-2 ${status.color} mb-2`}>
              {status.icon}
              <span className="text-sm font-medium">{status.label}</span>
            </div>
            <p className={`text-2xl font-bold ${status.color}`}>
              {status.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

JobStatusOverview.propTypes = {
  activeJobs: PropTypes.number,
  expiredJobs: PropTypes.number,
  draftJobs: PropTypes.number,
  isLoading: PropTypes.bool,
};
