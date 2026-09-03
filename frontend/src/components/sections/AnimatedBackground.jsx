import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/utils/cn';

export function AnimatedBackground({ className, variant = 'orb' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      if (variant === 'orb') {
        const orbs = container.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, i) => {
          gsap.to(orb, {
            x: gsap.utils.random(-100, 100),
            y: gsap.utils.random(-100, 100),
            rotation: gsap.utils.random(0, 360),
            scale: gsap.utils.random(0.8, 1.2),
            duration: gsap.utils.random(15, 25),
            ease: 'none',
            repeat: -1,
            yoyo: true,
          });
        });
      } else if (variant === 'grid') {
        const lines = container.querySelectorAll('.grid-line');
        lines.forEach((line, i) => {
          gsap.to(line, {
            x: i % 2 === 0 ? 50 : -50,
            y: i % 2 === 0 ? -50 : 50,
            duration: 20,
            ease: 'none',
            repeat: -1,
            yoyo: true,
          });
        });
      } else if (variant === 'particles') {
        const particles = container.querySelectorAll('.particle');
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            x: gsap.utils.random(-200, 200),
            y: gsap.utils.random(-200, 200),
            opacity: gsap.utils.random(0.1, 0.5),
            scale: gsap.utils.random(0.5, 1.5),
            duration: gsap.utils.random(10, 20),
            ease: 'power1.inOut',
            repeat: -1,
            yoyo: true,
            delay: gsap.utils.random(0, 5),
          });
        });
      }
    }, container);

    return () => ctx.revert();
  }, [variant]);

  if (variant === 'orb') {
    return (
      <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)} aria-hidden="true">
        <div className="gradient-orb absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="gradient-orb absolute top-1/2 right-1/4 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="gradient-orb absolute bottom-1/4 left-1/2 w-64 h-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="gradient-orb absolute top-1/3 right-1/3 w-48 h-48 rounded-full bg-green-500/15 blur-3xl" />
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)} aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid" />
        {[...Array(20)].map((_, i) => (
          <div key={i} className="grid-line absolute w-px h-full bg-primary/10" style={{ left: `${i * 5}%` }} />
        ))}
      </div>
    );
  }

  if (variant === 'particles') {
    return (
      <div ref={containerRef} className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)} aria-hidden="true">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    );
  }

  return null;
}