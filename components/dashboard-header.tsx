"use client"

import Link from "next/link"
import { Gamepad2, Zap, Settings, Shield, Package, Crown } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="relative overflow-hidden border-b border-border bg-card">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 h-48 w-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -top-24 right-1/4 h-48 w-96 rounded-full bg-navy-light/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-gold-light shadow-lg shadow-gold/20">
              <Gamepad2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                <span className="text-gold">MLBB</span> Counter Pick
              </h1>
              <p className="text-sm text-muted-foreground">
                {"by. BEARKI.ft PECH & TEAR"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/tier-list"
              className="group flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2 text-gold transition-all hover:border-gold/50 hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/10"
            >
              <Crown className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">{"Tier List"}</span>
                <span className="text-[10px] text-gold/70 hidden sm:block">{"จัดอันดับฮีโร่"}</span>
              </div>
            </Link>
            <Link
              href="/admin"
              className="group flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2 text-gold transition-all hover:border-gold/50 hover:bg-gold/10 hover:shadow-lg hover:shadow-gold/10"
            >
              <Settings className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">{"Admin Panel"}</span>
                <span className="text-[10px] text-gold/70 hidden sm:block">{"จัดการ Rules / ไอเทม"}</span>
              </div>
            </Link>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <Zap className="h-4 w-4 text-gold" />
              <span className="text-xs font-medium text-gold">{"Patch 2.10"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
