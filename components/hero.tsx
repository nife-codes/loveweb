"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[hsl(30,30%,96%)] via-[hsl(30,25%,93%)] to-[hsl(28,22%,88%)] px-6">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[15%] h-1 w-1 animate-pulse rounded-full bg-primary/20" style={{ animationDelay: "0s", animationDuration: "4s" }} />
        <div className="absolute left-[80%] top-[25%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary/15" style={{ animationDelay: "1s", animationDuration: "5s" }} />
        <div className="absolute left-[25%] top-[70%] h-1 w-1 animate-pulse rounded-full bg-primary/20" style={{ animationDelay: "2s", animationDuration: "3.5s" }} />
        <div className="absolute left-[70%] top-[80%] h-1.5 w-1.5 animate-pulse rounded-full bg-primary/10" style={{ animationDelay: "0.5s", animationDuration: "4.5s" }} />
        <div className="absolute left-[50%] top-[10%] h-1 w-1 animate-pulse rounded-full bg-primary/15" style={{ animationDelay: "3s", animationDuration: "5s" }} />
        <div className="absolute left-[90%] top-[55%] h-1 w-1 animate-pulse rounded-full bg-primary/20" style={{ animationDelay: "1.5s", animationDuration: "4s" }} />
      </div>


      <div className="mb-8 animate-bounce" style={{ animationDuration: "3s" }}>
        <Heart className="h-5 w-5 text-primary/40" fill="hsl(20 25% 32% / 0.25)" strokeWidth={1.5} />
      </div>


      <h1 className="text-balance text-center font-script text-5xl leading-tight tracking-wide text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
        {"Rufiyah, this is for you"}
      </h1>


      <div className="mt-6 h-px w-16 bg-primary/20 sm:w-24" />


      <div className="mt-12">
        <button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative overflow-hidden rounded-full border border-primary/20 bg-primary/5 px-10 py-3.5 font-sans text-sm font-light tracking-[0.2em] uppercase text-primary transition-all duration-700 ease-out hover:border-primary/40 hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-12 sm:py-4 sm:text-base"
          aria-label="Continue"
        >
          <span className="relative z-10 transition-all duration-700">Continue</span>
          <span
            className={`absolute inset-0 -z-0 bg-primary transition-transform duration-700 ease-out ${
              isHovered ? "translate-y-0" : "translate-y-full"
            }`}
          />
        </button>
      </div>


      <p className="absolute bottom-8 text-center font-sans text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 sm:text-xs">
        {"with all my heart"}
      </p>
    </main>
  )
}
