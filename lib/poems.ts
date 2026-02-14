export interface PoemPage {
    lines: string[]
    pageNumber: number
}

// Deprecated old structure types, keeping for BookPage compatibility for now
export interface PoemData {
    title: string
    author: string
    year: string
    dedication?: string
    pages: PoemPage[] // This will be generated dynamically
}

export interface PoemWork {
    title: string
    lines: string[]
}

export const bookMetadata = {
    title: "For My Darling Rufiyah",
    author: "Your Valentine",
    year: "2026",
    dedication: "My flower, my confession",
}

export const PAGE_BREAK = "---PAGE_BREAK---"

export const rawPoems: PoemWork[] = [
    {
        title: "My Flower",
        lines: [
            "The flower has been planted and watered.",
            "A new beginning has started to come into fruition.",
            "This said flower has grown into a very elegant",
            "and a beautiful flower.",
            "",
            "The gardener cherishes his flower, the flower",
            "is very tender and soft.",
            "Which makes the dynamics even more beautiful to behold",
        ],
    },
    {
        title: "The Confession",
        lines: [
            "I'm not sure how to begin this; I'm not even sure",
            "if I can call this a poem more like what the title says.",
            "It's not news that I have fallen deeply for you,",
            "although I was contemplating it for a while.",
            "The reason why I had to act or proclaim my feelings",
            "w a s this:",
            "",
            "\"Last year towards the end of the year (November).",
            "I sat on my bed looking at everything I have",
            "accomplished with a bitter taste, and all the",
            PAGE_BREAK,
            "check boxes were checked. So what was missing?",
            "I asked myself • • • •",
            "I think what was missing was someone else, I",
            "don't know how I will explain it, but it's just",
            "easier with someone by your side.",
            "For most of the year, I was a bit alone everything",
            "was a cope to fight this said loneliness.",
            "I do think the only way to fight it is to love",
            "another person wholeheartedly.",
            "That's what I set out to do with you.",
            "",
            "My missing piece, I guess",
            PAGE_BREAK,
            "My reasons for contemplation:",
            "\"I fear that my efforts won't be reciprocated,",
            "I love too deeply.",
            "",
            "It has become more of a fall than a blessing.",
            "I loved my ex very muchly and she gave me an ego death.",
            "I had a best friend growing up, but I tried",
            "making the friendship work.",
            "",
            "This can be very draining, and I fear for this more",
            "than even my own mortality, because how can I",
            "love so deeply that a part of my identity replaces",
            "me and places the other person above myself?",
            "",
            "I write to you, today or rather I ask you today.",
            "'Will my efforts be reciprocated?\"",
            PAGE_BREAK,
            "Anyways, happy valentine Rufiyat and I love and",
            "a d o r e you",
        ],
    },
]

// Determine dynamic poem data (placeholder, will be handled by PoetryBook)
export const poem: PoemData = {
    ...bookMetadata,
    pages: [], // This will now be ignored/unused by the new logic in PoetryBook
}
