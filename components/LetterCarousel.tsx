"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { rawPoems, bookMetadata, PAGE_BREAK } from "@/lib/poems"
import { X, Heart, Mail, ChevronLeft, ChevronRight } from "lucide-react"

interface LetterCarouselProps {
    onBack: () => void
}

export default function LetterCarousel({ onBack }: LetterCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const count = rawPoems.length

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % count)
    }

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + count) % count)
    }

    const onDragEnd = (event: any, info: any) => {
        if (info.offset.x < -50) {
            handleNext()
        } else if (info.offset.x > 50) {
            handlePrev()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a0f0f] overflow-hidden font-sans">

            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Main Carousel Container */}
            <div className="relative w-full h-full max-w-md flex flex-col items-center justify-center p-4">

                {/* Navigation Arrows (Absolute) */}
                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all transform hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:bg-white/20 hover:text-white transition-all transform hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, x: 100, rotate: 0 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        exit={{ opacity: 0, x: -100, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={onDragEnd}
                        className="w-full px-2" // Added padding to clear arrows
                    >
                        <LetterCard
                            poem={rawPoems[activeIndex]}
                            index={activeIndex}
                            total={count}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 flex gap-2">
                    {rawPoems.map((_, i) => (
                        <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors duration-300 ${i === activeIndex ? "bg-red-500 box-shadow-glow" : "bg-white/30"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function LetterCard({ poem, index, total }: { poem: any, index: number, total: number }) {
    return (
        <div className="relative w-full p-4 flex items-center justify-center">

            {/* Shadow Container */}
            <div className="relative w-full bg-[#fdfbf7] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transform rotate-0 transition-transform hover:scale-[1.01] duration-500">

                {/* Scalloped Edge Mask */}
                {/* We use a radial gradient mask to create the stamp perforation effect */}
                <div
                    className="absolute inset-0 bg-[#fdfbf7] -z-10"
                    style={{
                        maskImage: "radial-gradient(circle, transparent 6px, black 6.5px)",
                        maskSize: "20px 20px",
                        maskPosition: "-10px -10px",
                        maskRepeat: "repeat",
                        WebkitMaskImage: "radial-gradient(circle, transparent 6px, black 6.5px)",
                        WebkitMaskSize: "20px 20px",
                        WebkitMaskPosition: "-10px -10px",
                        WebkitMaskRepeat: "repeat",
                    }}
                />

                {/* Main Card Content */}
                <div className="relative z-10 w-full h-full p-6 md:p-10 flex flex-col gap-6 min-h-[60vh] max-h-[75vh] overflow-y-auto no-scrollbar bg-[#fdfbf7]">

                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />

                    {/* Header Section */}
                    <div className="relative border-b-2 border-double border-red-900/20 pb-4 flex justify-between items-start">

                        <div className="flex flex-col gap-2">
                            {/* Decorative header text */}
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#8b0000] tracking-widest uppercase" style={{ fontFamily: "Georgia, serif" }}>
                                A Love Poem
                            </h1>
                            {/* Decorative line */}
                            <div className="w-1/2 h-0.5 bg-red-900/30 rounded-full" />
                        </div>

                        {/* Postage Stamps */}
                        <div className="flex gap-2 transform rotate-2">
                            <div className="w-14 h-16 bg-[#e8dac9] border-[3px] border-dotted border-red-800/40 p-1 shadow-sm flex flex-col items-center justify-center relative overflow-hidden group">
                                <Heart className="w-6 h-6 text-red-700 fill-red-700/20" />
                                <span className="text-[6px] font-bold text-red-900 mt-1 uppercase tracking-wider">Love Mail</span>
                                <div className="absolute -right-2 -bottom-2 opacity-30 text-[8px] font-mono text-black rotate-[-45deg]">14 CENTS</div>
                            </div>
                            <div className="w-14 h-16 bg-[#fae3e3] border-[3px] border-dotted border-red-800/40 p-1 shadow-sm flex flex-col items-center justify-center relative overflow-hidden -rotate-6 mt-1">
                                <Mail className="w-6 h-6 text-red-700" />
                                <span className="text-[6px] font-bold text-red-900 mt-1 uppercase tracking-wider">Air Post</span>
                            </div>
                        </div>

                        {/* Wavy Postmark over title/stamps */}
                        <div className="absolute right-8 top-4 opacity-40 pointer-events-none">
                            <svg width="100" height="40" viewBox="0 0 100 40" className="text-black">
                                <path d="M0,20 Q10,0 20,20 T40,20 T60,20 T80,20 T100,20" fill="none" stroke="currentColor" strokeWidth="1" />
                                <path d="M0,30 Q10,10 20,30 T40,30 T60,30 T80,30 T100,30" fill="none" stroke="currentColor" strokeWidth="1" />
                            </svg>
                        </div>
                    </div>

                    {/* Poem Body */}
                    <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
                        {/* Title of Poem */}
                        <div className="mb-6 relative">
                            <h2 className="text-2xl md:text-3xl font-serif text-[#5a0000] text-center font-bold italic relative z-10" style={{ fontFamily: "Georgia, serif" }}>
                                {poem.title}
                            </h2>
                            {/* Title Flourish */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-red-900/40 to-transparent" />
                        </div>

                        {/* Poem Text - Cursive (Dancing Script or similar) */}
                        <div className="font-script text-xl md:text-2xl leading-loose text-center text-[#4a0404] w-full max-w-lg mx-auto drop-shadow-sm">
                            {poem.lines.map((line: string, i: number) => {
                                if (line === PAGE_BREAK) return null
                                return (
                                    <p key={i} className={`min-h-[1.5em] ${line === "" ? "h-6" : ""}`}>
                                        {line}
                                    </p>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-6 border-t border-red-900/10 flex justify-between items-end relative">
                        <div className="flex flex-col">
                            <span className="font-script text-2xl md:text-3xl text-red-700 rotate-[-2deg]">
                                Happy Valentine's Day
                            </span>
                            <span className="text-[10px] font-mono text-red-900/50 uppercase tracking-widest mt-1 ml-2">
                                For My Darling Rufiyah
                            </span>
                        </div>

                        {/* Circular Postmark */}
                        <div className="absolute right-0 bottom-0 opacity-70 transform rotate-[-15deg]">
                            <div className="w-20 h-20 rounded-full border-2 border-red-900/30 flex items-center justify-center p-1">
                                <div className="w-full h-full rounded-full border border-red-900/20 border-dashed flex flex-col items-center justify-center text-red-900/80 font-mono text-[10px]">
                                    <span className="uppercase tracking-widest text-[8px]">Love City</span>
                                    <span className="text-lg font-bold my-0.5">FEB 14</span>
                                    <span>2026</span>
                                    <div className="w-full h-px bg-red-900/20 absolute top-1/2 -translate-y-1/2" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
