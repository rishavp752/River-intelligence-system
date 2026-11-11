import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Waves, Sparkles, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AquaticOpeningIntroProps {
  onFinish: () => void;
}

export const AquaticOpeningIntro: React.FC<AquaticOpeningIntroProps> = ({
  onFinish,
}) => {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const [progress, setProgress] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle pointer parallax for 3D underwater depth
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 18;
    const ny = (e.clientY / window.innerHeight - 0.5) * 14;
    setParallax({ x: nx, y: ny });
  };

  // Progress bar & auto-completion timer
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      const quickTimer = window.setTimeout(onFinish, 450);
      return () => window.clearTimeout(quickTimer);
    }

    const start = performance.now();
    const duration = 2700;

    let rafId: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(tick);
      } else {
        onFinish();
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onFinish]);

  // Lightweight HTML5 Canvas Water Caustics & Microscopic Particle Field
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.4 + Math.random() * 3.2,
      vx: (Math.random() - 0.5) * 0.45,
      vy: -0.35 - Math.random() * 0.65,
      alpha: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
    }));

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.018;
      ctx.clearRect(0, 0, width, height);

      // Draw 3D-style translucent liquid wave ribbons & caustic interference
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const baseY = height * (0.64 + layer * 0.1);
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 24) {
          const y =
            baseY +
            Math.sin(x * 0.0045 + t * (1.2 + layer * 0.3) + layer) * (22 - layer * 4) +
            Math.cos(x * 0.009 - t * 0.8) * 10;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, baseY - 40, width, height);
        if (isNight) {
          grad.addColorStop(0, `rgba(0, 242, 254, ${0.09 + layer * 0.04})`);
          grad.addColorStop(0.5, `rgba(14, 165, 233, ${0.12 + layer * 0.04})`);
          grad.addColorStop(1, `rgba(32, 227, 178, ${0.08 + layer * 0.04})`);
        } else {
          grad.addColorStop(0, `rgba(32, 207, 198, ${0.14 + layer * 0.05})`);
          grad.addColorStop(0.5, `rgba(112, 207, 255, ${0.18 + layer * 0.05})`);
          grad.addColorStop(1, `rgba(201, 245, 245, ${0.22 + layer * 0.06})`);
        }
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Draw floating microscopic water particles with soft caustic halo
      for (const p of particles) {
        p.x += p.vx + Math.sin(t + p.phase) * 0.25;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const pulse = 0.65 + 0.35 * Math.sin(t * 2 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isNight
          ? `rgba(0, 242, 254, ${p.alpha * pulse})`
          : `rgba(13, 148, 136, ${p.alpha * pulse * 0.75})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isNight]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03, filter: 'blur(8px)' }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none ${
        isNight
          ? 'bg-gradient-to-b from-[#030A14] via-[#07162C] to-[#0A2240]'
          : 'bg-gradient-to-b from-[#F7FCFF] via-[#E8F6FF] to-[#C9F5F5]/80'
      }`}
    >
      {/* Interactive Canvas Water Surface, Caustics & Particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Volumetric Sunlight Rays / Bioluminescent Light Shafts */}
      <div
        style={{
          transform: `translate3d(${parallax.x * -0.6}px, ${parallax.y * -0.6}px, 0)`,
        }}
        className="pointer-events-none absolute inset-0 overflow-hidden transition-transform duration-200 ease-out"
      >
        <div
          className={`absolute -top-36 left-1/5 h-[620px] w-52 rotate-12 blur-2xl ${
            isNight
              ? 'bg-gradient-to-b from-[#00F2FE]/22 via-[#20E3B2]/8 to-transparent'
              : 'bg-gradient-to-b from-white/90 via-[#70CFFF]/28 to-transparent'
          }`}
        />
        <div
          className={`absolute -top-28 left-1/2 h-[660px] w-64 -rotate-6 blur-2xl ${
            isNight
              ? 'bg-gradient-to-b from-[#20E3B2]/20 via-[#00F2FE]/10 to-transparent'
              : 'bg-gradient-to-b from-white/95 via-[#20CFC6]/25 to-transparent'
          }`}
        />
        <div
          className={`absolute -top-32 right-1/5 h-[580px] w-48 rotate-6 blur-2xl ${
            isNight
              ? 'bg-gradient-to-b from-[#38BDF8]/20 via-[#00F2FE]/8 to-transparent'
              : 'bg-gradient-to-b from-white/85 via-[#70CFFF]/25 to-transparent'
          }`}
        />
      </div>

      {/* Center 3D Liquid-Glass Brand Reveal Card */}
      <motion.div
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        }}
        initial={{ opacity: 0, y: 24, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 mx-4 max-w-xl w-full rounded-3xl border p-8 sm:p-10 text-center backdrop-blur-2xl ${
          isNight
            ? 'border-[#00F2FE]/35 bg-[#07162C]/75 shadow-[0_28px_70px_-15px_rgba(0,242,254,0.28)]'
            : 'border-white/90 bg-white/72 shadow-[0_28px_70px_-15px_rgba(32,207,198,0.28)]'
        }`}
      >
        {/* Glowing Liquid Emblem */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
          className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border shadow-[0_10px_30px_rgba(32,207,198,0.32)] ${
            isNight
              ? 'border-[#00F2FE]/50 bg-gradient-to-br from-[#0A2547] via-[#07162C] to-[#00F2FE]/25 text-[#00F2FE]'
              : 'border-[#20CFC6]/50 bg-gradient-to-br from-white via-[#EDF8FF] to-[#C9F5F5] text-[#0D9488]'
          }`}
        >
          <Waves className="h-8 w-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.45 }}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-[11px] font-mono font-bold tracking-widest ${
            isNight
              ? 'border-[#00F2FE]/35 bg-[#00F2FE]/10 text-[#00F2FE]'
              : 'border-[#20CFC6]/40 bg-[#EDF8FF]/90 text-[#0D9488]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AQUA NEXUS · ENVIRONMENTAL INTELLIGENCE</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.55 }}
          className={`mt-3.5 text-3xl sm:text-5xl font-extrabold tracking-tight ${
            isNight ? 'text-white' : 'text-[#183048]'
          }`}
        >
          RIVER INTELLIGENCE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className={`mt-2.5 text-base sm:text-lg font-semibold italic ${
            isNight ? 'text-[#38BDF8]' : 'text-[#0D9488]'
          }`}
        >
          &ldquo;Where Water Meets Intelligence&rdquo;
        </motion.p>

        {/* Liquid Caustic Progress Bar */}
        <div className="mt-7 space-y-2">
          <div
            className={`h-2.5 w-full overflow-hidden rounded-full border p-0.5 ${
              isNight
                ? 'border-[#00F2FE]/30 bg-[#040D1A]/80'
                : 'border-[#20CFC6]/35 bg-[#EDF8FF]'
            }`}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#20CFC6] via-[#38BDF8] to-[#00F2FE] shadow-[0_0_12px_rgba(32,207,198,0.65)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className={`flex items-center justify-between text-[11px] font-mono ${
              isNight ? 'text-[#9CC0E0]' : 'text-[#52667A]'
            }`}
          >
            <span>INITIALIZING AQUA NEXUS COMMAND CENTRE</span>
            <span className="font-bold">{progress}%</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onFinish}
            className="btn-liquid-primary inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#20CFC6] to-[#0EA5E9] px-5 py-2.5 text-xs font-bold text-white shadow-[0_8px_22px_rgba(32,207,198,0.4)] cursor-pointer"
          >
            <span>Skip Intro · Enter Command Centre</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
