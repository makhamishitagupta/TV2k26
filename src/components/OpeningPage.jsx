"use client";

import React from "react";
import { motion } from "framer-motion";
import OpeningMobileHero from "@/components/OpeningMobileHero";

export default function Hero({ onEnter, isEntered = false }) {
  return (
    <>
      <OpeningMobileHero onEnter={onEnter} isEntered={isEntered} />

    <section
      id="hero-desktop"
      className="relative min-h-full w-full hidden lg:flex flex-col justify-center py-8 lg:py-4 select-none"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* Responsive Grid: Flanked sidebars on desktop, stacked layout on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-center">
          
          {/* Left Sidebar (Stats 1 & 2) */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-6 sm:gap-8 lg:gap-14 text-left lg:text-right order-2 lg:order-1"
          >
            {/* Stat Item 1 */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#F59E0B] block mb-1">
                INDEX SYSTEM // EST. 2006
              </span>
              <h3 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-wide" style={{ backgroundImage: 'linear-gradient(135deg, #FFE899 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}>
                18th Edition
              </h3>
              <p className="font-switzer text-[#eae3d2b3] font-light text-sm sm:text-base leading-relaxed mt-2 max-w-sm lg:ml-auto">
                Nearly two decades of technical innovation and student coordination.
              </p>
            </div>

            {/* Stat Item 2 */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#F59E0B] block mb-1">
                SECTORS // TACTICAL MISSIONS
              </span>
              <h3 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-wide" style={{ backgroundImage: 'linear-gradient(135deg, #FFE899 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}>
                8 Events
              </h3>
              <p className="font-switzer text-[#eae3d2b3] font-light text-sm sm:text-base leading-relaxed mt-2 max-w-sm lg:ml-auto">
                Immersive sprints in machine learning, security hacking, and optimization.
              </p>
            </div>
          </motion.div>

          {/* Center Column (Technovista Banner Image Card) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-2 flex flex-col items-center justify-center order-1 lg:order-2 relative group gap-6"
          >
            {/* Ambient Background Aura Glow behind image */}
            <div className="absolute inset-0 rounded-[22px] bg-[#d9040b]/10 blur-3xl group-hover:bg-[#d9040b]/18 transition-all duration-700 -z-10" />

            {/* Premium Glassmorphic Container for Banner with custom glow */}
            <div className="p-3 rounded-[22px] border border-[rgba(243,229,202,0.08)] bg-white/[0.03] backdrop-blur-md shadow-[0_0_40px_rgba(217,4,11,0.15)] hover:border-[rgba(243,229,202,0.25)] hover:shadow-[0_0_45px_rgba(217,4,11,0.3)] transition-all duration-500 max-w-2xl w-full">
              <motion.img
                src="/events/technovista-banner.png"
                alt="VNRVJIET Technovista 18th Edition Banner"
                className="w-full h-auto rounded-[16px] object-contain filter brightness-[1.05]"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Enter Command Button */}
            {!isEntered && onEnter && (
              <motion.button
                onClick={onEnter}
                whileHover="hover"
                whileTap={{ scale: 0.98, y: 0 }}
                className="group relative px-8.5 py-3.5 border font-heading font-semibold uppercase text-[11px] sm:text-xs rounded-full cursor-pointer overflow-hidden text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 focus-visible:ring-offset-2 focus-visible:ring-offset-black mt-8"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #FFE899 0%, #F59E0B 100%)', // Gold Metallic
                  borderColor: 'rgba(255, 230, 160, 0.40)', // Gold border
                  color: '#170709', // Dark burgundy contrast text
                  letterSpacing: '0.16em',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.40)',
                  transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                }}
                variants={{
                  hover: {
                    y: -2,
                    borderColor: 'rgba(255, 240, 190, 0.70)',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15), 0 8px 32px rgba(245, 158, 11, 0.40), inset 0 1px 0 rgba(255, 255, 255, 0.50)',
                  }
                }}
              >
                <span className="relative z-10">ENTER COMMAND GRID</span>
                <motion.div
                  variants={{
                    hover: { x: '150%' }
                  }}
                  initial={{ x: '-150%', skewX: -25 }}
                  transition={{ duration: 1.1, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.40) 50%, transparent 100%)',
                  }}
                />
              </motion.button>
            )}
          </motion.div>

          {/* Right Sidebar (Stats 3 & 4) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-6 sm:gap-8 lg:gap-14 text-left order-3"
          >
            {/* Stat Item 3 */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#F59E0B] block mb-1">
                REWARDS // VALUATION
              </span>
              <h3 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-wide" style={{ backgroundImage: 'linear-gradient(135deg, #FFE899 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}>
                ₹1,00,000+
              </h3>
              <p className="font-switzer text-[#eae3d2b3] font-light text-sm sm:text-base leading-relaxed mt-2 max-w-sm">
                Cash prize pools distributed across flagship symposium domains.
              </p>
            </div>

            {/* Stat Item 4 */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#F59E0B] block mb-1">
                COORDINATES // VENUE PLACE
              </span>
              <h3 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-wide" style={{ backgroundImage: 'linear-gradient(135deg, #FFE899 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}>
                VNRVJIET
              </h3>
              <p className="font-switzer text-[#eae3d2b3] font-light text-sm sm:text-base leading-relaxed mt-2 max-w-sm">
                VNR Vignana Jyothi Institute, Bachupally, Hyderabad.
              </p>
            </div>
            
            {/* Stat Item 5 */}
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#F59E0B] block mb-1">
                CONFLUENCE // ATTENDEES
              </span>
              <h3 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-wide" style={{ backgroundImage: 'linear-gradient(135deg, #FFE899 0%, #F59E0B 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', display: 'inline-block', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }}>
                600+ Agents
              </h3>
              <p className="font-switzer text-[#eae3d2b3] font-light text-sm sm:text-base leading-relaxed mt-2 max-w-sm">
                Tech enthusiasts and elite coders assembling for symposium operations.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

    </section>
    </>
  );
}
