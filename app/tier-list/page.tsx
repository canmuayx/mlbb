"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Crown, ExternalLink, RefreshCw, Shield, Swords, TreePine, Zap, Coins } from "lucide-react"
import type { TierListData } from "@/lib/tier-list-data"
import { getStoreTierListData } from "@/lib/tier-list-store"
import { TierListGrid } from "@/components/tier-list-grid"
import { CountdownTimer } from "@/components/countdown-timer"
import { Gamepad2 } from "lucide-react"

export default function TierListPage() {
  const [data, setData] = useState<TierListData | null>(null)

  useEffect(() => {
    setData(getStoreTierListData())
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-sm">{"Loading..."}</div>
      </div>
    )
  }

  const updatedDate = new Date(data.updatedAt)
  const formattedDate = updatedDate.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/4 h-48 w-96 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -top-24 right-1/4 h-48 w-96 rounded-full bg-navy-light/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-light shadow-lg shadow-gold/20 transition-transform hover:scale-105">
                <Gamepad2 className="h-6 w-6 text-primary-foreground" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
                  <Crown className="inline h-6 w-6 text-gold mr-2 -mt-1" />
                  <span className="text-gold">MLBB</span>{" Tier List"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {"จัดอันดับฮีโร่ตามเลน - Mythic+ Pro Mode - อ้างอิง mlbb.io"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:border-gold/30 hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {"Counter Pick"}
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2 text-xs font-bold text-gold transition-all hover:border-gold/50 hover:bg-gold/10"
              >
                {"Admin"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Info Bar */}
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            {/* Last updated */}
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">{"อัพเดทล่าสุด"}</span>
                <span className="text-xs font-medium text-foreground">{formattedDate}</span>
              </div>
            </div>

            {/* Patch */}
            <div className="flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold/20 text-[8px] font-black text-gold">{"P"}</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">{"แพทช์"}</span>
                <span className="text-xs font-medium text-foreground">{data.patch}</span>
              </div>
            </div>

            {/* Source */}
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground">{"แหล่งข้อมูล"}</span>
                <a
                  href="https://mlbb.gg/tierlist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {data.source}
                </a>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <CountdownTimer targetDate={data.nextUpdateAt} />
        </div>

        {/* Lane overview cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {data.lanes.map((lane) => {
            const icons: Record<string, React.ReactNode> = {
              Roam: <Shield className="h-5 w-5" />,
              Exp: <Swords className="h-5 w-5" />,
              Jungle: <TreePine className="h-5 w-5" />,
              Mid: <Zap className="h-5 w-5" />,
              Gold: <Coins className="h-5 w-5" />,
            }
            const colors: Record<string, string> = {
              Roam: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
              Exp: "text-orange-400 border-orange-500/20 bg-orange-500/5",
              Jungle: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
              Mid: "text-purple-400 border-purple-500/20 bg-purple-500/5",
              Gold: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
            }
            const totalHeroes = lane.tiers.reduce((acc, t) => acc + t.heroes.length, 0)
            const topHeroes = lane.tiers.find((t) => t.tier === "SS")?.heroes ?? []

            return (
              <div key={lane.lane} className={`rounded-xl border p-3 ${colors[lane.lane]}`}>
                <div className="flex items-center gap-2 mb-2">
                  {icons[lane.lane]}
                  <span className="text-xs font-bold">{lane.label}</span>
                </div>
                <div className="text-[10px] text-muted-foreground mb-1">{totalHeroes} {"ฮีโร่"}</div>
                {topHeroes.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {topHeroes.slice(0, 3).map((hero) => (
                      <span key={hero.id} className="rounded-full bg-background/50 px-1.5 py-0.5 text-[9px] font-medium text-foreground">
                        {hero.name}
                      </span>
                    ))}
                    {topHeroes.length > 3 && (
                      <span className="rounded-full bg-background/50 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                        {`+${topHeroes.length - 3}`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Tier explanation */}
        <div className="mb-6 flex flex-wrap gap-2">
          {(["SS", "S", "A", "B", "C", "D"] as const).map((tier) => {
            const labels: Record<string, string> = {
              SS: "OP / Ban ทุกเกม",
              S: "แข็งแกร่งมาก",
              A: "ดี ใช้ได้ทุกแมทช์",
              B: "ปานกลาง",
              C: "ต่ำกว่าค่าเฉลี่ย",
              D: "อ่อน / ต้อง Buff",
            }
            const colors: Record<string, string> = {
              SS: "border-red-500/30 bg-red-500/10 text-red-400",
              S: "border-orange-500/30 bg-orange-500/10 text-orange-400",
              A: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
              B: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
              C: "border-blue-500/30 bg-blue-500/10 text-blue-400",
              D: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
            }
            return (
              <div key={tier} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${colors[tier]}`}>
                <span className="font-black">{tier}</span>
                <span className="opacity-70">{labels[tier]}</span>
              </div>
            )
          })}
        </div>

        {/* Tier List Grid */}
        <TierListGrid lanes={data.lanes} overall={data.overall} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            {"MLBB Tier List - Mythic+ Pro Mode - จัดการผ่านหน้า Admin"}
          </p>
        </div>
      </footer>
    </div>
  )
}
