import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { useHeroScroll } from '../../contexts/HeroScrollContext';

/**
 * VolumetricBeam — Renders a soft, architectural light beam.
 * Simulates a high-performance spotlight projecting a warm amber light cone.
 */
export default function VolumetricBeam({ animateState = 'hidden', isMobile = false }) {
  const sceneProgress = useHeroScroll();
  // Fade out spotlight between scroll progress 0 (start) and 0.45 (before About slides in)
  const beamScrollOpacity = useTransform(sceneProgress, [0, 0.45], [1, 0]);

  const beamVariants = {
    hidden: {
      opacity: 0,
      scaleX: 0.98,
      scaleY: 0.98,
    },
    visible: {
      opacity: 1,
      scaleX: 1.0,
      scaleY: 1.0,
      transition: {
        duration: isMobile ? 2.0 : 2.5,
        delay: isMobile ? 1.0 : 1.2,
        ease: 'easeInOut',
      }
    }
  };

  return (
    <motion.div
      variants={beamVariants}
      initial="hidden"
      animate={animateState}
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        transformOrigin: 'top center',
        mixBlendMode: 'screen',
      }}
    >
      {/* Scroll-linked fadeout wrapper */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: beamScrollOpacity,
        }}
      >
        {/* Rotating, Breathing, and Floating spotlight cone */}
        <motion.div
          className={
            isMobile
              ? "absolute top-[-15vh] left-1/2 w-[140vw] h-[140vh] pointer-events-none"
              : "absolute top-[-15vh] left-1/2 w-[45vw] md:w-[60vw] lg:w-[70vw] h-[150vh] pointer-events-none"
          }
          style={{
            x: '-50%',
            transformOrigin: 'top center',
            rotate: isMobile ? '0deg' : 'var(--tv-beam-angle, 0deg)',
            willChange: 'transform, opacity',
          }}
          animate={{
            opacity: [0.93, 1.07, 0.93],
            scale: [0.998, 1.002, 0.998],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className={
              isMobile
                ? "w-full h-full opacity-[0.26]"
                : "w-full h-full opacity-[0.22] md:opacity-[0.26] lg:opacity-[0.32]"
            }
            style={{
              filter: isMobile ? 'blur(26px)' : 'blur(20px)',
            }}
          >
            <defs>
              {/* Horizontal gradient: warm amber core to Soul Orange sides to transparency */}
              <linearGradient id="beamHorizontal" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff7300" stopOpacity="0" />
                <stop offset="36%" stopColor="#ff7300" stopOpacity="0.3" />
                <stop offset="43%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="1.0" /> {/* Warm Amber Core */}
                <stop offset="57%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="64%" stopColor="#ff7300" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff7300" stopOpacity="0" />
              </linearGradient>

              {/* Vertical gradient mask: refined vertical fade to prevent abrupt endings */}
              <linearGradient id="beamVertical" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1.0" />
                <stop offset="25%" stopColor="#ffffff" stopOpacity="0.80" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#ffffff" stopOpacity="0.18" />
                <stop offset="85%" stopColor="#ffffff" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              
              <mask id="beamMask">
                <rect x="0" y="0" width="100" height="100" fill="url(#beamVertical)" />
              </mask>
            </defs>

            {/* Narrower tapered spotlight path: reduced angle (widened on mobile) */}
            <path
              d={isMobile ? "M 25 0 L 75 0 L 100 100 L 0 100 Z" : "M 46 0 L 54 0 L 86 100 L 14 100 Z"}
              fill="url(#beamHorizontal)"
              mask="url(#beamMask)"
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
