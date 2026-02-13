"use client"

import { motion } from "framer-motion";

interface ContinueButtonProps {
  onClick: () => void;
}

const ContinueButton = ({ onClick }: ContinueButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="font-display text-lg tracking-widest uppercase text-ink-light border border-border px-10 py-3 rounded-sm hover:bg-secondary transition-colors duration-500"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Continue
    </motion.button>
  );
};

export default ContinueButton;
