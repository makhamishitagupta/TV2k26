import React from 'react';
import { motion } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';

/**
 * HeroBackground — Unified, premium burgundy background layer for the Hero section.
 * 
 * Uses warm burgundy/maroon radials for ambient lighting, warm-tinted grid overlay,
 * and a cinematic vignette — all blending seamlessly with the global gradient canvas.
 * 
 * No cool tones (blue, purple, navy, indigo) anywhere.
 * Preserves visual depth through subtle overlays, glows, and atmospheric haze.
 */
export default function HeroBackground({ delay = 0.3, accent, animateState = 'hidden' }) {
  const parentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1.8,
        delay,
        ease: GOLDEN_EASE,
        staggerChildren: 0.1,
      },
    },
  };

  const childDotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 200, damping: 18 },
    },
  };

  return (
    <motion.div
      variants={parentVariants}
      initial="hidden"
      animate={animateState}
      className="relative w-full h-full overflow-hidden pointer-events-none select-none"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* 1. Ambient Lighting Gradients — Warm burgundy/maroon tones only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Left: Large warm maroon radial glow */}
        <div 
          className="absolute -top-[35%] -left-[25%] w-[110vw] h-[110vw] rounded-full opacity-100 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(90, 26, 25, 0.20) 0%, rgba(90, 26, 25, 0) 75%)' }}
        />

        {/* Top Right: Soft burgundy ambient glow */}
        <div 
          className="absolute -top-[25%] -right-[15%] w-[80vw] h-[80vw] rounded-full opacity-100 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(59, 14, 18, 0.12) 0%, rgba(59, 14, 18, 0) 75%)' }}
        />

        {/* Center Focal: Soft warm crimson ambient backlight for title area */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vh] rounded-full opacity-80 mix-blend-screen"
          style={{ background: 'radial-gradient(circle, rgba(138, 45, 36, 0.10) 0%, rgba(138, 45, 36, 0) 70%)' }}
        />

        {/* Bottom: Subtle warm gradient — burgundy to deep maroon blend */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[45vh] pointer-events-none opacity-[0.08]"
          style={{ background: 'linear-gradient(to right, rgba(90, 26, 25, 0.6), rgba(59, 14, 18, 0.8), rgba(42, 10, 15, 0.6))' }}
        />

        {/* Layer 3: Ambient Fog / Haze (Drifting radial clouds with extremely low opacities to be subtle) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-60">
          <motion.div
            className="absolute -top-[20%] -left-[20%] w-[90vw] h-[90vw] rounded-full blur-[150px]"
            style={{
              background: `radial-gradient(circle, ${accent || '#d9040b'}04 0%, transparent 70%)`,
              willChange: 'transform',
            }}
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -40, 30, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute -bottom-[25%] -right-[20%] w-[100vw] h-[100vw] rounded-full blur-[180px]"
            style={{
              background: 'radial-gradient(circle, rgba(255, 201, 88, 0.02) 0%, transparent 70%)',
              willChange: 'transform',
            }}
            animate={{
              x: [0, -60, 40, 0],
              y: [0, 50, -40, 0],
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>

      {/* 2. Subtle Noise Texture Overlay (film grain for depth) */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay z-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="heroNoiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#heroNoiseFilter)" />
        </svg>
      </div>

      {/* 3. Grid Blueprint overlay (warm-tinted lines) */}
      <div className="absolute inset-0 grid-overlay opacity-[0.05] pointer-events-none z-10" />

      {/* 4. Interactive SVG Blueprint Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8A2D24" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Large Blueprint Radial Backing */}
        <circle cx="50%" cy="50%" r="48%" fill="url(#centerGlow)" className="transition-all duration-[1000ms]" />

        {/* Grid intersections Crosshairs (4 anchors, warm burgundy accent) */}
        {[
          { x: '20%', y: '20%' },
          { x: '80%', y: '20%' },
          { x: '20%', y: '80%' },
          { x: '80%', y: '80%' },
        ].map((pt, i) => (
          <motion.g
            key={`cross-${i}`}
            variants={childDotVariants}
            stroke="rgba(138, 45, 36, 0.28)"
            strokeWidth="0.8"
            strokeOpacity="0.28"
            className="transition-colors duration-[1000ms]"
          >
            <line x1={`calc(${pt.x} - 8px)`} y1={pt.y} x2={`calc(${pt.x} + 8px)`} y2={pt.y} />
            <line x1={pt.x} y1={`calc(${pt.y} - 8px)`} x2={pt.x} y2={`calc(${pt.y} + 8px)`} />
            <circle cx={pt.x} cy={pt.y} r="2" fill="none" />
          </motion.g>
        ))}
      </svg>

      {/* Radial vignette for atmospheric depth (warm burgundy vignette) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 0%, rgba(23, 7, 9, 0.55) 100%)',
        }}
      />
    </motion.div>
  );
}
