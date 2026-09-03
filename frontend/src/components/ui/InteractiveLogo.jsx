import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/utils/cn';

export function InteractiveLogo({
  size = 'md',
  className = '',
  enableSpinOnClick = true,
  showGlow = true,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickSpins, setClickSpins] = useState(0);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for buttery smooth motion
  const springConfig = { damping: 15, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-100, 100], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-25, 25]), springConfig);
  const rotateZ = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleClick = () => {
    if (enableSpinOnClick) {
      setClickSpins((prev) => prev + 1);
    }
  };

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
    hero: 'w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36',
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: 1000 }}
      className={cn(
        'relative inline-flex items-center justify-center cursor-pointer select-none group',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
      title="Rotate me with your cursor or click for 360° spin!"
    >
      {/* Google 4-Color Ambient Radial Glow */}
      {showGlow && (
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.25, 1] : 1,
            opacity: isHovered ? 0.85 : 0.35,
            rotate: isHovered ? 360 : 0,
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute inset-0 rounded-full blur-xl pointer-events-none"
          style={{
            background: 'conic-gradient(from 0deg, #4285F4, #EA4335, #FBBC04, #34A853, #4285F4)',
          }}
        />
      )}

      {/* 3D Rotating Logo Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotate: clickSpins * 360,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{
          rotate: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
          scale: { duration: 0.25 },
        }}
        className="relative w-full h-full flex items-center justify-center filter drop-shadow-lg"
      >
        <img
          src="/gdgc-logo.png"
          alt="GDGC Logo"
          className="w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105"
          draggable="false"
        />
      </motion.div>

      {/* Interactive 360° Tooltip hint on hover */}
      {size === 'hero' && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          className="absolute -bottom-8 whitespace-nowrap text-xs font-semibold px-2.5 py-1 rounded-full bg-background/90 border border-primary/30 text-primary shadow-sm pointer-events-none"
        >
          ✨ Move cursor or click to spin!
        </motion.span>
      )}
    </div>
  );
}
