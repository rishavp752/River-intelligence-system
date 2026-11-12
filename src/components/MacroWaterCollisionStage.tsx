import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

interface MacroWaterCollisionStageProps {
  className?: string;
  interactive?: boolean;
  intensity?: 'hero' | 'intro';
}

interface ConvergingDroplet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetOffsetX: number;
  targetOffsetY: number;
  radius: number;
  spawnTime: number;
  active: boolean;
  merged: boolean;
  wobblePhase: number;
  wobbleFreq: number;
  oscillationAmp: number;
  curveFactor: number;
  generation: number;
}

interface BreakupFragment {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  wobblePhase: number;
  alpha: number;
  parentX: number;
  parentY: number;
  filamentAlpha: number;
}

interface LiquidSheet {
  angle: number;
  spread: number;
  innerRadius: number;
  outerRadius: number;
  speed: number;
  alpha: number;
  wobble: number;
}

interface SplashDroplet {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  alpha: number;
  wobblePhase: number;
  hasReentered: boolean;
}

interface MistCloud {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  thickness: number;
}

export const MacroWaterCollisionStage: React.FC<MacroWaterCollisionStageProps> = ({
  className = '',
  interactive = true,
  intensity = 'hero',
}) => {
  const { theme } = useTheme();
  const isNight = theme === 'night';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const triggerRef = useRef<((clickX?: number, clickY?: number) => void) | null>(
    null
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = canvas.offsetWidth || window.innerWidth;
    let height = canvas.offsetHeight || window.innerHeight;

    const syncCanvasSize = () => {
      if (!canvas) return;
      width = canvas.offsetWidth || window.innerWidth;
      height = canvas.offsetHeight || window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    syncCanvasSize();
    window.addEventListener('resize', syncCanvasSize);

    // 4-Phase Fluid Simulation Timeline (seconds)
    // Phase 1 (0.0s - 2.2s): 28 droplets enter from all 8 directions with staggered timing
    // Phase 2 (1.0s - 3.5s): Multiple mid-flight collisions & metaball surface-tension merging into 1 large droplet
    // Phase 3 (3.5s - 4.75s): Large droplet travels along an arc, destabilizes & breaks apart into 34 fragments
    // Phase 4 (4.75s - 8.8s): Massive water splash (liquid sheets, 96 3D droplets, mist, ripples) & natural settling
    let cycleDuration = 8.8;
    let cycleTime = intensity === 'intro' ? 0.35 : 0.0;
    let phaseState: 'converging' | 'traveling' | 'breakup' | 'splashing' =
      'converging';

    let convergingDroplets: ConvergingDroplet[] = [];
    let masterDroplet: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      wobblePhase: number;
      oscillationAmp: number;
      travelStartTime: number;
    } | null = null;

    let breakupFragments: BreakupFragment[] = [];
    let liquidSheets: LiquidSheet[] = [];
    let splashDroplets: SplashDroplet[] = [];
    let mistClouds: MistCloud[] = [];
    let ripples: WaterRipple[] = [];
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0;

    let pointerX = width * 0.5;
    let pointerY = height * 0.5;

    // Spawn 28 droplets from all 8 compass & diagonal directions (W, E, N, S, NW, NE, SW, SE)
    const initConvergingPhase = (centerX: number, centerY: number) => {
      convergingDroplets = [];
      masterDroplet = null;
      breakupFragments = [];
      liquidSheets = [];
      phaseState = 'converging';
      // Slight variation in cycle duration each loop for organic unpredictability
      cycleDuration = 8.6 + Math.random() * 0.6;

      // 8 cardinal + diagonal base angles, 3-4 droplets per sector
      const totalDroplets = 28;
      const margin = Math.max(width, height) * 0.58 + 50;

      for (let i = 0; i < totalDroplets; i++) {
        const sectorIndex = i % 8;
        const baseAngle = (sectorIndex * Math.PI) / 4; // 0, 45, 90, 135, 180, 225, 270, 315 deg
        const angleJitter = (Math.random() - 0.5) * 0.32;
        const entryAngle = baseAngle + angleJitter;

        const distVariation = margin * (0.72 + Math.random() * 0.36);
        const startX = centerX + Math.cos(entryAngle) * distVariation;
        const startY = centerY + Math.sin(entryAngle) * distVariation * 0.78;

        // Intermediate collision sub-clusters before final center merge
        const clusterOffsetAngle = (i % 4) * (Math.PI / 2) + 0.3;
        const clusterRadius = 18 + (i % 3) * 14;
        const targetOffsetX = Math.cos(clusterOffsetAngle) * clusterRadius;
        const targetOffsetY = Math.sin(clusterOffsetAngle) * clusterRadius * 0.75;

        // Staggered arrival: some arrive simultaneously in waves, others stagger
        const waveGroup = Math.floor(i / 7);
        const spawnTime =
          waveGroup * 0.22 + (i % 2 === 0 ? 0 : Math.random() * 0.18);

        const flightDuration = 1.65 + Math.random() * 0.65;
        const dx = centerX + targetOffsetX - startX;
        const dy = centerY + targetOffsetY - startY;

        convergingDroplets.push({
          id: i,
          x: startX,
          y: startY,
          vx: dx / flightDuration,
          vy: dy / flightDuration,
          targetOffsetX,
          targetOffsetY,
          radius: 4.8 + Math.random() * 7.8,
          spawnTime,
          active: false,
          merged: false,
          wobblePhase: Math.random() * Math.PI * 2,
          wobbleFreq: 6.5 + Math.random() * 4.5,
          oscillationAmp: 0.14 + Math.random() * 0.12,
          curveFactor: (Math.random() - 0.5) * 42,
          generation: 1,
        });
      }
    };

    // Trigger Phase 3: Large Droplet Sudden Fluid Breakup
    const triggerLargeDropletBreakup = (mx: number, my: number, mr: number) => {
      phaseState = 'breakup';
      breakupFragments = [];

      // Sudden capillary fracture ripple
      ripples.push({
        x: mx,
        y: my,
        radius: mr * 0.6,
        maxRadius: mr * 4.2,
        alpha: 0.55,
        speed: 3.2,
        thickness: 2.0,
      });

      const fragCount = 34;
      for (let i = 0; i < fragCount; i++) {
        const ring = i < 12 ? 0.35 : i < 24 ? 0.72 : 1.05;
        const angle =
          (Math.PI * 2 * i) / fragCount + (Math.random() - 0.5) * 0.24;
        const burstSpeed = (48 + Math.random() * 95) * ring;
        const r =
          ring < 0.5
            ? 6.5 + Math.random() * 5.0
            : 3.2 + Math.random() * 5.5;

        breakupFragments.push({
          x: mx + Math.cos(angle) * (mr * 0.28 * ring),
          y: my + Math.sin(angle) * (mr * 0.28 * ring),
          vx: Math.cos(angle) * burstSpeed,
          vy: Math.sin(angle) * burstSpeed + 14,
          radius: r,
          wobblePhase: Math.random() * Math.PI * 2,
          alpha: 0.96,
          parentX: mx,
          parentY: my,
          filamentAlpha: 0.78,
        });
      }
    };

    // Trigger Phase 4: Massive Full-Screen Water Splash
    const triggerMassiveSplash = (cx: number, cy: number) => {
      phaseState = 'splashing';
      shockwaveRadius = 16;
      shockwaveAlpha = 0.82;

      // 1. Expanding Translucent Liquid Sheets / Crown Petals
      liquidSheets = [];
      const sheetCount = 14;
      for (let i = 0; i < sheetCount; i++) {
        const baseAngle = (Math.PI * 2 * i) / sheetCount;
        liquidSheets.push({
          angle: baseAngle + (Math.random() - 0.5) * 0.14,
          spread: 0.22 + Math.random() * 0.15,
          innerRadius: 12 + Math.random() * 10,
          outerRadius: 42 + Math.random() * 28,
          speed: 145 + Math.random() * 115,
          alpha: 0.58 + Math.random() * 0.22,
          wobble: Math.random() * Math.PI * 2,
        });
      }

      // 2. Multi-Ring Perspective Ripples Expanding Across the Stage
      for (let i = 0; i < 7; i++) {
        ripples.push({
          x: cx,
          y: cy + 12,
          radius: 14 + i * 18,
          maxRadius: Math.max(width, height) * (0.48 + i * 0.11),
          alpha: 0.74 - i * 0.08,
          speed: 3.2 + i * 0.78,
          thickness: 2.8 - i * 0.28,
        });
      }

      // 3. Fine Aerosol Mist Clouds
      for (let i = 0; i < 28; i++) {
        const angle = (Math.PI * 2 * i) / 28 + (Math.random() - 0.5) * 0.3;
        const speed = 1.2 + Math.random() * 4.2;
        mistClouds.push({
          x: cx + Math.cos(angle) * 18,
          y: cy + Math.sin(angle) * 12,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed * 0.75 - 0.6,
          radius: 18 + Math.random() * 26,
          maxRadius: 68 + Math.random() * 64,
          alpha: isNight ? 0.18 + Math.random() * 0.12 : 0.22 + Math.random() * 0.14,
        });
      }

      // 4. 96 Suspended & Flying 3D Macro Splash Droplets
      const dropCount = 96;
      for (let i = 0; i < dropCount; i++) {
        const angle =
          (Math.PI * 2 * i) / dropCount + (Math.random() - 0.5) * 0.22;
        const tier = i % 3; // fine spray, medium crown droplets, heavy foreground globules
        const speed =
          tier === 0
            ? 6.5 + Math.random() * 12.5
            : tier === 1
            ? 4.2 + Math.random() * 8.8
            : 2.4 + Math.random() * 5.6;

        const upwardLift = -1.6 - Math.random() * 4.2;
        const zVel =
          tier === 2 ? 0.8 + Math.random() * 1.4 : 0.25 + Math.random() * 0.9;

        splashDroplets.push({
          x: cx + Math.cos(angle) * (8 + Math.random() * 18),
          y: cy + Math.sin(angle) * (6 + Math.random() * 12),
          z: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed * 0.78 + upwardLift,
          vz: zVel,
          radius:
            tier === 0
              ? 1.4 + Math.random() * 2.4
              : tier === 1
              ? 3.0 + Math.random() * 3.8
              : 5.2 + Math.random() * 5.8,
          alpha: 0.85 + Math.random() * 0.15,
          wobblePhase: Math.random() * Math.PI * 2,
          hasReentered: false,
        });
      }
    };

    initConvergingPhase(width * 0.5, height * 0.5);

    triggerRef.current = (clickX?: number, clickY?: number) => {
      const targetX = clickX ?? width * 0.5;
      const targetY = clickY ?? height * 0.5;
      triggerMassiveSplash(targetX, targetY);
      cycleTime = 4.85;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      pointerX = e.clientX - rect.left;
      pointerY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Helper: Draw a physically shaded 3D water droplet with internal refraction, Fresnel edge & studio highlights
    const drawRealisticDroplet = (
      x: number,
      y: number,
      r: number,
      alpha: number,
      vx = 0,
      vy = 0,
      wobblePhase = 0,
      oscillationAmp = 0.08,
      nowSec = 0
    ) => {
      if (r <= 0.35 || alpha <= 0.015) return;
      ctx.save();
      ctx.translate(x, y);

      const speed = Math.hypot(vx, vy);
      if (speed > 2.5) {
        const angle = Math.atan2(vy, vx);
        ctx.rotate(angle);
        const velStretch = Math.min(1.65, 1 + speed * 0.0038);
        const capWobble =
          Math.sin(nowSec * 9.5 + wobblePhase) * oscillationAmp;
        const sx = velStretch + capWobble;
        const sy = 1 / Math.sqrt(Math.max(0.55, sx));
        ctx.scale(sx, sy);
      } else {
        const capWobble =
          Math.sin(nowSec * 7.2 + wobblePhase) * oscillationAmp;
        ctx.scale(1 + capWobble, 1 - capWobble * 0.85);
      }

      // Soft cast refractive shadow beneath/behind droplet (essential for Day Mode clarity without any grey box)
      ctx.beginPath();
      ctx.arc(r * 0.14, r * 0.18, r * 0.98, 0, Math.PI * 2);
      ctx.fillStyle = isNight
        ? `rgba(0, 0, 0, ${0.42 * alpha})`
        : `rgba(20, 56, 74, ${0.16 * alpha})`;
      ctx.fill();

      // Main refractive water volume gradient
      const bodyGrad = ctx.createRadialGradient(
        -r * 0.28,
        -r * 0.32,
        r * 0.06,
        r * 0.12,
        r * 0.16,
        r * 1.05
      );

      if (isNight) {
        // Charcoal/Silver & Muted Cyan-Aqua liquid refraction
        bodyGrad.addColorStop(0, `rgba(248, 250, 252, ${0.95 * alpha})`);
        bodyGrad.addColorStop(0.28, `rgba(182, 224, 232, ${0.68 * alpha})`);
        bodyGrad.addColorStop(0.68, `rgba(72, 148, 160, ${0.42 * alpha})`);
        bodyGrad.addColorStop(0.9, `rgba(38, 46, 56, ${0.52 * alpha})`);
        bodyGrad.addColorStop(1, `rgba(160, 220, 228, ${0.58 * alpha})`);
      } else {
        // Crystal-clear optical aqua-teal over bright light background
        bodyGrad.addColorStop(0, `rgba(255, 255, 255, ${0.98 * alpha})`);
        bodyGrad.addColorStop(0.26, `rgba(168, 228, 236, ${0.76 * alpha})`);
        bodyGrad.addColorStop(0.65, `rgba(45, 148, 160, ${0.48 * alpha})`);
        bodyGrad.addColorStop(0.88, `rgba(26, 98, 112, ${0.42 * alpha})`);
        bodyGrad.addColorStop(1, `rgba(32, 128, 140, ${0.62 * alpha})`);
      }

      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Crisp Fresnel outer contour rim
      ctx.lineWidth = Math.max(0.75, r * 0.055);
      ctx.strokeStyle = isNight
        ? `rgba(226, 242, 248, ${0.42 * alpha})`
        : `rgba(33, 122, 134, ${0.46 * alpha})`;
      ctx.stroke();

      // Primary upper-left studio specular reflection (curved meniscus highlight)
      ctx.beginPath();
      ctx.ellipse(
        -r * 0.32,
        -r * 0.34,
        r * 0.28,
        r * 0.16,
        -Math.PI / 4,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${0.92 * alpha})`;
      ctx.fill();

      // Secondary pinpoint specular glint
      if (r > 5) {
        ctx.beginPath();
        ctx.arc(-r * 0.14, -r * 0.52, r * 0.08, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.82 * alpha})`;
        ctx.fill();

        // Lower-right internal caustic bounce light
        ctx.beginPath();
        ctx.arc(r * 0.28, r * 0.3, r * 0.26, 0, Math.PI * 2);
        ctx.fillStyle = isNight
          ? `rgba(130, 225, 235, ${0.32 * alpha})`
          : `rgba(255, 255, 255, ${0.58 * alpha})`;
        ctx.fill();
      }

      ctx.restore();
    };

    // Helper: Draw realistic liquid surface-tension metaball neck between two merging droplets
    const drawLiquidMetaballNeck = (
      x1: number,
      y1: number,
      r1: number,
      x2: number,
      y2: number,
      r2: number,
      dist: number
    ) => {
      const maxReach = (r1 + r2) * 2.15;
      if (dist >= maxReach || dist <= Math.abs(r1 - r2) * 0.8) return;

      const t = 1 - (dist - (r1 + r2) * 0.7) / (maxReach - (r1 + r2) * 0.7);
      const neckStrength = Math.max(0, Math.min(1, t));
      if (neckStrength <= 0.02) return;

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const sinPerp = Math.sin(angle + Math.PI / 2);
      const cosPerp = Math.cos(angle + Math.PI / 2);

      const spread1 = r1 * (0.68 * neckStrength);
      const spread2 = r2 * (0.68 * neckStrength);

      const p1TopX = x1 + cosPerp * spread1;
      const p1TopY = y1 + sinPerp * spread1;
      const p1BotX = x1 - cosPerp * spread1;
      const p1BotY = y1 - sinPerp * spread1;

      const p2TopX = x2 + cosPerp * spread2;
      const p2TopY = y2 + sinPerp * spread2;
      const p2BotX = x2 - cosPerp * spread2;
      const p2BotY = y2 - sinPerp * spread2;

      const midX = (x1 + x2) * 0.5;
      const midY = (y1 + y2) * 0.5;
      const pinch = Math.min(r1, r2) * 0.28 * neckStrength;

      const ctrlTopX = midX + cosPerp * pinch;
      const ctrlTopY = midY + sinPerp * pinch;
      const ctrlBotX = midX - cosPerp * pinch;
      const ctrlBotY = midY - sinPerp * pinch;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p1TopX, p1TopY);
      ctx.quadraticCurveTo(ctrlTopX, ctrlTopY, p2TopX, p2TopY);
      ctx.lineTo(p2BotX, p2BotY);
      ctx.quadraticCurveTo(ctrlBotX, ctrlBotY, p1BotX, p1BotY);
      ctx.closePath();

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      if (isNight) {
        grad.addColorStop(0, `rgba(182, 224, 232, ${0.65 * neckStrength})`);
        grad.addColorStop(0.5, `rgba(240, 249, 255, ${0.82 * neckStrength})`);
        grad.addColorStop(1, `rgba(182, 224, 232, ${0.65 * neckStrength})`);
      } else {
        grad.addColorStop(0, `rgba(52, 156, 168, ${0.52 * neckStrength})`);
        grad.addColorStop(0.5, `rgba(180, 234, 240, ${0.78 * neckStrength})`);
        grad.addColorStop(1, `rgba(52, 156, 168, ${0.52 * neckStrength})`);
      }

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    };

    let lastTime = performance.now();
    let animId: number;

    const render = (now: number) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;
      const nowSec = now * 0.001;

      const cx = width * 0.5 + (pointerX - width * 0.5) * 0.03;
      const cy = height * 0.5 + (pointerY - height * 0.5) * 0.025;

      if (!prefersReducedMotion) {
        cycleTime += dt;
        if (cycleTime >= cycleDuration) {
          cycleTime = 0;
          initConvergingPhase(cx, cy);
        }
      }

      // 100% transparent clear — no grey fill rectangles or artificial boxes
      ctx.clearRect(0, 0, width, height);

      // Subtle localized caustic light reflection directly beneath the water action
      const causticRadius = Math.min(width, height) * 0.42;
      const causticGrad = ctx.createRadialGradient(
        cx,
        cy,
        4,
        cx,
        cy,
        causticRadius
      );
      if (isNight) {
        causticGrad.addColorStop(0, 'rgba(88, 185, 194, 0.075)');
        causticGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)');
        causticGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        causticGrad.addColorStop(0, 'rgba(41, 130, 138, 0.075)');
        causticGrad.addColorStop(0.55, 'rgba(138, 197, 200, 0.04)');
        causticGrad.addColorStop(1, 'rgba(248, 250, 252, 0)');
      }
      ctx.fillStyle = causticGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, causticRadius, 0, Math.PI * 2);
      ctx.fill();

      // ======================================================================
      // PHASE 1 & PHASE 2: MULTI-DIRECTION DROPLETS & SURFACE-TENSION MERGING
      // ======================================================================
      if (phaseState === 'converging') {
        const activeDrops: ConvergingDroplet[] = [];

        for (const d of convergingDroplets) {
          if (d.merged) continue;
          if (cycleTime >= d.spawnTime) {
            d.active = true;
          }
          if (!d.active) continue;

          // Organic curved trajectory + central gravitational pull as time progresses
          const pullStrength = cycleTime > 1.35 ? 2.4 : 0.85;
          const targetX =
            cycleTime > 1.75 ? cx : cx + d.targetOffsetX * (1 - cycleTime * 0.4);
          const targetY =
            cycleTime > 1.75 ? cy : cy + d.targetOffsetY * (1 - cycleTime * 0.4);

          const toCenterX = targetX - d.x;
          const toCenterY = targetY - d.y;

          d.vx += toCenterX * pullStrength * dt;
          d.vy += toCenterY * pullStrength * dt;

          // Damping so they coalesce smoothly in the central zone
          d.vx *= 0.968;
          d.vy *= 0.968;

          // Subtle perpendicular organic drift
          const perpAngle = Math.atan2(d.vy, d.vx) + Math.PI / 2;
          const organicDrift =
            Math.sin(nowSec * 3.5 + d.wobblePhase) * d.curveFactor * dt;

          d.x += d.vx * dt + Math.cos(perpAngle) * organicDrift;
          d.y += d.vy * dt + Math.sin(perpAngle) * organicDrift;

          d.oscillationAmp = Math.max(0.08, d.oscillationAmp * 0.985);
          activeDrops.push(d);
        }

        // Pairwise collision detection & liquid surface-tension metaball merging
        for (let i = 0; i < activeDrops.length; i++) {
          const a = activeDrops[i];
          if (a.merged) continue;

          for (let j = i + 1; j < activeDrops.length; j++) {
            const b = activeDrops[j];
            if (b.merged) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const sumR = a.radius + b.radius;

            // Draw liquid surface-tension bridge when droplets approach each other
            if (dist < sumR * 2.1) {
              drawLiquidMetaballNeck(a.x, a.y, a.radius, b.x, b.y, b.radius, dist);
              // Surface tension pulls them together
              const tensionForce = 18 * dt;
              a.x += (dx / Math.max(1, dist)) * tensionForce;
              a.y += (dy / Math.max(1, dist)) * tensionForce;
              b.x -= (dx / Math.max(1, dist)) * tensionForce;
              b.y -= (dy / Math.max(1, dist)) * tensionForce;
            }

            // Coalesce into a larger droplet when surface tension bridges snap together
            if (dist < sumR * 0.82) {
              const areaA = a.radius * a.radius;
              const areaB = b.radius * b.radius;
              const totalArea = areaA + areaB;

              const newRadius = Math.min(
                42,
                Math.pow(a.radius ** 3 + b.radius ** 3, 1 / 3) * 1.07
              );

              a.x = (a.x * areaA + b.x * areaB) / totalArea;
              a.y = (a.y * areaA + b.y * areaB) / totalArea;
              a.vx = (a.vx * areaA + b.vx * areaB) / totalArea;
              a.vy = (a.vy * areaA + b.vy * areaB) / totalArea;
              a.radius = newRadius;
              a.oscillationAmp = Math.min(0.34, a.oscillationAmp + 0.14);
              a.generation += 1;
              b.merged = true;

              // Emit a subtle coalescence ripple & tiny satellite bead
              if (ripples.length < 18) {
                ripples.push({
                  x: a.x,
                  y: a.y,
                  radius: newRadius * 0.7,
                  maxRadius: newRadius * 3.4,
                  alpha: 0.32,
                  speed: 2.1,
                  thickness: 1.3,
                });
              }
            }
          }
        }

        // Draw all active converging & coalescing droplets
        for (const d of activeDrops) {
          if (d.merged) continue;
          drawRealisticDroplet(
            d.x,
            d.y,
            d.radius,
            0.96,
            d.vx,
            d.vy,
            d.wobblePhase,
            d.oscillationAmp,
            nowSec
          );
        }

        // Transition to Phase 3 once droplets have merged into the large master droplet (or at t >= 3.4s)
        const unmerged = convergingDroplets.filter((d) => !d.merged);
        if ((unmerged.length <= 1 && cycleTime > 2.2) || cycleTime >= 3.45) {
          const primary = unmerged[0] || {
            x: cx,
            y: cy,
            radius: 38,
            wobblePhase: 0,
          };
          masterDroplet = {
            x: primary.x,
            y: primary.y,
            vx: 38,
            vy: -24,
            radius: Math.max(36, primary.radius),
            wobblePhase: primary.wobblePhase,
            oscillationAmp: 0.22,
            travelStartTime: cycleTime,
          };
          phaseState = 'traveling';
        }
      }

      // ======================================================================
      // PHASE 3A: LARGE COALESCED DROPLET TRAVELS SHORT DISTANCE & DESTABILIZES
      // ======================================================================
      if (phaseState === 'traveling' && masterDroplet) {
        const travelElapsed = cycleTime - masterDroplet.travelStartTime;
        const travelProgress = Math.min(1, travelElapsed / 1.05);

        // Travel along a graceful short curved path while building Rayleigh-Taylor instability
        masterDroplet.x += masterDroplet.vx * dt;
        masterDroplet.y +=
          masterDroplet.vy * dt + Math.sin(travelProgress * Math.PI) * 18 * dt;

        // Increase surface-tension capillary oscillation before breakup
        const instability = 0.16 + travelProgress * 0.28;

        drawRealisticDroplet(
          masterDroplet.x,
          masterDroplet.y,
          masterDroplet.radius * (1 + travelProgress * 0.08),
          0.98,
          masterDroplet.vx * (1 + travelProgress * 1.8),
          masterDroplet.vy,
          masterDroplet.wobblePhase,
          instability,
          nowSec * (1 + travelProgress * 0.8)
        );

        if (travelElapsed >= 0.95) {
          triggerLargeDropletBreakup(
            masterDroplet.x,
            masterDroplet.y,
            masterDroplet.radius
          );
        }
      }

      // ======================================================================
      // PHASE 3B: SUDDEN BREAKUP INTO SMALLER DROPLETS & TRANSITION TO SPLASH
      // ======================================================================
      if (phaseState === 'breakup') {
        let activeFrags = 0;
        for (const f of breakupFragments) {
          f.x += f.vx * dt;
          f.y += f.vy * dt;
          f.vy += 45 * dt; // gravity acceleration toward impact plane
          f.filamentAlpha *= 0.88;

          // Draw thinning liquid filament ligament during initial breakup
          if (f.filamentAlpha > 0.05) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(f.parentX, f.parentY);
            ctx.lineTo(f.x, f.y);
            ctx.strokeStyle = isNight
              ? `rgba(182, 224, 232, ${f.filamentAlpha * 0.45})`
              : `rgba(45, 148, 160, ${f.filamentAlpha * 0.42})`;
            ctx.lineWidth = Math.max(0.8, f.radius * 0.35 * f.filamentAlpha);
            ctx.stroke();
            ctx.restore();
          }

          drawRealisticDroplet(
            f.x,
            f.y,
            f.radius,
            f.alpha,
            f.vx,
            f.vy,
            f.wobblePhase,
            0.18,
            nowSec
          );
          activeFrags++;
        }

        if (cycleTime >= 4.8 || activeFrags === 0) {
          const splashOriginX = masterDroplet ? masterDroplet.x : cx;
          const splashOriginY = masterDroplet ? masterDroplet.y : cy;
          triggerMassiveSplash(splashOriginX, splashOriginY);
        }
      }

      // ======================================================================
      // PHASE 4: MASSIVE WATER SPLASH (LIQUID SHEETS, MIST, RIPPLES & DROPLETS)
      // ======================================================================

      // 4A. Fine Aerosol Mist Clouds
      for (let i = mistClouds.length - 1; i >= 0; i--) {
        const m = mistClouds[i];
        m.x += m.vx;
        m.y += m.vy;
        m.vx *= 0.985;
        m.vy *= 0.985;
        m.radius += (m.maxRadius - m.radius) * 0.035;
        m.alpha *= 0.976;

        if (m.alpha <= 0.008) {
          mistClouds.splice(i, 1);
          continue;
        }

        const mistGrad = ctx.createRadialGradient(
          m.x,
          m.y,
          1,
          m.x,
          m.y,
          m.radius
        );
        if (isNight) {
          mistGrad.addColorStop(0, `rgba(210, 232, 240, ${m.alpha})`);
          mistGrad.addColorStop(0.5, `rgba(120, 175, 188, ${m.alpha * 0.45})`);
          mistGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        } else {
          mistGrad.addColorStop(0, `rgba(52, 148, 160, ${m.alpha * 0.65})`);
          mistGrad.addColorStop(0.55, `rgba(145, 212, 220, ${m.alpha * 0.35})`);
          mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        }

        ctx.fillStyle = mistGrad;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4B. Expanding Translucent Liquid Sheets / Crown Petals
      for (let i = liquidSheets.length - 1; i >= 0; i--) {
        const s = liquidSheets[i];
        s.innerRadius += s.speed * dt * 0.72;
        s.outerRadius += s.speed * dt * 1.15;
        s.speed *= 0.96;
        s.alpha *= 0.962;

        if (s.alpha <= 0.015) {
          liquidSheets.splice(i, 1);
          continue;
        }

        const originX = masterDroplet ? masterDroplet.x : cx;
        const originY = masterDroplet ? masterDroplet.y : cy;

        const a1 = s.angle - s.spread;
        const a2 = s.angle + s.spread;
        const midA = s.angle;

        const x1In = originX + Math.cos(a1) * s.innerRadius;
        const y1In = originY + Math.sin(a1) * s.innerRadius * 0.78;
        const x2In = originX + Math.cos(a2) * s.innerRadius;
        const y2In = originY + Math.sin(a2) * s.innerRadius * 0.78;

        const xOut = originX + Math.cos(midA) * s.outerRadius;
        const yOut = originY + Math.sin(midA) * s.outerRadius * 0.78;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1In, y1In);
        ctx.quadraticCurveTo(xOut, yOut, x2In, y2In);
        ctx.quadraticCurveTo(
          originX + Math.cos(midA) * (s.innerRadius * 0.85),
          originY + Math.sin(midA) * (s.innerRadius * 0.65),
          x1In,
          y1In
        );
        ctx.closePath();

        ctx.fillStyle = isNight
          ? `rgba(200, 234, 242, ${s.alpha * 0.28})`
          : `rgba(56, 158, 170, ${s.alpha * 0.24})`;
        ctx.fill();

        ctx.strokeStyle = isNight
          ? `rgba(245, 250, 255, ${s.alpha * 0.55})`
          : `rgba(36, 126, 138, ${s.alpha * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // 4C. Hydro-Shockwave Ring
      if (shockwaveAlpha > 0.01) {
        const originX = masterDroplet ? masterDroplet.x : cx;
        const originY = masterDroplet ? masterDroplet.y : cy;
        shockwaveRadius +=
          (Math.max(width, height) * 0.76 - shockwaveRadius) * 0.065;
        shockwaveAlpha *= 0.945;

        ctx.save();
        ctx.beginPath();
        ctx.arc(originX, originY, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isNight
          ? `rgba(210, 236, 244, ${shockwaveAlpha * 0.45})`
          : `rgba(41, 130, 138, ${shockwaveAlpha * 0.38})`;
        ctx.lineWidth = 1.8 + shockwaveAlpha * 4.5;
        ctx.stroke();
        ctx.restore();
      }

      // 4D. Perspective Elliptical Surface Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.radius += rp.speed;
        rp.alpha *= 0.98;

        if (rp.alpha <= 0.012 || rp.radius > rp.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(rp.x, rp.y);
        ctx.scale(1, 0.38);
        ctx.beginPath();
        ctx.arc(0, 0, rp.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isNight
          ? `rgba(190, 225, 235, ${rp.alpha * 0.48})`
          : `rgba(41, 130, 138, ${rp.alpha * 0.42})`;
        ctx.lineWidth = rp.thickness;
        ctx.stroke();
        ctx.restore();
      }

      // 4E. 3D Crown Splash & Suspended Droplets
      for (let i = splashDroplets.length - 1; i >= 0; i--) {
        const d = splashDroplets[i];
        d.vx *= 0.986;
        d.vy = d.vy * 0.986 + 0.135; // fluid drag + gentle gravity
        d.x += d.vx * 0.64;
        d.y += d.vy * 0.64;
        d.z += d.vz * 0.011;
        d.alpha *= 0.985;

        // Secondary ripple when falling droplet re-enters the water plane
        if (
          !d.hasReentered &&
          d.vy > 1.2 &&
          d.y > cy + 45 &&
          d.radius > 3.2 &&
          ripples.length < 24
        ) {
          d.hasReentered = true;
          ripples.push({
            x: d.x,
            y: d.y,
            radius: 3,
            maxRadius: 48 + d.radius * 8,
            alpha: d.alpha * 0.48,
            speed: 1.8,
            thickness: 1.2,
          });
        }

        if (d.alpha <= 0.02 || d.y > height + 50) {
          splashDroplets.splice(i, 1);
          continue;
        }

        const perspectiveRadius = d.radius * Math.min(2.15, d.z);
        drawRealisticDroplet(
          d.x,
          d.y,
          perspectiveRadius,
          d.alpha,
          d.vx * 14,
          d.vy * 14,
          d.wobblePhase,
          0.12,
          nowSec
        );
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', syncCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isNight, interactive, intensity]);

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!triggerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    triggerRef.current(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div
      onClick={handleStageClick}
      className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}
    >
      <canvas ref={canvasRef} className="h-full w-full block" />
    </div>
  );
};
