import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const AmbientAquaticBackdrop: React.FC = () => {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700"
    >
      {/* Subtle Ambient Light Diffusion (Charcoal/Silver in Night Mode, Luminous Aqua in Day Mode) */}
      <div
        className={`absolute -top-48 left-1/4 h-[540px] w-[680px] rounded-full blur-3xl transition-opacity duration-700 ${
          isNight
            ? 'bg-gradient-to-b from-white/[0.03] via-zinc-500/[0.02] to-transparent opacity-75'
            : 'bg-gradient-to-b from-[#E0F0F2]/65 via-[#EBF4FA]/45 to-transparent opacity-90'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full blur-3xl transition-opacity duration-700 ${
          isNight
            ? 'bg-gradient-to-bl from-zinc-400/[0.025] via-transparent to-transparent opacity-70'
            : 'bg-gradient-to-bl from-[#E5F1F5]/60 via-transparent to-transparent opacity-85'
        }`}
      />

      {/* Minimal Horizon Water Wave Silhouette */}
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 h-28 w-[106%] -left-[3%] animate-wave-drift opacity-35"
      >
        <defs>
          <linearGradient id="quietWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor={isNight ? '#58B9C2' : '#8AC5C8'}
              stopOpacity={isNight ? '0.04' : '0.16'}
            />
            <stop
              offset="50%"
              stopColor={isNight ? '#94A3B8' : '#A6CEE0'}
              stopOpacity={isNight ? '0.06' : '0.20'}
            />
            <stop
              offset="100%"
              stopColor={isNight ? '#58B9C2' : '#8AC5C8'}
              stopOpacity={isNight ? '0.04' : '0.16'}
            />
          </linearGradient>
        </defs>
        <path
          d="M0,70 C360,118 720,24 1080,76 C1260,102 1360,58 1440,66 L1440,140 L0,140 Z"
          fill="url(#quietWaveGrad)"
        />
      </svg>
    </div>
  );
};
