import React, { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  durationMs?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  decimals = 0,
  durationMs = 550,
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    const startVal = displayValue;
    const diff = value - startVal;
    if (Math.abs(diff) < 0.001) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();
    let rafId: number;

    const animate = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(startVal + diff * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs]);

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};
