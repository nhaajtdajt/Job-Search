/**
 * ResumeCard Component
 * Displays a resume card in the resume list
 */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FileText, Calendar, Edit2, Trash2, Eye, Download, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import ResumeStatusBadge from './ResumeStatusBadge';

function ResumeCard({ resume, onDelete, onSetDefault }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa CV này?')) {
      onDelete?.(resume.resume_id);
    }
    setShowMenu(false);
  };

  const handleSetDefault = () => {
    onSetDefault?.(resume.resume_id);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <Link 
              to={`/user/resumes/${resume.resume_id}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
            >
              {resume.resume_title || 'Chưa đặt tên'}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <ResumeStatusBadge 
                status={resume.status || 'active'} 
                isDefault={resume.is_default} 
              />
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <Link
                  to={`/user/resumes/${resume.resume_id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMenu(false)}
                >
                  <Eye className="w-4 h-4" />
                  Xem chi tiết
                </Link>
                <Link
                  to={`/user/resumes/${resume.resume_id}/edit`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowMenu(false)}
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </Link>
                {resume.resume_url && (
                  <a
                    href={resume.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <Download className="w-4 h-4" />
                    Tải xuống
                  </a>
                )}
                {!resume.is_default && (
                  <button
                    onClick={handleSetDefault}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                  >
                    <FileText className="w-4 h-4" />
                    Đặt làm mặc định
                  </button>
                )}
                <hr className="my-1" />
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa CV
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      {resume.summary && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {resume.summary}
        </p>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Cập nhật: {formatDate(resume.updated_at || resume.created_at)}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <Link
          to={`/user/resumes/${resume.resume_id}`}
          className="flex-1 px-4 py-2 text-center text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Xem CV
        </Link>
        <Link
          to={`/user/resumes/${resume.resume_id}/edit`}
          className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Chỉnh sửa
        </Link>
      </div>
    </div>
  );
}

ResumeCard.propTypes = {
  resume: PropTypes.shape({
    resume_id: PropTypes.string.isRequired,
    resume_title: PropTypes.string,
    summary: PropTypes.string,
    resume_url: PropTypes.string,
    status: PropTypes.string,
    is_default: PropTypes.bool,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func,
  onSetDefault: PropTypes.func,
};

export default ResumeCard;
