"use client"

import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Mail } from "lucide-react";

interface NextSectionProps {
  onSwipeDown: () => void;
  onLetterClick: () => void;
  onCameraClick: () => void;
}

const NextSection = ({ onSwipeDown, onLetterClick, onCameraClick }: NextSectionProps) => {
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

    // NextSection mainly needs swipe down to go back
    if (isSwipeDown) {
      onSwipeDown();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < -20) onSwipeDown();
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-background"
      onWheel={handleWheel}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex flex-col items-center gap-10"
      >
        <p className="font-display text-3xl md:text-4xl italic text-ink text-center leading-relaxed">
          Pick your surprise
        </p>

        <div className="flex gap-8 md:gap-16">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCameraClick}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-paper flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 border border-border group-hover:bg-secondary group-hover:border-secondary">
              <Camera className="w-8 h-8 md:w-10 md:h-10 text-ink/80 group-hover:text-paper transition-colors duration-500" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLetterClick}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-paper flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500 border border-border group-hover:bg-secondary group-hover:border-secondary">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-ink/80 group-hover:text-paper transition-colors duration-500" strokeWidth={1.5} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NextSection;
