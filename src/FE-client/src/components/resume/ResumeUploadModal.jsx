import { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { message } from 'antd';
import resumeService from '../../services/resumeService';

export default function ResumeUploadModal({ isOpen, onClose, onSuccess, resumeId }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Chỉ chấp nhận file PDF');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
        setError('Kích thước file không được vượt quá 5MB');
        return;
      }
      setFile(selectedFile);
      setTitle(selectedFile.name.replace('.pdf', ''));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || (!resumeId && !title)) return;

    try {
      setLoading(true);
      setError('');

      let targetResumeId = resumeId;

      if (!targetResumeId) {
        // 1. Create resume entry if not updating existing
        const createRes = await resumeService.createResume({
          resume_title: title,
          summary: 'Uploaded via Resume Manager'
        });
        targetResumeId = createRes?.data?.resume_id || createRes?.resume_id || (createRes?.success && createRes?.data?.uuid);
      }

      if (targetResumeId) {
         // 2. Upload file
         await resumeService.uploadResumeFile(targetResumeId, file);
         message.success(resumeId ? 'Cập nhật CV thành công' : 'Tải lên CV thành công');
         onSuccess(); // Refresh list
         handleClose();
      } else {
        throw new Error('Không thể xử lý hồ sơ');
      }
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra khi tải lên. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setTitle('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Tải lên CV có sẵn</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
            {/* File Drop Zone */}
            <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
            >
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden" 
                />
                
                {file ? (
                    <div className="flex flex-col items-center text-green-700">
                        <FileText className="w-10 h-10 mb-2" />
                        <p className="font-medium break-all">{file.name}</p>
                        <p className="text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        <Upload className="w-10 h-10 mb-2 text-gray-400" />
                        <p className="font-medium">Nhấn để chọn file</p>
                        <p className="text-xs mt-1">Hỗ trợ định dạng PDF (Tối đa 5MB)</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {file && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên CV</label>
                    <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên CV..."
                        required
                    />
                </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <button 
                    type="button" 
                    onClick={handleClose}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                    Hủy bỏ
                </button>
                <button 
                    type="submit" 
                    disabled={!file || !title || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Tải lên
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
