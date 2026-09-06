import { useEffect, useRef, useCallback } from "react";

export function DotParticleCanvas({
  backgroundColor = "transparent",
  animationSpeed = 0.006,
}) {
  const canvasRef = useRef(null);
  const requestIdRef = useRef(null);
  const timeRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, isDown: false });
  const dprRef = useRef(1);
  const particles = useRef([]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    canvas.style.width = displayWidth + "px";
    canvas.style.height = displayHeight + "px";

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
  }, []);

  const isDarkBackgroundAt = (x, y) => {
    if (document.documentElement.classList.contains("dark") || document.documentElement.getAttribute("data-theme") === "dark") {
      return true;
    }
    try {
      let el = document.elementFromPoint(x, y);
      while (el && el !== document.documentElement) {
        if (el.classList && (el.classList.contains("footer") || el.closest("footer"))) {
          return true;
        }
        const bg = window.getComputedStyle(el).backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
          const rgb = bg.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const r = parseInt(rgb[0], 10);
            const g = parseInt(rgb[1], 10);
            const b = parseInt(rgb[2], 10);
            const luminance = (r * 299 + g * 587 + b * 114) / 1000;
            return luminance < 160;
          }
        }
        el = el.parentElement;
      }
    } catch {
      // Fallback
    }
    return false;
  };

  const handleMouseDown = useCallback((e) => {
    mouseRef.current.isDown = true;
    const x = e.clientX;
    const y = e.clientY;

    const isDarkBg = isDarkBackgroundAt(x, y);
    // Pure luminous white for dark backgrounds, crisp Google blue/white for light backgrounds
    const colorRgb = isDarkBg ? "255, 255, 255" : "66, 133, 244";
    const maxAlpha = isDarkBg ? 0.9 : 0.6;

    const numParticles = 5 + Math.floor(Math.random() * 3);

    for (let i = 0; i < numParticles; i++) {
      const angle = (Math.PI * 2 * i) / numParticles + (Math.random() - 0.5) * 0.4;
      const speed = 1.4 + Math.random() * 2.2;
      const size = 1.6 + Math.random() * 2;

      particles.current.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 1000 + Math.random() * 1000,
        size: size,
        angle: angle,
        speed: speed,
        colorRgb: colorRgb,
        maxAlpha: maxAlpha,
      });
    }

    // Gentle floater
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 0.8;
    particles.current.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0,
      maxLife: 1400 + Math.random() * 800,
      size: 2 + Math.random() * 1.5,
      angle: angle,
      speed: speed,
      colorRgb: colorRgb,
      maxAlpha: maxAlpha,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    timeRef.current += animationSpeed;

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    if (backgroundColor === "transparent" || backgroundColor === "rgba(0,0,0,0)") {
      ctx.clearRect(0, 0, width, height);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    particles.current = particles.current.filter((particle) => {
      particle.life += 16;
      particle.x += particle.vx;
      particle.y += particle.vy;

      particle.vy += 0.02;
      particle.vx *= 0.985;
      particle.vy *= 0.985;

      const organicX = Math.sin(timeRef.current + particle.angle) * 0.2;
      const organicY = Math.cos(timeRef.current + particle.angle * 0.7) * 0.15;
      particle.x += organicX;
      particle.y += organicY;

      const lifeProgress = particle.life / particle.maxLife;
      const peakAlpha = particle.maxAlpha || 0.5;
      const alpha = Math.max(0, (1 - lifeProgress) * peakAlpha);
      const currentSize = particle.size * (1 - lifeProgress * 0.25);

      if (alpha > 0) {
        ctx.fillStyle = `rgba(${particle.colorRgb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
        ctx.fill();
        return true;
      }
      return false;
    });

    requestIdRef.current = requestAnimationFrame(animate);
  }, [backgroundColor, animationSpeed]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    window.addEventListener("mouseup", handleMouseUp, { passive: true });

    requestIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      if (requestIdRef.current) {
        cancelAnimationFrame(requestIdRef.current);
      }
    };
  }, [resizeCanvas, handleMouseMove, handleMouseDown, handleMouseUp, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
    />
  );
}

export default DotParticleCanvas;
