import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook to detect when an element enters the viewport
 * Uses Intersection Observer API for performance
 * 
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Percentage of element visible to trigger (0-1)
 * @param {string} options.rootMargin - Margin around the root (viewport)
 * @param {boolean} options.triggerOnce - If true, animation only triggers once
 * @returns {[React.RefObject, boolean]} - Ref to attach and visibility state
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = false,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (triggerOnce) {
          if (entry.isIntersecting && !hasTriggered) {
            setIsVisible(true);
            setHasTriggered(true);
          }
        } else {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return [ref, isVisible];
}

/**
 * Custom hook for staggered animations on multiple elements
 * 
 * @param {number} itemCount - Number of items to animate
 * @param {number} staggerDelay - Delay between each item in ms
 * @returns {[React.RefObject, number[]]} - Container ref and array of delays
 */
export function useStaggeredAnimation(itemCount, staggerDelay = 100) {
  const [ref, isVisible] = useScrollAnimation({ triggerOnce: true });
  
  const delays = Array.from({ length: itemCount }, (_, i) => 
    isVisible ? i * staggerDelay : 0
  );

  return [ref, isVisible, delays];
}

export default useScrollAnimation;
