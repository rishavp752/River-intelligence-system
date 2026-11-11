import React from 'react';
import { useTheme } from '../context/ThemeContext';

const FLOATING_MOTE_POSITIONS = [
  { id: 1, left: '8%', top: '18%', size: 5, duration: '11s', delay: '0s' },
  { id: 2, left: '22%', top: '65%', size: 7, duration: '14s', delay: '1.5s' },
  { id: 3, left: '38%', top: '32%', size: 4, duration: '10s', delay: '0.8s' },
  { id: 4, left: '54%', top: '78%', size: 6, duration: '13s', delay: '2.2s' },
  { id: 5, left: '68%', top: '24%', size: 8, duration: '15s', delay: '0.4s' },
  { id: 6, left: '82%', top: '58%', size: 5, duration: '12s', delay: '1.9s' },
  { id: 7, left: '91%', top: '28%', size: 6, duration: '13.5s', delay: '1.1s' },
  { id: 8, left: '15%', top: '84%', size: 5, duration: '12.5s', delay: '2.7s' },
];

export const AmbientAquaticBackdrop: React.FC = () => {
  const { theme } = useTheme();
  const isNight = theme === 'night';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-colors duration-700"
    >
      {/* Slowly Drifting Liquid Gradient Orbs */}
      <div
        className={`absolute -top-36 -left-24 h-[520px] w-[520px] rounded-full blur-3xl transition-all duration-700 animate-orb-float ${
          isNight
            ? 'bg-gradient-to-br from-[#00F2FE]/14 via-[#0EA5E9]/10 to-transparent'
            : 'bg-gradient-to-br from-[#20CFC6]/22 via-[#70CFFF]/18 to-transparent'
        }`}
      />
      <div
        className={`absolute top-1/4 -right-32 h-[560px] w-[560px] rounded-full blur-3xl transition-all duration-700 animate-orb-float-delayed ${
          isNight
            ? 'bg-gradient-to-bl from-[#20E3B2]/12 via-[#1E3A8A]/20 to-transparent'
            : 'bg-gradient-to-bl from-[#70CFFF]/24 via-[#C9F5F5]/35 to-transparent'
        }`}
      />
      <div
        className={`absolute -bottom-40 left-1/3 h-[480px] w-[640px] rounded-full blur-3xl transition-all duration-700 animate-orb-float ${
          isNight
            ? 'bg-gradient-to-t from-[#00F2FE]/12 via-[#07162C]/35 to-transparent'
            : 'bg-gradient-to-t from-[#C9F5F5]/45 via-[#EDF8FF]/50 to-transparent'
        }`}
      />

      {/* Volumetric Sunlight / Abyssal Caustic Rays from Top */}
      <div
        className={`absolute -top-24 left-1/4 h-[460px] w-48 rotate-12 blur-2xl transition-opacity duration-700 ${
          isNight
            ? 'bg-gradient-to-b from-[#00F2FE]/10 via-[#20CFC6]/5 to-transparent opacity-60'
            : 'bg-gradient-to-b from-white/75 via-[#70CFFF]/18 to-transparent opacity-85'
        }`}
      />
      <div
        className={`absolute -top-28 right-1/3 h-[500px] w-56 -rotate-12 blur-2xl transition-opacity duration-700 ${
          isNight
            ? 'bg-gradient-to-b from-[#20E3B2]/10 via-[#0284C7]/5 to-transparent opacity-55'
            : 'bg-gradient-to-b from-white/70 via-[#20CFC6]/16 to-transparent opacity-80'
        }`}
      />

      {/* Floating Microscopic Water Particles */}
      {FLOATING_MOTE_POSITIONS.map((mote) => (
        <span
          key={mote.id}
          style={{
            left: mote.left,
            top: mote.top,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            animationDuration: mote.duration,
            animationDelay: mote.delay,
          }}
          className={`absolute rounded-full animate-mote-rise transition-colors duration-700 ${
            isNight
              ? 'bg-[#00F2FE]/45 shadow-[0_0_12px_rgba(0,242,254,0.65)]'
              : 'bg-[#20CFC6]/45 shadow-[0_0_10px_rgba(32,207,198,0.45)]'
          }`}
        />
      ))}

      {/* Subtle Bottom Flowing Liquid Wave Silhouette */}
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 h-32 w-[108%] -left-[4%] animate-wave-drift opacity-45"
      >
        <defs>
          <linearGradient id="ambientWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              stopColor={isNight ? '#00F2FE' : '#20CFC6'}
              stopOpacity={isNight ? '0.12' : '0.20'}
            />
            <stop
              offset="50%"
              stopColor={isNight ? '#0284C7' : '#70CFFF'}
              stopOpacity={isNight ? '0.18' : '0.26'}
            />
            <stop
              offset="100%"
              stopColor={isNight ? '#20E3B2' : '#C9F5F5'}
              stopOpacity={isNight ? '0.12' : '0.22'}
            />
          </linearGradient>
        </defs>
        <path
          d="M0,76 C320,136 640,18 960,82 C1200,128 1340,56 1440,68 L1440,160 L0,160 Z"
          fill="url(#ambientWaveGrad)"
        />
      </svg>
    </div>
  );
};
