"use client"

import { Package, Clock, Trophy, Coins, Crosshair } from "lucide-react"
import type { CounterItem } from "@/lib/mlbb-data"

interface CounterItemsProps {
  earlyItems: CounterItem[]
  lateItems: CounterItem[]
  enemyName: string
}

const PHASE_STYLES = {
  early: {
    bg: "from-blue-500/10 to-blue-600/5",
    badge: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    label: "ต้นเกม",
    icon: Clock,
    iconColor: "text-blue-400",
  },
  late: {
    bg: "from-gold/10 to-gold-light/5",
    badge: "bg-gold/20 text-gold border-gold/30",
    label: "ท้ายเกม",
    icon: Trophy,
    iconColor: "text-gold",
  },
}

function ItemCard({ item, rank, phase }: { item: CounterItem; rank: number; phase: "early" | "late" }) {
  const style = PHASE_STYLES[phase]
  const PhaseIcon = style.icon

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5">
      {/* Rank badge */}
      <div className="absolute right-3 top-3 z-10">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
          #{rank}
        </span>
      </div>

      {/* Item header */}
      <div className={`bg-gradient-to-r ${style.bg} p-4 pb-3`}>
        <div className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-black/30 overflow-hidden border border-gold/20">
            <img
              src={item.image}
              alt={item.name}
              className="h-10 w-10 object-contain"
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = "none"
                const parent = target.parentElement
                if (parent) {
                  const fallback = document.createElement("span")
                  fallback.className = "font-mono text-lg font-bold text-gold"
                  fallback.textContent = item.icon
                  parent.appendChild(fallback)
                }
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
            <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${style.badge}`}>
              <PhaseIcon className="h-3 w-3" />
              {style.label}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-gold" />
            <span className="text-sm text-muted-foreground">{"ราคา"}</span>
          </div>
          <span className="text-lg font-bold text-gold">{item.price.toLocaleString()}</span>
        </div>

        {/* Stat line */}
        <div className="flex items-start gap-2 mb-3">
          <Crosshair className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs font-mono text-accent-foreground leading-relaxed">{item.stat}</p>
        </div>

        {/* Reason / Description */}
        <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>
    </article>
  )
}

export function CounterItems({ earlyItems, lateItems, enemyName }: CounterItemsProps) {
  // Merge all items with phase info for unified display
  const allItems = [
    ...earlyItems.map((item, i) => ({ item, rank: i + 1, phase: "early" as const })),
    ...lateItems.map((item, i) => ({ item, rank: i + 1, phase: "late" as const })),
  ]

  return (
    <section aria-labelledby="counter-items-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
          <Package className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h2 id="counter-items-heading" className="text-xl font-bold text-foreground">
            {"ไอเทมแก้ทาง"}{" "}
            <span className="text-sm font-normal text-muted-foreground">({allItems.length} {"ชิ้น"})</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {"ไอเทมที่เลือกมาแก้ทาง "}<span className="text-gold font-semibold">{enemyName}</span>
            {" (เรียงตามช่วงเกม)"}
          </p>
        </div>
      </div>

      {/* Phase filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">{"แสดง:"}</span>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400"
          aria-label="ไอเทมต้นเกม"
        >
          <Clock className="h-3.5 w-3.5" />
          {"ต้นเกม"} ({earlyItems.length})
        </button>
        <span className="text-muted-foreground text-xs">+</span>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold"
          aria-label="ไอเทมท้ายเกม"
        >
          <Trophy className="h-3.5 w-3.5" />
          {"ท้ายเกม"} ({lateItems.length})
        </button>
      </div>

      {/* Early Game Section */}
      {earlyItems.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-bold text-foreground">{"ช่วงต้นเกม"}</h3>
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{earlyItems.length} {"ชิ้น"}</span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {earlyItems.map((item, i) => (
              <ItemCard key={`early-${item.id}`} item={item} rank={i + 1} phase="early" />
            ))}
          </div>
        </div>
      )}

      {/* Late Game Section */}
      {lateItems.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-gold" />
            <h3 className="text-lg font-bold text-foreground">{"ช่วงท้ายเกม"}</h3>
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">{lateItems.length} {"ชิ้น"}</span>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {lateItems.map((item, i) => (
              <ItemCard key={`late-${item.id}`} item={item} rank={i + 1} phase="late" />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
