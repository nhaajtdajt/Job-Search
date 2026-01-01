/**
 * ResumePreview Page
 * Display a printable preview of the resume
 */
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Edit2, 
  Mail, 
  Phone, 
  MapPin,
  GraduationCap,
  Briefcase,
  Code,
  Calendar,
  Loader2,
  Printer
} from 'lucide-react';
import { message } from 'antd';
import resumeService from '../../services/resumeService';

function ResumePreview() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  const loadResume = async () => {
    try {
      setLoading(true);
      const response = await resumeService.getResumeById(resumeId);
      if (response.success && response.data) {
        setResume(response.data);
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      message.error('Không thể tải CV');
      navigate('/user/resumes');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Hiện tại';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Không tìm thấy CV</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar - Hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/user/resumes" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="font-semibold text-gray-900">Xem trước CV</h1>
              <p className="text-sm text-gray-500">{resume.resume_title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              In CV
            </button>
            {resume.resume_url && (
              <a
                href={resume.resume_url}
                download
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Tải PDF
              </a>
            )}
            <Link
              to={`/user/resumes/${resumeId}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa
            </Link>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="max-w-4xl mx-auto px-4 py-8 print:p-0 print:max-w-none">
        <div className="bg-white rounded-xl shadow-lg print:shadow-none print:rounded-none overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 print:p-6">
            <h1 className="text-3xl font-bold mb-2">
              {resume.user?.name || 'Họ và tên'}
            </h1>
            <p className="text-blue-100 text-lg mb-4">{resume.resume_title}</p>
            
            <div className="flex flex-wrap gap-4 text-sm">
              {resume.user?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{resume.user.email}</span>
                </div>
              )}
              {resume.user?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{resume.user.phone}</span>
                </div>
              )}
              {resume.user?.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{resume.user.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 print:p-6 space-y-8">
            {/* Summary */}
            {resume.summary && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                  Giới thiệu bản thân
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {resume.summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {resume.experiences && resume.experiences.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  Kinh nghiệm làm việc
                </h2>
                <div className="space-y-4">
                  {resume.experiences.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-600" />
                      <div className="flex flex-wrap items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{exp.job_title}</h3>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium mb-2">{exp.company_name}</p>
                      {exp.description && (
                        <p className="text-gray-600 text-sm whitespace-pre-line">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {resume.educations && resume.educations.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Học vấn
                </h2>
                <div className="space-y-4">
                  {resume.educations.map((edu, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-gray-200">
                      <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-600" />
                      <div className="flex flex-wrap items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{edu.school_name}</h3>
                        <span className="text-sm text-gray-500">
                          {edu.start_year} - {edu.end_year || 'Hiện tại'}
                        </span>
                      </div>
                      <p className="text-green-600 font-medium">{edu.degree}</p>
                      <p className="text-gray-600 text-sm">{edu.major}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600 flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  Kỹ năng
                </h2>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {skill.skill_name || skill.name}
                      {skill.level && (
                        <span className="ml-1 text-gray-500">• {skill.level}</span>
                      )}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:p-6 { padding: 1.5rem !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:max-w-none { max-width: none !important; }
        }
      `}</style>
    </div>
  );
}

export default ResumePreview;
