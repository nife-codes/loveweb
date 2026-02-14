"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export interface GalleryItem {
    id: number
    type: "image" | "video"
    src: string
    title: string
    subtitle: string
}

interface SpatialGalleryProps {
    items: GalleryItem[]
    onBack: () => void
}

export function SpatialGallery({ items, onBack }: SpatialGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0)

    // Touch state
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const count = items.length

    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) {
            handleNext()
        } else if (isRightSwipe) {
            handlePrev()
        }
    }

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % count)
    }

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + count) % count)
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrev()
            if (e.key === "ArrowRight") handleNext()
            if (e.key === "Escape") onBack()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [])

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center font-sans overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >

            {/* Background Image - Brown */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/gallery/brown.jpg"
                    alt="Background"
                    className="w-full h-full object-cover opacity-100"
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full h-full max-w-7xl flex flex-col items-center justify-center p-4">

                {/* Top Bar - Responsive Width */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    // Widen on mobile (90%), fixed on desktop (60%)
                    className="flex-none flex items-center justify-between px-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg w-[90%] md:w-[60%] h-[50px]"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <button onClick={onBack} className="flex-none p-1.5 rounded-full hover:bg-white/20 transition-colors text-white/90">
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex-none h-3 w-px bg-white/20" />
                        <span className="text-[10px] md:text-xs font-medium text-white/80 tracking-wide uppercase truncate">
                            My favorite media of you
                        </span>
                    </div>

                    <div className="flex-none flex gap-1.5 ml-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                </motion.div>

                {/* Spacer - 40px */}
                <div style={{ height: "40px" }} className="flex-none" />

                {/* Main Spatial Carousel Area - Centered */}
                <div className="flex-1 w-full flex items-center justify-center perspective-[2000px] min-h-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                        {items.map((item, index) => {
                            let offset = (index - activeIndex) % count
                            if (offset > count / 2) offset -= count
                            if (offset < -count / 2) offset += count

                            const isActive = offset === 0
                            const isVisible = Math.abs(offset) <= 2

                            if (!isVisible) return null

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={false}
                                    animate={{
                                        x: offset * 220,
                                        z: isActive ? 0 : -250,
                                        rotateY: isActive ? 0 : offset * -10,
                                        scale: isActive ? 1.0 : 0.85,
                                        opacity: isActive ? 1 : 0.5,
                                        filter: isActive ? "blur(0px)" : "blur(2px)"
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 180,
                                        damping: 25
                                    }}
                                    className="absolute"
                                    style={{
                                        transformStyle: "preserve-3d",
                                        zIndex: isActive ? 10 : 5 - Math.abs(offset)
                                    }}
                                >
                                    <div
                                        className={`
                                relative 
                                w-[210px] md:w-[280px] 
                                aspect-[4/5] 
                                rounded-[20px] 
                                overflow-hidden 
                                bg-white/5 backdrop-blur-md border border-white/20 shadow-2xl
                                cursor-pointer
                                transition-all duration-300
                            `}
                                        onClick={() => {
                                            if (!isActive) {
                                                const newIndex = ((activeIndex + offset) % count + count) % count
                                                setActiveIndex(newIndex)
                                            }
                                        }}
                                    >
                                        {/* Media */}
                                        <div className="absolute inset-0 z-0 bg-black">
                                            {item.type === "image" ? (
                                                <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <video
                                                    src={item.src}
                                                    className="w-full h-full object-cover"
                                                    loop
                                                    muted
                                                    playsInline
                                                    ref={el => {
                                                        if (el) {
                                                            if (isActive) {
                                                                const playPromise = el.play();
                                                                if (playPromise !== undefined) {
                                                                    playPromise.catch(() => { });
                                                                }
                                                            } else {
                                                                el.pause();
                                                                el.currentTime = 0; // Reset
                                                            }
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Overlay Controls */}
                                        {isActive && (
                                            <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 bg-gradient-to-t from-black/60 via-transparent to-black/30">
                                                {/* Top row */}
                                                <div className="flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                    <button onClick={(e) => { e.stopPropagation(); handlePrev(); }} className="p-1.5 bg-black/30 rounded-full text-white hover:bg-black/50">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="p-1.5 bg-black/30 rounded-full text-white hover:bg-black/50">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {/* Bottom Info */}
                                                <div className="mt-auto">
                                                    <h2 className="text-base font-medium text-white shadow-sm mb-0.5">{item.title}</h2>
                                                    <p className="text-[10px] text-white/80">{item.subtitle}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Spacer - 30px */}
                <div style={{ height: "30px" }} className="flex-none" />

                {/* Bottom Bar - Responsive Width */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    // Widen on mobile
                    className="flex-none flex items-center justify-between px-6 rounded-[24px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg w-[95%] md:w-[70%] h-[60px]"
                >
                    <button onClick={handlePrev} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 p-0.5 flex-none">
                            <img src="/gallery/first-date.jpeg" alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-white truncate">My Pretty Flower</span>
                            <span className="text-[10px] text-white/50 truncate">Timeline</span>
                        </div>
                    </div>

                    <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </motion.div>

            </div>
        </div>
    )
}
