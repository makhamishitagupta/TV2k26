import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useFestival } from '../../hooks/useFestival';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { useWindowSize } from '../../hooks/useWindowSize';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { GOLDEN_EASE } from '../../animations/variants';

import HeroBackground from '../Background/HeroBackground';
import HeroLogos from './HeroLogos';
import HeroAmbientGlow from './HeroAmbientGlow';
import HeroCountdown from './HeroCountdown';
import HeroTitle from './HeroTitle';
import HeroFloatingObjects from './HeroFloatingObjects';
import HeroFeaturedObject from './HeroFeaturedObject';
import HeroFloatingWords from './HeroFloatingWords';
import HeroParticles from './HeroParticles';
import VolumetricBeam from './VolumetricBeam';

import AboutSection from '../About/AboutSection';
import clubLogo from '../../assets/logos/logo.png';
import { HeroScrollContext } from '../../contexts/HeroScrollContext';

function getChromaticColor(hex, shiftAmt = 24) {
  if (!hex || hex.length < 7) return hex;
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  
  // Create chromatic separation by shifting red up and blue down slightly
  r = Math.max(0, Math.min(255, r + shiftAmt));
  g = Math.max(0, Math.min(255, g - Math.round(shiftAmt * 0.4)));
  b = Math.max(0, Math.min(255, b - shiftAmt));
  
  const toHex = (n) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * HeroSection — Production orchestrator (V4.0).
 *
 * Exposes a shared ScrollSceneContext scroll progress to drive a cinematic, 
 * 100% reversible, and continuous Hero -> About transition.
 */
export default function HeroSection() {
  const { isLoaderFinished, isLoaderExiting } = useApp();
  const {
    themeName,
    accent,
    startDate,
    countdownVisible,
  } = useFestival();

  const { width, height: windowHeight } = useWindowSize();
  const { x: mouseX, y: mouseY, isTouch } = useMouseParallax();
  const containerRef = useRef(null);
  const isMobile = width > 0 && width < 768;

  // Drive scroll progress directly by window.scrollY
  const { scrollY } = useScroll();
  const rawProgress = useTransform(
    scrollY,
    [0, isMobile ? (windowHeight || 800) : 2.0 * (windowHeight || 800)],
    [0, 1]
  );
  const scrollYProgress = useSpring(rawProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.08,
    restDelta: 0.001
  });

  // Background Grid Line exit: Opacity 1 -> 0 from 0.70 to 1.0 (to blend smoothly with EventHub background)
  const bgOpacity = useTransform(scrollYProgress, [0, 0.45, 0.70, 1.0], [1, 1, 1, 0]);

  // Scroll arrow exit: Opacity 1 -> 0 from 0.0 to 0.20
  const arrowOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Logo Badges exit: Y 0 -> -250px, Opacity 1 -> 0 (completely gone by 0.30)
  const logosY = useTransform(scrollYProgress, [0, 0.35], [0, isMobile ? -80 : -250]);
  const logosOpacity = useTransform(scrollYProgress, [0, 0.10, 0.30], [1, 1, 0]);

  // Ambient Title Glow exit: Y 0 -> -300px, Scale 1 -> 1.4, Opacity 1 -> 0 (completely gone by 0.36)
  const glowY = useTransform(scrollYProgress, [0, 0.36], [0, isMobile ? -80 : -300]);
  const glowScale = useTransform(scrollYProgress, [0, 0.36], [1, isMobile ? 1.15 : 1.4]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.12, 0.36], [1, 1, 0]);

  // Central 3D shape/object exit: Y 0 -> -500px, Scale 1 -> 0.75, Opacity 1 -> 0 (completely gone by 0.36)
  const featY = useTransform(scrollYProgress, [0, 0.36], [0, isMobile ? -120 : -500]);
  const featScale = useTransform(scrollYProgress, [0, 0.36], [1, isMobile ? 0.85 : 0.75]);
  const featOpacity = useTransform(scrollYProgress, [0, 0.12, 0.36], [1, 1, 0]);

  // WebGL SideRays exit: Y 0 -> -300px, ScaleY 1 -> 1.4, Opacity 1 -> 0, Blur 0px -> 8px (completely gone by 0.36)
  const raysY = useTransform(scrollYProgress, [0, 0.36], [0, isMobile ? -100 : -300]);
  const raysScaleY = useTransform(scrollYProgress, [0, 0.36], [1, isMobile ? 1.2 : 1.4]);
  const raysOpacityScroll = useTransform(scrollYProgress, [0, 0.12, 0.36], [1, 1, 0]);
  const raysBlur = useTransform(scrollYProgress, [0, 0.12, 0.36], ['blur(0px)', 'blur(0px)', isMobile ? 'blur(4px)' : 'blur(8px)']);

  const viewportTier = width >= 1024 ? 'desktop' : width >= 768 ? 'tablet' : 'mobile';

  // Entrance triggers the moment loading screen starts exiting/dissolving
  const entranceReady = isLoaderExiting || isLoaderFinished;
  const animateState = entranceReady ? 'visible' : 'hidden';

  // Delay mouse parallax activation until 2.4s after exit begins
  const [parallaxActive, setParallaxActive] = useState(false);
  const isTransitioning = false;
  const [isSearching, setIsSearching] = useState(false);
  const [isEntranceComplete, setIsEntranceComplete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollDown = () => {
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

  useEffect(() => {
    if (!entranceReady) return;
    const timer = setTimeout(() => setParallaxActive(true), 2400);
    const timerReveal = setTimeout(() => {
      setIsSearching(true);
      setIsOpen(true);
    }, 100);
    const timerEntrance = setTimeout(() => {
      setIsEntranceComplete(true);
    }, 3500); // 3.5 seconds after entrance begins
    return () => {
      clearTimeout(timer);
      clearTimeout(timerReveal);
      clearTimeout(timerEntrance);
    };
  }, [entranceReady]);

  useEffect(() => {
    let cAngle = -32;
    let tx = window.innerWidth / 2;
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let ty = cx;
    let tyMouse = cy;
    let animationFrameId;

    const handleMouseMove = (e) => {
      tx = e.clientX;
      ty = e.clientX;
      tyMouse = e.clientY;
      window.__tv_raw_mx = e.clientX;
      window.__tv_raw_my = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const tick = () => {
      const targetAngle = ((tx / window.innerWidth) - 0.5) * 48; // Maximum ±24 degrees rotation
      cAngle += (targetAngle - cAngle) * 0.16;                  // Smoother tracking speed (lerp 0.16)
      document.documentElement.style.setProperty('--tv-beam-angle', `${cAngle}deg`);
      document.documentElement.style.setProperty('--tv-beam-angle-raw', cAngle.toFixed(4));
      cx += (ty - cx) * 0.18;
      cy += (tyMouse - cy) * 0.18;
      document.documentElement.style.setProperty('--tv-mx', `${cx}px`);
      document.documentElement.style.setProperty('--tv-my', `${cy}px`);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const mx = parallaxActive ? mouseX : 0;
  const my = parallaxActive ? mouseY : 0;

  return (
    <HeroScrollContext.Provider value={scrollYProgress}>
      <section
        ref={containerRef}
        id="hero-scene-container"
        className="relative w-full"
        style={{ height: isMobile ? 'auto' : '200vh' }}
      >
        <header
          id="stage"
          className={[
            isMobile 
              ? "relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center tv-stage"
              : "sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-center items-center tv-stage",
            isSearching ? 'is-searching' : '',
            isOpen ? 'is-open' : '',
            isEntranceComplete ? 'entrance-complete' : ''
          ].filter(Boolean).join(' ')}
        >
          <motion.div style={{ opacity: bgOpacity }} className="absolute inset-0 -z-10">
            <HeroBackground delay={0.3} accent={accent} animateState={animateState} />
            <VolumetricBeam isMobile={isMobile} animateState={isOpen ? 'visible' : 'hidden'} />
          </motion.div>

          {!isMobile && (
            <HeroFloatingWords
              mouseX={mx}
              mouseY={my}
              isTouch={isTouch}
              viewportTier={viewportTier}
              accent={accent}
              delay={0.8}
              animateState={isOpen ? 'visible' : 'hidden'}
            />
          )}

          <div className="tv-hero-content">
            {!isMobile && (
              <motion.div style={{ y: logosY, opacity: logosOpacity }} className="absolute inset-0 z-30 pointer-events-none">
                <HeroLogos
                  delay={0.1}
                  accent={accent}
                  animateState={isOpen ? 'visible' : 'hidden'}
                  mouseX={mx}
                  mouseY={my}
                  isTouch={isTouch}
                  isTransitioning={isTransitioning}
                />
              </motion.div>
            )}

            <motion.div style={{ y: glowY, scale: glowScale, opacity: glowOpacity }} className="absolute inset-0 pointer-events-none">
              <HeroAmbientGlow
                accent={accent}
                mouseX={mx}
                mouseY={my}
                isTouch={isTouch}
                isMobile={isMobile}
                delay={0.1}
                animateState={isOpen ? 'visible' : 'hidden'}
              />
            </motion.div>

            <HeroParticles
              mouseX={mx}
              mouseY={my}
              isTouch={isTouch}
              isMobile={isMobile}
              viewportTier={viewportTier}
              accent={accent}
              delay={0.2}
              animateState={isOpen ? 'visible' : 'hidden'}
            />

            <HeroFloatingObjects
              mouseX={mx}
              mouseY={my}
              isTouch={isTouch}
              isMobile={isMobile}
              viewportTier={viewportTier}
              accent={accent}
              delay={0.2}
              animateState={isOpen ? 'visible' : 'hidden'}
            />

            <motion.div style={{ y: featY, scale: featScale, opacity: featOpacity }} className="absolute inset-0 pointer-events-none">
              <HeroFeaturedObject
                themeName={themeName}
                accent={accent}
                mouseX={mx}
                mouseY={my}
                isTouch={isTouch}
                delay={0.2}
                animateState={isOpen ? 'visible' : 'hidden'}
              />
            </motion.div>

            <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
              <motion.div 
                style={isMobile ? {} : { 
                  transformStyle: 'preserve-3d',
                  perspective: 1000
                }}
                className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6 pointer-events-auto"
              >

                <HeroCountdown
                  isMobile={isMobile}
                  startDate={startDate}
                  countdownVisible={countdownVisible}
                  accent={accent}
                  delay={0.1}
                  animateState={isOpen ? 'visible' : 'hidden'}
                  isTransitioning={isTransitioning}
                />

                <HeroTitle
                  isMobile={isMobile}
                  themeName={themeName}
                  accent={accent}
                  delayTitle={0.2}
                  delayText={0.45}
                  delayButtons={0.7}
                  animateState={isOpen ? 'visible' : 'hidden'}
                  isTransitioning={isTransitioning}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            style={{ opacity: arrowOpacity }}
            className="tv-scroll-cue absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2.5 cursor-pointer pointer-events-auto group"
            onClick={handleScrollDown}
            initial={{ opacity: 0, y: 15 }}
            animate={entranceReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 1.0, delay: 2.4, ease: GOLDEN_EASE }}
          >
            <motion.span 
              animate={{ opacity: [0.45, 0.75, 0.45] }} // Quieter visibility pulse bounds
              transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}
              className="text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-mono text-white/40 group-hover:text-white transition-colors duration-300 select-none"
            >
              Scroll to Explore
            </motion.span>
            
            <motion.svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              stroke="rgba(255, 201, 88, 0.55)" // Muted warm amber accent stroke
              className="group-hover:stroke-white transition-colors duration-300"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{
                y: [0, 5, 0],
                opacity: [0.35, 0.85, 0.35],
                filter: [
                  'drop-shadow(0 0 1px rgba(255, 201, 88, 0.1))',
                  'drop-shadow(0 0 4px rgba(255, 201, 88, 0.5))',
                  'drop-shadow(0 0 1px rgba(255, 201, 88, 0.1))'
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <path d="M1 1L5 5L9 1" />
            </motion.svg>
          </motion.div>

          {!isMobile && <AboutSection isMobile={false} />}
        </header>

        {isMobile && <AboutSection isMobile={true} />}
      </section>
    </HeroScrollContext.Provider>
  );
}
