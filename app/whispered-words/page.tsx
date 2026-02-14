"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import LoveLetter from "@/components/LoveLetter"
import NextSection from "@/components/NextSection"
import LetterCarousel from "@/components/LetterCarousel"
import { GalleryOverlay } from "@/components/carousel/GalleryOverlay"

type View = "letter" | "next" | "poetry" | "gallery"

export default function WhisperedWordsPage() {
    const [view, setView] = useState<View>("letter")
    const router = useRouter()

    return (
        <div className="min-h-screen overflow-hidden bg-background">
            <AnimatePresence mode="wait">
                {view === "letter" && (
                    <LoveLetter
                        key="letter"
                        onSwipeUp={() => setView("next")}
                        onSwipeDown={() => router.push('/')}
                    />
                )}

                {view === "next" && (
                    <NextSection
                        key="next"
                        onSwipeDown={() => setView("letter")}
                        onLetterClick={() => setView("poetry")}
                        onCameraClick={() => setView("gallery")}
                    />
                )}

                {view === "poetry" && (
                    <motion.div
                        key="poetry"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8 }}
                        className="fixed inset-0 z-50 bg-background"
                    >
                        <LetterCarousel onBack={() => setView("next")} />
                    </motion.div>
                )}

                {view === "gallery" && (
                    <motion.div
                        key="gallery"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <GalleryOverlay onBack={() => setView("next")} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
