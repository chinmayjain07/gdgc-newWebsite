import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation(options = {}) {
  const elementRef = useRef(null);
  const {
    trigger,
    start = 'top 85%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    toggleActions = 'play none none reset',
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
    ...animationProps
  } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      const resolvedTrigger = (typeof trigger === 'string' ? document.querySelector(trigger) : trigger) || element;
      gsap.fromTo(element,
        { opacity: 0, y: 50, ...animationProps.from },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: resolvedTrigger,
            start,
            end,
            scrub,
            markers,
            toggleActions,
            onEnter,
            onLeave,
            onEnterBack,
            onLeaveBack,
          },
          ...animationProps.to,
        }
      );
    }, element);

    return () => ctx.revert();
  }, [trigger, start, end, scrub, markers, onEnter, onLeave, onEnterBack, onLeaveBack, animationProps.from, animationProps.to]);

  return elementRef;
}

export function useStaggerAnimation(options = {}) {
  const containerRef = useRef(null);
  const {
    stagger = 0.1,
    start = 'top 85%',
    end = 'bottom 20%',
    toggleActions = 'play none none reset',
    from = { opacity: 0, y: 30 },
    to = { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
  } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const children = container.querySelectorAll('[data-stagger]');
      if (children && children.length > 0) {
        gsap.fromTo(children, from, {
          ...to,
          stagger,
          scrollTrigger: {
            trigger: container,
            start,
            end,
            toggleActions,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [stagger, start, end, from, to]);

  return containerRef;
}

export function useParallax(speed = 0.5) {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.to(element, {
        yPercent: -50 * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, element);

    return () => ctx.revert();
  }, [speed]);

  return elementRef;
}

export function useMagnetic() {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      gsap.to(element, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return elementRef;
}