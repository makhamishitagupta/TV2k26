"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useLenis } from "lenis/react";

import { 
  RiFlashlightLine, 
  RiStarLine, 
  RiBugLine, 
  RiSpyLine, 
  RiCompass3Line, 
  RiShieldLine 
} from "react-icons/ri";

const events = [
  {
    id: "hackathon",
    num: "01",
    title: "Stark Hackathon",
    hero: "Iron Man",
    tagline: "Build the Future in 24 Hours.",
    desc: "Build secure, real-time system architectures and deploy working products in a 24-hour team sprint.",
    imagePath: "/events/ironman.jpg",
    accentColor: "#d9040b", // Stark Crimson Red
    glowColor: "rgba(217, 4, 11, 0.45)",
    icon: <RiFlashlightLine />
  },
  {
    id: "ml-challenge",
    num: "02",
    title: "Mystic AI Quest",
    hero: "Doctor Strange",
    tagline: "We saw 14,005 futures. Build the best model.",
    desc: "Analyze complex datasets, train high-accuracy machine learning models, and secure the leaderboard.",
    imagePath: "/events/doctorstrange.jpg",
    accentColor: "#f59e0b", // Mystic Amber Gold
    glowColor: "rgba(245, 158, 11, 0.45)",
    icon: <RiStarLine />
  },
  {
    id: "debug-or-die",
    num: "03",
    title: "Web Debug Matrix",
    hero: "Spider-Man",
    tagline: "Every Bug Has a Weakness.",
    desc: "Race against the clock to squash bugs, solve memory leaks, and repair code firewalls.",
    imagePath: "/events/spiderman.jpg",
    accentColor: "#b71c1c", // Spidey Scarlet Crimson
    glowColor: "rgba(183, 28, 28, 0.45)",
    icon: <RiBugLine />
  },
  {
    id: "data-detective",
    num: "04",
    title: "Stealth Crypt",
    hero: "Black Panther",
    tagline: "Wakanda Forever. Code Forever.",
    desc: "Intercept vibration logs, decrypt security matrices, and capture hidden files.",
    imagePath: "/events/black panther.jpg",
    accentColor: "#e8c88a", // Vibranium Antique Gold
    glowColor: "rgba(232, 200, 138, 0.45)",
    icon: <RiSpyLine />
  },
  {
    id: "dq-code-fest",
    num: "05",
    title: "Mjolnir Code Fest",
    hero: "Thor",
    tagline: "Write Code Worthy of Mjolnir.",
    desc: "Solve complex algorithmic puzzles and write lightning-fast optimized code.",
    imagePath: "/events/thor.jpg",
    accentColor: "#d97706", // Mjolnir Bright Amber
    glowColor: "rgba(217, 119, 6, 0.45)",
    icon: <RiCompass3Line />
  },
  {
    id: "guest-lectures",
    num: "06",
    title: "Shield Summit",
    hero: "Captain America",
    tagline: "Learn from the Legends.",
    desc: "Keynote briefings and leadership strategies from top cybersecurity and systems engineers.",
    imagePath: "/events/captainamerica.jpg",
    accentColor: "#9f1239", // Shield Crimson Rose
    glowColor: "rgba(159, 18, 57, 0.45)",
    icon: <RiShieldLine />
  }
];

export default function EventHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isThrottled, setIsThrottled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const touchStartYRef = useRef(null);
  const lockEligibleRef = useRef(true);
  
  const lenis = useLenis();
  const activeEvent = events[activeIndex];
  const itemHeight = 84; // height of each vertical dial text row (px)
  const rotation = activeIndex * 12; // 12 degrees rotation per item
  const mobileRotation = activeIndex * 24; // 24 degrees rotation per item on mobile for faster rolling feel

  // Native scroll ref synchronizers to prevent stale closure in event hooks
  const scrollStateRef = useRef({ activeIndex, isThrottled });
  const isLockedRef = useRef(isLocked);

  useEffect(() => {
    scrollStateRef.current = { activeIndex, isThrottled };
  }, [activeIndex, isThrottled]);

  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  // Hook into Lenis scroll to check if the center of the grid aligns with the viewport center
  useLenis((lenisInstance) => {
    // Disable scroll lock on mobile / tablet viewports (<1024px)
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      return;
    }
    const grid = gridRef.current;
    if (!grid) return;

    const rect = grid.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const gridCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distanceToCenter = Math.abs(gridCenter - viewportCenter);

    // If we've scrolled away, reset lock eligibility so it can lock when we return
    if (distanceToCenter > 150) {
      lockEligibleRef.current = true;
    }

    // Snaps and locks scrolling only when the interactive grid center aligns with viewport center
    if (distanceToCenter < 30 && lockEligibleRef.current && !isLockedRef.current) {
      setIsLocked(true);
      lockEligibleRef.current = false;
      
      lenisInstance.stop();
      lenisInstance.scrollTo(grid, { 
        offset: -((viewportHeight - rect.height) / 2),
        duration: 0.85,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let touchStartX = null;

    const handleNativeWheel = (e) => {
      if (!isLockedRef.current) return;
      if (Math.abs(e.deltaY) < 15) return;
      
      const scrollingDown = e.deltaY > 0;
      const { activeIndex: currIdx, isThrottled: throttled } = scrollStateRef.current;
      const isAtBoundary = scrollingDown 
        ? currIdx === events.length - 1 
        : currIdx === 0;

      // Release page lock at boundaries
      if (isAtBoundary) {
        setIsLocked(false);
        lockEligibleRef.current = false;
        setTimeout(() => { lockEligibleRef.current = true; }, 800);
        lenis?.start();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (throttled) return;

      const grid = gridRef.current;
      if (grid) {
        const rect = grid.getBoundingClientRect();
        lenis?.stop();
        lenis?.scrollTo(grid, { 
          offset: -((window.innerHeight - rect.height) / 2), 
          duration: 0.85,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }

      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), 600);

      if (scrollingDown) {
        setActiveIndex((prev) => Math.min(prev + 1, events.length - 1));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
      // Mobile horizontal swipe handling (<1024px)
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        if (touchStartX === null) return;
        const deltaX = touchStartX - e.touches[0].clientX;
        const deltaY = touchStartYRef.current !== null ? Math.abs(touchStartYRef.current - e.touches[0].clientY) : 0;
        
        // Predominantly horizontal swipe threshold check
        if (Math.abs(deltaX) < 40 || Math.abs(deltaX) < deltaY) return;
        
        const swipingLeft = deltaX > 0;
        touchStartX = null;
        touchStartYRef.current = null;
        
        if (swipingLeft) {
          setActiveIndex((prev) => Math.min(prev + 1, events.length - 1));
        } else {
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        }
        return;
      }

      if (!isLockedRef.current) return;
      if (touchStartYRef.current === null) return;

      const deltaY = touchStartYRef.current - e.touches[0].clientY;
      if (Math.abs(deltaY) < 40) return;

      const scrollingDown = deltaY > 0;
      const { activeIndex: currIdx, isThrottled: throttled } = scrollStateRef.current;
      const isAtBoundary = scrollingDown 
        ? currIdx === events.length - 1 
        : currIdx === 0;

      touchStartYRef.current = null;

      if (isAtBoundary) {
        setIsLocked(false);
        lockEligibleRef.current = false;
        setTimeout(() => { lockEligibleRef.current = true; }, 800);
        lenis?.start();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (throttled) return;

      const grid = gridRef.current;
      if (grid) {
        const rect = grid.getBoundingClientRect();
        lenis?.stop();
        lenis?.scrollTo(grid, { 
          offset: -((window.innerHeight - rect.height) / 2), 
          duration: 0.85,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }

      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), 600);

      if (scrollingDown) {
        setActiveIndex((prev) => Math.min(prev + 1, events.length - 1));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    const handleKeyDown = (e) => {
      if (!isLockedRef.current) return;

      const isPageUp = e.key === "PageUp";
      const isPageDown = e.key === "PageDown";
      const isArrowUp = e.key === "ArrowUp";
      const isArrowDown = e.key === "ArrowDown";
      const isSpace = e.key === " " || e.key === "Spacebar";

      if (!isPageUp && !isPageDown && !isArrowUp && !isArrowDown && !isSpace) return;

      const scrollingDown = isArrowDown || isPageDown || isSpace;
      const { activeIndex: currIdx, isThrottled: throttled } = scrollStateRef.current;
      const isAtBoundary = scrollingDown 
        ? currIdx === events.length - 1 
        : currIdx === 0;

      if (isAtBoundary) {
        setIsLocked(false);
        lockEligibleRef.current = false;
        setTimeout(() => { lockEligibleRef.current = true; }, 800);
        lenis?.start();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (throttled) return;

      const grid = gridRef.current;
      if (grid) {
        const rect = grid.getBoundingClientRect();
        lenis?.stop();
        lenis?.scrollTo(grid, { 
          offset: -((window.innerHeight - rect.height) / 2), 
          duration: 0.85,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }

      setIsThrottled(true);
      setTimeout(() => setIsThrottled(false), 600);

      if (scrollingDown) {
        setActiveIndex((prev) => Math.min(prev + 1, events.length - 1));
      } else {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    };

    section.addEventListener("wheel", handleNativeWheel, { passive: false });
    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown, { passive: false });

    return () => {
      section.removeEventListener("wheel", handleNativeWheel);
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      lenis?.start();
    };
  }, [lenis]);

  return (
    <section 
      ref={sectionRef}
      id="events" 
      className="relative py-32 sm:py-36 overflow-hidden select-none bg-transparent"
    >
      
      {/* Diffused emissive radial glow reflecting the active event's theme color — blended with warm canvas */}
      <div 
        className="absolute -left-[200px] top-1/2 -translate-y-1/2 w-[400px] h-[600px] rounded-full pointer-events-none transition-all duration-1000"
        style={{
          backgroundImage: `radial-gradient(circle at left, ${activeEvent.accentColor}1A, rgba(23, 7, 9, 0) 100%)`
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Heading with Brand Gold Styling */}
        <div className="mb-20 text-center lg:text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-[#F59E0B]">
            TACTICAL GRID DATABASE // DIRECTIVES
          </span>
          <h2 className="font-heading text-6xl md:text-8xl font-black tracking-tight text-gradient-silver uppercase mt-1">
            MISSIONS HUB
          </h2>
          <div className="w-16 h-1 bg-[#F59E0B] mt-4 shadow-[0_0_8px_#F59E0B] mx-auto lg:mx-0" />
        </div>

        {/* ========================================================
            1. DESKTOP VIEW: Snapping Circular Dial & Float Card
            ======================================================== */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-[550px]">
          
          {/* Left Column: Snapping Circular Dial list (Responsive Split) */}
          <div className="col-span-1 lg:col-span-6 w-full z-10 relative">
            
            {/* DESKTOP DIAL VIEW (Visible on lg viewports and up) */}
            <div className="hidden lg:flex lg:flex-col lg:justify-center h-[420px] pl-[200px] relative w-full">
              {/* The Leftmost Circular Dial (SVG mechanical radar display) */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-[550px] h-[550px] pointer-events-none select-none z-0 left-[-320px]"
              >
                <svg 
                  className="w-full h-full fill-none overflow-visible" 
                  viewBox="0 0 500 500"
                >
                  {/* Concentric record grooves */}
                  {Array.from({ length: 45 }).map((_, i) => (
                    <circle
                      key={`groove-desk-${i}`}
                      cx="250"
                      cy="250"
                      r={150 + i * 5}
                      stroke={`${activeEvent.accentColor}06`}
                      strokeWidth="0.8"
                      className="transition-colors duration-500"
                    />
                  ))}

                  {/* Concentric glowing support rings */}
                  <circle
                    cx="250"
                    cy="250"
                    r="280"
                    stroke={`${activeEvent.accentColor}1A`}
                    strokeWidth="1.2"
                    className="transition-colors duration-500"
                  />
                  <circle
                    cx="250"
                    cy="250"
                    r="220"
                    fill={`${activeEvent.accentColor}03`}
                    stroke={`${activeEvent.accentColor}10`}
                    strokeWidth="1.0"
                    className="transition-colors duration-500"
                  />

                  {/* Rotating group */}
                  <g 
                    style={{
                      transformOrigin: "250px 250px",
                      transform: `rotate(${rotation}deg)`,
                      transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    <circle 
                      cx="250" 
                      cy="250" 
                      r="430" 
                      stroke={`${activeEvent.accentColor}1A`} 
                      strokeWidth="1.2" 
                      strokeDasharray="2 4" 
                      className="transition-colors duration-500"
                    />
                    <circle 
                      cx="250" 
                      cy="250" 
                      r="410" 
                      stroke={`${activeEvent.accentColor}2D`} 
                      strokeWidth="0.8" 
                      className="transition-colors duration-500"
                    />
                    <circle 
                      cx="250" 
                      cy="250" 
                      r="390" 
                      stroke={`${activeEvent.accentColor}1E`} 
                      strokeWidth="1.2" 
                      strokeDasharray="4 8" 
                      className="transition-colors duration-500"
                    />
                    
                    {/* Ticks */}
                    {Array.from({ length: 61 }).map((_, i) => {
                      const angleDeg = -40 + (i / 60) * 80;
                      const angleRad = (angleDeg * Math.PI) / 180;
                      const isMajor = i % 5 === 0;
                      const rInner = 395;
                      const rOuter = isMajor ? 412 : 404;
                      const x1 = 250 + Math.cos(angleRad) * rInner;
                      const y1 = 250 + Math.sin(angleRad) * rInner;
                      const x2 = 250 + Math.cos(angleRad) * rOuter;
                      const y2 = 250 + Math.sin(angleRad) * rOuter;
                      return (
                        <line
                          key={`tick-desk-${i}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isMajor ? `${activeEvent.accentColor}66` : `${activeEvent.accentColor}26`}
                          strokeWidth={isMajor ? 1.5 : 0.8}
                          className="transition-colors duration-500"
                        />
                      );
                    })}
                    
                    {/* Degree markers */}
                    {Array.from({ length: 9 }).map((_, i) => {
                      const angleDeg = -40 + i * 10;
                      const angleRad = (angleDeg * Math.PI) / 180;
                      const rText = 426;
                      const x = 250 + Math.cos(angleRad) * rText;
                      const y = 250 + Math.sin(angleRad) * rText;
                      return (
                        <text
                          key={`text-desk-${i}`}
                          x={x}
                          y={y}
                          fill={`${activeEvent.accentColor}33`}
                          fontSize="7"
                          fontFamily="monospace"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${angleDeg + 90}, ${x}, ${y})`}
                          className="transition-colors duration-500"
                        >
                          {`${(i * 10).toString().padStart(2, "0")}°`}
                        </text>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Fixed Center Indicator Line and Bracket */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-20 font-mono flex items-center transition-all duration-500 left-[40px]"
                style={{ color: activeEvent.accentColor }}
              >
                <div 
                  className="h-[1.5px] transition-all duration-500 w-[274px]" 
                  style={{ 
                    backgroundColor: activeEvent.accentColor,
                    boxShadow: `0 0 8px ${activeEvent.accentColor}, 0 0 15px ${activeEvent.accentColor}`,
                    opacity: 0.75
                  }}
                />
                <div className="flex items-center justify-center font-bold text-sm ml-1.5 select-none opacity-90">
                  ]
                </div>
              </div>

              {/* Vertical Menu */}
              <div className="relative h-[380px] w-full overflow-hidden flex flex-col justify-center z-10">
                <div 
                  className="flex flex-col select-none"
                  style={{
                    transform: `translateY(${(2 - activeIndex) * itemHeight}px)`,
                    transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  {events.map((e, idx) => {
                    const isActive = idx === activeIndex;
                    const distance = Math.abs(idx - activeIndex);
                    const opacity = distance === 0 ? 1 : distance === 1 ? 0.35 : distance === 2 ? 0.12 : 0;
                    const scale = distance === 0 ? 1.05 : distance === 1 ? 0.95 : 0.85;
                    const blur = distance === 0 ? "blur(0px)" : distance === 1 ? "blur(0.5px)" : "blur(2px)";
                    return (
                      <button
                        key={`btn-desk-${e.id}`}
                        onClick={() => setActiveIndex(idx)}
                        className="w-full h-[84px] flex items-center pl-20 pr-4 cursor-pointer select-none transition-all duration-500 focus:outline-none"
                        style={{
                          opacity,
                          transform: `scale(${scale})`,
                          filter: blur,
                          transformOrigin: "left center"
                        }}
                      >
                        <span className="font-mono text-xs w-8 text-right mr-6 transition-colors duration-300 text-gray-400">
                          {e.num}
                        </span>
                        <span 
                          className={`font-switzer font-bold tracking-[0.2em] text-xl lg:text-3xl uppercase transition-colors duration-300 ${
                            isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                          }`}
                          style={isActive ? { textShadow: `0 0 10px ${activeEvent.accentColor}4D` } : undefined}
                        >
                          {e.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scroll Tip */}
              <div className="absolute bottom-2 left-20 font-mono text-[9px] text-gray-500 uppercase tracking-widest pointer-events-none">
                SCROLL SECTOR / CLICK DIAL TO NAVIGATE
              </div>
            </div>

            {/* MOBILE & TABLET DIAL VIEW (Visible on viewports below lg, i.e., <1024px) */}
            <div className="flex lg:hidden flex-col items-center justify-start h-[220px] xs:h-[260px] sm:h-[300px] w-full relative overflow-hidden pt-6">
              
              {/* Dial centered horizontally at the top, rotated 90deg so the active sweep faces downwards */}
              <div 
                className="absolute pointer-events-none select-none z-0 left-1/2 -translate-x-1/2
                           w-[270px] h-[270px] top-[-175px]
                           xs:w-[310px] xs:h-[310px] xs:top-[-200px]
                           sm:w-[380px] sm:h-[380px] sm:top-[-240px]"
                style={{
                  transform: 'rotate(90deg)', // Rotates the active right side to face bottom
                }}
              >
                <svg 
                  className="w-full h-full fill-none overflow-visible" 
                  viewBox="0 0 500 500"
                >
                  {/* Faint ambient glow behind the mobile dial to create depth and contrast */}
                  <defs>
                    <radialGradient id="mobileDialGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={activeEvent.accentColor} stopOpacity="0.18" />
                      <stop offset="100%" stopColor={activeEvent.accentColor} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="250" cy="250" r="430" fill="url(#mobileDialGlow)" />

                  {/* Groove rings - increased opacity from 06 to 1A for higher contrast */}
                  {Array.from({ length: 45 }).map((_, i) => (
                    <circle
                      key={`groove-mob-${i}`}
                      cx="250"
                      cy="250"
                      r={150 + i * 5}
                      stroke={`${activeEvent.accentColor}1A`}
                      strokeWidth="0.8"
                      className="transition-colors duration-500"
                    />
                  ))}

                  {/* Glowing support rings - increased opacity */}
                  <circle
                    cx="250"
                    cy="250"
                    r="280"
                    stroke={`${activeEvent.accentColor}33`}
                    strokeWidth="1.2"
                    className="transition-colors duration-500"
                  />
                  <circle
                    cx="250"
                    cy="250"
                    r="220"
                    fill={`${activeEvent.accentColor}08`}
                    stroke={`${activeEvent.accentColor}26`}
                    strokeWidth="1.0"
                    className="transition-colors duration-500"
                  />

                  {/* Rotating inner instrumentation - using mobileRotation at activeIndex * 24 */}
                  <g 
                    style={{
                      transformOrigin: "250px 250px",
                      transform: `rotate(${mobileRotation}deg)`,
                      transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    <circle 
                      cx="250" 
                      cy="250" 
                      r="430" 
                      stroke={`${activeEvent.accentColor}33`} 
                      strokeWidth="1.2" 
                      strokeDasharray="2 4" 
                      className="transition-colors duration-500"
                    />
                    <circle 
                      cx="250" 
                      cy="250" 
                      r="410" 
                      stroke={`${activeEvent.accentColor}4D`} 
                      strokeWidth="1.2" 
                      className="transition-colors duration-500"
                    />
                    <circle 
                      cx="250" 
                      cy="250" 
                      r="390" 
                      stroke={`${activeEvent.accentColor}33`} 
                      strokeWidth="1.5" 
                      strokeDasharray="4 8" 
                      className="transition-colors duration-500"
                    />
                    
                    {/* Ticks - increased strokeWidth and opacity for sharp, technical look */}
                    {Array.from({ length: 61 }).map((_, i) => {
                      const angleDeg = -40 + (i / 60) * 80;
                      const angleRad = (angleDeg * Math.PI) / 180;
                      const isMajor = i % 5 === 0;
                      const rInner = 395;
                      const rOuter = isMajor ? 412 : 404;
                      const x1 = 250 + Math.cos(angleRad) * rInner;
                      const y1 = 250 + Math.sin(angleRad) * rInner;
                      const x2 = 250 + Math.cos(angleRad) * rOuter;
                      const y2 = 250 + Math.sin(angleRad) * rOuter;
                      return (
                        <line
                          key={`tick-mob-${i}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isMajor ? `${activeEvent.accentColor}B3` : `${activeEvent.accentColor}4D`}
                          strokeWidth={isMajor ? 2.0 : 1.0}
                          className="transition-colors duration-500"
                        />
                      );
                    })}

                    {/* Degree markers - increased fill opacity and font size for legibility */}
                    {Array.from({ length: 9 }).map((_, i) => {
                      const angleDeg = -40 + i * 10;
                      const angleRad = (angleDeg * Math.PI) / 180;
                      const rText = 426;
                      const x = 250 + Math.cos(angleRad) * rText;
                      const y = 250 + Math.sin(angleRad) * rText;
                      return (
                        <text
                          key={`text-mob-${i}`}
                          x={x}
                          y={y}
                          fill={`${activeEvent.accentColor}66`}
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${angleDeg + 90}, ${x}, ${y})`}
                          className="transition-colors duration-500"
                        >
                          {`${(i * 10).toString().padStart(2, "0")}°`}
                        </text>
                      );
                    })}
                  </g>
                </svg>
              </div>

              {/* Fixed Center Indicator Line pointing straight down */}
              <div 
                className="absolute top-0 pointer-events-none z-20 font-mono flex flex-col items-center transition-all duration-500 left-1/2 -translate-x-1/2"
                style={{ color: activeEvent.accentColor }}
              >
                <div 
                  className="w-[1.5px] transition-all duration-500 h-[40px] xs:h-[50px] sm:h-[70px]" 
                  style={{ 
                    backgroundColor: activeEvent.accentColor,
                    boxShadow: `0 0 10px ${activeEvent.accentColor}, 0 0 18px ${activeEvent.accentColor}`,
                    opacity: 0.85
                  }}
                />
                <div className="flex items-center justify-center font-bold text-sm select-none opacity-90 rotate-90 mt-1">
                  ]
                </div>
              </div>

              {/* Horizontal Menu translating active item to center - decreased margin top */}
              <div className="relative h-[80px] w-full overflow-hidden z-10 mt-[50px] xs:mt-[60px] sm:mt-[80px]">
                <div 
                  className="absolute left-1/2 top-0 bottom-0 flex flex-row items-center select-none w-max"
                  style={{
                    transform: `translateX(-${activeIndex * 180 + 90}px)`, // centers active item (180px width, half is 90px)
                    transition: "transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)"
                  }}
                >
                  {events.map((e, idx) => {
                    const isActive = idx === activeIndex;
                    const distance = Math.abs(idx - activeIndex);
                    const opacity = distance === 0 ? 1 : distance === 1 ? 0.35 : distance === 2 ? 0.12 : 0;
                    const scale = distance === 0 ? 1.05 : distance === 1 ? 0.95 : 0.85;
                    const blur = distance === 0 ? "blur(0px)" : distance === 1 ? "blur(0.5px)" : "blur(2px)";
                    return (
                      <button
                        key={`btn-mob-${e.id}`}
                        onClick={() => setActiveIndex(idx)}
                        className="w-[180px] h-[60px] flex items-center justify-center cursor-pointer select-none transition-all duration-500 focus:outline-none flex-shrink-0"
                        style={{
                          opacity,
                          transform: `scale(${scale})`,
                          filter: blur,
                        }}
                      >
                        <span className="font-mono text-[10px] mr-2 transition-colors duration-300 text-gray-400">
                          {e.num}
                        </span>
                        <span 
                          className={`font-switzer font-bold tracking-[0.15em] text-sm sm:text-base uppercase transition-colors duration-300 ${
                            isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
                          }`}
                          style={isActive ? { textShadow: `0 0 10px ${activeEvent.accentColor}4D` } : undefined}
                        >
                          {e.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Interaction Tip */}
              <div className="absolute bottom-2 font-mono text-[9px] text-gray-500 uppercase tracking-widest pointer-events-none text-center w-full">
                TAP / SWIPE DIAL SECTORS TO NAVIGATE
              </div>
            </div>

          </div>

          {/* Right Column: Smaller Preview Card positioned below dial on mobile, right on desktop */}
          <div className="col-span-1 lg:col-span-6 flex justify-center lg:justify-end w-full lg:pr-12 z-10 mt-8 lg:mt-0">
            <Link 
              to={`/events/${activeEvent.id}`}
              onMouseEnter={() => setIsCardHovered(true)}
              onMouseLeave={() => setIsCardHovered(false)}
              className="w-full max-w-[340px] lg:max-w-[360px] h-[400px] lg:h-[480px] rounded-[22px] border relative overflow-hidden bg-[#0a0d14]/95 group transition-all duration-500"
              style={{
                borderColor: isCardHovered ? `${activeEvent.accentColor}66` : "rgba(255, 255, 255, 0.1)",
                boxShadow: isCardHovered 
                  ? `0 0 55px ${activeEvent.accentColor}80, inset 0 0 18px ${activeEvent.accentColor}26` 
                  : `0 0 45px ${activeEvent.glowColor}, inset 0 0 15px rgba(255,255,255,0.02)`,
                transform: isCardHovered ? "translateY(-6px)" : "translateY(0px)"
              }}
            >
              
              {/* Card contents slide to the right side and scale down slightly */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: -15, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 15, scale: 0.98 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 w-full h-full p-8 md:p-10 flex flex-col justify-end"
                >
                  {/* Background image container */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                      src={activeEvent.imagePath} 
                      alt={activeEvent.title}
                      className="w-full h-full object-cover filter brightness-[0.58] contrast-[1.08] transition-transform duration-[12000ms] ease-out scale-105 group-hover:scale-110"
                    />
                    {/* Sunset dark visual overlay gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-[#0a0d14]/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14]/70 to-[#0a0d14]/10" />
                  </div>

                  {/* Dynamic text details in bottom-left corner */}
                  <div className="relative z-10 w-full flex flex-col items-start select-none">
                    {/* Event Name */}
                    <h3 className="font-switzer font-black text-3xl sm:text-4xl text-white uppercase tracking-wider mb-2 leading-none">
                      {activeEvent.title}
                    </h3>

                    {/* Event Description */}
                    <p className="font-switzer text-gray-200 text-sm sm:text-base leading-relaxed max-w-[310px] font-normal">
                      {activeEvent.desc}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
