import { useEffect, useRef, useState } from 'react';

/**
 * useCountUp - animates a number from 0 to target when element is in view.
 * Resets and re-animates whenever element scrolls into view again.
 * @param {number} target - the final number to count to
 * @param {number} duration - animation duration in ms (default 1200)
 * @param {number} startDelay - delay before counting starts in ms (default 0)
 */
export function useCountUp(target, duration = 1200, startDelay = 0) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          // Reset so when user scrolls down again, it re-animates!
          setIsInView(false);
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setCount(0);
      return;
    }

    let startTime = null;
    const startValue = 0;

    const delayTimeout = setTimeout(() => {
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * (target - startValue) + startValue));

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        } else {
          setCount(target);
        }
      };

      rafRef.current = requestAnimationFrame(step);
    }, startDelay);

    return () => {
      clearTimeout(delayTimeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, target, duration, startDelay]);

  return { count, ref };
}

export function CountUp({ to, duration = 1200, suffix = '', className = '' }) {
  const { count, ref } = useCountUp(Number(to) || 0, duration);
  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  );
}

export default useCountUp;
