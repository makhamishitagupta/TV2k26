"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LandingIntro({ onComplete }) {
  const [showText, setShowText] = useState(false);
  const [stage, setStage] = useState(0); // 0: loading/playing, 1: fade-out

  useEffect(() => {
    // Zoom out the text 1.2 seconds after mount (once the portal opens in the video)
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 1200);

    // Trigger page entrance transition after 4.6 seconds
    const exitTimer = setTimeout(() => {
      setStage(1);
    }, 4600);

    // Complete loader and enter main landing page after 5.2 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5200);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleVideoEnded = () => {
    setStage(1);
    setTimeout(() => {
      onComplete();
    }, 600); // Allow fade-out animation to complete
  };

  return (
    <AnimatePresence>
      {stage === 0 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-[#170709] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Fullscreen Portal Video Intro */}
          <video
            src="/videos/portal.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            className="absolute inset-0 w-full h-full object-cover z-10 opacity-80"
          />

          {/* Futuristic HUD scans & scanlines */}
          <div className="absolute inset-0 bg-radar opacity-[0.06] pointer-events-none z-15" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.12)_50%)] bg-[length:100%_4px] pointer-events-none z-15" />

          {/* "TECHNOVISTA 2K26" coming out of the portal center */}
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ scale: 0.05, opacity: 0, filter: "blur(15px)" }}
                  animate={{ scale: 1.0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ scale: 1.15, opacity: 0, filter: "blur(8px)" }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 65, 
                    damping: 13,
                    duration: 1.3
                  }}
                  className="flex flex-col items-center justify-center text-center px-4 -translate-x-4 sm:-translate-x-6 md:-translate-x-8"
                >
                  <h1 className="font-boska font-black text-3xl sm:text-7xl md:text-[5rem] leading-none tracking-wider text-[#d9040b] drop-shadow-[0_0_35px_rgba(217,4,11,0.75)] uppercase">
                    VJ DATA QUESTERS
                  </h1>
                  <h1 className="font-boska font-black text-2xl sm:text-5xl md:text-[3rem] leading-none tracking-widest text-[#d9040b] drop-shadow-[0_0_35px_rgba(217,4,11,0.75)] mt-4">
                    Presents
                  </h1>
                  {/* <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 0.85, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="font-stardom text-[#D4AF37] text-xs sm:text-sm tracking-[0.45em] uppercase mt-6 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
                  >
                    VJ DATA QUESTERS PRESENTS
                  </motion.p> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
