import React, { useMemo, useRef } from 'react';
import { motion, useTransform, useAnimationFrame } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';
import { useHeroScroll } from '../../contexts/HeroScrollContext';

/**
 * HeroParticles — Tiny glowing nodes that fill empty space.
 */
export default function HeroParticles({
  mouseX = 0,
  mouseY = 0,
  isTouch = false,
  isMobile = false,
  viewportTier = 'desktop',
  accent = '#ffffff',
  delay = 0.7,
  animateState = 'hidden',
}) {
  const counts = { desktop: 80, tablet: 45, mobile: 20 };
  const count = counts[viewportTier] || counts.desktop;

  const sceneProgress = useHeroScroll();

  const seed = useMemo(() => Math.floor(Math.random() * 100000), []);

  const particles = useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s % 10000) / 10000;
    };

    // Helper to generate coordinates outside the main hero text zone to prevent overlaps
    const generateSafeCoordinates = () => {
      let x, y;
      let attempts = 0;
      const unsafeXMin = isMobile ? 14 : 20;
      const unsafeXMax = isMobile ? 86 : 80;
      const unsafeYMin = isMobile ? 12 : 18;
      const unsafeYMax = isMobile ? 88 : 82;

      while (attempts < 150) {
        x = 2 + rand() * 96; // 2% to 98%
        y = 2 + rand() * 96; // 2% to 98%
        const isInsideUnsafeX = x > unsafeXMin && x < unsafeXMax;
        const isInsideUnsafeY = y > unsafeYMin && y < unsafeYMax;
        if (!(isInsideUnsafeX && isInsideUnsafeY)) {
          return { x, y };
        }
        attempts++;
      }
      return rand() > 0.5 ? { x: 5, y: rand() * 90 } : { x: 95, y: rand() * 90 };
    };

    return Array.from({ length: count }, (_, i) => {
      const { x, y } = generateSafeCoordinates();
      
      const roll = rand();
      let type, color, glow, size, opacity, glowSpread;
      
      if (roll < 0.70) {
        // 70% Tiny warm-white ambient dust
        type = 'dust';
        size = 1.6 + rand() * 1.4; // 1.6px to 3.0px
        opacity = 0.65 + rand() * 0.25; // 0.65 to 0.90
        color = 'rgba(245, 235, 221, 0.95)'; // Warm Off-White
        glow = 'rgba(245, 235, 221, 0.55)';
        glowSpread = size * (isMobile ? 1.8 : 2.5);
      } else if (roll < 0.90) {
        // 20% Soft gold glowing particles
        type = 'glow';
        size = 3.2 + rand() * 1.8; // 3.2px to 5.0px
        opacity = 0.75 + rand() * 0.20; // 0.75 to 0.95
        color = 'rgba(255, 213, 145, 1.0)'; // Solid Soft Gold
        glow = 'rgba(255, 213, 145, 0.75)';
        glowSpread = size * (isMobile ? 2.5 : 3.5);
      } else {
        // 10% Small golden/burgundy spark particles
        type = 'spark';
        size = 2.5 + rand() * 1.5; // 2.5px to 4.0px
        opacity = 0.85 + rand() * 0.15; // 0.85 to 1.00
        // Rare Burgundy Accent (~35% of sparks) vs Amber (~65% of sparks)
        if (rand() < 0.35) {
          color = 'rgba(239, 68, 68, 1.0)'; // Solid Burgundy
          glow = 'rgba(239, 68, 68, 0.80)';
        } else {
          color = 'rgba(245, 158, 11, 1.0)'; // Solid Amber/Gold
          glow = 'rgba(245, 158, 11, 0.80)';
        }
        glowSpread = size * (isMobile ? 3.0 : 4.5);
      }

      const depth = rand();
      const floatDuration = 18 + rand() * 10; // slow, smooth drift
      const floatDelay = rand() * 10;
      
      // Tight local drift offsets (range -12px to 12px) to prevent excessive speed
      const tx1 = rand() * 24 - 12;
      const ty1 = rand() * 24 - 12;
      const tx2 = rand() * 24 - 12;
      const ty2 = rand() * 24 - 12;
      const tx3 = rand() * 24 - 12;
      const ty3 = rand() * 24 - 12;

      const survivor = rand() < 0.3; // Stable ~30% survivor flag
      const exitVector = {
        x: rand() * 2.0 - 1.0, // range [-1.0, 1.0]
        y: rand() * 2.0 - 1.8, // range [-1.8, 0.2] (mostly upwards)
      };

      return {
        x, y, size, opacity, depth, floatDuration, floatDelay,
        tx1, ty1, tx2, ty2, tx3, ty3,
        survivor, exitVector, color, glow, glowSpread, type
      };
    });
  }, [seed, count]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p, i) => (
        <ParticleItem
          key={`particle-${i}`}
          p={p}
          index={i}
          sceneProgress={sceneProgress}
          mouseX={mouseX}
          mouseY={mouseY}
          isTouch={isTouch}
          isMobile={isMobile}
          accent={accent}
          delay={delay}
          animateState={animateState}
        />
      ))}
    </div>
  );
}

/**
 * ParticleItem — Isolated particle item that safely consumes scroll context hooks
 * and layers animations to keep floating behavior while exiting.
 */
function ParticleItem({
  p,
  index,
  sceneProgress,
  mouseX,
  mouseY,
  isTouch,
  isMobile = false,
  accent,
  delay,
  animateState
}) {
  const elRef = useRef(null);

  // Exit progress mapping (starts at 0.0, ends at 0.85)
  const exitProgress = useTransform(sceneProgress, [0, 0.85], [0, 1]);

  // On mobile: skip exit displacement for performance — particles just fade out
  const exitX = useTransform(exitProgress, (v) => isMobile ? 0 : (p.survivor ? 0 : p.exitVector.x * 600 * v));
  const exitY = useTransform(exitProgress, (v) => isMobile ? 0 : (p.survivor ? 0 : p.exitVector.y * 1000 * v));

  // Opacity: fades from base to 0 (or survivor lower background level) from 0.15 to 0.40
  const scrollOpacity = useTransform(
    sceneProgress,
    [0, 0.15, 0.40],
    [p.opacity, p.opacity, p.survivor ? p.opacity * 0.10 : 0]
  );

  // Parallax offsets
  const multiplier = 0.15 + p.depth * 0.05;
  const px = isTouch ? 0 : mouseX * multiplier;
  const py = isTouch ? 0 : mouseY * multiplier;

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
      opacity: custom.opacity,
      transition: {
        duration: 2.0,
        delay: custom.delay,
        ease: GOLDEN_EASE,
      },
    }),
  };

  // Gentle cursor repulsion logic — disabled on mobile/touch for performance
  useAnimationFrame(() => {
    if (!elRef.current || isTouch || isMobile) return;
    const mx = window.__tv_raw_mx;
    const my = window.__tv_raw_my;
    if (mx === undefined || my === undefined) return;

    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const ex = p.survivor ? 0 : exitX.get();
    const ey = p.survivor ? 0 : exitY.get();

    const pxCenter = (p.x / 100) * winW + px + ex;
    const pyCenter = (p.y / 100) * winH + py + ey;

    const dx = pxCenter - mx;
    const dy = pyCenter - my;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let rx = 0;
    let ry = 0;
    const threshold = 110;
    if (dist < threshold && dist > 0.1) {
      const force = (threshold - dist) / threshold;
      const push = force * 12;
      rx = (dx / dist) * push;
      ry = (dy / dist) * push;
    }

    elRef.current.style.setProperty('--repulsion-x', `${rx}px`);
    elRef.current.style.setProperty('--repulsion-y', `${ry}px`);
  });

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        width: `${p.size}px`,
        height: `${p.size}px`,
        x: exitX,
        y: exitY,
        opacity: scrollOpacity,
      }}
    >
      <motion.div
        variants={itemVariants}
        custom={{ opacity: 1.0, delay: delay + index * 0.03 }}
        initial="hidden"
        animate={animateState}
        className="w-full h-full"
      >
        {/* Parallax and repulsion wrapper */}
        <div
          ref={elRef}
          style={{
            transform: `translate(calc(${px}px + var(--repulsion-x, 0px)), calc(${py}px + var(--repulsion-y, 0px)))`,
            willChange: 'transform',
            transition: 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }}
          className="w-full h-full"
        >
          {/* Drifting and Twinkling Visible Dot (Corrected background color and shadow mapping) */}
          <motion.div
            animate={{
              x: [0, p.tx1, p.tx2, p.tx3, 0],
              y: [0, p.ty1, p.ty2, p.ty3, 0],
              opacity: p.type === 'spark'
                ? [0.55, 1.0, 0.35, 0.95, 0.55]
                : [0.80, 1.0, 0.75, 1.0, 0.80],
              scale: p.type === 'spark'
                ? [1, 1.25, 0.75, 1.15, 1]
                : [1, 1.05, 0.95, 1.05, 1]
            }}
            transition={{
              duration: p.floatDuration,
              delay: p.floatDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full rounded-full"
            style={{
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.glowSpread}px ${p.glow}`,
              willChange: 'transform, opacity',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
