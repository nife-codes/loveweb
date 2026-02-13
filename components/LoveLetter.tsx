"use client"

import { motion } from "framer-motion";
import SwipeIndicator from "./SwipeIndicator";

interface LoveLetterProps {
  onSwipeUp: () => void;
}

const letterLines = [
  "My Dearest,",
  "",
  "If I could fold the night sky",
  "into an envelope and seal it",
  "with a kiss made of moonlight,",
  "I would send it to you —",
  "so you'd know that even the stars",
  "blush when I speak your name.",
  "",
  "You are the quiet between my heartbeats,",
  "the warmth in every word I've left unspoken.",
  "In a world of fleeting things,",
  "you are the one I'd choose",
  "to stay.",
  "",
  "Forever and always,",
  "Yours"
];

const LoveLetter = ({ onSwipeUp }: LoveLetterProps) => {
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 30) onSwipeUp();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY;
    const el = e.currentTarget;

    const handleTouchEnd = (ev: TouchEvent) => {
      const deltaY = startY - ev.changedTouches[0].clientY;
      if (deltaY > 60) onSwipeUp();
      el.removeEventListener("touchend", handleTouchEnd);
    };

    el.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 paper-texture"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-lg w-full flex flex-col items-center">
        {/* Decorative line */}
        <motion.div
          className="w-16 h-px bg-border mb-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        {/* Letter content */}
        <div className="w-full space-y-1">
          {letterLines.map((line, i) => (
            <motion.p
              key={i}
              className={`font-display text-ink leading-relaxed ${i === 0
                  ? "text-2xl md:text-3xl italic mb-4"
                  : line === ""
                    ? "h-4"
                    : i >= letterLines.length - 2
                      ? "text-lg italic mt-2"
                      : "text-base md:text-lg"
                }`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.12,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </div>

        {/* Decorative line */}
        <motion.div
          className="w-16 h-px bg-border mt-10 mb-12"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        />

        {/* Swipe indicator */}
        <SwipeIndicator />
      </div>
    </motion.div>
  );
};

export default LoveLetter;
