import { useState, useEffect, useRef, memo, Children, cloneElement } from 'react';

/**
 * AnimatedCounter Component
 * Animates a number counting up from 0 to target value
 */
export const AnimatedCounter = memo(function AnimatedCounter({
  value = 0,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = ''
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(null);
  const animationFrame = useRef(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const startValue = prevValue.current;
    const endValue = Number(value);
    
    if (startValue === endValue) return;

    const animate = (timestamp) => {
      if (!startTime.current) {
        startTime.current = timestamp;
      }

      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = startValue + (endValue - startValue) * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = endValue;
        startTime.current = null;
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [value, duration]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals) 
    : Math.round(displayValue);

  return (
    <span className={`animate-countUp ${className}`}>
      {prefix}{formattedValue.toLocaleString()}{suffix}
    </span>
  );
});

/**
 * AnimatedList Component
 * Animates list items appearing one by one (stagger effect)
 */
export const AnimatedList = memo(function AnimatedList({
  children,
  animation = 'fadeInUp', // fadeIn, fadeInUp, fadeInDown, slideInLeft, slideInRight
  staggerDelay = 50, // ms between each item
  initialDelay = 0, // ms before first item
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  // Intersection Observer for viewport detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animatedChildren = Children.map(children, (child, index) => {
    if (!child) return null;
    
    const delay = initialDelay + (index * staggerDelay);
    
    return cloneElement(child, {
      className: `${child.props.className || ''} ${isVisible ? `animate-${animation}` : 'opacity-0'}`,
      style: {
        ...child.props.style,
        animationDelay: isVisible ? `${delay}ms` : '0ms',
        animationFillMode: 'both'
      }
    });
  });

  return (
    <div ref={containerRef} className={className}>
      {animatedChildren}
    </div>
  );
});

/**
 * FadeIn Component
 * Simple fade-in wrapper with optional delay
 */
export const FadeIn = memo(function FadeIn({
  children,
  delay = 0,
  duration = 300,
  direction = 'up', // up, down, left, right, none
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const animations = {
    up: 'fadeInUp',
    down: 'fadeInDown',
    left: 'slideInLeft',
    right: 'slideInRight',
    none: 'fadeIn'
  };

  const animationClass = animations[direction] || 'fadeIn';

  return (
    <div
      ref={ref}
      className={`${isVisible ? `animate-${animationClass}` : 'opacity-0'} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
});

/**
 * ProgressBar Component
 * Animated progress bar with smooth transitions
 */
export const ProgressBar = memo(function ProgressBar({
  value = 0,
  max = 100,
  color = 'orange',
  showLabel = true,
  height = 'h-2',
  className = ''
}) {
  const [width, setWidth] = useState(0);
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    // Delay animation start for visual effect
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const colorClasses = {
    orange: 'bg-gradient-to-r from-orange-400 to-orange-600',
    green: 'bg-gradient-to-r from-green-400 to-green-600',
    blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
    red: 'bg-gradient-to-r from-red-400 to-red-600',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600'
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span className="text-gray-600">Tiến độ</span>
          <span className="font-medium text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full ${colorClasses[color] || colorClasses.orange} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
});

/**
 * Pulse Component
 * Adds a pulsing animation to highlight elements
 */
export const Pulse = memo(function Pulse({
  children,
  active = true,
  color = 'orange',
  className = ''
}) {
  if (!active) return children;

  const colorClasses = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500'
  };

  return (
    <span className={`relative inline-flex ${className}`}>
      {children}
      <span className={`absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3`}>
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-75`} />
        <span className={`relative inline-flex rounded-full h-3 w-3 ${colorClasses[color]}`} />
      </span>
    </span>
  );
});

export default {
  AnimatedCounter,
  AnimatedList,
  FadeIn,
  ProgressBar,
  Pulse
};
