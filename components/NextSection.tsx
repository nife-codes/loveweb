"use client"

import { motion } from "framer-motion";
import { Camera, Mail } from "lucide-react";

interface NextSectionProps {
  onSwipeDown: () => void;
}

const NextSection = ({ onSwipeDown }: NextSectionProps) => {
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < -30) onSwipeDown();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const startY = e.touches[0].clientY;
    const el = e.currentTarget as HTMLElement;

    const handleTouchEnd = (ev: any) => {
      const endY = ev.changedTouches[0].clientY;
      const deltaY = startY - endY;

      if (deltaY < -50) onSwipeDown(); // Swipe down

      el.removeEventListener("touchend", handleTouchEnd);
    };

    el.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-background"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
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
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-paper flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-border">
              <Camera className="w-8 h-8 md:w-10 md:h-10 text-ink/80 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <span className="font-body text-sm tracking-widest uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
              Photos
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-paper flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 border border-border">
              <Mail className="w-8 h-8 md:w-10 md:h-10 text-ink/80 group-hover:text-primary transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <span className="font-body text-sm tracking-widest uppercase text-muted-foreground group-hover:text-primary transition-colors duration-300">
              Letter
            </span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NextSection;
