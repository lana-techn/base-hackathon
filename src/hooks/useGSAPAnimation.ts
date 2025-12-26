import { useEffect, useRef } from 'react';
import { gsapAnimationManager, AnimationType } from '@/lib/gsap-animation-manager';

interface AnimationOptions {
  duration?: number;
  ease?: string;
  delay?: number;
  stagger?: number;
}

interface ScrollAnimationConfig {
  trigger?: string;
  start?: string;
  end?: string;
  animation: gsap.core.Animation;
}

/**
 * Hook for using GSAP animations in React components
 */
export function useGSAPAnimation() {
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      gsapAnimationManager.init();
      isInitialized.current = true;
    }

    return () => {
      // Don't destroy on component unmount, let the main provider handle it
    };
  }, []);

  return {
    animateIn: (element: HTMLElement | string, type: AnimationType = 'fade', options?: AnimationOptions) => {
      return gsapAnimationManager.animateIn(element, type, options);
    },
    animateInStagger: (elements: HTMLElement[] | string, type: AnimationType = 'slide', staggerDelay: number = 0.1) => {
      return gsapAnimationManager.animateInStagger(elements, type, staggerDelay);
    },
    scrollTo: (target: string | number | HTMLElement, options?: AnimationOptions) => {
      gsapAnimationManager.scrollTo(target, options);
    },
    getScrollSmoother: () => {
      return gsapAnimationManager.getScrollSmoother();
    }
  };
}

/**
 * Hook for entrance animations on component mount
 */
export function useEntranceAnimation(
  type: AnimationType = 'fade',
  options?: AnimationOptions
) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      gsapAnimationManager.animateIn(elementRef.current, type, options);
    }
  }, [type, options]);

  return elementRef;
}

/**
 * Hook for stagger animations on a list of elements
 */
export function useStaggerAnimation(
  type: AnimationType = 'slide',
  staggerDelay: number = 0.1,
  selector?: string
) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = selector 
        ? containerRef.current.querySelectorAll(selector)
        : containerRef.current.children;
      
      if (elements.length > 0) {
        gsapAnimationManager.animateInStagger(Array.from(elements) as HTMLElement[], type, staggerDelay);
      }
    }
  }, [type, staggerDelay, selector]);

  return containerRef;
}

/**
 * Hook for scroll-triggered animations
 */
export function useScrollAnimation(
  animationConfig: ScrollAnimationConfig
) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamic import to avoid SSR issues
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (elementRef.current) {
        ScrollTrigger.create({
          trigger: animationConfig.trigger || elementRef.current,
          start: animationConfig.start || 'top 80%',
          end: animationConfig.end || 'bottom 20%',
          animation: animationConfig.animation,
          toggleActions: 'play none none reverse'
        });
      }
    });

    return () => {
      // Clean up ScrollTrigger instances
      const element = elementRef.current;
      if (element && typeof window !== 'undefined') {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.trigger === element) {
              trigger.kill();
            }
          });
        });
      }
    };
  }, [animationConfig]);

  return elementRef;
}

export default useGSAPAnimation;