import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * PageTransition Component
 * Provides smooth page transition animations when navigating between routes
 * 
 * Features:
 * - Fade + slide animations
 * - Optimized for performance (CSS transforms)
 * - Customizable animation style
 * - Automatic route change detection
 */
export default function PageTransition({
    children,
    animation = 'fade-slide', // 'fade', 'fade-slide', 'slide'
    duration = 350,
    className = ''
}) {
    const location = useLocation();
    const containerRef = useRef(null);
    const prevLocationRef = useRef(location.pathname);

    useEffect(() => {
        // Only animate if location actually changed
        if (prevLocationRef.current !== location.pathname) {
            const container = containerRef.current;
            if (!container) return;

            // Remove any existing animation classes
            container.classList.remove('page-enter', 'page-enter-active', 'page-exit', 'page-exit-active');

            // Trigger reflow to restart animation
            void container.offsetWidth;

            // Add enter animation
            container.classList.add('page-enter');
            requestAnimationFrame(() => {
                container.classList.add('page-enter-active');
            });

            // Update previous location
            prevLocationRef.current = location.pathname;

            // Cleanup animation classes after animation completes
            const timer = setTimeout(() => {
                container.classList.remove('page-enter', 'page-enter-active');
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [location.pathname, duration]);

    // Map animation style to CSS class
    const animationClass = `page-transition-${animation}`;

    return (
        <div
            ref={containerRef}
            className={`${animationClass} ${className}`}
            style={{
                animationDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
}

PageTransition.propTypes = {
    children: PropTypes.node.isRequired,
    animation: PropTypes.oneOf(['fade', 'fade-slide', 'slide']),
    duration: PropTypes.number,
    className: PropTypes.string,
};
