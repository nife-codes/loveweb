"use client"

import { useState, useCallback, useMemo } from "react"
import { rawPoems, bookMetadata, type PoemPage, PAGE_BREAK } from "@/lib/poems"
import { BookPageContent } from "@/components/BookPage"
import { useIsMobile } from "@/hooks/use-mobile"
import { X } from "lucide-react"

/*
  Physical book with real CSS 3D page flipping.
  
  The book starts CLOSED (cover facing you).
  Click the right half to flip the next sheet open.
  Click the left half to flip the last sheet back closed.

  Sheets (each has a front and back face):
    Sheet 0: Cover (front) / Main Title page (back)
    Sheet 1: Poem 1 Title (front) / Poem 1 Page 1 (back)
    ...
    Last Sheet: Finis (front) / Back cover (back)
*/

const FLIP_MS = 700


interface BookPageData extends PoemPage {
    variant: "title" | "poem" | "end" | "empty"
    poemTitle: string
}

interface PoetryBookProps {
    onBack: () => void
}

export default function PoetryBook({ onBack }: PoetryBookProps) {
    const isMobile = useIsMobile()

    // Adjust lines per page based on device to prevent overflow
    const linesPerPage = isMobile ? 12 : 20

    // Generate pages dynamically
    const pages = useMemo(() => {
        const generated: BookPageData[] = []
        let pageNum = 1

        rawPoems.forEach((poem) => {
            // 1. Poem Title Page
            generated.push({
                lines: [poem.title],
                pageNumber: pageNum++,
                variant: "title",
                poemTitle: poem.title,
            })

            // 2. Content Pages
            let currentLines: string[] = []

            poem.lines.forEach((line, index) => {
                // Handle manual page breaks
                if (line === PAGE_BREAK) {
                    if (currentLines.length > 0) {
                        generated.push({
                            lines: [...currentLines],
                            pageNumber: pageNum++,
                            variant: "poem",
                            poemTitle: poem.title,
                        })
                        currentLines = []
                    }
                    return // Skip the break marker itself
                }

                // Determine if we need to break page automatically (fallback)
                // Logic: 
                // - If currentLines is full (linesPerPage)
                // - Don't start a page with an empty line (stanza break) unless it's unavoidable?
                //   Actually, just skipping leading empty lines on new page is better.

                if (currentLines.length >= linesPerPage) {
                    generated.push({
                        lines: [...currentLines],
                        pageNumber: pageNum++,
                        variant: "poem",
                        poemTitle: poem.title,
                    })
                    currentLines = []
                }

                // Skip leading empty line on new page
                if (currentLines.length === 0 && line.trim() === "") {
                    return
                }

                currentLines.push(line)
            })

            // Push remaining lines
            if (currentLines.length > 0) {
                generated.push({
                    lines: [...currentLines],
                    pageNumber: pageNum++,
                    variant: "poem",
                    poemTitle: poem.title,
                })
            }
        })

        // 3. Ensure "Finis" page lands on a Front Face (Right side).
        // Front Faces are at Even indices in 'generated' array (0, 2, 4...).
        // Valid indices: 0 (Sheet 1 Front), 1 (Sheet 1 Back), 2 (Sheet 2 Front)...
        // We want Finis at an Even index.
        // If length is Odd (next index is Odd/Left), add a Blank page first.

        if (generated.length % 2 !== 0) {
            generated.push({
                lines: [],
                pageNumber: 0, // No number for empty
                variant: "empty",
                poemTitle: "",
            })
        }

        // Add Finis
        generated.push({
            lines: ["Finis"],
            pageNumber: 0,
            variant: "end",
            poemTitle: "",
        })

        return generated
    }, [isMobile, linesPerPage]) // Re-generate when device changes

    const TOTAL_SHEETS = 1 + Math.ceil(pages.length / 2)

    const [flippedCount, setFlippedCount] = useState(0)
    const [isFlipping, setIsFlipping] = useState(false)

    // Reset loop if pages change significantly? 
    // Actually framer or React might complain if flippedCount > total.
    // Let's safe-guard it.
    if (flippedCount > TOTAL_SHEETS) {
        setFlippedCount(0)
    }

    const isClosed = flippedCount === 0
    const isAllOpen = flippedCount === TOTAL_SHEETS

    const flipForward = useCallback(() => {
        if (isFlipping || flippedCount >= TOTAL_SHEETS) return
        setIsFlipping(true)
        setFlippedCount((c) => c + 1)
        setTimeout(() => setIsFlipping(false), FLIP_MS)
    }, [isFlipping, flippedCount])

    const flipBack = useCallback(() => {
        if (isFlipping || flippedCount <= 0) return
        setIsFlipping(true)
        setFlippedCount((c) => c - 1)
        setTimeout(() => setIsFlipping(false), FLIP_MS)
    }, [isFlipping, flippedCount])

    // Reduced base size slightly for mobile to ensure fit with scaling
    const pageW = isMobile ? 290 : 340
    const pageH = isMobile ? 480 : 500
    const bookW = isClosed ? pageW : pageW * 2

    // Scale down on mobile to fit viewport width
    const mobileScale = isMobile ? 0.85 : 1

    // Close book handler (swipe down or close button)
    const handleTouchStart = (e: React.TouchEvent) => {
        const startY = e.touches[0].clientY;
        const el = e.currentTarget as HTMLElement;

        const handleTouchEnd = (ev: any) => {
            const endY = ev.changedTouches[0].clientY;
            const deltaY = startY - endY;

            if (deltaY < -50) onBack(); // Swipe down to close

            el.removeEventListener("touchend", handleTouchEnd);
        };

        el.addEventListener("touchend", handleTouchEnd);
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY < -30) onBack();
    };

    return (
        <main
            className="flex min-h-screen flex-col items-center justify-center px-4 py-8 relative overflow-hidden"
            style={{
                background:
                    "radial-gradient(ellipse at 50% 40%, hsl(24 12% 16%), hsl(24 10% 8%))",
            }}
            onTouchStart={handleTouchStart}
            onWheel={handleWheel}
        >
            {/* Scale container for mobile fit */}
            <div className="flex flex-col items-center relative z-10" style={{ transform: `scale(${mobileScale})` }}>

                {/* Close Button */}
                <button
                    onClick={onBack}
                    className="absolute -top-12 right-0 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* ... Header and Hint remain the same ... */}

                {/* Title */}
                <header className="relative z-10 mb-8 text-center">
                    <p className="text-[10px] tracking-[0.5em] uppercase text-[hsl(40,40%,48%)]">
                        A Love Poem
                    </p>
                    <h1 className="mt-2 font-display text-2xl font-bold italic tracking-wider text-[hsl(40,55%,55%)] md:text-4xl">
                        {bookMetadata.title}
                    </h1>
                    <p className="mt-1.5 text-xs italic tracking-[0.25em] text-[hsl(36,20%,48%)]">
                        {bookMetadata.author}, {bookMetadata.year}
                    </p>
                </header>

                {/* Hint */}
                <p
                    className="relative z-10 mb-5 text-[11px] tracking-[0.25em] text-[hsl(36,18%,40%)] transition-opacity duration-500"
                    key={flippedCount}
                >
                    {isClosed
                        ? "Click to open the book"
                        : isAllOpen
                            ? "Click the left page to go back"
                            : "Click right side to turn, left to go back"}
                </p>

                {/* Book scene */}
                <div className="relative z-10" style={{ perspective: "2200px" }}>

                    {/* ... Drop shadow and Book wrapper ... */}

                    {/* Drop shadow */}
                    <div
                        className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2"
                        style={{
                            width: "90%",
                            height: "20px",
                            background:
                                "radial-gradient(ellipse at center, rgba(0,0,0,0.5), transparent 70%)",
                            filter: "blur(8px)",
                        }}
                        aria-hidden="true"
                    />

                    <div
                        className="relative transition-[width] duration-500 ease-in-out"
                        style={{
                            width: `${bookW}px`,
                            height: `${pageH}px`,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* ... Back cover and Stacked pages ... */}

                        {/* Back cover (static, sits behind everything) */}
                        <div
                            className="absolute rounded-r-md"
                            style={{
                                width: `${pageW}px`,
                                height: `${pageH}px`,
                                left: isClosed ? 0 : pageW,
                                top: 0,
                                background:
                                    "linear-gradient(135deg, hsl(24 28% 18%), hsl(24 32% 14%) 40%, hsl(24 25% 11%))",
                                boxShadow:
                                    "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -2px 4px rgba(0,0,0,0.25)",
                                transform: "translateZ(-4px)",
                                transition: "left 500ms ease-in-out",
                                borderRadius: "0 6px 6px 0",
                            }}
                            aria-hidden="true"
                        />

                        {/* Stacked page edges for depth */}
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="pointer-events-none absolute"
                                style={{
                                    width: `${pageW}px`,
                                    height: `${pageH}px`,
                                    left: isClosed ? 0 : pageW,
                                    top: 0,
                                    background: `hsl(38 32% ${87 - i * 1.5}%)`,
                                    transform: `translateZ(${-i}px)`,
                                    borderRadius: "0 4px 4px 0",
                                    transition: "left 500ms ease-in-out, opacity 500ms",
                                    opacity: isAllOpen ? 0 : 1,
                                }}
                                aria-hidden="true"
                            />
                        ))}

                        {/* ... Click zones ... */}

                        {/* Left-side click zone: flip back (only when book is open) */}
                        {!isClosed && (
                            <div
                                className="absolute z-[100] cursor-pointer"
                                style={{
                                    width: `${pageW}px`,
                                    height: `${pageH}px`,
                                    left: 0,
                                    top: 0,
                                }}
                                onClick={flipBack}
                                role="button"
                                tabIndex={0}
                                aria-label="Turn page back"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        flipBack()
                                    }
                                }}
                            />
                        )}

                        {/* Right-side click zone: flip forward (only when book not fully open) */}
                        {!isAllOpen && (
                            <div
                                className="absolute z-[100] cursor-pointer"
                                style={{
                                    width: `${pageW}px`,
                                    height: `${pageH}px`,
                                    left: isClosed ? 0 : pageW,
                                    top: 0,
                                    transition: "left 500ms ease-in-out",
                                }}
                                onClick={flipForward}
                                role="button"
                                tabIndex={0}
                                aria-label="Turn page forward"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        flipForward()
                                    }
                                }}
                            />
                        )}

                        {/* Render sheets from bottom to top */}
                        {Array.from({ length: TOTAL_SHEETS }).map((_, sheetIdx) => {
                            const isFlipped = sheetIdx < flippedCount
                            let z: number
                            if (isFlipping) {
                                const turningSheet = isFlipped
                                    ? flippedCount - 1
                                    : flippedCount

                                if (sheetIdx === turningSheet || sheetIdx === flippedCount) {
                                    z = 60
                                } else if (isFlipped) {
                                    z = 10 + sheetIdx
                                } else {
                                    z = 10 + (TOTAL_SHEETS - sheetIdx)
                                }
                            } else {
                                if (isFlipped) {
                                    z = 10 + sheetIdx
                                } else {
                                    z = 10 + (TOTAL_SHEETS - sheetIdx)
                                }
                            }

                            return (
                                <div
                                    key={sheetIdx}
                                    className="absolute"
                                    style={{
                                        width: `${pageW}px`,
                                        height: `${pageH}px`,
                                        left: isClosed ? 0 : pageW,
                                        top: 0,
                                        transformStyle: "preserve-3d",
                                        transformOrigin: "left center",
                                        transform: isFlipped ? "rotateY(-180deg)" : "rotateY(0deg)",
                                        transition: `transform ${FLIP_MS}ms cubic-bezier(0.645, 0.045, 0.355, 1.0), left 500ms ease-in-out`,
                                        zIndex: z,
                                        pointerEvents: "none",
                                    }}
                                >
                                    {/* Front face */}
                                    <div
                                        className="backface-hidden absolute inset-0 overflow-hidden"
                                        style={{
                                            borderRadius: "0 6px 6px 0",
                                            boxShadow:
                                                "2px 0 12px rgba(0,0,0,0.12), 1px 0 3px rgba(0,0,0,0.08)",
                                        }}
                                    >
                                        <SheetFront index={sheetIdx} pages={pages} />
                                    </div>

                                    {/* Back face */}
                                    <div
                                        className="backface-hidden absolute inset-0 overflow-hidden"
                                        style={{
                                            transform: "rotateY(180deg)",
                                            borderRadius: "6px 0 0 6px",
                                            boxShadow:
                                                "-2px 0 12px rgba(0,0,0,0.12), -1px 0 3px rgba(0,0,0,0.08)",
                                        }}
                                    >
                                        <SheetBack index={sheetIdx} pages={pages} totalSheets={TOTAL_SHEETS} />
                                    </div>
                                </div>
                            )
                        })}

                        {/* Spine shadow when open */}
                        {!isClosed && (
                            <div
                                className="pointer-events-none absolute top-0 z-[90]"
                                style={{
                                    left: `${pageW - 8}px`,
                                    width: "16px",
                                    height: `${pageH}px`,
                                    background:
                                        "linear-gradient(to right, rgba(0,0,0,0.08), rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.18) 60%, rgba(0,0,0,0.08))",
                                    transition: "opacity 500ms",
                                }}
                                aria-hidden="true"
                            />
                        )}
                    </div>
                </div>

                {/* Progress dots */}
                <div
                    className="relative z-10 mt-8 flex items-center gap-2"
                    role="navigation"
                    aria-label="Page progress"
                >
                    {Array.from({ length: TOTAL_SHEETS + 1 }).map((_, i) => (
                        <div
                            key={i}
                            className={`rounded-full transition-all duration-500 ${i === flippedCount
                                ? "h-2 w-2 bg-[hsl(40,55%,55%)] shadow-[0_0_6px_hsl(40,55%,55%,0.5)]"
                                : "h-1.5 w-1.5 bg-[hsl(36,20%,28%)]"
                                }`}
                            aria-label={`Step ${i + 1}`}
                            aria-current={i === flippedCount ? "step" : undefined}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}

/* ------------------------------------------------------------------ */
/*  Sheet face content                                                 */
/* ------------------------------------------------------------------ */

function SheetFront({ index, pages }: { index: number; pages: BookPageData[] }) {
    if (index === 0) return <BookCover />

    const pageIndex = (index - 1) * 2
    const page = pages[pageIndex]

    if (page) {
        return (
            <BookPageContent
                poem={{ ...bookMetadata, pages: [] }}
                page={page}
                side="right"
                variant={page.variant}
            />
        )
    }
    return null
}

function SheetBack({ index, pages, totalSheets }: { index: number; pages: BookPageData[]; totalSheets: number }) {
    if (index === 0)
        return (
            <BookPageContent
                poem={{ ...bookMetadata, pages: [] }}
                side="left"
                variant="title"
            />
        )

    if (index === totalSheets - 1) return <BackCoverInterior />

    const pageIndex = (index - 1) * 2 + 1
    const page = pages[pageIndex]

    if (page) {
        return (
            <BookPageContent
                poem={{ ...bookMetadata, pages: [] }}
                page={page}
                side="left"
                variant={page.variant}
            />
        )
    }
    return null
}

/* ------------------------------------------------------------------ */
/*  Book Cover                                                         */
/* ------------------------------------------------------------------ */

function BookCover() {
    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
                background:
                    "linear-gradient(145deg, hsl(24 32% 24%), hsl(24 36% 19%) 25%, hsl(24 30% 15%) 60%, hsl(24 28% 12%))",
                borderRadius: "0 6px 6px 0",
            }}
        >
            {/* Leather grain */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='l'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23l)'/%3E%3C/svg%3E")`,
                    borderRadius: "inherit",
                }}
                aria-hidden="true"
            />

            {/* Gold border frames */}
            <div
                className="absolute inset-5 rounded border border-[hsl(40,50%,48%,0.25)] md:inset-7"
                aria-hidden="true"
            />
            <div
                className="absolute inset-7 rounded border border-[hsl(40,50%,48%,0.12)] md:inset-9"
                aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
                <CoverOrnament />

                <h2 className="font-display text-xl font-bold italic leading-snug tracking-wider text-[hsl(40,55%,55%)] md:text-2xl">
                    {bookMetadata.title}
                </h2>

                <div className="h-px w-14 bg-[hsl(40,50%,50%)] opacity-35" />

                <p className="text-xs tracking-[0.3em] uppercase text-[hsl(40,40%,50%)]">
                    {bookMetadata.author}
                </p>

                <CoverOrnament />
            </div>

            {/* Spine edge */}
            <div
                className="pointer-events-none absolute bottom-0 left-0 top-0 w-3"
                style={{
                    background:
                        "linear-gradient(to right, rgba(0,0,0,0.25), rgba(255,255,255,0.03) 60%, transparent)",
                }}
                aria-hidden="true"
            />
        </div>
    )
}

function CoverOrnament() {
    return (
        <svg
            width="36"
            height="16"
            viewBox="0 0 40 20"
            fill="none"
            className="text-[hsl(40,55%,52%)] opacity-50"
            aria-hidden="true"
        >
            <path
                d="M0 10 Q10 0 20 10 Q30 0 40 10"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
            />
            <path
                d="M0 10 Q10 20 20 10 Q30 20 40 10"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
            />
            <circle cx="20" cy="10" r="2" fill="currentColor" />
        </svg>
    )
}

/* ------------------------------------------------------------------ */
/*  Back Cover Interior                                                */
/* ------------------------------------------------------------------ */

function BackCoverInterior() {
    return (
        <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
                background:
                    "linear-gradient(145deg, hsl(24 28% 20%), hsl(24 32% 16%) 40%, hsl(24 26% 13%))",
                borderRadius: "6px 0 0 6px",
            }}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='l'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23l)'/%3E%3C/svg%3E")`,
                    borderRadius: "inherit",
                }}
                aria-hidden="true"
            />
            <div
                className="absolute inset-5 rounded border border-[hsl(40,50%,48%,0.12)]"
                aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="text-[hsl(40,50%,50%)] opacity-35"
                    aria-hidden="true"
                >
                    <path
                        d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z"
                        fill="currentColor"
                    />
                </svg>
                <p className="text-xs italic tracking-[0.2em] text-[hsl(40,35%,42%)]">
                    With love, always
                </p>
            </div>
        </div>
    )
}
