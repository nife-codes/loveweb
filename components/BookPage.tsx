import type { PoemPage, PoemData } from "@/lib/poems"

interface BookPageContentProps {
    page?: PoemPage
    poem: PoemData
    side: "left" | "right"
    variant?: "title" | "poem" | "end" | "empty"
}

export function BookPageContent({
    page,
    poem,
    side,
    variant = "poem",
}: BookPageContentProps) {
    const bgGradient =
        side === "left"
            ? "linear-gradient(to right, hsl(36 28% 83%), hsl(38 38% 89%) 12%, hsl(38 40% 91%))"
            : "linear-gradient(to left, hsl(36 28% 83%), hsl(38 38% 89%) 12%, hsl(38 40% 91%))"

    return (
        <div
            className="absolute inset-0 flex flex-col justify-between overflow-hidden backface-hidden"
            style={{ background: bgGradient }}
        >
            {/* Subtle paper texture overlay */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                }}
                aria-hidden="true"
            />

            {/* Page fold shadow */}
            {side === "left" && (
                <div
                    className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10"
                    style={{
                        background:
                            "linear-gradient(to right, transparent, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.06))",
                    }}
                    aria-hidden="true"
                />
            )}
            {side === "right" && (
                <div
                    className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10"
                    style={{
                        background:
                            "linear-gradient(to left, transparent, rgba(0,0,0,0.02) 40%, rgba(0,0,0,0.06))",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Content area */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-4 md:px-12 md:py-14">
                {variant === "title" && (
                    <div className="flex flex-col items-center gap-4">
                        {/* Ornament */}
                        <Ornament />
                        <h2 className="text-balance text-center font-display text-2xl font-bold italic leading-tight tracking-wide text-[hsl(24,30%,20%)] md:text-3xl lg:text-4xl">
                            {page ? page.lines[0] : poem.title}
                        </h2>

                        {!page && (
                            <>
                                <p className="text-center text-sm font-medium tracking-[0.25em] uppercase text-[hsl(24,20%,42%)]">
                                    {poem.author}
                                </p>
                                {poem.dedication && (
                                    <p className="mt-1 text-center text-xs italic tracking-wider text-[hsl(24,15%,50%)]">
                                        {poem.dedication}
                                    </p>
                                )}
                                <p className="text-xs tracking-wider text-[hsl(24,15%,52%)]">
                                    {poem.year}
                                </p>
                            </>
                        )}
                        <SmallOrnament />
                    </div>
                )}

                {variant === "poem" && page && (
                    <div className="flex flex-col items-center gap-0">
                        {page.lines.map((line, i) => {
                            // Specialized styling for denser poems
                            const isConfession = (page as any)?.poemTitle === "The Confession"
                            const isMediumPage = page.pageNumber === 4 || page.pageNumber === 5

                            let textClass = "text-center font-serif tracking-wide text-[hsl(24,30%,20%)] "
                            if (isMediumPage) {
                                textClass += "text-[11px] leading-snug md:text-sm md:leading-relaxed"
                            } else if (isConfession) {
                                textClass += "text-[10px] leading-[1.3] md:text-xs md:leading-relaxed"
                            } else {
                                textClass += "text-xs leading-snug md:text-base md:leading-relaxed"
                            }

                            return (
                                <p
                                    key={i}
                                    className={`${textClass} ${line === "" ? (isConfession ? "h-1.5" : "h-2") : ""}`}
                                >
                                    {line || "\u00A0"}
                                </p>
                            )
                        })}
                    </div>
                )}

                {variant === "end" && (
                    <div className="flex flex-col items-center gap-5">
                        <Ornament />
                        <p className="font-display text-lg italic tracking-wider text-[hsl(24,20%,38%)]">
                            Finis
                        </p>
                        <SmallOrnament />
                    </div>
                )}

                {variant === "empty" && (
                    <div className="opacity-0" aria-hidden="true" />
                )}
            </div>

            {/* Page number */}
            {page && (
                <div className="relative z-10 pb-6 text-center">
                    <span className="text-xs tracking-[0.3em] text-[hsl(24,15%,52%)]">
                        {page.pageNumber}
                    </span>
                </div>
            )}
        </div>
    )
}

function Ornament() {
    return (
        <div className="flex items-center gap-3" aria-hidden="true">
            <div className="h-px w-10 bg-[hsl(40,50%,55%)] opacity-40" />
            <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                className="text-[hsl(40,55%,50%)] opacity-60"
            >
                <path
                    d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z"
                    fill="currentColor"
                />
            </svg>
            <div className="h-px w-10 bg-[hsl(40,50%,55%)] opacity-40" />
        </div>
    )
}

function SmallOrnament() {
    return (
        <div className="flex items-center gap-2" aria-hidden="true">
            <div className="h-px w-6 bg-[hsl(24,15%,40%)] opacity-25" />
            <svg
                width="6"
                height="6"
                viewBox="0 0 10 10"
                fill="none"
                className="text-[hsl(40,55%,50%)] opacity-40"
            >
                <circle cx="5" cy="5" r="2.5" fill="currentColor" />
            </svg>
            <div className="h-px w-6 bg-[hsl(24,15%,40%)] opacity-25" />
        </div>
    )
}
