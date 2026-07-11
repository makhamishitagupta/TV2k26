"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SmoothScroll from "@/components/SmoothScroll";
import SparksEffect from "@/components/SparksEffect";
import SketchfabBackground from "@/components/SketchfabBackground";
import EventHub from "@/components/EventHub";
import HeroSection from "@/components/Hero/HeroSection";
import { AppProvider } from "@/contexts/AppContext";
import { FestivalProvider } from "@/contexts/FestivalContext";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState("transition");
  const [visibleLetters, setVisibleLetters] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TECHNOVISTA 2K26 | VJ Data Questers";
    if (typeof window !== "undefined") {
      const hasShownIntro = window.__hasShownIntro;
      if (hasShownIntro) {
        setIsLoading(false);
        setStage("completed");
        setMounted(true);
      } else {
        // Play entry transition on cold load/reload
        setMounted(true);
        setIsLoading(true);
        setStage("transition");
        
        const word = "TECHNOVISTA";
        let index = 0;
        const interval = setInterval(() => {
          setVisibleLetters(index);
          index++;
          if (index >= word.length) {
            clearInterval(interval);
            
            setTimeout(() => {
              setStage("dissolve");
              
              setTimeout(() => {
                setIsLoading(false);
                setStage("completed");
                window.__hasShownIntro = true;
              }, 1000);
            }, 1100);
          }
        }, 140);
      }
    }
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  const word = "TECHNOVISTA";

  return (
    <AppProvider>
      <FestivalProvider>
        <SmoothScroll>
          <div className="relative min-h-screen bg-transparent">
            {/* Doctor Strange spark mouse trails */}
            <SparksEffect />
            
            {/* Global fixed gradient background — the ONLY background source */}
            <SketchfabBackground />

            <div className="relative z-10">
              <main>
                {/* Main content - only render when loading finishes */}
                {!isLoading && (
                  <div className="relative z-10">
                    {/* Relative container to keep content above background glows */}
                    <div className="relative z-10">
                      <HeroSection />
                      <EventHub />
                    </div>
                  </div>
                )}
              </main>
            </div>

            {/* Screen Transition Animation Stages overlay */}
            {isLoading && (stage === "transition" || stage === "dissolve") && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black flex-col pointer-events-none">
                <div className="flex items-center justify-center font-boska font-black text-4xl sm:text-6xl md:text-8xl tracking-widest uppercase">
                  {word.split("").map((letter, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scale: 0, opacity: 0, filter: "blur(8px)" }}
                      animate={
                        idx <= visibleLetters 
                          ? stage === "dissolve"
                            ? { scale: 1.15, opacity: 0, filter: "blur(12px)", transition: { duration: 0.8, ease: "easeIn" } }
                            : { scale: 1, opacity: 1, filter: "blur(0px)" }
                          : {}
                      }
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 10,
                      }}
                      className="text-[#d9040b] drop-shadow-[0_0_35px_rgba(217,4,11,0.85)] inline-block select-none text-glow-red"
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SmoothScroll>
      </FestivalProvider>
    </AppProvider>
  );
}
