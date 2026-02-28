"use client"

import { Crosshair, Shield, Swords, Sparkles } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 sm:p-12 text-center">
      <div className="relative mb-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-navy-light/40 border border-gold/20">
          <Crosshair className="h-10 w-10 text-gold" />
        </div>
        <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold/20">
          <Sparkles className="h-4 w-4 text-gold" />
        </div>
      </div>

      <h3 className="mb-2 text-xl font-bold text-foreground">{"เลือกฮีโร่ศัตรูเพื่อเริ่มต้น"}</h3>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
        {"ค้นหาฮีโร่ศัตรูจากแถบค้นหาด้านบน แล้วเราจะแนะนำฮีโร่และไอเทมที่เหมาะสมในการแก้ทาง"}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full max-w-lg">
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-4">
          <Swords className="h-6 w-6 text-gold/60" />
          <span className="text-xs text-muted-foreground text-center">{"แนะนำฮีโร่แก้ทาง"}</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-4">
          <Shield className="h-6 w-6 text-gold/60" />
          <span className="text-xs text-muted-foreground text-center">{"ไอเทมต้นเกม"}</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/30 p-4">
          <Sparkles className="h-6 w-6 text-gold/60" />
          <span className="text-xs text-muted-foreground text-center">{"ไอเทมท้ายเกม"}</span>
        </div>
      </div>
    </div>
  )
}
