import { useScrollAnimation } from '../../hooks/useScrollAnimation';

/**
 * AnimatedSection - A wrapper component that adds scroll-triggered animations
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {string} props.className - Additional CSS classes
 * @param {'up'|'down'|'left'|'right'|'fade'|'scale'|'blur'} props.direction - Animation direction
 * @param {number} props.delay - Animation delay in ms
 * @param {number} props.duration - Animation duration in ms (default: 700)
 * @param {boolean} props.triggerOnce - Only animate once when scrolled into view
 * @param {string} props.as - HTML element to render (default: 'div')
 */
export default function AnimatedSection({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 700,
  triggerOnce = true,
  as: Component = 'div',
  ...props
}) {
  const [ref, isVisible] = useScrollAnimation({ triggerOnce });

  // Animation variants based on direction
  const animations = {
    up: {
      hidden: 'opacity-0 translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    down: {
      hidden: 'opacity-0 -translate-y-8',
      visible: 'opacity-100 translate-y-0',
    },
    left: {
      hidden: 'opacity-0 -translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    right: {
      hidden: 'opacity-0 translate-x-8',
      visible: 'opacity-100 translate-x-0',
    },
    fade: {
      hidden: 'opacity-0',
      visible: 'opacity-100',
    },
    scale: {
      hidden: 'opacity-0 scale-95',
      visible: 'opacity-100 scale-100',
    },
    blur: {
      hidden: 'opacity-0 blur-sm',
      visible: 'opacity-100 blur-0',
    },
  };

  const animation = animations[direction] || animations.up;
  const animationClass = isVisible ? animation.visible : animation.hidden;

  // Duration classes mapping
  const durationClass = duration <= 300 ? 'duration-300' 
    : duration <= 500 ? 'duration-500'
    : duration <= 700 ? 'duration-700'
    : 'duration-1000';

  return (
    <Component
      ref={ref}
      className={`transition-all ease-out ${durationClass} ${animationClass} ${className}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * AnimatedList - Renders children with staggered animations
 * 
 * @param {Object} props
 * @param {React.ReactNode[]} props.children - Array of items to animate
 * @param {string} props.className - Container CSS classes
 * @param {number} props.staggerDelay - Delay between each item (default: 100ms)
 * @param {'up'|'down'|'left'|'right'|'fade'|'scale'} props.direction - Animation direction
 */
export function AnimatedList({
  children,
  className = '',
  staggerDelay = 100,
  direction = 'up',
  triggerOnce = true,
}) {
  const [ref, isVisible] = useScrollAnimation({ triggerOnce });
  const childArray = Array.isArray(children) ? children : [children];

  const animations = {
    up: { hidden: 'opacity-0 translate-y-6', visible: 'opacity-100 translate-y-0' },
    down: { hidden: 'opacity-0 -translate-y-6', visible: 'opacity-100 translate-y-0' },
    left: { hidden: 'opacity-0 -translate-x-6', visible: 'opacity-100 translate-x-0' },
    right: { hidden: 'opacity-0 translate-x-6', visible: 'opacity-100 translate-x-0' },
    fade: { hidden: 'opacity-0', visible: 'opacity-100' },
    scale: { hidden: 'opacity-0 scale-95', visible: 'opacity-100 scale-100' },
  };

  const animation = animations[direction] || animations.up;

  return (
    <div ref={ref} className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-500 ease-out ${
            isVisible ? animation.visible : animation.hidden
          }`}
          style={{ transitionDelay: isVisible ? `${index * staggerDelay}ms` : '0ms' }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/**
 * FadeIn - Simple fade-in animation wrapper
 */
export function FadeIn({ children, className = '', delay = 0, duration = 500, triggerOnce = true }) {
  return (
    <AnimatedSection
      direction="fade"
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}

/**
 * SlideUp - Slide up animation wrapper
 */
export function SlideUp({ children, className = '', delay = 0, duration = 500, triggerOnce = true }) {
  return (
    <AnimatedSection
      direction="up"
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}

/**
 * SlideIn - Slide in from left/right animation wrapper
 */
export function SlideIn({ children, className = '', from = 'left', delay = 0, duration = 500, triggerOnce = true }) {
  return (
    <AnimatedSection
      direction={from}
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}

/**
 * ScaleIn - Scale in animation wrapper
 */
export function ScaleIn({ children, className = '', delay = 0, duration = 500, triggerOnce = true }) {
  return (
    <AnimatedSection
      direction="scale"
      delay={delay}
      duration={duration}
      triggerOnce={triggerOnce}
      className={className}
    >
      {children}
    </AnimatedSection>
  );
}
