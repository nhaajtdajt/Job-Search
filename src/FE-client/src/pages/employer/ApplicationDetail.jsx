import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Briefcase,
  FileText,
  Loader2
} from 'lucide-react';
import { message } from 'antd';

// Components
import ApplicationStatusUpdater from '../../components/employer/ApplicationStatusUpdater';
import ApplicationNotes from '../../components/employer/ApplicationNotes';
import ResumeViewer from '../../components/employer/ResumeViewer';

// Services
import applicationService from '../../services/applicationService';

/**
 * ApplicationDetail Page
 * View single application with candidate info, resume, and status management
 */
export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);

  /**
   * Load application details
   */
  const loadApplication = useCallback(async () => {
    try {
      setLoading(true);
      const data = await applicationService.getApplicationById(id);
      setApplication(data);
    } catch (error) {
      console.error('Error loading application:', error);
      message.error('Không thể tải thông tin ứng viên');
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Load notes for this application
   */
  const loadNotes = useCallback(async () => {
    try {
      setNotesLoading(true);
      const data = await applicationService.getNotes(id);
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setNotesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadApplication();
    loadNotes();
  }, [loadApplication, loadNotes]);

  /**
   * Handle status change
   */
  const handleStatusChange = async (newStatus) => {
    try {
      await applicationService.updateApplicationStatus(id, newStatus);
      setApplication(prev => ({ ...prev, status: newStatus }));
      message.success('Đã cập nhật trạng thái');
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Không thể cập nhật trạng thái');
      throw error;
    }
  };

  /**
   * Handle add note
   */
  const handleAddNote = async (noteContent) => {
    try {
      const newNote = await applicationService.addNote(id, noteContent);
      setNotes(prev => [newNote, ...prev]);
      message.success('Đã thêm ghi chú');
    } catch (error) {
      console.error('Error adding note:', error);
      // Still add locally for UX
      setNotes(prev => [{
        id: Date.now(),
        content: noteContent,
        created_at: new Date().toISOString(),
        created_by: 'Bạn'
      }, ...prev]);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!application) {
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

  const candidate = application.user || {};
  const job = application.job || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/employer/applications')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {(candidate.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {candidate.name || application.applicant_name || 'Ứng viên'}
                </h1>
                <p className="text-gray-600">
                  Ứng tuyển: {job.job_title || application.job_title || '-'}
                </p>
              </div>
            </div>
            <ApplicationStatusUpdater
              currentStatus={application.status}
              onStatusChange={handleStatusChange}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Info Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Thông tin ứng viên
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {candidate.email || application.email || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Điện thoại</p>
                    <p className="font-medium text-gray-900">
                      {candidate.phone || application.phone || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Ngày ứng tuyển</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(application.apply_date || application.applied_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Vị trí ứng tuyển</p>
                    <p className="font-medium text-gray-900">
                      {job.job_title || application.job_title || '-'}
                    </p>
                  </div>
                </div>
              </div>

              {candidate.user_id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/employer/candidates/${candidate.user_id}`}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    Xem hồ sơ đầy đủ →
                  </Link>
                </div>
              )}
            </div>

            {/* Cover Letter */}
            {application.cover_letter && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Thư giới thiệu
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {application.cover_letter}
                </div>
              </div>
            )}

            {/* Resume Viewer */}
            <ResumeViewer
              resumeUrl={application.resume?.resume_url || application.resume_url}
              resumeTitle={application.resume?.resume_title || 'CV ứng viên'}
              isLoading={false}
            />
          </div>

          {/* Right Column - Notes & Actions */}
          <div className="space-y-6">
            {/* Notes */}
            <ApplicationNotes
              notes={notes}
              onAddNote={handleAddNote}
              isLoading={notesLoading}
            />

            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-3">Thông tin nhanh</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID đơn:</span>
                  <span className="font-mono text-gray-900">{id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium">{application.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cập nhật:</span>
                  <span>{formatDate(application.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
