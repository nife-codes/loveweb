"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Pause, X, Info, Heart, Maximize2 } from "lucide-react"

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
    const [playingVideo, setPlayingVideo] = useState<number | null>(null)

    const count = items.length

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % count)
        setPlayingVideo(null)
    }

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + count) % count)
        setPlayingVideo(null)
    }

    const toggleVideo = (id: number) => {
        setPlayingVideo(playingVideo === id ? null : id)
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black/40 backdrop-blur-sm font-sans">

            {/* Top Bar (Vision Pro Browser Style) */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="absolute top-8 z-50 flex items-center gap-4 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            >
                <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20 transition-colors text-white/90">
                    <X className="w-5 h-5" />
                </button>
                <div className="h-4 w-px bg-white/20 mx-2" />
                <div className="flex items-center gap-6 px-4">
                    <span className="text-sm font-medium text-white/80 tracking-wide uppercase">Love Gallery</span>
                </div>
                <div className="h-4 w-px bg-white/20 mx-2" />
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
            </motion.div>


            {/* Main Spatial Carousel Area */}
            <div className="relative w-full max-w-[1200px] h-[60vh] flex items-center justify-center perspective-[2000px]">
                {items.map((item, index) => {
                    // Calculate relative position to active index
                    // Handling modulo arithmetic for circular list
                    let offset = (index - activeIndex) % count
                    if (offset > count / 2) offset -= count
                    if (offset < -count / 2) offset += count

                    const isActive = offset === 0
                    const isVisible = Math.abs(offset) <= 2 // Only show 2 neighbors

                    if (!isVisible) return null

                    return (
                        <motion.div
                            key={item.id}
                            initial={false}
                            animate={{
                                x: offset * 320, // Distance between cards
                                z: isActive ? 0 : -300, // Depth effect
                                rotateY: isActive ? 0 : offset * -15, // Angled sides
                                scale: isActive ? 1.1 : 0.85,
                                opacity: isActive ? 1 : 0.4,
                                filter: isActive ? "blur(0px)" : "blur(2px)"
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 150,
                                damping: 20
                            }}
                            className="absolute pointer-events-auto cursor-pointer"
                            onClick={() => {
                                if (!isActive) {
                                    // Update index based on click
                                    const newIndex = ((activeIndex + offset) % count + count) % count
                                    setActiveIndex(newIndex)
                                }
                            }}
                            style={{
                                transformStyle: "preserve-3d",
                                zIndex: isActive ? 10 : 5 - Math.abs(offset)
                            }}
                        >
                            <div
                                className={`
                    relative w-[300px] md:w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden 
                    bg-white/5 backdrop-blur-md border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                    transition-all duration-300 group
                `}
                            >
                                {/* Glass Reflection Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 z-10 pointer-events-none" />

                                {/* Media Content */}
                                <div className="absolute inset-0 z-0">
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
                                                    if (isActive && playingVideo === item.id) el.play().catch(() => { })
                                                    else el.pause()
                                                }
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Active Controls & Overlays */}
                                {isActive && (
                                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
                                        {/* Top Controls */}
                                        <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-colors">
                                                <ChevronLeft className="w-5 h-5" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
                                            </button>
                                            <div className="flex gap-2">
                                                <button className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-colors">
                                                    <Maximize2 className="w-5 h-5" />
                                                </button>
                                                <button className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-colors">
                                                    <Info className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <button className="p-2 rounded-full bg-black/20 backdrop-blur-md hover:bg-black/40 text-white transition-colors">
                                                <ChevronRight className="w-5 h-5" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
                                            </button>
                                        </div>

                                        {/* Center Play Button for Video */}
                                        {item.type === "video" && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleVideo(item.id); }}
                                                    className={`
                                        w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 
                                        flex items-center justify-center text-white pointer-events-auto
                                        hover:scale-110 transition-transform duration-300
                                        ${playingVideo === item.id ? 'opacity-0 hover:opacity-100' : 'opacity-100'}
                                    `}
                                                >
                                                    {playingVideo === item.id ? <Pause className="fill-current" /> : <Play className="fill-current ml-1" />}
                                                </button>
                                            </div>
                                        )}

                                        {/* Bottom Info Glass Panel */}
                                        <div className="mt-auto">
                                            <div className="rounded-2xl bg-black/40 backdrop-blur-xl p-4 border border-white/10">
                                                <h2 className="text-xl font-medium text-white mb-1">{item.title}</h2>
                                                <p className="text-sm text-white/70">{item.subtitle}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Bottom Control Bar (Vision Pro Style) */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute bottom-10 z-50 flex items-center gap-6 px-8 py-4 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            >
                <button onClick={handlePrev} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-4 px-4 border-x border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 p-0.5">
                        <div className="w-full h-full rounded-full overflow-hidden">
                            {/* Avatar or Icon */}
                            <img src="/gallery/first-date.jpeg" alt="Avatar" className="w-full h-full object-cover opacity-90" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">Amnesty & Pap</span>
                        <span className="text-xs text-white/50">Our Journey</span>
                    </div>
                </div>

                <button onClick={handleNext} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white">
                    <ChevronRight className="w-6 h-6" />
                </button>
            </motion.div>

            {/* Background Ambient Glow */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full mix-blend-screen" />
            </div>

        </div>
    )
}
