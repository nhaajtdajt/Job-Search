import { memo } from 'react';
import { AlertCircle, WifiOff, RefreshCw, ServerCrash } from 'lucide-react';

/**
 * ErrorState Component
 * Displays error states with retry functionality
 */
export const ErrorState = memo(function ErrorState({
  error = null,
  title = 'Đã xảy ra lỗi',
  message = 'Không thể tải dữ liệu. Vui lòng thử lại.',
  onRetry = null,
  variant = 'default', // default, network, server, empty
  className = ''
}) {
  const variants = {
    default: {
      icon: AlertCircle,
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    network: {
      icon: WifiOff,
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    server: {
      icon: ServerCrash,
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    empty: {
      icon: AlertCircle,
      iconColor: 'text-gray-400',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  };

  const config = variants[variant] || variants.default;
  const Icon = config.icon;

  // Auto-detect variant from error type
  const detectedVariant = error?.message?.includes('Network') ? 'network' 
    : error?.response?.status >= 500 ? 'server' 
    : variant;
  
  const finalConfig = variants[detectedVariant] || config;
  const FinalIcon = finalConfig.icon;

  return (
    <div className={`rounded-xl border ${finalConfig.bgColor} ${finalConfig.borderColor} p-8 text-center ${className}`}>
      <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${finalConfig.bgColor} flex items-center justify-center`}>
        <FinalIcon className={`w-8 h-8 ${finalConfig.iconColor}`} />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
      )}
      
      {error?.message && process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-left">
          <p className="text-xs text-gray-500 font-mono break-all">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
});

/**
 * InlineError Component
 * For inline error messages in forms or lists
 */
export const InlineError = memo(function InlineError({
  message,
  onRetry = null,
  className = ''
}) {
  return (
    <div className={`flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <span className="text-red-700 flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});

/**
 * ErrorBoundaryFallback Component
 * Fallback UI for React Error Boundaries
 */
export const ErrorBoundaryFallback = memo(function ErrorBoundaryFallback({
  error,
  resetErrorBoundary
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <ErrorState
        error={error}
        title="Ứng dụng gặp sự cố"
        message="Đã xảy ra lỗi không mong muốn. Vui lòng thử tải lại trang."
        onRetry={resetErrorBoundary}
        variant="server"
      />
    </div>
  );
});

export default ErrorState;
