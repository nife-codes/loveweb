"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"

export interface GalleryItem {
    id: number
    type: "image" | "video"
    src: string
    title: string
    subtitle: string
}

interface CoverflowCarouselProps {
    items: GalleryItem[]
}

export function CoverflowCarousel({ items }: CoverflowCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [playingVideo, setPlayingVideo] = useState<number | null>(null)
    const [dragOffset, setDragOffset] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const touchStartX = useRef(0)
    const touchCurrentX = useRef(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const count = items.length
    const theta = 360 / count

    // Responsive card sizing
    const [cardWidth, setCardWidth] = useState(320)
    useEffect(() => {
        const update = () => {
            const w = window.innerWidth
            if (w < 480) setCardWidth(220)
            else if (w < 768) setCardWidth(260)
            else if (w < 1024) setCardWidth(320)
            else setCardWidth(380)
        }
        update()
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    // Calculate the radius so cards are spaced out properly
    const radius = Math.round(cardWidth / (2 * Math.tan(Math.PI / count)))

    const goTo = useCallback(
        (index: number) => {
            if (isAnimating) return
            setIsAnimating(true)
            setPlayingVideo(null)
            const newIndex = ((index % count) + count) % count
            setActiveIndex(newIndex)
            setTimeout(() => setIsAnimating(false), 700)
        },
        [isAnimating, count]
    )

    const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
    const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
        touchCurrentX.current = e.touches[0].clientX
        setIsDragging(true)
    }, [])

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (!isDragging) return
            touchCurrentX.current = e.touches[0].clientX
            const diff = touchCurrentX.current - touchStartX.current
            // Convert pixel drag to degrees (partial rotation feel)
            const degreesPerPixel = theta / cardWidth
            setDragOffset(diff * degreesPerPixel)
        },
        [isDragging, theta, cardWidth]
    )

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false)
        const diff = touchCurrentX.current - touchStartX.current
        const threshold = 40
        if (Math.abs(diff) > threshold) {
            if (diff < 0) goNext()
            else goPrev()
        }
        setDragOffset(0)
    }, [goNext, goPrev])

    // Mouse drag handlers for desktop
    const mouseStartX = useRef(0)
    const mouseDown = useRef(false)

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        mouseStartX.current = e.clientX
        touchCurrentX.current = e.clientX
        touchStartX.current = e.clientX
        mouseDown.current = true
        setIsDragging(true)
    }, [])

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!mouseDown.current) return
            touchCurrentX.current = e.clientX
            const diff = e.clientX - mouseStartX.current
            const degreesPerPixel = theta / cardWidth
            setDragOffset(diff * degreesPerPixel)
        },
        [theta, cardWidth]
    )

    const handleMouseUp = useCallback(() => {
        if (!mouseDown.current) return
        mouseDown.current = false
        setIsDragging(false)
        const diff = touchCurrentX.current - mouseStartX.current
        const threshold = 40
        if (Math.abs(diff) > threshold) {
            if (diff < 0) goNext()
            else goPrev()
        }
        setDragOffset(0)
    }, [goNext, goPrev])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goPrev()
            if (e.key === "ArrowRight") goNext()
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [goNext, goPrev])

    // Global mouse up listener
    useEffect(() => {
        const up = () => {
            if (mouseDown.current) {
                mouseDown.current = false
                setIsDragging(false)
                const diff = touchCurrentX.current - mouseStartX.current
                if (Math.abs(diff) > 40) {
                    if (diff < 0) goNext()
                    else goPrev()
                }
                setDragOffset(0)
            }
        }
        window.addEventListener("mouseup", up)
        return () => window.removeEventListener("mouseup", up)
    }, [goNext, goPrev])

    const toggleVideo = (id: number) => {
        setPlayingVideo(playingVideo === id ? null : id)
    }

    // The rotation of the entire drum
    const drumRotation = -(activeIndex * theta) + dragOffset

    const cardAspect = 1.35
    const cardHeight = Math.round(cardWidth * cardAspect)

    return (
        <div className="relative flex flex-col items-center justify-center w-full h-full select-none">
            {/* Title area */}
            <div className="text-center mb-4 md:mb-8 z-10 px-4">
                <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-muted-foreground mb-2 font-sans">
                    Gallery
                </p>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif text-foreground tracking-tight text-balance">
                    Moments in Time
                </h1>
            </div>

            {/* 3D Carousel Container */}
            <div
                ref={containerRef}
                className="relative w-full flex-1 min-h-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
                style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* The rotating drum */}
                <div
                    className="relative"
                    style={{
                        width: cardWidth,
                        height: cardHeight,
                        transformStyle: "preserve-3d",
                        transform: `rotateY(${drumRotation}deg)`,
                        transition: isDragging
                            ? "none"
                            : "transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                >
                    {items.map((item, index) => {
                        // Each card is a face of the polygon
                        const angle = index * theta
                        const isActive = index === activeIndex && !isDragging

                        return (
                            <div
                                key={item.id}
                                className="absolute top-0 left-0"
                                style={{
                                    width: cardWidth,
                                    height: cardHeight,
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                    backfaceVisibility: "hidden",
                                }}
                            >
                                <div
                                    className="relative group w-full h-full"
                                    onClick={() => {
                                        if (!isActive) goTo(index)
                                    }}
                                    role="button"
                                    tabIndex={isActive ? 0 : -1}
                                    aria-label={`Gallery item ${index + 1}: ${item.title}`}
                                >
                                    {/* Main card */}
                                    <div
                                        className={`
                      relative overflow-hidden rounded-xl w-full h-full
                      transition-shadow duration-700
                      ${isActive ? "shadow-[0_8px_60px_rgba(139,109,71,0.4)]" : "shadow-[0_4px_30px_rgba(0,0,0,0.5)]"}
                    `}
                                    >
                                        {item.type === "image" ? (
                                            <img
                                                src={item.src}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                                draggable={false}
                                            />
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <video
                                                    src={item.src}
                                                    className="w-full h-full object-cover"
                                                    loop
                                                    muted
                                                    playsInline
                                                    ref={(el) => {
                                                        if (el) {
                                                            if (playingVideo === item.id && isActive) {
                                                                el.play()
                                                            } else {
                                                                el.pause()
                                                            }
                                                        }
                                                    }}
                                                />
                                                {isActive && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleVideo(item.id)
                                                        }}
                                                        className="absolute inset-0 flex items-center justify-center bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                        aria-label={
                                                            playingVideo === item.id
                                                                ? "Pause video"
                                                                : "Play video"
                                                        }
                                                    >
                                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center border border-border/50">
                                                            {playingVideo === item.id ? (
                                                                <Pause className="w-6 h-6 md:w-7 md:h-7 text-foreground" />
                                                            ) : (
                                                                <Play className="w-6 h-6 md:w-7 md:h-7 text-foreground ml-1" />
                                                            )}
                                                        </div>
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Dim overlay for non-active */}
                                        <div
                                            className={`
                        absolute inset-0 transition-opacity duration-700 pointer-events-none
                        bg-background/50
                        ${isActive ? "opacity-0" : "opacity-60"}
                      `}
                                        />

                                        {/* Active card info overlay */}
                                        <div
                                            className={`
                        absolute bottom-0 left-0 right-0 p-4 md:p-6
                        transition-all duration-700 pointer-events-none
                        ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                      `}
                                            style={{
                                                background:
                                                    "linear-gradient(to top, hsl(30 15% 8% / 0.85), hsl(30 15% 8% / 0.4) 60%, transparent)",
                                            }}
                                        >
                                            <h3 className="text-base md:text-lg font-serif text-foreground mb-0.5">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs md:text-sm text-muted-foreground font-sans">
                                                {item.subtitle}
                                            </p>
                                        </div>

                                        {/* Border highlight for active */}
                                        <div
                                            className={`
                        absolute inset-0 rounded-xl border-2 transition-opacity duration-700 pointer-events-none
                        ${isActive ? "border-primary/20 opacity-100" : "border-transparent opacity-0"}
                      `}
                                        />
                                    </div>

                                    {/* Reflection below card */}
                                    <div
                                        className="absolute left-0 right-0 overflow-hidden rounded-xl pointer-events-none"
                                        style={{
                                            top: cardHeight + 2,
                                            height: cardHeight * 0.2,
                                        }}
                                        aria-hidden="true"
                                    >
                                        <div
                                            className="w-full"
                                            style={{
                                                height: cardHeight,
                                                transform: "scaleY(-1)",
                                                filter: "blur(3px) brightness(0.4)",
                                                transformOrigin: "top",
                                            }}
                                        >
                                            {item.type === "image" ? (
                                                <img
                                                    src={item.src}
                                                    alt=""
                                                    className="w-full h-full object-cover object-bottom"
                                                    draggable={false}
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted" />
                                            )}
                                        </div>
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                background:
                                                    "linear-gradient(to bottom, hsl(30 15% 8% / 0.3), hsl(30 15% 8% / 1))",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Navigation controls */}
            <div className="flex items-center justify-center gap-6 md:gap-8 z-10 mt-2 md:mt-4">
                <button
                    onClick={goPrev}
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 active:scale-95"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                <div className="flex items-center gap-2">
                    <span className="font-serif text-xl md:text-2xl text-foreground tabular-nums">
                        {activeIndex + 1}
                    </span>
                    <span className="text-muted-foreground/60 font-sans">/</span>
                    <span className="font-sans text-sm text-muted-foreground tabular-nums">
                        {count}
                    </span>
                </div>

                <button
                    onClick={goNext}
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 active:scale-95"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Dot indicators */}
            <div
                className="flex items-center justify-center gap-2 z-10 mt-3 md:mt-4 pb-2"
                role="tablist"
                aria-label="Gallery navigation"
            >
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goTo(index)}
                        className={`
              rounded-full transition-all duration-500
              ${index === activeIndex
                                ? "w-6 md:w-8 h-1.5 md:h-2 bg-primary"
                                : "w-1.5 md:w-2 h-1.5 md:h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                            }
            `}
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
