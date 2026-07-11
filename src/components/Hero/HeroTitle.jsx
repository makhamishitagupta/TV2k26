import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';
import { useHeroScroll } from '../../contexts/HeroScrollContext';
import { playTactileSound } from '../../utils/sound';

const GRADIENT_MAP = {
  explore: ['#FAFAFA', '#E7E7E7', '#CFCFCF'],
  create: ['#FAFAFA', '#E7E7E7', '#CFCFCF'],
  celebrate: ['#FAFAFA', '#E7E7E7', '#CFCFCF'],
};

/**
 * HeroTitle — TECHNOVISTA heading with accent gradient, subtle float,
 * supporting text, and redesigned CTA buttons.
 */
export default function HeroTitle({
  isMobile = false,
  themeName = 'explore',
  accent,
  delayTitle = 1.5,
  delayText = 1.8,
  delayButtons = 2.1,
  animateState = 'hidden',
  isTransitioning = false, // Intercept day transition states
}) {
  const colors = GRADIENT_MAP[themeName] || GRADIENT_MAP.explore;
  const gradientText = `linear-gradient(135deg, ${colors[0]} 15%, ${colors[1]} 55%, ${colors[2]} 100%)`;

  const sceneProgress = useHeroScroll();

  // Scroll scene transforms (adjusted for both desktop and mobile)
  const titleY = useTransform(sceneProgress, [0, 0.36], [0, isMobile ? -40 : -150]);
  const titleScale = useTransform(sceneProgress, [0, 0.36], [1, isMobile ? 0.96 : 0.90]);
  const titleOpacity = useTransform(sceneProgress, [0, 0.10, 0.36], [1, 1, 0]);
  const titlePointerEvents = useTransform(sceneProgress, (p) => p > 0.36 ? 'none' : 'auto');

  // Supporting Text: Y and fade with proportional mobile distances
  const textY = useTransform(sceneProgress, [0, 0.30], [0, isMobile ? -25 : -85]);
  const textOpacity = useTransform(sceneProgress, [0, 0.08, 0.30], [1, 1, 0]);
  const textPointerEvents = useTransform(sceneProgress, (p) => p > 0.30 ? 'none' : 'auto');

  // CTA Buttons: Y and fade with proportional mobile distances
  const buttonsY = useTransform(sceneProgress, [0, 0.30], [0, isMobile ? -30 : -100]);
  const buttonsOpacity = useTransform(sceneProgress, [0, 0.08, 0.30], [1, 1, 0]);
  const buttonsPointerEvents = useTransform(sceneProgress, (p) => p > 0.30 ? 'none' : 'auto');

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: delayTitle,
      }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: GOLDEN_EASE }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, delay: delayText, ease: GOLDEN_EASE }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.0, delay: delayButtons, ease: GOLDEN_EASE }
    }
  };

  const titleLetters = Array.from("TECHNOVISTA");
  const isVisible = animateState === 'visible';

  const handleExploreClick = (e) => {
    e.preventDefault();
    playTactileSound('click');
    const isMobile = window.innerWidth < 768;
    const vh = window.innerHeight;
    if (isMobile) {
      const el = document.getElementById('about');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({
        top: vh * 0.95,
        behavior: 'smooth'
      });
    }
  };



  return (
    <div className="flex flex-col items-center text-center relative z-10 w-full">
      {/* Subtle background colored glow matching active day theme */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 rounded-full blur-[80px] ${isMobile ? 'w-[300px] h-[100px]' : 'w-[450px] sm:w-[650px] h-[130px]'}`}
        style={{
          background: `radial-gradient(circle, ${accent}25 0%, transparent 80%)`,
          opacity: 0.75,
          transition: 'background 0.8s ease',
        }}
      />

      {/* Single Gradient-Clipped Heading with scroll transform */}
      <motion.div style={{ y: titleY, scale: titleScale, opacity: titleOpacity, pointerEvents: titlePointerEvents }}>
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={animateState}
        >
          <motion.h1
            className={`editorial-title-lg tv-hero-title max-w-5xl select-none text-center ${isMobile ? 'mb-2.5' : 'mb-6'}`}
            style={{
              fontWeight: 800, // ExtraBold weight
            }}
            animate={{
              letterSpacing: isTransitioning 
                ? '-0.24em' // Tight compression during shifting
                : (isVisible ? '-0.04em' : '-0.08em'), // Original Outfit ExtraBold negative tracking
              scale: isTransitioning ? 0.94 : 1,
            }}
            transition={{
              duration: isTransitioning ? 0.8 : 1.8,
              ease: GOLDEN_EASE
            }}
          >
            <span className="inline-flex select-none tv-sweep">
              {titleLetters.map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block cursor-default text-clip-gradient transition-all duration-300"
                  style={{
                    display: 'inline-block',
                    backgroundImage: 'inherit',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </motion.h1>
        </motion.div>
      </motion.div>

      {/* Supporting subtitle with scroll transform */}
      <motion.div style={{ y: textY, opacity: textOpacity, pointerEvents: textPointerEvents }} className="w-full flex justify-center">
        <motion.p
          variants={textVariants}
          initial="hidden"
          animate={
            isTransitioning
              ? { opacity: 0.15, y: 5 }
              : (isVisible ? 'visible' : 'hidden')
          }
          transition={{
            duration: isTransitioning ? 0.7 : 1.0,
            ease: 'easeInOut'
          }}
          className={`text-[10.5px] sm:text-xs font-sans tracking-widest leading-relaxed uppercase max-w-xl select-none font-normal px-6 text-center ${isMobile ? 'mb-6' : 'mb-10'}`}
          style={{ color: 'rgba(255, 255, 255, 0.45)' }}
        >
          A High-Fidelity National Level Tech Symposium hosted by Department of Information Technology at VNR VJIET.
        </motion.p>
      </motion.div>

      {/* CTA Buttons with scroll transform */}
      <motion.div style={{ y: buttonsY, opacity: buttonsOpacity, pointerEvents: buttonsPointerEvents }}>
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate={
            isTransitioning
              ? { opacity: 0.15, scale: 0.93, y: 10 }
              : (isVisible ? 'visible' : 'hidden')
          }
          transition={{
            duration: isTransitioning ? 0.7 : 1.0,
            ease: 'easeInOut'
          }}
          className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} items-center justify-center ${isMobile ? 'gap-3 w-full px-6' : 'gap-4 sm:gap-6'}`}
        >
          {/* Primary CTA — Register Now (Opaque Metallic Champagne Gold Gradient with Layered Shadows) */}
          <motion.a
            href="https://forms.gle/technovista2026-register" // Placeholder registration link
            target="_blank"
            rel="noopener noreferrer"
            whileHover="hover"
            whileTap={{ scale: 0.97, y: 0 }}
            className={`group relative border font-heading font-semibold tracking-[0.16em] uppercase text-[11px] sm:text-xs rounded-full cursor-pointer overflow-hidden text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${isMobile ? 'w-full px-6 py-4 min-h-[50px]' : 'px-8.5 py-3.5'}`}
            style={{
              background: 'linear-gradient(135deg, #f3e5ca 0%, #d8b26e 50%, #9a7538 100%)', // Rich metallic champagne gold
              borderColor: 'rgba(243, 229, 202, 0.35)', // Light champagne gold outline
              color: '#080604', // Dark charcoal text
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.20), 0 8px 18px rgba(154, 117, 56, 0.25), inset 0 1px 1.5px rgba(255, 255, 255, 0.60)',
              transition: 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, color 0.4s ease',
            }}
            variants={{
              hover: {
                y: -2, // Lift by exactly 2px
                borderColor: '#ffffff', // High-visibility white border on hover
                background: 'linear-gradient(135deg, #f6ebd7 0%, #e0c286 50%, #ad8444 100%)', // Slightly brighter champagne sheen
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.25), 0 14px 28px rgba(154, 117, 56, 0.40), inset 0 1px 2px rgba(255, 255, 255, 0.80)',
              }
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Register Now
              <svg
                className="w-4 h-4 transform group-hover:scale-105 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
              </svg>
            </span>
            
            {/* Beam ambient reflection glow */}
            <div className="tv-hero-btn-glow" />

            {/* Amber Shimmer light sweep */}
            <motion.div
              variants={{
                hover: { x: '150%' }
              }}
              initial={{ x: '-150%', skewX: -25 }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 201, 88, 0.25) 50%, transparent 100%)',
              }}
            />
          </motion.a>

          {/* Secondary CTA — Conclave Info (Translucent Glass Panel treatment) */}
          <motion.a
            href="#about"
            onClick={handleExploreClick}
            whileHover="hover"
            whileTap={{ scale: 0.97, y: 0 }}
            className={`group relative border font-heading font-semibold uppercase text-[11px] sm:text-xs rounded-full cursor-pointer overflow-hidden text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${isMobile ? 'w-full px-6 py-4 min-h-[50px]' : 'px-8.5 py-3.5'}`}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)', // Translucent glass
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderColor: 'rgba(255, 248, 235, 0.08)', // Faint warm inner border
              color: '#ffffff', // White text
              letterSpacing: '0.16em', // Base spacing
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.20), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
              transition: 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, color 0.4s ease',
            }}
            variants={{
              hover: {
                y: -2, // Lift by exactly 2px
                borderColor: 'rgba(243, 229, 202, 0.25)', // Subtle warm border highlight
                backgroundColor: 'rgba(255, 255, 255, 0.08)', // Brighter glass
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(243, 229, 202, 0.05), 0 8px 24px rgba(0, 0, 0, 0.30), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
              }
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Conclave Info
              <svg
                className="w-3.5 h-3.5 transform group-hover:translate-x-[5.5px] transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
            
            {/* Beam ambient reflection glow */}
            <div className="tv-hero-btn-glow" />

            {/* Amber Shimmer light sweep */}
            <motion.div
              variants={{
                hover: { x: '150%' }
              }}
              initial={{ x: '-150%', skewX: -25 }}
              transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 201, 88, 0.15) 50%, transparent 100%)',
              }}
            />
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
