import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  title?: string;
  ariaLabel?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  title,
  ariaLabel,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle macOS-precision magnetic pull (max ~5px)
    setOffset({
      x: ((relX - centerX) / centerX) * 4.5,
      y: ((relY - centerY) / centerY) * 3.5,
    });

    setGlowPos({
      x: Math.round((relX / rect.width) * 100),
      y: Math.round((relY / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setOffset({ x: 0, y: 0 });
  };

  const baseStyles =
    variant === 'primary'
      ? 'btn-luxury-primary text-white'
      : variant === 'secondary'
      ? 'border border-[#70CFFF]/35 bg-white/80 text-[#263B50]'
      : 'text-[#52667A] hover:text-[#263B50]';

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: offset.x,
        y: hovered ? offset.y - 1.5 : 0,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 360, damping: 24, mass: 0.6 }}
      className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3 text-xs sm:text-sm font-medium tracking-wide cursor-pointer ${baseStyles} ${className}`}
    >
      {/* Cursor-following specular highlight */}
      {hovered && (
        <span
          aria-hidden="true"
          style={{
            background: `radial-gradient(120px circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.24), transparent 70%)`,
          }}
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};
