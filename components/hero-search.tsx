"use client"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { searchHeroes, HEROES, ROLE_COLORS, getAllHeroes, type Hero } from "@/lib/mlbb-data"

interface HeroSearchProps {
  onSelectHero: (hero: Hero) => void
  selectedHero: Hero | null
  customHeroes?: Hero[]
  baseHeroOverrides?: Record<string, Partial<Hero>>
}

export function HeroSearch({ onSelectHero, selectedHero, customHeroes, baseHeroOverrides }: HeroSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<Hero[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim()) {
      setResults(searchHeroes(query, customHeroes, baseHeroOverrides))
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, customHeroes, baseHeroOverrides])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSelect(hero: Hero) {
    onSelectHero(hero)
    setQuery("")
    setIsOpen(false)
  }

  function handleClear() {
    setQuery("")
    setIsOpen(false)
    onSelectHero(null as unknown as Hero)
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gold/60" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="ค้นหาฮีโร่ศัตรู... (เช่น Ling, Fanny, Mage)"
          className="w-full rounded-xl border border-border bg-card py-4 pl-12 pr-12 font-sans text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
          aria-label="ค้นหาฮีโร่ศัตรู"
          aria-expanded={isOpen}
          role="combobox"
          aria-controls="hero-search-results"
        />
        {(query || selectedHero) && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="ล้างการค้นหา"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          id="hero-search-results"
          role="listbox"
          className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden"
        >
          <div className="max-h-72 overflow-y-auto">
            {results.map((hero) => (
              <button
                key={hero.id}
                role="option"
                aria-selected={selectedHero?.id === hero.id}
                onClick={() => handleSelect(hero)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-secondary/60 transition-colors border-b border-border/50 last:border-b-0"
              >
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-light to-navy overflow-hidden">
                  <img
                    src={hero.image}
                    alt={hero.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent) {
                        const fallback = document.createElement("span")
                        fallback.className = "font-mono text-sm font-bold text-gold"
                        fallback.textContent = hero.icon
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{hero.name}</p>
                </div>
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[hero.role]}`}>
                  {hero.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-card p-6 text-center shadow-2xl shadow-black/50">
          <p className="text-muted-foreground">{"ไม่พบฮีโร่ที่ค้นหา"}</p>
        </div>
      )}

      {!isOpen && !selectedHero && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">{"แนะนำ:"}</span>
          {["Ling", "Fanny", "Gusion", "Beatrix", "Esmeralda"].map((name) => {
            const allHeroes = getAllHeroes(customHeroes, baseHeroOverrides)
            const hero = allHeroes.find((h) => h.name === name)
            if (!hero) return null
            return (
              <button
                key={hero.id}
                onClick={() => handleSelect(hero)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-3 py-1 text-xs text-secondary-foreground hover:border-gold/50 hover:text-gold transition-all"
              >
                <img src={hero.image} alt="" className="h-4 w-4 rounded-sm object-cover" loading="lazy" />
                {hero.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
