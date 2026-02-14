"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import SwipeIndicator from "./SwipeIndicator";

interface LoveLetterProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
}

const letterLines = [
  "I see myself being lost as",
  "I gaze into your eyes.",
  "The performance I play",
  "for the world isn't",
  "needed anymore.",
  "",
  "My ears lift up as you",
  "speak and I try to pick up",
  "Every detail that I can",
  "use to better my limited",
  "knowledge of you.",
  "",
  "My hands become a bit",
  "sweaty as I try to touch your skin,",
  "And my lips ooh my lips",
  "become dry as I long",
  "for your lips.",
  "",
  "When our body meets,",
  "a bit of your soul enters mine.",
  "Every bit of the world",
  "doesn't matter because",
  "At that moment you",
  "became my world.",
];

const LoveLetter = ({ onSwipeUp, onSwipeDown }: LoveLetterProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); // Reset
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipeUp = distance > minSwipeDistance;
    const isSwipeDown = distance < -minSwipeDistance;

    if (isSwipeUp) {
      onSwipeUp();
    }

    if (isSwipeDown) {
      onSwipeDown();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Debounce or threshold
    if (e.deltaY > 20) onSwipeUp();
    if (e.deltaY < -20) onSwipeDown();
  };

  return (
    <motion.div
      className="h-screen w-full flex flex-col items-center justify-between py-8 px-6 paper-texture overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg relative min-h-0">
        {/* Decorative line top */}
        <motion.div
          className="w-16 h-px bg-border mb-6 flex-shrink-0"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        {/* Letter content - made scrollable if needed but attempting to fit */}
        <div className="w-full flex-col items-center justify-center overflow-y-auto no-scrollbar py-2 text-center" style={{ maxHeight: "calc(100% - 60px)" }}>
          {letterLines.map((line, i) => (
            <motion.p
              key={i}
              className={`font-display text-ink leading-relaxed ${i === 0
                ? "text-xl md:text-2xl italic mb-3"
                : line === ""
                  ? "h-3"
                  : i >= letterLines.length - 2
                    ? "text-base italic mt-2"
                    : "text-base md:text-lg"
                }`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + i * 0.08,
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              {line || "\u00A0"}
            </motion.p>
          ))}
        </div>

        {/* Decorative line bottom */}
        <motion.div
          className="w-16 h-px bg-border mt-6 flex-shrink-0"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        />
      </div>

      {/* Swipe indicator fixed at bottom */}
      <div className="flex-shrink-0 mt-4">
        <SwipeIndicator />
      </div>
    </motion.div>
  );
};

export default LoveLetter;
