"use client"

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
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 30) onSwipeUp();
    if (e.deltaY < -30) onSwipeDown();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY;
    const el = e.currentTarget as HTMLElement;

    const handleTouchEnd = (ev: any) => {
      const endY = ev.changedTouches[0].clientY;
      const deltaY = startY - endY;

      if (deltaY > 50) onSwipeUp(); // Swipe up
      if (deltaY < -50) onSwipeDown(); // Swipe down

      el.removeEventListener("touchend", handleTouchEnd);
    };

    el.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <motion.div
      className="h-screen w-full flex flex-col items-center justify-between py-8 px-6 paper-texture overflow-hidden"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
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
