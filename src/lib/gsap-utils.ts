import { gsap } from 'gsap';

/**
 * Utility functions for common GSAP animation patterns
 */

/**
 * Animate text with typewriter effect
 */
export function animateTypewriter(element: HTMLElement | string, text: string, options: any = {}) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (!target) return;

  const chars = text.split('');
  target.textContent = '';
  
  const tl = gsap.timeline(options);
  
  chars.forEach((char, index) => {
    tl.call(() => {
      target.textContent += char;
    }, [], index * 0.05);
  });

  return tl;
}

/**
 * Animate counter numbers
 */
export function animateCounter(
  element: HTMLElement | string, 
  from: number, 
  to: number, 
  options: any = {}
) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (!target) return;

  const obj = { value: from };
  const { formatter, ...gsapOptions } = options; // Extract formatter from GSAP options
  
  return gsap.to(obj, {
    value: to,
    duration: options.duration || 2,
    ease: options.ease || 'power2.out',
    onUpdate: () => {
      const value = Math.round(obj.value);
      target.textContent = formatter ? formatter(value) : value.toString();
    },
    ...gsapOptions // Use options without formatter
  });
}

/**
 * Animate progress bar
 */
export function animateProgressBar(
  element: HTMLElement | string,
  progress: number,
  options: any = {}
) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (!target) return;

  return gsap.to(target, {
    width: `${progress}%`,
    duration: options.duration || 1.5,
    ease: options.ease || 'power2.out',
    ...options
  });
}

/**
 * Animate card flip effect
 */
export function animateCardFlip(
  frontElement: HTMLElement | string,
  backElement: HTMLElement | string,
  options: any = {}
) {
  const front = typeof frontElement === 'string' ? document.querySelector(frontElement) : frontElement;
  const back = typeof backElement === 'string' ? document.querySelector(backElement) : backElement;
  
  if (!front || !back) return;

  const tl = gsap.timeline(options);
  
  tl.to(front, {
    rotationY: 90,
    duration: 0.3,
    ease: 'power2.in'
  })
  .set(front, { display: 'none' })
  .set(back, { display: 'block', rotationY: -90 })
  .to(back, {
    rotationY: 0,
    duration: 0.3,
    ease: 'power2.out'
  });

  return tl;
}

/**
 * Animate morphing shapes
 */
export function animateMorph(
  element: HTMLElement | string,
  fromPath: string,
  toPath: string,
  options: any = {}
) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (!target) return;

  return gsap.to(target, {
    attr: { d: toPath },
    duration: options.duration || 1,
    ease: options.ease || 'power2.inOut',
    ...options
  });
}

/**
 * Animate particles or floating elements
 */
export function animateFloating(
  elements: HTMLElement[] | string,
  options: any = {}
) {
  const targets = typeof elements === 'string' 
    ? Array.from(document.querySelectorAll(elements))
    : elements;

  if (!targets.length) return;

  const tl = gsap.timeline({ repeat: -1, yoyo: true });

  targets.forEach((element, index) => {
    tl.to(element, {
      y: `+=${Math.random() * 20 + 10}`,
      x: `+=${Math.random() * 10 - 5}`,
      rotation: Math.random() * 10 - 5,
      duration: 2 + Math.random() * 2,
      ease: 'sine.inOut',
      delay: index * 0.1
    }, 0);
  });

  return tl;
}

/**
 * Animate text reveal with mask
 */
export function animateTextReveal(
  element: HTMLElement | string,
  options: any = {}
) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (!target || !(target instanceof HTMLElement)) return;

  // Create mask element
  const mask = document.createElement('div');
  mask.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, #000  50%, transparent 100%);
    transform: translateX(-100%);
  `;

  target.style.position = 'relative';
  target.style.overflow = 'hidden';
  target.appendChild(mask);

  const tl = gsap.timeline(options);
  
  tl.to(mask, {
    x: '100%',
    duration: options.duration || 1.5,
    ease: options.ease || 'power2.inOut',
    onComplete: () => {
      mask.remove();
    }
  });

  return tl;
}

/**
 * Animate loading spinner
 */
export function animateSpinner(
  element: HTMLElement | string,
  options: any = {}
) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (!target) return;

  return gsap.to(target, {
    rotation: 360,
    duration: options.duration || 1,
    ease: 'none',
    repeat: -1,
    ...options
  });
}

/**
 * Animate wave effect
 */
export function animateWave(
  elements: HTMLElement[] | string,
  options: any = {}
) {
  const targets = typeof elements === 'string' 
    ? Array.from(document.querySelectorAll(elements))
    : elements;

  if (!targets.length) return;

  const tl = gsap.timeline({ repeat: -1 });

  targets.forEach((element, index) => {
    tl.to(element, {
      y: -20,
      duration: 0.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1
    }, index * 0.1);
  });

  return tl;
}

/**
 * Animate glitch effect
 */
export function animateGlitch(
  element: HTMLElement | string,
  options: any = {}
) {
  const target = typeof element === 'string' ? document.querySelector(element) : element;
  if (!target) return;

  const tl = gsap.timeline({ repeat: options.repeat || 3 });

  tl.to(target, {
    x: Math.random() * 10 - 5,
    y: Math.random() * 10 - 5,
    skewX: Math.random() * 10 - 5,
    duration: 0.1,
    ease: 'none'
  })
  .to(target, {
    x: 0,
    y: 0,
    skewX: 0,
    duration: 0.1,
    ease: 'none'
  });

  return tl;
}

export default {
  animateTypewriter,
  animateCounter,
  animateProgressBar,
  animateCardFlip,
  animateMorph,
  animateFloating,
  animateTextReveal,
  animateSpinner,
  animateWave,
  animateGlitch
};