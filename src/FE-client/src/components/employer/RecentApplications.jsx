import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { User, Clock, CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import applicationService from '../../services/applicationService';

/**
 * RecentApplications Component
 * Shows recent job applications for employer
 */
export default function RecentApplications({ limit = 5 }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadApplications();
  }, [limit]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getEmployerApplications({
        page: 1,
        limit: limit,
        sort: 'applied_at:desc'
      });
      setApplications(response.data || response || []);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError('Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: <Clock className="w-4 h-4" />,
        text: 'Chờ xử lý',
        className: 'bg-yellow-100 text-yellow-700',
      },
      reviewing: {
        icon: <Eye className="w-4 h-4" />,
        text: 'Đang xem xét',
        className: 'bg-blue-100 text-blue-700',
      },
      shortlisted: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Đã chọn',
        className: 'bg-green-100 text-green-700',
      },
      rejected: {
        icon: <XCircle className="w-4 h-4" />,
        text: 'Từ chối',
        className: 'bg-red-100 text-red-700',
      },
      hired: {
        icon: <CheckCircle className="w-4 h-4" />,
        text: 'Đã tuyển',
        className: 'bg-purple-100 text-purple-700',
      },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ứng viên mới nhất</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ứng viên mới nhất</h2>
        <p className="text-red-500 text-center py-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Ứng viên mới nhất</h2>
        <Link 
          to="/employer/applications" 
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          Xem tất cả →
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có ứng viên nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const statusConfig = getStatusConfig(app.status);
            return (
              <div
                key={app.application_id || app.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {app.user?.name?.charAt(0) || app.applicant_name?.charAt(0) || <User className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {app.user?.name || app.applicant_name || 'Ứng viên'}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {app.job?.job_title || app.job_title || 'Vị trí không xác định'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {app.applied_at ? new Date(app.applied_at).toLocaleDateString('vi-VN') : ''}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}>
                  {statusConfig.icon}
                  {statusConfig.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

RecentApplications.propTypes = {
  limit: PropTypes.number,
};
