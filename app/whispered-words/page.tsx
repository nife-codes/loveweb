"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import ContinueButton from "@/components/ContinueButton"
import LoveLetter from "@/components/LoveLetter"
import NextSection from "@/components/NextSection"

type View = "intro" | "letter" | "next"

export default function WhisperedWordsPage() {
    const [view, setView] = useState<View>("letter")

    return (
        <div className="min-h-screen overflow-hidden bg-background">
            <AnimatePresence mode="wait">
                {view === "intro" && (
                    <motion.div
                        key="intro"
                        className="min-h-screen flex flex-col items-center justify-center px-6 paper-texture"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.p
                            className="font-display text-3xl md:text-4xl italic text-ink mb-12 text-center leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                        >
                            A letter, for you.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                        >
                            <ContinueButton onClick={() => setView("letter")} />
                        </motion.div>
                    </motion.div>
                )}

                {view === "letter" && (
                    <LoveLetter
                        key="letter"
                        onSwipeUp={() => setView("next")}
                    />
                )}

                {view === "next" && (
                    <NextSection key="next" />
                )}
            </AnimatePresence>
        </div>
    )
}
