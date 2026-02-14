"use client"

import { CoverflowCarousel, type GalleryItem } from "@/components/carousel/coverflow-carousel"
import { AmbientParticles } from "@/components/carousel/ambient-particles"
import { X } from "lucide-react"

interface GalleryOverlayProps {
    onBack: () => void
}

const galleryItems: GalleryItem[] = [
    {
        id: 1,
        type: "video",
        src: "/gallery/adore.mp4",
        title: "Adore",
        subtitle: "A moment of pure adoration",
    },
    {
        id: 2,
        type: "video",
        src: "/gallery/most-adore.mp4",
        title: "Most Adored",
        subtitle: "Cherishing every second",
    },
    {
        id: 3,
        type: "video",
        src: "/gallery/pretty.mp4",
        title: "Simply Beautiful",
        subtitle: "Radiance captured in time",
    },
    {
        id: 4,
        type: "video",
        src: "/gallery/spicy.mp4",
        title: "Spicy & Sweet",
        subtitle: "The fire in your spirit",
    },
    {
        id: 5,
        type: "image",
        src: "/gallery/19th.jpeg",
        title: "The 19th",
        subtitle: "A special date to remember",
    },
    {
        id: 6,
        type: "image",
        src: "/gallery/first-date.jpeg",
        title: "First Date",
        subtitle: "Where it all began",
    },
    {
        id: 7,
        type: "video",
        src: "/gallery/first-ever-video.mp4",
        title: "Our First Video",
        subtitle: "The start of our story recorded",
    },
]

export function GalleryOverlay({ onBack }: GalleryOverlayProps) {
    return (
        <main className="fixed inset-0 z-50 w-screen h-dvh overflow-hidden flex flex-col bg-background">
            {/* Background radial glow */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 55% at 50% 45%, hsl(30 25% 14% / 0.7), transparent 70%)",
                }}
            />

            {/* Ambient floating particles */}
            <AmbientParticles />

            {/* Top vignette */}
            <div
                className="fixed top-0 left-0 right-0 h-24 pointer-events-none z-30"
                aria-hidden="true"
                style={{
                    background: "linear-gradient(to bottom, hsl(30 15% 8%), transparent)",
                }}
            />

            {/* Close Button */}
            <button
                onClick={onBack}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-background/20 hover:bg-background/40 text-foreground transition-all duration-300 backdrop-blur-md border border-border/30"
                aria-label="Close gallery"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Bottom vignette */}
            <div
                className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none z-30"
                aria-hidden="true"
                style={{
                    background: "linear-gradient(to top, hsl(30 15% 8%), transparent)",
                }}
            />

            {/* Main carousel */}
            <div className="relative z-20 flex-1 flex flex-col pt-6 md:pt-10 pb-4 md:pb-6 min-h-0">
                <CoverflowCarousel items={galleryItems} />
            </div>

            {/* Bottom hint */}
            <div className="relative z-40 text-center pb-3 md:pb-5">
                <p className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-muted-foreground/40 font-sans">
                    Drag or use arrow keys to explore
                </p>
            </div>
        </main>
    )
}
