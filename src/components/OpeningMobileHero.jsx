"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { GOLDEN_EASE } from "@/animations/variants";

const GOLD_GRADIENT =
  "linear-gradient(135deg, #FFE899 0%, #F59E0B 100%)";

const STATS = [
  { value: "18TH", label: "EDITION" },
  { value: "8", label: "EVENTS" },
  { value: "₹1L+", label: "REWARDS" },
  { value: "3", label: "DAYS" },
];

function MobileAmbientBackground() {
  const backgroundElements = useMemo(() => {
    const particles = [];
    const stars = [];
    const embers = [];

    // Slow-moving dust/glowing particles (22 items)
    for (let i = 0; i < 22; i++) {
      particles.push({
        id: `p-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * -10, // Start animation in past so it starts immediately
        duration: 20 + Math.random() * 14,
        opacity: 0.15 + Math.random() * 0.4,
        isGold: Math.random() > 0.65,
      });
    }

    // Twinkling stars (14 items)
    for (let i = 0; i < 14; i++) {
      stars.push({
        id: `s-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 85, // concentrate higher up
        size: 0.8 + Math.random() * 1.5,
        delay: Math.random() * -5,
        duration: 3 + Math.random() * 4,
      });
    }

    // Upward drifting embers (14 items)
    for (let i = 0; i < 14; i++) {
      embers.push({
        id: `e-${i}`,
        x: Math.random() * 100,
        y: 75 + Math.random() * 25, // start near bottom
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * -15,
        duration: 8 + Math.random() * 8,
      });
    }

    return { particles, stars, embers };
  }, []);

  const streaks = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i,
        top: 12 + i * 22,
        delay: i * -3, // Start in past
        duration: 16 + i * 4,
      })),
    []
  );

  return (
    <div
      className="opening-mobile-ambient pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="opening-mobile-vignette" />
      <div className="opening-mobile-circuit-grid" />
      <div className="opening-mobile-ambient__glow" />
      <div className="opening-mobile-ambient__radial opening-mobile-ambient__radial--top" />
      <div className="opening-mobile-ambient__radial opening-mobile-ambient__radial--bottom" />

      {/* Twinkling Stars */}
      {backgroundElements.stars.map((star) => (
        <span
          key={star.id}
          className="opening-mobile-ambient__star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}

      {/* Floating Embers */}
      {backgroundElements.embers.map((ember) => (
        <span
          key={ember.id}
          className="opening-mobile-ambient__ember"
          style={{
            left: `${ember.x}%`,
            top: `${ember.y}%`,
            width: ember.size,
            height: ember.size,
            animationDelay: `${ember.delay}s`,
            animationDuration: `${ember.duration}s`,
          }}
        />
      ))}

      {/* Glowing Dust Particles */}
      {backgroundElements.particles.map((p) => (
        <span
          key={p.id}
          className={`opening-mobile-ambient__particle ${p.isGold ? "opening-mobile-ambient__particle--gold" : ""}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* Streak details */}
      {streaks.map((s) => (
        <span
          key={s.id}
          className="opening-mobile-ambient__streak"
          style={{
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function StatCard({ stat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -3, 0],
      }}
      transition={{
        opacity: { duration: 0.55, delay: 0.85 + index * 0.1, ease: GOLDEN_EASE },
        scale: { duration: 0.55, delay: 0.85 + index * 0.1, ease: GOLDEN_EASE },
        y: {
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.25 + index * 0.15,
        },
      }}
      whileTap={{ scale: 0.98 }}
      className="opening-mobile-stat group"
    >
      <span
        className="opening-mobile-stat__value font-heading font-black leading-none"
        style={{
          backgroundImage: GOLD_GRADIENT,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {stat.value}
      </span>
      <span className="opening-mobile-stat__label">{stat.label}</span>
    </motion.div>
  );
}

export default function OpeningMobileHero({ onEnter, isEntered = false }) {
  return (
    <section
      id="hero"
      className="opening-mobile-hero relative flex h-[100svh] w-full flex-col overflow-hidden select-none lg:hidden"
    >
      <MobileAmbientBackground />

      <div className="relative z-10 flex h-full flex-col items-center justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: GOLDEN_EASE }}
          className="opening-mobile-badge shrink-0"
        >
          <span className="opening-mobile-badge__dot" />
          <span>18th Edition</span>
          <span className="opening-mobile-badge__sep">•</span>
          <span>Since 2006</span>
          <motion.div
            className="opening-mobile-badge__shimmer"
            animate={{ x: ["-150%", "250%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 4.5,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Center stack: Logo → Tagline → CTA → Stats */}
        <div className="flex w-full max-w-[420px] md:max-w-[700px] flex-1 flex-col items-center justify-center gap-3 sm:gap-3.5 md:gap-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: GOLDEN_EASE }}
            className="opening-mobile-logo-wrap relative w-full max-w-[min(88vw,340px)]"
          >
            <motion.div
              animate={{ opacity: [0.35, 0.6, 0.35], scale: [0.95, 1.04, 0.95] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="opening-mobile-logo-wrap__aura absolute inset-0 -z-10 rounded-2xl"
            />
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 0.6, -0.6, 0]
              }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="opening-mobile-logo-wrap__panel"
            >
              <img
                src="/events/technovista-banner.png"
                alt="TechnoVista 18th Edition"
                className="opening-mobile-logo-wrap__img"
                draggable={false}
              />
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: GOLDEN_EASE }}
            className="opening-mobile-tagline text-center"
          >
            National Tech Symposium at VNRVJIET
          </motion.p>

          {/* CTA */}
          {!isEntered && onEnter && (
            <motion.button
              onClick={onEnter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 20,
                delay: 0.5,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className="opening-mobile-cta group relative mt-0.5 shrink-0"
            >
              <span className="relative z-10">Enter Command Grid</span>
              <motion.span
                aria-hidden="true"
                className="opening-mobile-cta__sweep absolute inset-0 pointer-events-none"
                animate={{ x: ["-180%", "180%"] }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  repeatDelay: 4.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
              <span aria-hidden="true" className="opening-mobile-cta__glow" />
            </motion.button>
          )}

          {/* Statistics 2×2 on Mobile, 4x1 on Tablet */}
          <div className="opening-mobile-stats mt-1 w-full max-w-[min(92vw,360px)]">
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.35, ease: GOLDEN_EASE }}
          className="opening-mobile-scroll shrink-0"
          aria-hidden="true"
        >
          <motion.span
            animate={{ opacity: [0.35, 0.65, 0.35] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="opening-mobile-scroll__label"
          >
            Explore
          </motion.span>
          <motion.svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            stroke="rgba(255, 201, 88, 0.55)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [0, 4, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M1 1L5 5L9 1" />
          </motion.svg>
        </motion.div> */}
      </div>
    </section>
  );
}
