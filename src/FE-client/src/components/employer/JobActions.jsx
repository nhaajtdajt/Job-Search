import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';

export default function JobActions({ job, onPublish, onExpire, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action) => {
    setIsOpen(false);
    if (action && typeof action === 'function') {
      action();
    }
  };

  // Determine status from job.status field (now stored in database)
  const status = job.status || 'draft';
  const isExpired = status === 'expired';
  const isPublished = status === 'published';
  const isDraft = status === 'draft';

  // Get job ID (could be job_id or id depending on source)
  const jobId = job.job_id || job.id;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <MoreVertical className="w-5 h-5 text-gray-500" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
          style={{ zIndex: 9999 }}
        >
          {/* View job */}
          <Link
            to={`/jobs/${jobId}`}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Xem tin
          </Link>

          {/* Edit job */}
          <Link
            to={`/employer/jobs/${jobId}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Link>

          <div className="border-t border-gray-100 my-1" />

          {/* If job is expired/closed -> show "Re-publish" button */}
          {isExpired && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(onPublish);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition text-left"
            >
              <RotateCcw className="w-4 h-4" />
              Đăng lại
            </button>
          )}

          {/* If job is published -> show "Pause" button */}
          {isPublished && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(onExpire);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition text-left"
            >
              <EyeOff className="w-4 h-4" />
              Tạm dừng tuyển
            </button>
          )}

          {/* If draft -> show "Publish" button */}
          {isDraft && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAction(onPublish);
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition text-left"
            >
              <Eye className="w-4 h-4" />
              Đăng tin
            </button>
          )}

          <div className="border-t border-gray-100 my-1" />

          {/* Delete - always shown */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAction(onDelete);
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left"
          >
            <Trash2 className="w-4 h-4" />
            Xóa tin
          </button>
        </div>
      )}
    </div>
  );
}
