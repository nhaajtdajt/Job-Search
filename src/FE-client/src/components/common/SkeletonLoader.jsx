/**
 * SkeletonLoader Component
 * Reusable skeleton loading components for better UX during data fetching
 */
import PropTypes from 'prop-types';

/**
 * Base Skeleton - animated loading placeholder
 */
export function Skeleton({ className = '', style = {} }) {
  return (
    <div 
      className={`skeleton animate-shimmer ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

Skeleton.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

/**
 * SkeletonText - for text content
 */
export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="skeleton skeleton-text"
          style={{ 
            width: index === lines - 1 && lines > 1 ? '70%' : '100%',
            height: '0.875rem'
          }}
        />
      ))}
    </div>
  );
}

SkeletonText.propTypes = {
  lines: PropTypes.number,
  className: PropTypes.string,
};

/**
 * SkeletonAvatar - for profile images
 */
export function SkeletonAvatar({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <div 
      className={`skeleton skeleton-avatar ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    />
  );
}

SkeletonAvatar.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

/**
 * SkeletonCard - for card-style content
 */
export function SkeletonCard({ className = '' }) {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}
      aria-hidden="true"
    >
      <div className="flex gap-4">
        {/* Logo skeleton */}
        <SkeletonAvatar size="lg" />
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title */}
          <div className="skeleton h-5 w-3/4 rounded" />
          {/* Company */}
          <div className="skeleton h-4 w-1/2 rounded" />
          {/* Meta info */}
          <div className="flex gap-4 mt-3">
            <div className="skeleton h-4 w-24 rounded" />
            <div className="skeleton h-4 w-20 rounded" />
            <div className="skeleton h-4 w-16 rounded" />
          </div>
          {/* Tags */}
          <div className="flex gap-2 mt-3">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-14 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

SkeletonCard.propTypes = {
  className: PropTypes.string,
};

/**
 * SkeletonJobList - for job listing pages
 */
export function SkeletonJobList({ count = 5, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`} aria-label="Đang tải danh sách việc làm">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

SkeletonJobList.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string,
};

/**
 * SkeletonDashboardWidget - for dashboard stat widgets
 */
export function SkeletonDashboardWidget({ className = '' }) {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-8 w-16 rounded" />
          <div className="skeleton h-4 w-24 rounded" />
        </div>
        <div className="skeleton w-10 h-10 rounded-lg" />
      </div>
    </div>
  );
}

SkeletonDashboardWidget.propTypes = {
  className: PropTypes.string,
};

/**
 * SkeletonNotification - for notification items
 */
export function SkeletonNotification({ className = '' }) {
  return (
    <div 
      className={`flex gap-3 p-3 rounded-lg ${className}`}
      aria-hidden="true"
    >
      <div className="skeleton w-4 h-4 rounded mt-1" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    </div>
  );
}

SkeletonNotification.propTypes = {
  className: PropTypes.string,
};

/**
 * SkeletonProfile - for profile sections
 */
export function SkeletonProfile({ className = '' }) {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      aria-hidden="true"
    >
      <div className="flex items-start gap-4 mb-6">
        <SkeletonAvatar size="xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-6 w-48 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="skeleton w-5 h-5 rounded mt-1" />
            <div className="flex-1 space-y-1">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-4 w-40 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

SkeletonProfile.propTypes = {
  className: PropTypes.string,
};

// Default export for convenience
export default {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonJobList,
  SkeletonDashboardWidget,
  SkeletonNotification,
  SkeletonProfile,
};
