import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';
import collegeLogo from '../../assets/hero/VNRVJIET-logo-files-03.png';
import clubLogo from '../../assets/hero/tv-logo.png';

/**
 * HeroLogos renders VNR college and Data Questers club logos as premium floating glass badges.
 */
export default function HeroLogos({
  delay = 0.3,
  accent,
  animateState = 'hidden',
  mouseX = 0,
  mouseY = 0,
  isTouch = false,
  isTransitioning = false, // Day transition state intercept
}) {
  const glowColor = accent || '#ffffff';
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  // Logo 1 Base Variants (College)
  const logoLeftBase = {
    hidden: { opacity: 0, y: 35, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        opacity: { duration: 1.4, delay, ease: 'easeOut' },
        y: { duration: 1.4, delay, ease: GOLDEN_EASE },
        scale: { duration: 1.4, delay, ease: GOLDEN_EASE }
      }
    }
  };

  // Logo 2 Base Variants (Club)
  const logoRightBase = {
    hidden: { opacity: 0, y: 35, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        opacity: { duration: 1.4, delay: delay + 0.05, ease: 'easeOut' },
        y: { duration: 1.4, delay: delay + 0.05, ease: GOLDEN_EASE },
        scale: { duration: 1.4, delay: delay + 0.05, ease: GOLDEN_EASE }
      }
    }
  };

  return (
    <>
      {/* ================= VNR LOGO (LEFT) ================= */}
      <motion.div
        variants={logoLeftBase}
        initial="hidden"
        animate={
          isTransitioning 
            ? { opacity: 0.35, scale: 0.95, y: -15, x: 0, rotate: 0 } 
            : (animateState === 'visible' 
                ? { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 } 
                : 'hidden')
        }
        transition={
          isTransitioning 
            ? { duration: 0.6, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 150, damping: 25 }
        }
        className="absolute top-8 left-8 sm:top-10 sm:left-12 z-30"
        style={{
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="cursor-default"
          onMouseEnter={() => setLeftHovered(true)}
          onMouseLeave={() => setLeftHovered(false)}
        >
          <div
            className="flex items-center justify-center rounded-[22px] relative overflow-hidden transition-all duration-500"
            style={{
              width: 280,
              height: 90,
              background: leftHovered 
                ? 'linear-gradient(135deg, rgba(15, 12, 10, 0.60) 0%, rgba(232, 200, 138, 0.12) 50%, rgba(8, 6, 5, 0.70) 100%)' 
                : 'linear-gradient(135deg, rgba(15, 12, 10, 0.70) 0%, rgba(232, 200, 138, 0.08) 50%, rgba(8, 6, 5, 0.80) 100%)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: leftHovered ? '1px solid rgba(232, 200, 138, 0.18)' : '1px solid rgba(232, 200, 138, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Soft vertical reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: { duration: 12.0, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={collegeLogo}
                alt="VNR VJIET Logo"
                className="w-50 h-20 object-contain select-none"
                style={{
                  // Silhouetted white inversion for maximum readability (opacity raised to 0.95 default)
                  filter: leftHovered ? 'brightness(0) invert(1) opacity(1.0)' : 'brightness(0) invert(1) opacity(0.95)',
                  transition: 'filter 0.4s ease, opacity 0.4s ease',
                  willChange: 'filter, opacity',
                }}
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ================= DATA QUESTERS LOGO (RIGHT) ================= */}
      <motion.div
        variants={logoRightBase}
        initial="hidden"
        animate={
          isTransitioning 
            ? { opacity: 0.35, scale: 0.95, y: -15, x: 0, rotate: 0 } 
            : (animateState === 'visible' 
                ? { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 } 
                : 'hidden')
        }
        whileHover={{
          y: -3,
          rotate: 2.5,
        }}
        transition={
          isTransitioning 
            ? { duration: 0.6, ease: 'easeInOut' }
            : { type: 'spring', stiffness: 220, damping: 20 }
        }
        className="absolute top-8 right-8 sm:top-10 sm:right-12 z-30"
        style={{
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      >
        <div
          className="cursor-default"
          onMouseEnter={() => setRightHovered(true)}
          onMouseLeave={() => setRightHovered(false)}
        >
          <div
            className="flex items-center justify-center rounded-[22px] relative overflow-hidden transition-all duration-500"
            style={{
              width: 140,
              height: 90,
              background: rightHovered 
                ? 'linear-gradient(135deg, rgba(15, 12, 10, 0.60) 0%, rgba(232, 200, 138, 0.12) 50%, rgba(8, 6, 5, 0.70) 100%)' 
                : 'linear-gradient(135deg, rgba(15, 12, 10, 0.70) 0%, rgba(232, 200, 138, 0.08) 50%, rgba(8, 6, 5, 0.80) 100%)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: rightHovered ? '1px solid rgba(232, 200, 138, 0.18)' : '1px solid rgba(232, 200, 138, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Soft vertical reflection */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

            <motion.div
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: { duration: 12.0, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={clubLogo}
                alt="Data Questers Logo"
                className="w-32 h-20 object-contain select-none transition-all duration-300"
                style={{
                  // Restored original brand colors with slight saturation & contrast reduction to harmonize
                  filter: rightHovered ? 'saturate(0.85) brightness(1.0) contrast(1.0)' : 'saturate(0.70) brightness(0.90) contrast(0.95)',
                  transition: 'filter 0.4s ease, opacity 0.4s ease',
                  willChange: 'filter, opacity',
                }}
                draggable={false}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
