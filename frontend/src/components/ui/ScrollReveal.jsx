import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

export function ScrollReveal({
  children,
  as: Component = 'div',
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  blurStrength = 6,
  className = '',
  duration = 0.6,
  staggerDelay = 0.04,
  ...props
}) {
  const containerRef = useRef(null);

  const isString = typeof children === 'string';

  const splitContent = useMemo(() => {
    if (!isString) return children;
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children, isString]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const ctx = gsap.context(() => {
      let targets = el.querySelectorAll('.word');
      if (!targets || targets.length === 0) {
        targets = el.children.length > 0 ? Array.from(el.children) : [el];
      }

      if (targets && targets.length > 0) {
        gsap.set(targets, {
          opacity: baseOpacity,
          filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
          y: 10,
          willChange: 'opacity, filter, transform',
        });

        ScrollTrigger.create({
          trigger: el,
          scroller,
          start: 'top 90%',
          onEnter: () => {
            gsap.to(targets, {
              ease: 'power3.out',
              opacity: 1,
              filter: 'blur(0px)',
              y: 0,
              duration,
              stagger: targets.length > 1 ? staggerDelay : 0,
            });
          },
          onLeaveBack: () => {
            gsap.set(targets, {
              opacity: baseOpacity,
              filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)',
              y: 10,
            });
          },
        });
      }
    }, el);

    return () => {
      ctx.revert();
    };
  }, [scrollContainerRef, enableBlur, baseOpacity, blurStrength, duration, staggerDelay]);

  return (
    <Component
      ref={containerRef}
      className={`scroll-reveal ${className}`.trim()}
      {...props}
    >
      {splitContent}
    </Component>
  );
}

export default ScrollReveal;
