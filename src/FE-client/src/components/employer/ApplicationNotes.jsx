import { useState } from 'react';
import PropTypes from 'prop-types';
import { MessageSquare, Send, Loader2, User, Trash2 } from 'lucide-react';

/**
 * ApplicationNotes Component
 * Display and add notes for an application
 */
export default function ApplicationNotes({ 
  notes = [], 
  onAddNote, 
  onDeleteNote,
  isLoading = false 
}) {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onAddNote(newNote.trim());
      setNewNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-orange-500" />
        Ghi chú
      </h3>

      {/* Add Note Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Thêm ghi chú..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newNote.trim() || isSubmitting}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Notes List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Chưa có ghi chú nào</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {notes.map((note, index) => (
            <div 
              key={note.id || index} 
              className="p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-700">{note.content || note.note || note}</p>
                {onDeleteNote && (
                  <button
                    onClick={() => onDeleteNote(note.id || index)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                <User className="w-3 h-3" />
                <span>{note.created_by || 'Bạn'}</span>
                {note.created_at && (
                  <>
                    <span>•</span>
                    <span>{formatDate(note.created_at)}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

ApplicationNotes.propTypes = {
  notes: PropTypes.array,
  onAddNote: PropTypes.func.isRequired,
  onDeleteNote: PropTypes.func,
  isLoading: PropTypes.bool,
};
