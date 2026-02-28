"use client"

import { useState } from "react"
import Link from "next/link"
import { Shield, Swords, TreePine, Zap, Coins } from "lucide-react"
import { ROLE_COLORS } from "@/lib/mlbb-data"
import type { TierEntry, TierHero, TierRank, LaneTierList, LaneType } from "@/lib/tier-list-data"
import type { HeroRole } from "@/lib/mlbb-data"

const TIER_COLORS: Record<TierRank, { bg: string; text: string; border: string; glow: string; barBg: string }> = {
  SS: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30", glow: "shadow-red-500/5", barBg: "bg-red-500/20" },
  S: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30", glow: "shadow-orange-500/5", barBg: "bg-orange-500/20" },
  A: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30", glow: "shadow-yellow-500/5", barBg: "bg-yellow-500/20" },
  B: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", glow: "shadow-emerald-500/5", barBg: "bg-emerald-500/20" },
  C: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30", glow: "shadow-blue-500/5", barBg: "bg-blue-500/20" },
  D: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30", glow: "shadow-zinc-500/5", barBg: "bg-zinc-500/20" },
}

const TIER_LABELS: Record<TierRank, string> = {
  SS: "OP / Ban",
  S: "Very Strong",
  A: "Strong",
  B: "Average",
  C: "Below Avg",
  D: "Weak",
}

const LANE_ICONS: Record<LaneType, React.ReactNode> = {
  Roam: <Shield className="h-4 w-4" />,
  Exp: <Swords className="h-4 w-4" />,
  Jungle: <TreePine className="h-4 w-4" />,
  Mid: <Zap className="h-4 w-4" />,
  Gold: <Coins className="h-4 w-4" />,
}

const LANE_COLORS: Record<LaneType, string> = {
  Roam: "text-cyan-400",
  Exp: "text-orange-400",
  Jungle: "text-emerald-400",
  Mid: "text-purple-400",
  Gold: "text-yellow-400",
}

interface TierListGridProps {
  lanes: LaneTierList[]
  overall: TierEntry[]
}

type TabKey = "all" | LaneType

export function TierListGrid({ lanes, overall }: TierListGridProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const tabs: { key: TabKey; label: string; icon?: React.ReactNode; thLabel?: string }[] = [
    { key: "all", label: "All Lanes", thLabel: "ทุกเลน" },
    ...lanes.map((l) => ({
      key: l.lane as TabKey,
      label: l.lane,
      icon: LANE_ICONS[l.lane],
      thLabel: l.label,
    })),
  ]

  const activeTiers =
    activeTab === "all"
      ? overall
      : lanes.find((l) => l.lane === activeTab)?.tiers ?? []

  const filteredTiers = searchQuery.trim()
    ? activeTiers
        .map((entry) => ({
          ...entry,
          heroes: entry.heroes.filter((hero) =>
            hero.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((entry) => entry.heroes.length > 0)
    : activeTiers.filter((entry) => entry.heroes.length > 0)

  return (
    <div className="space-y-6">
      {/* Lane Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                isActive
                  ? "bg-gold text-primary-foreground shadow-lg shadow-gold/20"
                  : "border border-border bg-card text-muted-foreground hover:border-gold/30 hover:text-foreground"
              }`}
            >
              {tab.icon && <span className={isActive ? "" : LANE_COLORS[tab.key as LaneType] ?? ""}>{tab.icon}</span>}
              <span className="hidden sm:inline">{tab.thLabel ?? tab.label}</span>
              <span className="sm:hidden">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="ค้นหาฮีโร่..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 sm:max-w-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
          >
            {"ล้าง"}
          </button>
        )}
      </div>

      {/* Active Lane Info */}
      {activeTab !== "all" && (
        <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-4 py-2">
          <span className={LANE_COLORS[activeTab]}>{LANE_ICONS[activeTab]}</span>
          <span className="text-sm font-bold text-foreground">
            {lanes.find((l) => l.lane === activeTab)?.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {" - Mythic+ Pro Mode"}
          </span>
        </div>
      )}

      {/* Tier Rows */}
      <div className="space-y-3">
        {filteredTiers.map((entry) => (
          <TierRow key={entry.tier} entry={entry} />
        ))}
        {filteredTiers.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">{"ไม่พบฮีโร่ที่ค้นหา"}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function TierRow({ entry }: { entry: TierEntry }) {
  const colors = TIER_COLORS[entry.tier]

  if (entry.heroes.length === 0) return null

  return (
    <div className={`flex rounded-xl border ${colors.border} ${colors.bg} overflow-hidden shadow-lg ${colors.glow}`}>
      {/* Tier label */}
      <div className={`flex w-16 shrink-0 flex-col items-center justify-center ${colors.barBg} border-r ${colors.border} px-2 py-4 sm:w-20`}>
        <span className={`text-2xl font-black ${colors.text} sm:text-3xl`}>{entry.tier}</span>
        <span className={`text-[9px] ${colors.text} opacity-70 text-center leading-tight mt-1`}>
          {TIER_LABELS[entry.tier]}
        </span>
        <span className="mt-1 text-[9px] text-muted-foreground">{entry.heroes.length}</span>
      </div>

      {/* Hero cards */}
      <div className="flex flex-1 flex-wrap gap-2 p-3 sm:gap-3 sm:p-4">
        {entry.heroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </div>
    </div>
  )
}

function HeroCard({ hero }: { hero: TierHero }) {
  const roleColor = ROLE_COLORS[hero.role as HeroRole] ?? "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"

  return (
    <Link
      href={`/?hero=${hero.id}`}
      className="group flex flex-col items-center gap-1.5 rounded-lg border border-border/50 bg-card/60 p-2 transition-all hover:border-gold/40 hover:bg-card hover:shadow-md hover:shadow-gold/5 sm:p-3"
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border/50 bg-navy sm:h-12 sm:w-12">
        {hero.image ? (
          <img
            src={hero.image}
            alt={hero.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
            crossOrigin="anonymous"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-muted-foreground">
            {hero.icon}
          </div>
        )}
      </div>
      <span className="max-w-[72px] truncate text-center text-[10px] font-medium text-foreground group-hover:text-gold sm:max-w-[80px] sm:text-xs">
        {hero.name}
      </span>
      <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-bold ${roleColor}`}>
        {hero.role}
      </span>
    </Link>
  )
}
