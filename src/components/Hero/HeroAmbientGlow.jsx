import React from 'react';
import { motion } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';

/**
 * HeroAmbientGlow — Large breathing radial glow behind the TECHNOVISTA title.
 * Color syncs to the active day theme accent.
 * Responds slightly to mouse movement for depth.
 */
export default function HeroAmbientGlow({
  accent,
  mouseX = 0,
  mouseY = 0,
  isTouch = false,
  isMobile = false,
  delay = 0.4,
  animateState = 'hidden',
}) {
  const px = isTouch ? 0 : mouseX * 0.15;
  const py = isTouch ? 0 : mouseY * 0.15;

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 2.0, delay, ease: GOLDEN_EASE }
    }
  };

  const glowSize = isMobile ? '400px' : '750px';
  const glowBlur = isMobile ? 'blur(50px)' : 'blur(75px)';

  return (
    <motion.div
      variants={glowVariants}
      initial="hidden"
      animate={animateState}
      className="absolute pointer-events-none z-[1]"
      style={{
        left: '50%',
        top: '48%',
        transform: `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`,
        willChange: 'transform',
      }}
    >
      <motion.div
        animate={{
          opacity: [0.24, 0.48, 0.24],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: glowSize,
          height: glowSize,
          background: `radial-gradient(circle, ${accent}65 0%, ${accent}25 35%, ${accent}06 70%, transparent 100%)`,
          filter: glowBlur,
          borderRadius: '50%',
          transition: 'background 0.8s ease',
        }}
      />
    </motion.div>
  );
}
