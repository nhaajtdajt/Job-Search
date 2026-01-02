/**
 * JobDetail Page
 * Displays full details of a job and allows users to apply
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  Users, 
  ChevronLeft,
  Share2,
  Flag,
  Calendar,
  CheckCircle2,

  Loader2,
  Globe,
  Mail,
  Phone
} from 'lucide-react';
import { message } from 'antd';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../contexts/AuthContext';
import SaveJobButton from '../../components/jobs/SaveJobButton';
import { ApplyJobModal } from '../../components/application';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobById(id);
      if (data) {
        setJob(data);
      } else {
        setError('Không tìm thấy thông tin công việc');
      }
    } catch (err) {
      console.error('Error fetching job detail:', err);
      setError('Đã có lỗi xảy ra khi tải thông tin công việc');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      message.info('Vui lòng đăng nhập để ứng tuyển công việc này');
      navigate('/login', { state: { from: `/jobs/${id}` } });
      return;
    }
    if (user.role !== 'job_seeker') {
      message.warning('Tài khoản nhà tuyển dụng không thể ứng tuyển');
      return;
    }
    setIsApplyModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Đã sao chép liên kết công việc');
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Thỏa thuận';
    const format = (num) => new Intl.NumberFormat('vi-VN').format(num);
    if (min && max) return `${format(min)} - ${format(max)} đ`;
    if (min) return `Từ ${format(min)} đ`;
    return `Đến ${format(max)} đ`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-6">{error || 'Không tìm thấy công việc'}</p>
          <button
            onClick={() => navigate('/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Quay lại danh sách việc làm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header / Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Quay lại
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center flex-shrink-0 p-2">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {job.title}
                  </h1>
                  <Link 
                    to={`/companies/${job.company_id}`}
                    className="text-lg font-medium text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
                  >
                    {job.company_name}
                  </Link>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-700">
                        {formatSalary(job.salary_min, job.salary_max)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Briefcase className="w-5 h-5 text-gray-400 mr-2" />
                      <span>{job.job_type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Mobile only, visible on top) */}
              <div className="flex lg:hidden gap-3 mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={handleApplyClick}
                  className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-sm"
                >
                  Ứng tuyển ngay
                </button>
                <div className="flex gap-2">
                  <SaveJobButton jobId={job.job_id} initialSaved={job.is_saved} size="lg" />
                  <button onClick={handleShare} className="p-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                Chi tiết công việc
              </h2>
              
              <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
                {/* Description - Assuming HTML or text. For now treating as text with newlines */}
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 block">Mô tả công việc</h3>
                  <div className="whitespace-pre-line leading-relaxed">
                    {job.description || 'Chưa có mô tả chi tiết.'}
                  </div>
                </section>

                {job.requirements && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 block">Yêu cầu ứng viên</h3>
                    <div className="whitespace-pre-line leading-relaxed">
                      {job.requirements}
                    </div>
                  </section>
                )}

                {job.benefits && (
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 block">Quyền lợi</h3>
                    <div className="whitespace-pre-line leading-relaxed">
                      {job.benefits}
                    </div>
                  </section>
                )}
              </div>
            </div>
            
            {/* Warning/Report */}
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex gap-3 text-sm text-amber-800">
              <Flag className="w-5 h-5 flex-shrink-0" />
              <p>
                Báo cáo tin tuyển dụng này nếu bạn thấy có dấu hiệu lừa đảo, sai sự thật hoặc nội dung không phù hợp. 
                <button className="font-semibold underline ml-1 hover:text-amber-900">Báo cáo ngay</button>
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Action Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Ứng tuyển công việc này</h3>
              
              <button
                onClick={handleApplyClick}
                className="w-full bg-blue-600 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2 mb-3"
              >
                <Briefcase className="w-5 h-5" />
                Ứng tuyển ngay
              </button>
              
              <button
                onClick={handleApplyClick} // Or specific 'Save CV' action? No, just save job for now.
                className="w-full bg-white border border-blue-600 text-blue-600 font-bold py-3.5 px-6 rounded-xl hover:bg-blue-50 transition mb-6"
              >
                Lưu tin tuyển dụng
              </button>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Ngày đăng
                  </span>
                  <span className="font-medium text-gray-900">
                    {new Date(job.posted_at || job.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Users className="w-4 h-4" /> Số lượng tuyển
                  </span>
                  <span className="font-medium text-gray-900">
                    {job.headcount || 1} người
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Kinh nghiệm
                  </span>
                  <span className="font-medium text-gray-900">
                    {job.experience_level || 'Không yêu cầu'}
                  </span>
                </div>
              </div>
            </div>

            {/* Company Short Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center p-1">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-1">{job.company_name}</h3>
                  <Link to={`/companies/${job.company_id}`} className="text-sm text-blue-600 hover:underline">
                    Xem hồ sơ công ty
                  </Link>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="text-sm text-gray-600 line-clamp-3 italic mb-4">
                  {job.company_description || 'Chưa có mô tả về công ty.'}
                </div>

                <div className="space-y-2 text-sm">
                  {job.company_industry && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <Briefcase className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span>{job.company_industry}</span>
                    </div>
                  )}
                  {job.company_size && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{job.company_size}</span>
                    </div>
                  )}
                  {job.company_address && (
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <span className="line-clamp-2">{job.company_address}</span>
                    </div>
                  )}
                  {job.company_website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a 
                        href={job.company_website.startsWith('http') ? job.company_website : `https://${job.company_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate"
                      >
                        Website công ty
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <Link 
                to={`/companies/${job.company_id}`}
                className="block w-full py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                Xem thêm việc làm khác
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ApplyJobModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
        onSuccess={() => {
          message.success('Đã gửi hồ sơ ứng tuyển!');
          // Optionally refresh job status if we track applied status
        }}
      />
    </div>
  );
}
