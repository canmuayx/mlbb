"use client"

import { Shield, Swords, TrendingUp } from "lucide-react"
import { ROLE_COLORS, ROLE_BG_COLORS, type CounterPick } from "@/lib/mlbb-data"

interface CounterPicksProps {
  counters: CounterPick[]
  enemyName: string
}

const DIFFICULTY_STYLES = {
  Easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
}

const DIFFICULTY_LABEL = {
  Easy: "ง่าย",
  Medium: "ปานกลาง",
  Hard: "ยาก",
}

export function CounterPicks({ counters, enemyName }: CounterPicksProps) {
  return (
    <section aria-labelledby="counter-picks-heading">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
          <Swords className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h2 id="counter-picks-heading" className="text-xl font-bold text-foreground">
            {"ฮีโร่แก้ทาง"}{" "}
            <span className="text-sm font-normal text-muted-foreground">({counters.length} {"ตัว"})</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            {"ฮีโร่ที่แนะนำสำหรับสู้กับ "}<span className="text-gold font-semibold">{enemyName}</span>
            {" (เรียงตามความเหมาะสม)"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {counters.map((counter, i) => (
          <article
            key={counter.hero.id}
            className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5"
          >
            {/* Rank badge */}
            <div className="absolute right-3 top-3 z-10">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                #{i + 1}
              </span>
            </div>

            {/* Hero header */}
            <div className={`bg-gradient-to-r ${ROLE_BG_COLORS[counter.hero.role]} p-4 pb-3`}>
              <div className="flex items-center gap-3">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-black/30 overflow-hidden border border-foreground/10">
                  <img
                    src={counter.hero.image}
                    alt={counter.hero.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget
                      target.style.display = "none"
                      const parent = target.parentElement
                      if (parent) {
                        const fallback = document.createElement("span")
                        fallback.className = "font-mono text-lg font-bold text-foreground"
                        fallback.textContent = counter.hero.icon
                        parent.appendChild(fallback)
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{counter.hero.name}</h3>
                  <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[counter.hero.role]}`}>
                    {counter.hero.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-muted-foreground">{"อัตราชนะ"}</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">{counter.winRate}%</span>
              </div>

              {/* Win rate bar */}
              <div className="mb-3 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${counter.winRate}%` }}
                />
              </div>

              {/* Difficulty */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{"ความยาก"}</span>
                </div>
                <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${DIFFICULTY_STYLES[counter.difficulty]}`}>
                  {DIFFICULTY_LABEL[counter.difficulty]}
                </span>
              </div>

              {/* Reason */}
              <div className="rounded-lg bg-muted/50 p-3 border border-border/50">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {counter.reason}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
