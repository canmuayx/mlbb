"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { HeroSearch } from "@/components/hero-search"
import { CounterPicks } from "@/components/counter-picks"
import { CounterItems } from "@/components/counter-items"
import { EmptyState } from "@/components/empty-state"
import { SelectedHeroBanner } from "@/components/selected-hero-banner"
import { getCounterDataWithCustomItems, type Hero, type CounterRule, type ItemCounterRule, type ItemDef } from "@/lib/mlbb-data"
import { getCustomRules, getItemCounterRules, getCustomHeroes, getCustomItemDefs, getBaseHeroOverrides, getBaseItemOverrides } from "@/lib/custom-rules-store"
import { AlertCircle } from "lucide-react"

export default function MLBBDashboard() {
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [customRules, setCustomRules] = useState<CounterRule[]>([])
  const [itemCounterRules, setItemCounterRules] = useState<ItemCounterRule[]>([])
  const [customHeroes, setCustomHeroes] = useState<Hero[]>([])
  const [customItemDefs, setCustomItemDefs] = useState<ItemDef[]>([])
  const [baseHeroOverrides, setBaseHeroOverrides] = useState<Record<string, Partial<Hero>>>({})
  const [baseItemOverrides, setBaseItemOverrides] = useState<Record<string, Partial<ItemDef>>>({})

  useEffect(() => {
    setCustomRules(getCustomRules())
    setItemCounterRules(getItemCounterRules())
    setCustomHeroes(getCustomHeroes())
    setCustomItemDefs(getCustomItemDefs())
    setBaseHeroOverrides(getBaseHeroOverrides())
    setBaseItemOverrides(getBaseItemOverrides())
  }, [])

  const counterData = selectedHero
    ? getCounterDataWithCustomItems(
        selectedHero.id,
        customRules.length > 0 ? customRules : undefined,
        itemCounterRules.length > 0 ? itemCounterRules : undefined,
        customHeroes.length > 0 ? customHeroes : undefined,
        customItemDefs.length > 0 ? customItemDefs : undefined,
        Object.keys(baseHeroOverrides).length > 0 ? baseHeroOverrides : undefined,
        Object.keys(baseItemOverrides).length > 0 ? baseItemOverrides : undefined
      )
    : null

  function handleSelectHero(hero: Hero | null) {
    setSelectedHero(hero)
  }

  function handleClearHero() {
    setSelectedHero(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Search Section */}
        <section className="mb-8" aria-label="ค้นหาฮีโร่">
          <HeroSearch onSelectHero={handleSelectHero} selectedHero={selectedHero} customHeroes={customHeroes} baseHeroOverrides={baseHeroOverrides} />
        </section>

        {/* Selected Hero Banner */}
        {selectedHero && (
          <section className="mb-8 animate-in fade-in slide-in-from-top-2 duration-300">
            <SelectedHeroBanner hero={selectedHero} onClear={handleClearHero} />
          </section>
        )}

        {/* Content */}
        {!selectedHero && <EmptyState />}

        {selectedHero && !counterData && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center animate-in fade-in duration-300">
            <AlertCircle className="mb-4 h-12 w-12 text-gold/50" />
            <h3 className="mb-2 text-xl font-bold text-foreground">{"ยังไม่มีข้อมูลแก้ทาง"}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {"ข้อมูล Counter Pick สำหรับ "}<span className="text-gold font-semibold">{selectedHero.name}</span>{" ยังไม่พร้อมใช้งาน กรุณาลองฮีโร่อื่น"}
            </p>
          </div>
        )}

        {selectedHero && counterData && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CounterPicks counters={counterData.counters} enemyName={selectedHero.name} />
            <CounterItems
              earlyItems={counterData.earlyItems}
              lateItems={counterData.lateItems}
              enemyName={selectedHero.name}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            {"MLBB Counter Pick Advisor - ข้อมูลอ้างอิงจากสถิติการเล่นและ Meta ปัจจุบัน"}
          </p>
        </div>
      </footer>
    </div>
  )
}
