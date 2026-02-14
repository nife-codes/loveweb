"use client"

import { SpatialGallery, type GalleryItem } from "@/components/carousel/spatial-gallery"

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
        <main className="fixed inset-0 z-50 w-screen h-dvh overflow-hidden flex flex-col bg-black">
            <SpatialGallery items={galleryItems} onBack={onBack} />
        </main>
    )
}
