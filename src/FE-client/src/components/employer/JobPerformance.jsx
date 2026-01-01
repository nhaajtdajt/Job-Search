import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TrendingUp, Eye, Users, BarChart3 } from 'lucide-react';
import { jobService } from '../../services/jobService';

/**
 * JobPerformance Component
 * Shows job performance metrics with simple bar visualization
 */
export default function JobPerformance({ limit = 5 }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadJobPerformance();
  }, [limit]);

  const loadJobPerformance = async () => {
    try {
      setLoading(true);
      const response = await jobService.getMyJobs({ limit: limit });
      const jobsList = response?.data || response?.jobs || response || [];
      // Sort by views to show best performing jobs
      const sortedJobs = Array.isArray(jobsList) 
        ? [...jobsList].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit)
        : [];
      setJobs(sortedJobs);
    } catch (err) {
      console.error('Error loading job performance:', err);
      setError('Không thể tải dữ liệu hiệu suất');
    } finally {
      setLoading(false);
    }
  };

  const maxViews = Math.max(...jobs.map(j => j.views || 0), 1);
  const maxApplications = Math.max(...jobs.map(j => j.applications_count || 0), 1);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hiệu suất tin tuyển dụng</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Hiệu suất tin tuyển dụng</h2>
        <p className="text-red-500 text-center py-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          Hiệu suất tin tuyển dụng
        </h2>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có dữ liệu hiệu suất</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const viewsPercentage = ((job.views || 0) / maxViews) * 100;
            const applicationsPercentage = ((job.applications_count || 0) / maxApplications) * 100;
            
            return (
              <div key={job.job_id || job.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 truncate max-w-[200px]">
                    {job.job_title || job.title || 'Không có tiêu đề'}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-blue-600">
                      <Eye className="w-4 h-4" />
                      {job.views || 0}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Users className="w-4 h-4" />
                      {job.applications_count || 0}
                    </span>
                  </div>
                </div>
                
                {/* Views bar */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Lượt xem</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${viewsPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Applications bar */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-16">Ứng tuyển</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                      style={{ width: `${applicationsPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

JobPerformance.propTypes = {
  limit: PropTypes.number,
};
