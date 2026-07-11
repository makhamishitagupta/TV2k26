import React, { useMemo } from 'react';
import { motion, useTransform } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';
import { useHeroScroll } from '../../contexts/HeroScrollContext';

const WORD_POOL = [
  'AI', 'API', 'JSON', 'NODE', 'REACT', 'SQL', 'CODE',
  'BUILD', 'CREATE', 'EXPLORE', 'INNOVATE', 'VNR', 'ML',
  'GPU', 'TECH', 'GIT', 'RUST', 'WASM', 'HTTP', 'DNS',
  'DEV', 'WEB', 'CLOUD', 'NEXT', 'VITE', 'CSS', 'HTML',
  'DATA', 'SERVER', 'DOCKER', 'KUBE', 'EDGE', 'LINUX',
  'ENGINE', 'CORE', 'STACK', 'PYTHON', 'TS', 'JS'
];

// Predefined safe coordinates for floating words, staggered from object anchors to prevent overlap
const WORD_ANCHORS = [
  // Left strip (shifted closer to center x: 12%–20%)
  { x: 12, y: 22 },
  { x: 18, y: 35 },
  { x: 14, y: 50 },
  { x: 20, y: 64 },
  { x: 15, y: 78 },
  { x: 18, y: 86 },
  
  // Right strip (shifted closer to center x: 80%–86%)
  { x: 86, y: 22 },
  { x: 80, y: 35 },
  { x: 84, y: 50 },
  { x: 79, y: 64 },
  { x: 83, y: 78 },
  { x: 81, y: 86 },
  
  // Top strip (shifted closer to center y: 17%–18%)
  { x: 24, y: 18 },
  { x: 35, y: 17 },
  { x: 65, y: 17 },
  { x: 76, y: 18 },
  
  // Bottom strip (shifted closer to center y: 76%–77%)
  { x: 22, y: 76 },
  { x: 32, y: 77 },
  { x: 68, y: 77 },
  { x: 78, y: 76 }
];

// Seeded shuffle helper.
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

/**
 * HeroFloatingWords — Tiny floating technical vocabulary.
 */
export default function HeroFloatingWords({
  mouseX = 0,
  mouseY = 0,
  isTouch = false,
  viewportTier = 'desktop',
  accent = '#B7C0CF',
  delay = 0.8,
  animateState = 'hidden',
}) {
  const counts = { desktop: 20, tablet: 12, mobile: 6 };
  const count = counts[viewportTier] || counts.desktop;

  const sceneProgress = useHeroScroll();

  const seed = useMemo(() => Math.floor(Math.random() * 100000), []);

  const words = useMemo(() => {
    const shuffledWords = seededShuffle(WORD_POOL, seed);
    const shuffledAnchors = seededShuffle(WORD_ANCHORS, seed + 1);

    const selectedWords = shuffledWords.slice(0, count);
    const selectedAnchors = shuffledAnchors.slice(0, count);

    return selectedWords.map((word, i) => {
      let rs = seed + i * 47;
      const rand = () => {
        rs = (rs * 16807 + 0) % 2147483647;
        return (rs % 10000) / 10000;
      };

      const anchor = selectedAnchors[i] || { x: 50, y: 50 };
      // Tiny random jitter (±2%)
      const pos = {
        x: Math.max(2, Math.min(98, anchor.x + (rand() * 4 - 2))),
        y: Math.max(2, Math.min(98, anchor.y + (rand() * 4 - 2)))
      };

      const fontSize = 10 + rand() * 4; // 10–14px
      const opacity = 0.10 + rand() * 0.06; // Base: 10%–16% atmospheric opacity (subtle warm tint)
      const depth = rand(); // 0 to 1 normalized depth
      const floatDuration = 12 + rand() * 8; // 12–20 seconds
      const floatDelay = rand() * 5;
      const driftY = 6 + rand() * 8;
      const driftX = 4 + rand() * 6;
      const rotRange = -4 + rand() * 8; // -4° to +4° rotation

      const survivor = rand() < 0.3; // Stable ~30% survivor flag
      const exitVector = {
        x: rand() * 2.0 - 1.0, // range [-1, 1]
        y: rand() * 2.0 - 1.5, // range [-1.5, 0.5] (mostly upwards/outwards)
      };

      return {
        word, pos, fontSize, opacity, depth,
        floatDuration, floatDelay, driftY, driftX, rotRange,
        survivor, exitVector
      };
    });
  }, [seed, count]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {words.map((w, i) => (
        <FloatingWordItem
          key={`word-${w.word}-${i}`}
          w={w}
          index={i}
          sceneProgress={sceneProgress}
          mouseX={mouseX}
          mouseY={mouseY}
          isTouch={isTouch}
          accent={accent}
          delay={delay}
          animateState={animateState}
        />
      ))}
    </div>
  );
}

/**
 * FloatingWordItem — Isolated word item that safely consumes scroll contexts
 * and prevents animation conflicts using a nested layout.
 */
function FloatingWordItem({
  w,
  index,
  sceneProgress,
  mouseX,
  mouseY,
  isTouch,
  accent,
  delay,
  animateState
}) {
  const [hovered, setHovered] = React.useState(false);

  // Exit progress mapping (starts at 0.0, ends at 0.85)
  const exitProgress = useTransform(sceneProgress, [0, 0.85], [0, 1]);

  const exitX = useTransform(exitProgress, (p) => w.survivor ? 0 : w.exitVector.x * 800 * p);
  const exitY = useTransform(exitProgress, (p) => w.survivor ? 0 : w.exitVector.y * 800 * p);

  // Parent exit scroll opacity: fades to 0 by 0.40
  const parentScrollOpacity = useTransform(
    sceneProgress,
    [0, 0.15, 0.40],
    [1, 1, w.survivor ? 0.10 : 0]
  );

  // Mouse Parallax offsets
  const multiplier = 0.25 + w.depth * 0.10;
  const px = isTouch ? 0 : mouseX * multiplier;
  const py = isTouch ? 0 : mouseY * multiplier;

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: (custom) => ({
      opacity: custom.opacity,
      transition: {
        duration: 1.6,
        delay: custom.delay,
        ease: GOLDEN_EASE,
      },
    }),
  };

  return (
    <motion.div
      className="absolute pointer-events-auto z-10"
      style={{
        left: `${w.pos.x}%`,
        top: `${w.pos.y}%`,
        x: exitX,
        y: exitY,
        opacity: parentScrollOpacity,
      }}
    >
      <motion.div
        variants={itemVariants}
        custom={{ opacity: 1.0, delay: delay + index * 0.04 }}
        initial="hidden"
        animate={animateState}
      >
        {/* Mouse parallax container */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            transform: `translate(${px}px, ${py}px)`,
            willChange: 'transform',
            cursor: 'default',
          }}
        >
          {/* Floating idle animation loop */}
          <motion.span
            animate={{
              y: [-w.driftY / 2, w.driftY / 2, -w.driftY / 2],
              x: [-w.driftX / 2, w.driftX / 2, -w.driftX / 2],
              rotate: [-w.rotRange / 2, w.rotRange / 2, -w.rotRange / 2],
            }}
            transition={{
              duration: w.floatDuration,
              delay: w.floatDelay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="font-heading font-medium select-none whitespace-nowrap"
            style={{
              fontSize: `${w.fontSize}px`,
              color: '#E8D5C0', // Warm off-white for cohesive warm palette
              letterSpacing: '12px',
              opacity: hovered ? 0.85 : w.opacity, // Dynamic opacity boost on hover
              textShadow: hovered ? '0 0 8px rgba(255, 213, 145, 0.35)' : 'none', // Warm amber glow
              textDecoration: hovered ? 'underline' : 'none', // Subtle text decoration
              textDecorationColor: 'rgba(255, 213, 145, 0.25)',
              textUnderlineOffset: '4px',
              transition: 'opacity 0.3s ease, text-shadow 0.3s ease, text-decoration 0.3s ease',
            }}
          >
            {w.word}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}
