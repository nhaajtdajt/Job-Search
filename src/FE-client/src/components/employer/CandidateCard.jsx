import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Heart, 
  HeartOff,
  FileText,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import { message, Dropdown, Modal, Input } from 'antd';
import savedCandidateService from '../../services/savedCandidateService';

/**
 * CandidateCard Component
 * Display candidate info with save/unsave functionality
 */
export default function CandidateCard({ 
  candidate, 
  onUnsave, 
  onUpdateNotes,
  showSaveButton = true 
}) {
  const [isSaved, setIsSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [notes, setNotes] = useState(candidate.notes || '');

  // Handle unsave
  const handleUnsave = async () => {
    try {
      setLoading(true);
      await savedCandidateService.unsaveCandidate(candidate.user_id);
      setIsSaved(false);
      message.success('Đã bỏ lưu ứng viên');
      if (onUnsave) {
        onUnsave(candidate.user_id);
      }
    } catch (error) {
      console.error('Error unsaving candidate:', error);
      message.error('Không thể bỏ lưu ứng viên');
    } finally {
      setLoading(false);
    }
  };

  // Handle save notes
  const handleSaveNotes = async () => {
    try {
      setLoading(true);
      await savedCandidateService.updateNotes(candidate.user_id, notes);
      message.success('Đã cập nhật ghi chú');
      setNotesModalOpen(false);
      if (onUpdateNotes) {
        onUpdateNotes(candidate.user_id, notes);
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      message.error('Không thể cập nhật ghi chú');
    } finally {
      setLoading(false);
    }
  };

  // Dropdown menu items
  const menuItems = [
    {
      key: 'notes',
      label: 'Chỉnh sửa ghi chú',
      icon: <Edit2 className="w-4 h-4" />,
      onClick: () => setNotesModalOpen(true)
    },
    {
      key: 'unsave',
      label: 'Bỏ lưu',
      icon: <Trash2 className="w-4 h-4" />,
      danger: true,
      onClick: handleUnsave
    }
  ];

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!isSaved) {
    return null; // Don't render if unsaved
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all duration-200">
        {/* Header with avatar and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {candidate.avatar_url ? (
                <img 
                  src={candidate.avatar_url} 
                  alt={candidate.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                (candidate.name || 'U').charAt(0).toUpperCase()
              )}
            </div>
            
            {/* Name & Title */}
            <div>
              <Link 
                to={`/employer/candidates/${candidate.user_id}`}
                className="font-bold text-gray-900 hover:text-orange-600 transition"
              >
                {candidate.name || 'Ứng viên'}
              </Link>
              {candidate.resume?.resume_title && (
                <p className="text-sm text-gray-500">{candidate.resume.resume_title}</p>
              )}
            </div>
          </div>

          {/* Actions Dropdown */}
          {showSaveButton && (
            <Dropdown
              menu={{ items: menuItems }}
              trigger={['click']}
              placement="bottomRight"
            >
              <button className="p-2 hover:bg-gray-100 rounded-full transition">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
            </Dropdown>
          )}
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {candidate.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${candidate.email}`} className="hover:text-orange-600 transition">
                {candidate.email}
              </a>
            </div>
          )}
          {candidate.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${candidate.phone}`} className="hover:text-orange-600 transition">
                {candidate.phone}
              </a>
            </div>
          )}
          {candidate.address && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{candidate.address}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          {candidate.application_count > 0 && (
            <div className="flex items-center gap-1 text-blue-600">
              <Briefcase className="w-4 h-4" />
              <span>{candidate.application_count} đơn ứng tuyển</span>
            </div>
          )}
          {candidate.resume && (
            <div className="flex items-center gap-1 text-green-600">
              <FileText className="w-4 h-4" />
              <span>Có CV</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {candidate.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">{candidate.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            Lưu ngày: {formatDate(candidate.saved_at)}
          </span>
          
          <div className="flex items-center gap-2">
            {candidate.phone && (
              <a 
                href={`tel:${candidate.phone}`}
                className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                Gọi
              </a>
            )}
            <Link
              to={`/employer/candidates/${candidate.user_id}`}
              className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
            >
              Xem hồ sơ
            </Link>
          </div>
        </div>
      </div>

      {/* Notes Modal */}
      <Modal
        title="Chỉnh sửa ghi chú"
        open={notesModalOpen}
        onOk={handleSaveNotes}
        onCancel={() => setNotesModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <Input.TextArea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Nhập ghi chú về ứng viên..."
          rows={4}
          maxLength={500}
          showCount
        />
      </Modal>
    </>
  );
}
