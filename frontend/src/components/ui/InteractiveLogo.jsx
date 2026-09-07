import { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/cn';

export function InteractiveLogo({
  size = 'md',
  className = '',
  enableSpinOnClick = true,
  showGlow = false,
  onSecretTrigger,
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Secret 3-spin easter egg tracking (redirects to mini laptop & devterminal.sh)
  const totalSpinsRef = useRef(0);
  const lastAngleRef = useRef(null);
  const accumulatedAngleRef = useRef(0);
  const triggeredRef = useRef(false);

  const registerSpin = () => {
    totalSpinsRef.current += 1;
    if (totalSpinsRef.current >= 3 && !triggeredRef.current) {
      triggeredRef.current = true;
      setTimeout(() => {
        if (onSecretTrigger) {
          onSecretTrigger();
        } else {
          // If on another page, navigate to home with hash
          if (location.pathname !== '/') {
            navigate('/#laptop-terminal');
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('gdgc:open-laptop-terminal'));
            }, 350);
          } else {
            window.dispatchEvent(new CustomEvent('gdgc:open-laptop-terminal'));
          }
        }
        setTimeout(() => {
          triggeredRef.current = false;
          totalSpinsRef.current = 0;
          accumulatedAngleRef.current = 0;
        }, 3000);
      }, 350);
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    mouseX.set(dx);
    mouseY.set(dy);

    // Track circular motion around center
    const angle = Math.atan2(dy, dx);
    if (lastAngleRef.current !== null) {
      let delta = angle - lastAngleRef.current;
      if (delta > Math.PI) delta -= 2 * Math.PI;
      if (delta < -Math.PI) delta += 2 * Math.PI;
      accumulatedAngleRef.current += Math.abs(delta);
      if (accumulatedAngleRef.current >= 2 * Math.PI) {
        accumulatedAngleRef.current = 0;
        registerSpin();
      }
    }
    lastAngleRef.current = angle;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    lastAngleRef.current = null;
  };

  const handleClick = () => {
    if (enableSpinOnClick) {
      setClickSpins((prev) => prev + 1);
      registerSpin();
    }
  };

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    navbar: 'w-16 h-16 sm:w-[72px] sm:h-[72px] lg:w-[80px] lg:h-[80px]',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    hero: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
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
    >
      {/* Subtle Google Ambient Glow (only if enabled, very soft) */}
      {showGlow && (
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.15, 1] : 1,
            opacity: isHovered ? 0.25 : 0.1,
          }}
          transition={{
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute inset-0 rounded-full blur-xl pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(66, 133, 244, 0.4), transparent 70%)',
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
          scale: isHovered ? 1.08 : 1,
        }}
        transition={{
          rotate: { duration: 0.9, ease: [0.34, 1.56, 0.64, 1] },
          scale: { duration: 0.25 },
        }}
        className="relative w-full h-full flex items-center justify-center filter drop-shadow-md"
      >
        <img
          src={theme === 'dark' ? '/GDGC-dark.png' : '/GDGC-Light.png'}
          alt="GDGC Logo"
          className="w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105"
          draggable="false"
        />
      </motion.div>
    </div>
  );
}
