"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, Plus, X, ChevronUp, ChevronDown, Download, Upload, RotateCcw, Shield, Swords, TreePine, Zap, Coins, Crown, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { HEROES } from "@/lib/mlbb-data"
import type { TierRank, LaneType } from "@/lib/tier-list-data"
import {
  getTierMap, saveTierMap, getTierMeta, saveTierMeta, resetTierData,
  moveHeroTier, addHeroToTier, removeHeroFromLane, getHeroesNotInLane,
  exportTierData, importTierData,
  type LaneTierMap, type TierListMeta
} from "@/lib/tier-list-store"

const TIERS: TierRank[] = ["SS", "S", "A", "B", "C", "D"]
const LANES: { key: LaneType; label: string; icon: React.ReactNode; color: string }[] = [
  { key: "Roam", label: "โรมมิ่ง", icon: <Shield className="h-4 w-4" />, color: "text-cyan-400" },
  { key: "Exp", label: "เลนประสบการณ์", icon: <Swords className="h-4 w-4" />, color: "text-orange-400" },
  { key: "Jungle", label: "ป่า", icon: <TreePine className="h-4 w-4" />, color: "text-emerald-400" },
  { key: "Mid", label: "เลนกลาง", icon: <Zap className="h-4 w-4" />, color: "text-purple-400" },
  { key: "Gold", label: "เลนทอง", icon: <Coins className="h-4 w-4" />, color: "text-yellow-400" },
]

const TIER_COLORS: Record<TierRank, { bg: string; text: string; border: string }> = {
  SS: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  S: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  A: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/30" },
  B: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  C: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  D: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/30" },
}

interface Props {
  showToast: (message: string, type: "success" | "error") => void
}

export function AdminTierList({ showToast }: Props) {
  const [tierMap, setTierMap] = useState<LaneTierMap>(getTierMap)
  const [meta, setMeta] = useState<TierListMeta>(getTierMeta)
  const [activeLane, setActiveLane] = useState<LaneType>("Roam")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [addToTier, setAddToTier] = useState<TierRank>("S")
  const [heroSearch, setHeroSearch] = useState("")
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState("")
  const [metaOpen, setMetaOpen] = useState(false)
  const [editPatch, setEditPatch] = useState(meta.patch)
  const [editSource, setEditSource] = useState(meta.source)

  // Refresh from store
  const refreshData = useCallback(() => {
    setTierMap(getTierMap())
    setMeta(getTierMeta())
  }, [])

  const heroesInLane = useMemo(() => {
    const result: { tier: TierRank; heroes: { id: string; name: string; image: string; role: string }[] }[] = []
    for (const t of TIERS) {
      const ids = tierMap[activeLane]?.[t] ?? []
      const heroes = ids.map((id) => {
        const h = HEROES.find((hero) => hero.id === id)
        return h ? { id: h.id, name: h.name, image: h.image, role: h.role } : { id, name: id, image: "", role: "" }
      })
      result.push({ tier: t, heroes })
    }
    return result
  }, [tierMap, activeLane])

  const availableHeroes = useMemo(() => {
    const available = getHeroesNotInLane(activeLane)
    if (!heroSearch.trim()) return available
    return available.filter((h) =>
      h.name.toLowerCase().includes(heroSearch.toLowerCase())
    )
  }, [activeLane, tierMap, heroSearch])

  const handleMoveTier = (heroId: string, fromTier: TierRank, toTier: TierRank) => {
    const updated = moveHeroTier(activeLane, heroId, fromTier, toTier)
    setTierMap({ ...updated })
    // Update timestamp
    const newMeta = { ...meta, updatedAt: new Date().toISOString() }
    saveTierMeta(newMeta)
    setMeta(newMeta)
  }

  const handleAddHero = (heroId: string) => {
    const updated = addHeroToTier(activeLane, addToTier, heroId)
    setTierMap({ ...updated })
    const newMeta = { ...meta, updatedAt: new Date().toISOString() }
    saveTierMeta(newMeta)
    setMeta(newMeta)
    showToast(`เพิ่มฮีโร่ในเทียร์ ${addToTier} แล้ว`, "success")
  }

  const handleRemoveHero = (heroId: string) => {
    const updated = removeHeroFromLane(activeLane, heroId)
    setTierMap({ ...updated })
    const newMeta = { ...meta, updatedAt: new Date().toISOString() }
    saveTierMeta(newMeta)
    setMeta(newMeta)
    showToast("ลบฮีโร่ออกจากเลนแล้ว", "success")
  }

  const handleSaveMeta = () => {
    const newMeta = { ...meta, patch: editPatch, source: editSource, updatedAt: new Date().toISOString() }
    saveTierMeta(newMeta)
    setMeta(newMeta)
    setMetaOpen(false)
    showToast("บันทึกข้อมูลแพทช์แล้ว", "success")
  }

  const handleExport = () => {
    const json = exportTierData()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `mlbb-tier-list-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast("Export tier list สำเร็จ", "success")
  }

  const handleImport = () => {
    if (importTierData(importText)) {
      refreshData()
      setImportOpen(false)
      setImportText("")
      showToast("Import tier list สำเร็จ", "success")
    } else {
      showToast("ข้อมูล JSON ไม่ถูกต้อง", "error")
    }
  }

  const handleReset = () => {
    resetTierData()
    refreshData()
    showToast("รีเซ็ต tier list เป็นค่าเริ่มต้นแล้ว", "success")
  }

  const totalHeroesInLane = heroesInLane.reduce((sum, t) => sum + t.heroes.length, 0)

  return (
    <div>
      {/* Toolbar */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {"แพทช์: "}
                <span className="font-bold text-gold">{meta.patch}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {"| อัพเดท: "}
                <span className="text-foreground">
                  {new Date(meta.updatedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => { setMetaOpen(true); setEditPatch(meta.patch); setEditSource(meta.source) }} className="border-border text-xs gap-1.5">
                <Pencil className="h-3 w-3" />
                {"แก้ไข Patch"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="border-border text-xs gap-1.5">
                <Download className="h-3 w-3" />
                {"Export"}
              </Button>
              <Dialog open={importOpen} onOpenChange={setImportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-border text-xs gap-1.5">
                    <Upload className="h-3 w-3" />
                    {"Import"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">{"Import Tier List"}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">{"วาง JSON ที่ Export ไว้เพื่อ Import ข้อมูล tier list"}</DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder='{"tierMap":...,"meta":...}'
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    className="min-h-[150px] bg-background border-border text-foreground font-mono text-xs"
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setImportOpen(false)} className="border-border">{"ยกเลิก"}</Button>
                    <Button onClick={handleImport} className="bg-gold text-primary-foreground hover:bg-gold-light">{"Import"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-destructive/30 text-destructive text-xs gap-1.5">
                    <RotateCcw className="h-3 w-3" />
                    {"รีเซ็ต"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-card border-border">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-foreground">{"รีเซ็ต Tier List?"}</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">{"จะคืนค่า tier list ทั้งหมดเป็นค่าเริ่มต้น การแก้ไขที่ทำไว้จะหายทั้งหมด"}</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-border">{"ยกเลิก"}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">{"รีเซ็ต"}</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {/* Meta dialog */}
      <Dialog open={metaOpen} onOpenChange={setMetaOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">{"แก้ไขข้อมูล Patch"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">{"Patch"}</Label>
              <Input value={editPatch} onChange={(e) => setEditPatch(e.target.value)} className="bg-background border-border text-foreground" placeholder="เช่น Patch 1.9.48" />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">{"แหล่งข้อมูล"}</Label>
              <Input value={editSource} onChange={(e) => setEditSource(e.target.value)} className="bg-background border-border text-foreground" placeholder="เช่น mlbb.io" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMetaOpen(false)} className="border-border">{"ยกเลิก"}</Button>
            <Button onClick={handleSaveMeta} className="bg-gold text-primary-foreground hover:bg-gold-light">{"บันทึก"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Lane tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {LANES.map((lane) => {
            const isActive = activeLane === lane.key
            const count = TIERS.reduce((sum, t) => sum + (tierMap[lane.key]?.[t]?.length ?? 0), 0)
            return (
              <button
                key={lane.key}
                onClick={() => setActiveLane(lane.key)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-gold text-primary-foreground shadow-lg shadow-gold/20"
                    : "border border-border bg-card text-muted-foreground hover:border-gold/30 hover:text-foreground"
                }`}
              >
                <span className={isActive ? "" : lane.color}>{lane.icon}</span>
                {lane.label}
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${isActive ? "border-primary-foreground/30 text-primary-foreground" : "border-border"}`}>
                  {count}
                </Badge>
              </button>
            )
          })}
        </div>

        {/* Add hero button */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {LANES.find((l) => l.key === activeLane)?.label} - {totalHeroesInLane} {"ฮีโร่"}
          </span>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gold text-primary-foreground hover:bg-gold-light text-xs gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {"เพิ่มฮีโร่"}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-foreground">{"เพิ่มฮีโร่ใน "}{LANES.find((l) => l.key === activeLane)?.label}</DialogTitle>
                <DialogDescription className="text-muted-foreground">{"เลือกเทียร์แล้วกดที่ฮีโร่เพื่อเพิ่ม"}</DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-3">
                <Label className="text-foreground text-xs shrink-0">{"เทียร์:"}</Label>
                <Select value={addToTier} onValueChange={(v) => setAddToTier(v as TierRank)}>
                  <SelectTrigger className="w-24 bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาฮีโร่..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="pl-9 bg-background border-border text-foreground"
                />
              </div>
              <div className="flex-1 overflow-y-auto min-h-0 max-h-[40vh]">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {availableHeroes.map((hero) => (
                    <button
                      key={hero.id}
                      onClick={() => handleAddHero(hero.id)}
                      className="flex flex-col items-center gap-1 rounded-lg border border-border/50 bg-background p-2 transition-all hover:border-gold/40 hover:bg-gold/5"
                    >
                      <div className="h-10 w-10 overflow-hidden rounded-lg border border-border/50 bg-navy">
                        {hero.image ? (
                          <img src={hero.image} alt={hero.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">{hero.name.substring(0, 2)}</div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-foreground truncate max-w-full">{hero.name}</span>
                      <span className="text-[8px] text-muted-foreground">{hero.role}</span>
                    </button>
                  ))}
                  {availableHeroes.length === 0 && (
                    <div className="col-span-full py-6 text-center text-sm text-muted-foreground">
                      {"ฮีโร่ทั้งหมดอยู่ในเลนนี้แล้ว"}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tier rows */}
        <div className="space-y-3">
          {heroesInLane.map(({ tier, heroes }) => {
            const colors = TIER_COLORS[tier]
            const tierIdx = TIERS.indexOf(tier)

            return (
              <div key={tier} className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
                <div className="flex">
                  {/* Tier label */}
                  <div className={`flex w-16 shrink-0 flex-col items-center justify-center border-r ${colors.border} px-2 py-3 sm:w-20`}>
                    <span className={`text-xl font-black ${colors.text} sm:text-2xl`}>{tier}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{heroes.length}</span>
                  </div>

                  {/* Heroes */}
                  <div className="flex-1 p-2 sm:p-3">
                    {heroes.length === 0 ? (
                      <div className="flex items-center justify-center py-3 text-xs text-muted-foreground">{"ว่าง - กด 'เพิ่มฮีโร่' เพื่อเพิ่ม"}</div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {heroes.map((hero) => (
                          <div key={hero.id} className="group relative flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 px-2 py-1.5 transition-all hover:border-gold/30">
                            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border/50 bg-navy">
                              {hero.image ? (
                                <img src={hero.image} alt={hero.name} className="h-full w-full object-cover" crossOrigin="anonymous" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted-foreground">{hero.name.substring(0, 2)}</div>
                              )}
                            </div>
                            <span className="text-xs font-medium text-foreground max-w-[60px] truncate sm:max-w-[80px]">{hero.name}</span>

                            {/* Move up/down buttons */}
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {tierIdx > 0 && (
                                <button
                                  onClick={() => handleMoveTier(hero.id, tier, TIERS[tierIdx - 1])}
                                  className="rounded p-0.5 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                                  title={`ย้ายไป ${TIERS[tierIdx - 1]}`}
                                >
                                  <ChevronUp className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {tierIdx < TIERS.length - 1 && (
                                <button
                                  onClick={() => handleMoveTier(hero.id, tier, TIERS[tierIdx + 1])}
                                  className="rounded p-0.5 text-muted-foreground hover:text-orange-400 hover:bg-orange-500/10"
                                  title={`ย้ายไป ${TIERS[tierIdx + 1]}`}
                                >
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleRemoveHero(hero.id)}
                                className="rounded p-0.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                title="ลบออก"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
