import React from 'react';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';
import { GOLDEN_EASE } from '../../animations/variants';
import Counter from '../ui/Counter';
import { useHeroScroll } from '../../contexts/HeroScrollContext';

/**
 * HeroCountdown renders a premium countdown card.
 * Automatically hides when the festival starts (countdownVisible=false).
 */
export default function HeroCountdown({
  isMobile = false,
  startDate,
  countdownVisible,
  accent,
  delay = 0.9,
  animateState = 'hidden',
  isTransitioning = false, // Day transition state intercept
}) {
  const timeLeft = useCountdown(`${startDate}T09:00:00`);
  const sceneProgress = useHeroScroll();

  // Scroll transition mapping (Progress 0% to 40%)
  const yScroll = useTransform(sceneProgress, [0, 0.40], [0, isMobile ? -20 : -40]);
  const opacityScroll = useTransform(sceneProgress, [0, 0.40], [1, 0]);
  const pointerEventsScroll = useTransform(sceneProgress, (p) => p > 0.40 ? 'none' : 'auto');

  const padTwo = (n) => String(n).padStart(2, '0');

  const units = [
    { label: 'DAYS', value: padTwo(timeLeft.days) },
    { label: 'HRS', value: padTwo(timeLeft.hours) },
    { label: 'MIN', value: padTwo(timeLeft.minutes) },
    { label: 'SEC', value: padTwo(timeLeft.seconds) },
  ];

  const pillVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: [0, -5, 0],
      transition: {
        opacity: { duration: 1.0, delay, ease: GOLDEN_EASE },
        y: {
          duration: 7.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay,
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {countdownVisible && (
        <motion.div
          style={{ y: yScroll, opacity: opacityScroll, pointerEvents: pointerEventsScroll }}
          className={`mb-4 sm:mb-8 ${isMobile ? 'mt-0' : 'mt-[-34px]'}`}
        >
          <motion.div
            variants={pillVariants}
            initial="hidden"
            animate={
              isTransitioning 
                ? { opacity: 0.25, scale: 0.94, y: -8 } 
                : animateState
            }
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.6, ease: GOLDEN_EASE } }}
          >
            <motion.div 
              className={`inline-flex items-center relative overflow-hidden border rounded-[22px] backdrop-blur-md ${isMobile ? 'gap-2 px-3 py-1.5' : 'gap-4 px-5 py-2.5'}`}
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 201, 88, 0.08), transparent 60%), linear-gradient(135deg, rgba(30, 25, 20, 0.45) 0%, rgba(15, 12, 10, 0.65) 100%)', // Premium warm bronze glass with top sun reflection
                borderColor: 'rgba(255, 201, 88, 0.16)', // Subtle amber border outline
                willChange: 'box-shadow',
              }}
              animate={{
                boxShadow: [
                  '0 4px 16px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.06), inset 0 -1px 8px rgba(255, 201, 88, 0.03), 0 0 0px rgba(255, 201, 88, 0)',
                  '0 4px 16px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.06), inset 0 -1px 8px rgba(255, 201, 88, 0.03), 0 0 10px rgba(255, 201, 88, 0.08)',
                  '0 4px 16px rgba(0, 0, 0, 0.35), 0 16px 40px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.06), inset 0 -1px 8px rgba(255, 201, 88, 0.03), 0 0 0px rgba(255, 201, 88, 0)',
                ]
              }}
              transition={{
                duration: 5.0,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              {/* Cursor-reactive glass reflection */}
              <div className="tv-countdown-reflection" />

              {/* T-Minus Label */}
              <span
                className={`font-mono font-semibold uppercase tracking-[0.2em] relative z-10 ${isMobile ? 'text-[8.5px]' : 'text-[11px]'}`}
                style={{ color: '#8d94a0' }} // Clean, high-contrast label color
              >
                T-Minus
              </span>

              {/* Divider */}
              <div className={`w-px bg-neutral-800/60 relative z-10 ${isMobile ? 'h-3' : 'h-4'}`} />

              {/* Time Units */}
              <div className={`flex items-center relative z-10 ${isMobile ? 'gap-1' : 'gap-2'}`}>
                {units.map((unit, i) => (
                  <React.Fragment key={unit.label}>
                    <div className={`flex flex-col items-center justify-center ${isMobile ? 'min-w-[24px]' : 'min-w-[34px]'}`}>
                      <Counter
                        value={parseInt(unit.value, 10)}
                        places={[10, 1]}
                        fontSize={isMobile ? 12 : 16}
                        fontWeight={600}
                        textColor="#ffffff" // Higher contrast white text
                        padding={0}
                        gap={1}
                        borderRadius={2}
                        horizontalPadding={0}
                        gradientHeight={0}
                        gradientFrom="transparent"
                        gradientTo="transparent"
                        digitStyle={{
                          // Monospace font family stack for layout stability
                          fontFamily: "'JetBrains Mono', 'IBM Plex Mono', 'Geist Mono', monospace",
                          // Soft warm amber glow text shadow
                          filter: 'drop-shadow(0 0 5px rgba(255, 201, 88, 0.40))',
                        }}
                      />
                      <span 
                        className={`font-mono uppercase tracking-[0.15em] mt-0.5 ${isMobile ? 'text-[6px]' : 'text-[8px]'}`}
                        style={{ color: '#777D87' }}
                      >
                        {unit.label}
                      </span>
                    </div>
                    {i < units.length - 1 && (
                      <span 
                        className={`font-light select-none ${isMobile ? 'text-[10px] -mt-1.5' : 'text-sm -mt-2'}`}
                        style={{ color: 'rgba(119, 125, 135, 0.35)' }}
                      >
                        :
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
