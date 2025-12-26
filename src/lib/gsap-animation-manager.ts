import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export type AnimationType = 'fade' | 'slide' | 'scale';
export type EaseType = 'power2.out' | 'power3.out' | 'back.out(1.7)' | 'none';

interface AnimationConfig {
  type: 'entrance' | 'hover' | 'scroll' | 'interaction';
  trigger: 'load' | 'scroll' | 'hover' | 'click';
  duration: number;
  ease: string;
  delay?: number;
  stagger?: number;
  properties: Record<string, any>;
}

/**
 * GSAP Animation Manager
 * Replaces Lenis with GSAP ScrollTrigger and ScrollSmoother
 * Provides component entrance animations, hover effects, and parallax
 */
export class GSAPAnimationManager {
  private scrollSmoother: ScrollSmoother | null = null;
  private timeline: GSAPTimeline | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeGSAP();
    }
  }

  /**
   * Initialize GSAP with performance optimizations
   */
  private initializeGSAP() {
    if (this.isInitialized) return;

    // Set up GSAP defaults
    gsap.defaults({
      duration: 0.6,
      ease: 'power2.out',
    });

    // Enable hardware acceleration for better performance
    gsap.set('.animated-element', { force3D: true });

    // Respect reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.globalTimeline.timeScale(0);
      ScrollTrigger.config({ ignoreMobileResize: true });
    }

    this.isInitialized = true;
  }

  /**
   * Initialize smooth scroll behavior with GSAP ScrollSmoother
   * Replaces Lenis functionality
   */
  initializeSmoothScroll() {
    if (typeof window === 'undefined' || this.scrollSmoother) return;

    // Skip ScrollSmoother initialization for now to avoid layout issues
    console.log('ScrollSmoother initialization skipped - using native scroll');
    return;

    try {
      // Check if elements exist
      const wrapper = document.getElementById('smooth-wrapper');
      const content = document.getElementById('smooth-content');
      
      if (!wrapper || !content) {
        console.warn('ScrollSmoother elements not found, skipping smooth scroll initialization');
        return;
      }

      this.scrollSmoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 1, // Reduced smooth factor for better compatibility
        effects: true, // Enable data-speed parallax effects
        smoothTouch: 0.1, // Smooth scrolling on touch devices
        normalizeScroll: true, // Normalize scroll across browsers
        ignoreMobileResize: true, // Better mobile performance
      });

      // Add momentum and easing similar to Lenis
      this.scrollSmoother.effects('.parallax-element', {
        speed: (i, target) => {
          const speed = target.getAttribute('data-speed');
          return speed ? parseFloat(speed) : 0.5;
        }
      });

    } catch (error) {
      console.warn('ScrollSmoother initialization failed:', error);
      // Fallback to regular scroll behavior
    }
  }

  /**
   * Component entrance animations
   * @param element - HTML element to animate
   * @param type - Animation type (fade, slide, scale)
   * @param options - Additional animation options
   */
  animateIn(
    element: HTMLElement | string, 
    type: AnimationType = 'fade',
    options: Partial<gsap.TweenVars> = {}
  ): GSAPTween {
    const animations = {
      fade: { 
        opacity: 0, 
        duration: 0.6, 
        ease: 'power2.out' 
      },
      slide: { 
        y: 50, 
        opacity: 0, 
        duration: 0.8, 
        ease: 'power3.out' 
      },
      scale: { 
        scale: 0.8, 
        opacity: 0, 
        duration: 0.6, 
        ease: 'back.out(1.7)' 
      }
    };

    const config = { ...animations[type], ...options };
    return gsap.from(element, config);
  }

  /**
   * Stagger animations for lists and grids
   * @param elements - Array of elements or selector
   * @param type - Animation type
   * @param staggerDelay - Delay between each element
   */
  animateInStagger(
    elements: HTMLElement[] | string,
    type: AnimationType = 'slide',
    staggerDelay: number = 0.1
  ): GSAPTimeline {
    const tl = gsap.timeline();
    
    const animations = {
      fade: { opacity: 0, duration: 0.6, ease: 'power2.out' },
      slide: { y: 60, opacity: 0, duration: 0.8, ease: 'power3.out' },
      scale: { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }
    };

    tl.from(elements, {
      ...animations[type],
      stagger: staggerDelay
    });

    return tl;
  }

  /**
   * Set up hover animations for interactive elements
   */
  setupHoverAnimations() {
    // Button hover effects
    gsap.utils.toArray('.btn-animated').forEach((btn: any) => {
      const hoverTl = gsap.timeline({ paused: true });
      
      hoverTl.to(btn, { 
        scale: 1.02, 
        duration: 0.2, 
        ease: 'power2.out' 
      });

      btn.addEventListener('mouseenter', () => hoverTl.play());
      btn.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // Card hover effects with glow
    gsap.utils.toArray('.card-animated').forEach((card: any) => {
      const hoverTl = gsap.timeline({ paused: true });
      
      hoverTl.to(card, { 
        y: -5, 
        boxShadow: '0 20px 40px rgba(193, 255, 114, 0.15)',
        duration: 0.3, 
        ease: 'power2.out' 
      });

      card.addEventListener('mouseenter', () => hoverTl.play());
      card.addEventListener('mouseleave', () => hoverTl.reverse());
    });

    // Glass card hover effects
    gsap.utils.toArray('.glass-card').forEach((card: any) => {
      const hoverTl = gsap.timeline({ paused: true });
      
      hoverTl.to(card, {
        background: 'rgba(15, 15, 17, 0.8)',
        borderColor: 'rgba(193, 255, 114, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });

      card.addEventListener('mouseenter', () => hoverTl.play());
      card.addEventListener('mouseleave', () => hoverTl.reverse());
    });
  }

  /**
   * Set up parallax effects for elements with data-speed attribute
   */
  setupParallax() {
    gsap.utils.toArray('.parallax-element').forEach((element: any) => {
      const speed = element.getAttribute('data-speed') || -0.5;
      
      gsap.to(element, {
        yPercent: parseFloat(speed) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          invalidateOnRefresh: true
        }
      });
    });
  }

  /**
   * Set up scroll-triggered entrance animations
   */
  setupScrollAnimations() {
    // Hero section animations - play immediately on load (only if elements exist)
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    if (heroTitle || heroSubtitle || heroCta) {
      const heroTl = gsap.timeline();
      
      if (heroTitle) {
        heroTl.from('.hero-title', { y: 100, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
      }
      if (heroSubtitle) {
        heroTl.from('.hero-subtitle', { y: 50, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5');
      }
      if (heroCta) {
        heroTl.from('.hero-cta', { scale: 0.8, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.3');
      }
    }

    // Bento grid stagger animation (only if elements exist)
    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
      ScrollTrigger.create({
        trigger: '.bento-grid',
        start: 'top 80%',
        onEnter: () => {
          const bentoItems = document.querySelectorAll('.bento-item');
          if (bentoItems.length > 0) {
            gsap.from('.bento-item', {
              y: 60,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out'
            });
          }
        }
      });
    }

    // Chat interface animations (only if elements exist)
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      const chatTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.chat-container',
          start: 'top center',
          toggleActions: 'play none none reverse'
        }
      });

      const chatSidebar = document.querySelector('.chat-sidebar');
      const chatMain = document.querySelector('.chat-main');
      const chatInput = document.querySelector('.chat-input');

      if (chatSidebar) {
        chatTl.from('.chat-sidebar', { x: -100, opacity: 0, duration: 0.6, ease: 'power2.out' });
      }
      if (chatMain) {
        chatTl.from('.chat-main', { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
      }
      if (chatInput) {
        chatTl.from('.chat-input', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
      }
    }

    // Generic scroll animations for elements with .animate-on-scroll class
    gsap.utils.toArray('.animate-on-scroll').forEach((element: any) => {
      gsap.from(element, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  /**
   * Create click animations for buttons and interactive elements
   */
  setupClickAnimations() {
    gsap.utils.toArray('.click-animated').forEach((element: any) => {
      element.addEventListener('click', () => {
        gsap.to(element, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        });
      });
    });
  }

  /**
   * Performance optimization methods
   */
  optimizePerformance() {
    // Batch DOM reads/writes
    gsap.ticker.add(() => {
      // Batch operations here if needed
    });

    // Refresh ScrollTrigger on window resize
    window.addEventListener('resize', () => {
      ScrollTrigger.refresh();
    });

    // Kill animations on page unload
    window.addEventListener('beforeunload', () => {
      gsap.killTweensOf('*');
      ScrollTrigger.killAll();
    });
  }

  /**
   * Initialize all animations
   */
  init() {
    if (typeof window === 'undefined') return;

    this.initializeSmoothScroll();
    this.setupHoverAnimations();
    this.setupParallax();
    this.setupScrollAnimations();
    this.setupClickAnimations();
    this.optimizePerformance();

    // Refresh ScrollTrigger after initialization
    ScrollTrigger.refresh();
  }

  /**
   * Destroy all animations and clean up
   */
  destroy() {
    if (this.scrollSmoother) {
      this.scrollSmoother.kill();
      this.scrollSmoother = null;
    }

    gsap.killTweensOf('*');
    ScrollTrigger.killAll();
    
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }

    this.isInitialized = false;
  }

  /**
   * Get the ScrollSmoother instance
   */
  getScrollSmoother() {
    return this.scrollSmoother;
  }

  /**
   * Scroll to a specific element or position
   */
  scrollTo(target: string | number | HTMLElement, options: any = {}) {
    // Use GSAP scrollTo since we're not using ScrollSmoother
    gsap.to(window, {
      duration: options.duration || 1,
      scrollTo: target,
      ease: 'power2.out',
      ...options
    });
  }
}

// Create singleton instance
export const gsapAnimationManager = new GSAPAnimationManager();

// Export for use in components
export default gsapAnimationManager;