"use client"

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const NextSection = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="flex flex-col items-center gap-6"
      >
        <Heart className="w-8 h-8 text-accent fill-accent/20" />
        <p className="font-display text-2xl md:text-3xl italic text-ink text-center leading-relaxed">
          Some stories never end.
        </p>
        <p className="font-body text-ink-light text-sm tracking-[0.25em] uppercase">
          This is ours.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default NextSection;
