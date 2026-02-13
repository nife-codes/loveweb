"use client"

import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

const SwipeIndicator = () => {
  return (
    <motion.div
      className="flex flex-col items-center gap-2 text-ink-light"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <ChevronUp className="w-5 h-5" />
      </motion.div>
      <span className="font-body text-sm tracking-[0.3em] uppercase">
        Swipe up to continue
      </span>
    </motion.div>
  );
};

export default SwipeIndicator;
