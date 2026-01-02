/**
 * ApplicationDetail Page (Job Seeker Side)
 * Shows detailed view of a job application
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft,
  Building2, 
  MapPin, 
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { message, Modal } from 'antd';
import applicationService from '../../services/applicationService';
import ApplicationStatusBadge from '../../components/application/ApplicationStatusBadge';

// Status timeline steps
const STATUS_STEPS = [
  { key: 'pending', label: 'Đã nộp', description: 'Hồ sơ của bạn đã được gửi' },
  { key: 'reviewing', label: 'Đang xem xét', description: 'Nhà tuyển dụng đang xem hồ sơ' },
  { key: 'shortlisted', label: 'Được chọn', description: 'Bạn trong danh sách rút gọn' },
  { key: 'interview', label: 'Phỏng vấn', description: 'Lên lịch phỏng vấn' },
  { key: 'offered', label: 'Offer', description: 'Nhận được offer' },
];

function ApplicationDetail() {
  const { applicationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      setLoading(true);
      // Since we're job seeker, we use getMyApplications and find by ID
      const applications = await applicationService.getMyApplications();
      const appList = applications?.data || applications || [];
      const app = appList.find(a => String(a.application_id) === String(applicationId));
      
      if (app) {
        setApplication(app);
      } else {
        message.error('Không tìm thấy đơn ứng tuyển');
        navigate('/user/my-jobs');
      }
    } catch (error) {
      console.error('Error loading application:', error);
      message.error('Không thể tải thông tin đơn ứng tuyển');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = () => {
    Modal.confirm({
      title: 'Rút đơn ứng tuyển?',
      content: 'Bạn có chắc chắn muốn rút đơn ứng tuyển này? Hành động này không thể hoàn tác.',
      okText: 'Rút đơn',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setWithdrawing(true);
          await applicationService.deleteApplication(applicationId);
          message.success('Đã rút đơn ứng tuyển');
          navigate('/user/my-jobs');
        } catch (error) {
          console.error('Error withdrawing application:', error);
          message.error('Không thể rút đơn ứng tuyển');
        } finally {
          setWithdrawing(false);
        }
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusStepIndex = (status) => {
    const index = STATUS_STEPS.findIndex(s => s.key === status);
    return index >= 0 ? index : -1;
  };

  const isRejected = application?.status === 'rejected';
  const isWithdrawn = application?.status === 'withdrawn';
  const canWithdraw = application?.status === 'pending';
  const currentStepIndex = getStatusStepIndex(application?.status);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!application) {
    return null;
  }

  const job = application.job || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/user/my-jobs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex gap-5">
            {/* Company Logo */}
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {job.company_logo ? (
                <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-gray-400" />
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <Link to={`/companies/${job.company_id}`} className="text-lg text-blue-600 hover:text-blue-700">
                    {job.company_name}
                  </Link>
                </div>
                <ApplicationStatusBadge status={application.status} size="lg" />
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                {job.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {job.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  Ứng tuyển lúc: {formatDate(application.applied_at)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4">
                <Link
                  to={`/jobs/${job.job_id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Xem việc làm
                </Link>
                {canWithdraw && (
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Rút đơn
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Trạng thái đơn ứng tuyển</h2>
              
              {isRejected ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800">Đơn ứng tuyển bị từ chối</p>
                    <p className="text-sm text-red-600 mt-1">
                      Rất tiếc, nhà tuyển dụng đã từ chối đơn ứng tuyển của bạn. 
                      Đừng nản lòng, hãy tiếp tục ứng tuyển các vị trí khác!
                    </p>
                  </div>
                </div>
              ) : isWithdrawn ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">Đơn ứng tuyển đã rút</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Bạn đã rút đơn ứng tuyển này.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.key} className="flex gap-4 mb-6 last:mb-0">
                        {/* Line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                            isCompleted 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          {index < STATUS_STEPS.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 ${
                              index < currentStepIndex ? 'bg-green-300' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pb-6">
                          <p className={`font-medium ${
                            isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                                Hiện tại
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Cover Letter */}
            {application.cover_letter && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thư giới thiệu</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{application.cover_letter}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume Used */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                CV đã sử dụng
              </h3>
              {application.resume ? (
                <Link
                  to={`/user/resumes/${application.resume.resume_id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <p className="font-medium text-gray-900">{application.resume.title || 'CV'}</p>
                  <p className="text-xs text-gray-500 mt-1">Nhấn để xem chi tiết</p>
                </Link>
              ) : (
                <p className="text-sm text-gray-500">Không có thông tin CV</p>
              )}
            </div>

            {/* Timeline Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Thời gian
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày nộp:</span>
                  <span className="text-gray-900 font-medium">{formatDate(application.applied_at)}</span>
                </div>
                {application.status_updated_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cập nhật:</span>
                    <span className="text-gray-900 font-medium">{formatDate(application.status_updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Mẹo nhỏ</h3>
              <p className="text-sm text-blue-700">
                Nhà tuyển dụng thường phản hồi trong vòng 1-2 tuần. 
                Hãy tiếp tục ứng tuyển các vị trí khác để tăng cơ hội!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;
