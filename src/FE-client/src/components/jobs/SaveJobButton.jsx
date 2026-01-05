/**
 * SaveJobButton Component
 * Button to save/unsave a job with heart icon animation
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Heart, Loader2 } from 'lucide-react';
import { message } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import savedService from '../../services/savedService';

function SaveJobButton({ 
  jobId, 
  initialSaved = false, 
  size = 'md',
  showText = false,
  onSaveChange,
  className = '',
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      message.info('Vui lòng đăng nhập để lưu việc làm');
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      setIsAnimating(true);

      if (isSaved) {
        await savedService.unsaveJob(jobId);
        setIsSaved(false);
        message.success('Đã bỏ lưu việc làm');
      } else {
        await savedService.saveJob(jobId);
        setIsSaved(true);
        message.success('Đã lưu việc làm');
      }

      onSaveChange?.(!isSaved);
    } catch (error) {
      console.error('Error toggling save job:', error);
      message.error('Không thể lưu việc làm. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <button
      onClick={handleToggleSave}
      disabled={isLoading}
      aria-label={isSaved ? 'Bỏ lưu việc làm này' : 'Lưu việc làm này'}
      aria-pressed={isSaved}
      className={`
        inline-flex items-center gap-2 rounded-lg transition-all duration-200 focus-ring
        ${sizeClasses[size]}
        ${isSaved 
          ? 'text-red-500 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 bg-gray-50 hover:bg-gray-100 hover:text-red-400'
        }
        ${isAnimating ? 'scale-110' : 'scale-100'}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isSaved ? 'Bỏ lưu' : 'Lưu việc làm'}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Heart 
          className={`${iconSizes[size]} transition-transform ${isAnimating ? 'scale-125' : ''}`}
          fill={isSaved ? 'currentColor' : 'none'}
        />
      )}
      {showText && (
        <span className="text-sm font-medium">
          {isSaved ? 'Đã lưu' : 'Lưu'}
        </span>
      )}
    </button>
  );
}

SaveJobButton.propTypes = {
  jobId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  initialSaved: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showText: PropTypes.bool,
  onSaveChange: PropTypes.func,
  className: PropTypes.string,
};

export default SaveJobButton;
