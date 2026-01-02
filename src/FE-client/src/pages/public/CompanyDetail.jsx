import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, Globe, Users, Calendar, 
  CheckCircle, Briefcase, Mail, Phone, Loader2, ChevronLeft 
} from 'lucide-react';
import { companyService } from '../../services/companyService';
import JobCard from '../../components/job/JobCard';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'jobs'

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      const [companyData, jobsData] = await Promise.all([
        companyService.getById(id),
        companyService.getCompanyJobs(id)
      ]);
      setCompany(companyData);
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy công ty</h2>
        <p className="text-gray-600 mb-6">Công ty bạn tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.</p>
        <Link to="/companies" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Danh sách công ty
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Banner */}
      <div className="h-48 sm:h-64 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
        {company.banner_url && (
          <img 
            src={company.banner_url} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.company_name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{company.company_name}</h1>
                <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-50" />
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {company.industry && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    {company.industry}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {company.company_size || 'Quy mô chưa cập nhật'}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {company.address || 'Chưa cập nhật địa chỉ'}
                </span>
                {company.website && (
                  <a 
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mt-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === 'about' 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Giới thiệu công ty
              {activeTab === 'about' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                activeTab === 'jobs' 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tuyển dụng
              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-xs">
                {jobs.length}
              </span>
              {activeTab === 'jobs' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'about' ? (
              <div className="prose prose-blue max-w-none text-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Về chúng tôi</h3>
                <div className="whitespace-pre-line leading-relaxed">
                  {company.description || 'Chưa có mô tả về công ty.'}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {company.founded_year && (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Năm thành lập</div>
                      <div className="font-semibold text-gray-900">{company.founded_year}</div>
                    </div>
                  )}
                  {company.email && (
                     <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm text-gray-500 mb-1">Email liên hệ</div>
                      <div className="font-semibold text-gray-900">{company.email}</div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <JobCard 
                      key={job.job_id} 
                      id={job.job_id}
                      title={job.job_title}
                      company={job.company_name}
                      location={job.location}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Công ty hiện chưa có tin tuyển dụng nào.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
