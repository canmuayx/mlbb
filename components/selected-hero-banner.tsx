"use client"

import { X, Target } from "lucide-react"
import { ROLE_COLORS, ROLE_BG_COLORS, type Hero } from "@/lib/mlbb-data"

interface SelectedHeroBannerProps {
  hero: Hero
  onClear: () => void
}

export function SelectedHeroBanner({ hero, onClear }: SelectedHeroBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-gradient-to-r from-card via-card to-navy/20">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${ROLE_BG_COLORS[hero.role]} opacity-10 blur-2xl`} />
      </div>

      <div className="relative flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-gold" />
            <span className="text-sm font-medium text-muted-foreground">{"ศัตรูที่เลือก"}</span>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="flex items-center gap-3">
            <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${ROLE_BG_COLORS[hero.role]} overflow-hidden shadow-lg border border-foreground/10`}>
              <img
                src={hero.image}
                alt={hero.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = "none"
                  const parent = target.parentElement
                  if (parent) {
                    const fallback = document.createElement("span")
                    fallback.className = "font-mono text-lg font-bold text-foreground"
                    fallback.textContent = hero.icon
                    parent.appendChild(fallback)
                  }
                }}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{hero.name}</h3>
              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[hero.role]}`}>
                {hero.role}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClear}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-all"
          aria-label="ล้างการเลือก"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
