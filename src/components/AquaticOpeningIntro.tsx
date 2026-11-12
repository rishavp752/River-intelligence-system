import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { MacroWaterCollisionStage } from './MacroWaterCollisionStage';

interface AquaticOpeningIntroProps {
  onFinish: () => void;
}

export const AquaticOpeningIntro: React.FC<AquaticOpeningIntroProps> = ({
  onFinish,
}) => {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      const quickTimer = window.setTimeout(onFinish, 450);
      return () => window.clearTimeout(quickTimer);
    }

    const start = performance.now();
    const duration = 2600;

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

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none ${
        isNight ? 'bg-[#0E1013]' : 'bg-[#F8FAFC]'
      }`}
    >
      {/* Multi-Droplet Fluid Convergence & Splash Stage */}
      <MacroWaterCollisionStage intensity="intro" interactive={false} />

      {/* Editorial Brand Reveal */}
      <div className="relative z-10 mx-6 max-w-xl w-full text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`text-[11px] font-mono tracking-[0.28em] uppercase ${
            isNight ? 'text-[#8E96A3]' : 'text-[#76899D]'
          }`}
        >
          Environmental Hydrological Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className={`text-3xl sm:text-5xl font-light tracking-[0.16em] uppercase ${
            isNight ? 'text-[#F3F4F6]' : 'text-[#14202E]'
          }`}
        >
          River Intelligence
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={`font-serif-editorial italic text-xl sm:text-2xl font-normal ${
            isNight ? 'text-[#A1A8B3]' : 'text-[#4C6074]'
          }`}
        >
          Where Water Meets Intelligence.
        </motion.p>

        {/* Minimal Hairline Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto max-w-xs pt-4 space-y-3"
        >
          <div
            className={`h-[2px] w-full overflow-hidden rounded-full ${
              isNight ? 'bg-white/10' : 'bg-slate-300/70'
            }`}
          >
            <div
              className={`h-full transition-all duration-100 ${
                isNight ? 'bg-[#58B9C2]' : 'bg-[#29828A]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className={isNight ? 'text-[#707784]' : 'text-[#76899D]'}>
              {progress}%
            </span>
            <button
              onClick={onFinish}
              className={`inline-flex items-center gap-1.5 font-sans text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                isNight
                  ? 'text-[#A1A8B3] hover:text-white'
                  : 'text-[#4C6074] hover:text-[#14202E]'
              }`}
            >
              <span>Skip Intro</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
