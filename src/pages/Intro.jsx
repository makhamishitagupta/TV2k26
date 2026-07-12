"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LandingIntro from "@/components/LandingIntro";
import SparksEffect from "@/components/SparksEffect";
import SketchfabBackground from "@/components/SketchfabBackground";
import OpeningPage from "@/components/OpeningPage";

export default function Intro() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState("portal");
  const [visibleLetters, setVisibleLetters] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TECHNOVISTA 2K26 | VJ Data Questers";
    setMounted(true);
    if (typeof window !== "undefined") {
      const hasShownIntro = window.__hasShownIntro;
      if (hasShownIntro) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    document.documentElement.classList.add("scroll-locked");
    return () => {
      document.documentElement.classList.remove("scroll-locked");
    };
  }, [mounted, isLoading]);

  const handleIntroComplete = () => {
    if (typeof window !== "undefined") {
      window.__hasShownIntro = true;
    }
    setIsLoading(false);
  };

  const handleEnter = () => {
    setStage("transition");
    
    // Start letter popping transition sequence
    const word = "TECHNOVISTA";
    let index = 0;
    const interval = setInterval(() => {
      setVisibleLetters(index);
      index++;
      if (index >= word.length) {
        clearInterval(interval);
        
        // Wait 1.1s in complete layout before dissolving
        setTimeout(() => {
          setStage("dissolve");
          
          // Navigate to home after dissolve completes
          setTimeout(() => {
            if (typeof window !== "undefined") {
              window.__hasShownIntro = true;
            }
            navigate("/home");
          }, 1000);
        }, 1100);
      }
    }, 140);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-black" />;
  }

  const word = "TECHNOVISTA";

  return (
    <>
      {isLoading ? (
        <LandingIntro onComplete={handleIntroComplete} />
      ) : (
        <div className="relative h-[100svh] md:min-h-screen md:h-auto w-screen bg-transparent overflow-hidden md:overflow-y-auto lg:overflow-hidden flex flex-col justify-center select-none py-0 md:py-8 lg:py-0">
          {/* Doctor Strange spark mouse trails */}
          <SparksEffect />
          
          {/* Solid black background */}
          <SketchfabBackground />

          <main className="relative z-10 flex flex-col justify-center w-full h-full md:min-h-full lg:h-full">
            <OpeningPage onEnter={handleEnter} isEntered={stage !== "portal"} />
          </main>

          {/* Screen Transition Animation Stages */}
          {(stage === "transition" || stage === "dissolve") && (
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
                      stiffness: 120,
                      damping: 18,
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
      )}
    </>
  );
}
