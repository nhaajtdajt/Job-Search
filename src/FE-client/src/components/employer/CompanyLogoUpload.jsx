import { useState, useRef } from 'react';
import { Upload, Camera, Trash2 } from 'lucide-react';
import { message } from 'antd';

export default function CompanyLogoUpload({ 
  title, 
  currentImage, 
  onUpload, 
  aspectRatio = 'square' // 'square' for logo, 'wide' for banner
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      message.error('Chỉ hỗ trợ file ảnh (JPG, PNG, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      message.error('File không được vượt quá 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploading(true);
      await onUpload(file);
    } catch (error) {
      // Error already handled in parent
      setPreview(null);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const displayImage = preview || currentImage;
  const isSquare = aspectRatio === 'square';

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">{title}</p>
      <div 
        className={`
          relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden
          hover:border-orange-400 transition cursor-pointer
          ${isSquare ? 'w-32 h-32' : 'w-full h-32'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onClick={handleClick}
      >
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-xs">Tải ảnh lên</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center">
          <div className="text-white text-center">
            <Camera className="w-6 h-6 mx-auto mb-1" />
            <span className="text-xs">{displayImage ? 'Thay đổi' : 'Tải lên'}</span>
          </div>
        </div>

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Helper text */}
      <p className="text-xs text-gray-500 mt-2">
        JPG, PNG hoặc WebP. Tối đa 5MB.
        {isSquare ? ' Khuyên dùng 200x200px.' : ' Khuyên dùng 1200x300px.'}
      </p>
    </div>
  );
}
