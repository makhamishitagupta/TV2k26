import React, { useMemo } from 'react';
import { motion, useTransform } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';
import { useHeroScroll } from '../../contexts/HeroScrollContext';

// Import all floating assets
import aiBrain from '../../assets/hero/ai-brain.svg';
import aiBrain04 from '../../assets/hero/ai-brain-04.svg';
import aiChip from '../../assets/hero/ai-chip.webp';
import apiStroke from '../../assets/hero/api-stroke.svg';
import binaryCode from '../../assets/hero/binary-code.svg';
import fontBot from '../../assets/hero/bot.svg';
import database from '../../assets/hero/database.svg';
import githubStroke from '../../assets/hero/github-stroke.svg';
import link01 from '../../assets/hero/link-01.svg';
import monitorDot from '../../assets/hero/monitor-dot.svg';
import neuralNetwork from '../../assets/hero/neural-network.svg';
import notebookText from '../../assets/hero/notebook-text.svg';
import qrCode from '../../assets/hero/qr-code.svg';
import terminal from '../../assets/hero/terminal.webp';
import typeOutline from '../../assets/hero/type-outline.svg';
import usbBugs from '../../assets/hero/usb-bugs.svg';
import waypoints from '../../assets/hero/waypoints.svg';

const ASSET_POOL = [
  { src: aiBrain, name: 'ai-brain' },
  { src: aiBrain04, name: 'ai-brain-04' },
  { src: aiChip, name: 'ai-chip' },
  { src: apiStroke, name: 'api' },
  { src: binaryCode, name: 'binary-code' },
  { src: fontBot, name: 'bot' },
  { src: database, name: 'database' },
  { src: githubStroke, name: 'github' },
  { src: link01, name: 'link' },
  { src: monitorDot, name: 'monitor' },
  { src: neuralNetwork, name: 'neural-network' },
  { src: notebookText, name: 'notebook' },
  { src: qrCode, name: 'qr-code' },
  { src: terminal, name: 'terminal' },
  { src: typeOutline, name: 'type' },
  { src: usbBugs, name: 'usb' },
  { src: waypoints, name: 'waypoints' },
];

// Predefined grid of anchors on the left associated side (x <= 50)
const LEFT_ANCHORS = [
  { x: 4, y: 12 },
  { x: 11, y: 26 },
  { x: 5, y: 40 },
  { x: 12, y: 55 },
  { x: 6, y: 70 },
  { x: 11, y: 84 },
  { x: 22, y: 8 },
  { x: 38, y: 9 },
  { x: 20, y: 86 },
  { x: 36, y: 88 }
];

// Predefined grid of anchors on the right associated side (x > 50)
const RIGHT_ANCHORS = [
  { x: 94, y: 12 },
  { x: 86, y: 26 },
  { x: 93, y: 40 },
  { x: 85, y: 55 },
  { x: 91, y: 70 },
  { x: 86, y: 84 },
  { x: 78, y: 8 },
  { x: 62, y: 9 },
  { x: 80, y: 86 },
  { x: 64, y: 88 }
];

// Seeded shuffle helper to select different sets of anchors & assets each refresh.
function seededShuffle(array, seed) {
  const shuffled = [...array];
  let m = shuffled.length;
  let s = seed;
  while (m) {
    s = (s * 16807 + 0) % 2147483647;
    const i = s % m--;
    [shuffled[m], shuffled[i]] = [shuffled[i], shuffled[m]];
  }
  return shuffled;
}

// Convert hex color to HSL for dynamic color filter rotation.
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * HeroFloatingObjects — Premium floating logic objects.
 * Accent-tinted, glowing, and parallax responsive.
 */
export default function HeroFloatingObjects({
  mouseX = 0,
  mouseY = 0,
  isTouch = false,
  isMobile = false,
  viewportTier = 'desktop',
  accent = '#ffffff',
  delay = 0.6,
  animateState = 'hidden',
}) {
  const counts = { desktop: 9, tablet: 6, mobile: 2 }; // Half count per side (mobile: 2 per side = 4 total)
  const halfCount = counts[viewportTier] || counts.desktop;
  const count = halfCount * 2; // Total object count for effects loop

  const sceneProgress = useHeroScroll();

  const seed = useMemo(() => Math.floor(Math.random() * 100000), []);
  const hsl = useMemo(() => hexToHsl(accent), [accent]);

  const objects = useMemo(() => {
    const shuffledAssets = seededShuffle(ASSET_POOL, seed);
    
    // Disjoint slices of ASSET_POOL to prevent duplication on the left and right sides
    const leftAssets = shuffledAssets.slice(0, halfCount);
    const rightAssets = shuffledAssets.slice(halfCount, halfCount * 2);

    const leftSelectedAnchors = seededShuffle(LEFT_ANCHORS, seed + 1).slice(0, halfCount);
    const rightSelectedAnchors = seededShuffle(RIGHT_ANCHORS, seed + 2).slice(0, halfCount);

    // Merge into one balanced array
    const mergedList = [
      ...leftAssets.map((asset, idx) => ({ asset, anchor: leftSelectedAnchors[idx] })),
      ...rightAssets.map((asset, idx) => ({ asset, anchor: rightSelectedAnchors[idx] }))
    ];

    return mergedList.map(({ asset, anchor }, i) => {
      let s = seed + i * 31;
      const rand = () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s % 10000) / 10000;
      };

      // Assign to explicit size categories (Large, Medium, Small hierarchy)
      let sizeClass = 'medium';
      if (i % 3 === 0) sizeClass = 'large';
      else if (i % 3 === 1) sizeClass = 'small';

      // Adjust anchors and jitter for Safe Zones on mobile
      let rawX = (anchor?.x ?? 50) + (rand() * 4 - 2);
      let rawY = (anchor?.y ?? 50) + (rand() * 4 - 2);

      if (isMobile) {
        // Enforce X safe zone (15% to 85% is unsafe for text)
        if (rawX >= 15 && rawX <= 85) {
          // Push to nearest safe side
          rawX = rawX < 50 ? 8 : 92;
        }
        // Move large icons even closer to the edges
        if (sizeClass === 'large') {
          rawX = rawX < 50 ? 5 : 95;
          // Avoid placing large icons behind the subtitle/middle area (y: 35 to 65)
          if (rawY >= 30 && rawY <= 70) {
            rawY = rawY < 50 ? 20 : 80;
          }
        }
        // Avoid top (y < 12) and bottom (y > 80) center overlaps
        if (rawX > 20 && rawX < 80) {
          if (rawY < 12) rawY = 14;
          if (rawY > 80) rawY = 78;
        }
      }

      const pos = {
        x: Math.max(2, Math.min(98, rawX)),
        y: Math.max(2, Math.min(98, rawY))
      };

      let baseSize, depth, opacityMultiplier, blur, parallaxMultiplier;

      if (sizeClass === 'large') {
        // Foreground (large, blurred, high opacity, fast parallax)
        baseSize = isMobile ? (32 + rand() * 6) : (46 + rand() * 12);
        depth = 0.7 + rand() * 0.3; // 0.7 to 1.0 (close)
        opacityMultiplier = 0.35 + rand() * 0.10; // 35% to 45%
        blur = isMobile ? 1.0 : (1.8 + rand() * 1.4); // Less blur on mobile for perf
        parallaxMultiplier = 0.6 + depth * 0.2;
      } else if (sizeClass === 'small') {
        // Background (tiny, fainted, blurred, slow parallax)
        baseSize = isMobile ? (10 + rand() * 3) : (10 + rand() * 6);
        depth = 0.0 + rand() * 0.3; // 0.0 to 0.3 (far)
        opacityMultiplier = 0.16 + rand() * 0.08; // 16% to 24%
        blur = isMobile ? 0.5 : (1.0 + rand() * 1.0);
        parallaxMultiplier = 0.1 + depth * 0.1;
      } else {
        // Midground (medium, clear, in-focus, normal parallax)
        baseSize = isMobile ? (20 + rand() * 4) : (26 + rand() * 8);
        depth = 0.3 + rand() * 0.4; // 0.3 to 0.7 (middle)
        opacityMultiplier = 0.25 + rand() * 0.10; // 25% to 35%
        blur = 0; // In-focus
        parallaxMultiplier = 0.3 + depth * 0.15;
      }

      const floatDuration = 12 + rand() * 8; // 12–20s
      const floatDelay = rand() * 4;
      const driftY = 10 + rand() * 8;
      const driftX = 20 + rand() * 6;
      const rotRange = -2 + rand() * 4; // ±2° rotation
      const opacity = (opacityMultiplier + rand() * 0.04) * (isMobile ? 0.75 : 1.0); // Lower opacity on mobile

      // Spec 3 & 4: Persistent survivor tag and exit vector direction
      const survivor = rand() < 0.3; // Stable ~30% survivor flag
      const exitVector = {
        x: rand() * 3.0 - 1.5, // range [-1.5, 1.5]
        y: rand() * 2.0 - 1.5, // range [-1.5, 0.5] (mostly upwards/outwards)
      };

      return {
        ...asset,
        pos, depth, baseSize, sizeClass, blur,
        floatDuration, floatDelay,
        driftY, driftX, rotRange, opacity,
        survivor, exitVector, parallaxMultiplier
      };
    });
  }, [seed, count]);

  const [brightenedIndex, setBrightenedIndex] = React.useState(-1);

  React.useEffect(() => {
    const triggerRandomBrightening = () => {
      if (count > 0) {
        const randomIndex = Math.floor(Math.random() * count);
        setBrightenedIndex(randomIndex);
        setTimeout(() => {
          setBrightenedIndex(-1);
        }, 3500); // Hold for 3.5s
      }
    };

    // Initial delay, then trigger every 9.5 seconds (looping interval between 8-12s)
    const initialTimer = setTimeout(triggerRandomBrightening, 4000);
    const interval = setInterval(triggerRandomBrightening, 9500);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {objects.map((obj, i) => (
        <FloatingObjectItem
          key={`${obj.name}-${i}`}
          obj={obj}
          index={i}
          sceneProgress={sceneProgress}
          mouseX={mouseX}
          mouseY={mouseY}
          isTouch={isTouch}
          isMobile={isMobile}
          accent={accent}
          hsl={hsl}
          delay={delay}
          animateState={animateState}
          isBrightened={isMobile ? false : brightenedIndex === i}
        />
      ))}
    </div>
  );
}

/**
 * FloatingObjectItem — Isolated item container that safely consumes scroll context hooks
 * and layers animations hierarchically to prevent transform conflicts.
 */
function FloatingObjectItem({
  obj,
  index,
  sceneProgress,
  mouseX,
  mouseY,
  isTouch,
  isMobile = false,
  accent,
  hsl,
  delay,
  animateState,
  isBrightened
}) {
  // Exit progress mapping (Movement starts at 0.0, ends at 0.85)
  const exitProgress = useTransform(sceneProgress, [0, 0.85], [0, 1]);

  // exitOffset: survivor stays in place, non-survivor travels off-screen (disabled on mobile for perf)
  const exitX = useTransform(exitProgress, (p) => isMobile ? 0 : (obj.survivor ? 0 : obj.exitVector.x * 1000 * p));
  const exitY = useTransform(exitProgress, (p) => isMobile ? 0 : (obj.survivor ? 0 : obj.exitVector.y * 1000 * p));

  // Opacity timing: stays base until 0.45, goes to 0 (or lower survivor background level) by 0.85
  const scrollOpacity = useTransform(
    sceneProgress,
    [0, 0.45, 0.85],
    [obj.opacity, obj.opacity, obj.survivor ? obj.opacity * 0.45 : 0]
  );

  // Parallax offsets (Depth layering) using refined parallaxMultiplier
  const multiplier = obj.parallaxMultiplier;
  const px = isTouch ? 0 : mouseX * multiplier;
  const py = isTouch ? 0 : mouseY * multiplier;

  const shadowX = isTouch ? 0 : -mouseX * obj.depth * 0.4;
  const shadowY = isTouch ? 0 : -mouseY * obj.depth * 0.4;

  const rotMouse = isTouch ? 0 : (mouseX - mouseY) * obj.depth * 0.18;
  const scaleMouse = isTouch ? 1 : 1 + Math.abs(mouseX + mouseY) * 0.0006;

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: (custom) => ({
      opacity: custom.opacity,
      scale: 1,
      transition: {
        duration: 1.6,
        delay: custom.delay,
        ease: GOLDEN_EASE,
      },
    }),
  };

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${obj.pos.x}%`,
        top: `${obj.pos.y}%`,
        x: exitX,
        y: exitY,
        opacity: scrollOpacity,
      }}
    >
      <motion.div
        variants={itemVariants}
        custom={{ opacity: 1.0, delay: delay + index * 0.08 }}
        initial="hidden"
        animate={animateState}
      >
        {/* Parallax and camera effects container */}
        <div
          style={{
            transform: isMobile
              ? 'none'
              : `translate(${px}px, ${py}px) rotate(${rotMouse}deg) scale(${scaleMouse})`,
            willChange: 'transform',
            filter: isMobile
              ? `opacity(${isBrightened ? 1 : 0.85})`
              : `
              drop-shadow(${shadowX}px ${shadowY}px 8px rgba(0,0,0,0.05))
              drop-shadow(0 0 10px ${accent}${isBrightened ? '45' : '15'})
              hue-rotate(${hsl.h}deg) saturate(0.6)
              ${obj.blur > 0 ? `blur(${obj.blur}px)` : ''}
            `,
            opacity: isBrightened ? 1.5 : 1.0,
            transition: isMobile
              ? 'opacity 0.8s ease'
              : 'filter 0.8s ease, opacity 1.2s ease',
          }}
        >
          {/* Floating idle animation loop */}
          <motion.img
            src={obj.src}
            alt=""
            draggable={false}
            animate={{
              y: [-obj.driftY / 2, obj.driftY / 2, -obj.driftY / 2],
              x: [-obj.driftX / 2, obj.driftX / 2, -obj.driftX / 2],
              rotate: [-obj.rotRange, obj.rotRange, -obj.rotRange],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: obj.floatDuration,
              delay: obj.floatDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="select-none"
            style={{
              width: `${obj.baseSize}px`,
              height: `${obj.baseSize}px`,
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
