import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  FileText,
  History,
  Loader2
} from 'lucide-react';
import { message } from 'antd';

// Components
import ResumeViewer from '../../components/employer/ResumeViewer';
import { STATUS_CONFIG } from '../../components/employer/ApplicationStatusUpdater';

// Services
import applicationService from '../../services/applicationService';

/**
 * CandidateProfile Page
 * View full candidate profile with resume and application history
 */
export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);

  /**
   * Load candidate profile
   */
  const loadCandidate = useCallback(async () => {
    try {
      setLoading(true);
      const data = await applicationService.getCandidateProfile(id);
      setCandidate(data);
    } catch (error) {
      console.error('Error loading candidate:', error);
      message.error('Không thể tải thông tin ứng viên');
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Load application history
   */
  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const data = await applicationService.getCandidateHistory(id);
      setApplications(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setHistoryLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCandidate();
    loadHistory();
  }, [loadCandidate, loadHistory]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <User className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy ứng viên</h2>
        <button
          onClick={() => navigate('/employer/applications')}
          className="text-orange-600 hover:text-orange-700"
        >
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  const resume = candidate.resume || candidate.resumes?.[0] || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {(candidate.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {candidate.name || 'Ứng viên'}
              </h1>
              <p className="text-gray-600">{candidate.title || 'Ứng viên'}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                {candidate.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {candidate.email}
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {candidate.phone}
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {candidate.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            {candidate.summary && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Giới thiệu
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">{candidate.summary}</p>
              </div>
            )}

            {/* Experience */}
            {resume.experiences?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-500" />
                  Kinh nghiệm làm việc
                </h2>
                <div className="space-y-4">
                  {resume.experiences.map((exp, idx) => (
                    <div key={idx} className="border-l-2 border-orange-200 pl-4">
                      <h3 className="font-semibold text-gray-900">{exp.position || exp.title}</h3>
                      <p className="text-orange-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.start_date} - {exp.end_date || 'Hiện tại'}
                      </p>
                      {exp.description && (
                        <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.educations?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-500" />
                  Học vấn
                </h2>
                <div className="space-y-4">
                  {resume.educations.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-purple-200 pl-4">
                      <h3 className="font-semibold text-gray-900">{edu.school || edu.institution}</h3>
                      <p className="text-purple-600">{edu.degree} - {edu.field}</p>
                      <p className="text-sm text-gray-500">
                        {edu.start_year} - {edu.end_year || 'Hiện tại'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Viewer */}
            <ResumeViewer
              resumeUrl={resume.cv_url}
              resumeTitle={resume.title || 'CV ứng viên'}
            />
          </div>

          {/* Right Column - Application History & Skills */}
          <div className="space-y-6">
            {/* Skills */}
            {resume.skills?.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-500" />
                  Kỹ năng
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                    >
                      {skill.name || skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Application History */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <History className="w-5 h-5 text-blue-500" />
                Lịch sử ứng tuyển
              </h2>
              
              {historyLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : applications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Chưa có lịch sử ứng tuyển
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {applications.map((app) => {
                    const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                    return (
                      <Link
                        key={app.application_id || app.id}
                        to={`/employer/applications/${app.application_id || app.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 text-sm">
                            {app.job?.job_title || app.job_title || '-'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(app.applied_at)}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contact Actions */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Liên hệ</h2>
              <div className="space-y-2">
                {candidate.email && (
                  <a
                    href={`mailto:${candidate.email}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <Mail className="w-4 h-4" />
                    Gửi email
                  </a>
                )}
                {candidate.phone && (
                  <a
                    href={`tel:${candidate.phone}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    <Phone className="w-4 h-4" />
                    Gọi điện
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
