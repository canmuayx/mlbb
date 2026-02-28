"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft, Plus, Pencil, Trash2, Download, Upload, RotateCcw,
  Search, Filter, ChevronDown, ChevronUp, Shield, Swords, AlertTriangle,
  Package, Home, Users, ImagePlus, Tag, Lock, Eye, EyeOff, LogOut, Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import {
  HEROES, COUNTER_RULES, getAllTags, getMatchingHeroNames, getAllItems, getItemById,
  getAllHeroes, getAllItemDefs, getBaseHeroes, getBaseItemDefs, getHeroById,
  type CounterRule, type CounterItem, type ItemCounterRule, type ItemPhase,
  type Hero, type HeroRole, type ItemDef
} from "@/lib/mlbb-data"
import { AdminTierList } from "@/components/admin-tier-list"
import {
  getCustomRules, saveCustomRules, addCustomRule,
  updateCustomRule, deleteCustomRule, resetCustomRules,
  exportRulesToJSON, importRulesFromJSON,
  getItemCounterRules, addItemCounterRule,
  updateItemCounterRule, deleteItemCounterRule, resetItemCounterRules,
  getCustomHeroes, addCustomHero, updateCustomHero, deleteCustomHero, resetCustomHeroes,
  getCustomItemDefs, addCustomItemDef, updateCustomItemDef, deleteCustomItemDef, resetCustomItemDefs,
  getBaseHeroOverrides, setBaseHeroOverride, removeBaseHeroOverride, resetBaseHeroOverrides,
  getBaseItemOverrides, setBaseItemOverride, removeBaseItemOverride, resetBaseItemOverrides
} from "@/lib/custom-rules-store"

type RuleSource = "base" | "custom"
interface DisplayRule extends CounterRule {
  source: RuleSource
  originalIndex: number
}

type AdminTab = "rules" | "items" | "heroes" | "itemdefs" | "tierlist"

const HERO_ROLES: HeroRole[] = ["Fighter", "Mage", "Marksman", "Assassin", "Tank", "Support"]

const emptyHero: Hero = {
  id: "", name: "", role: "Fighter", icon: "", image: "", tags: [],
}

const emptyItemDef: ItemDef = {
  id: "", name: "", icon: "", image: "", stat: "", price: 0,
}

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Hard: "bg-red-500/20 text-red-400 border-red-500/30",
}

const PHASE_STYLES: Record<ItemPhase, string> = {
  early: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  late: "bg-gold/20 text-gold border-gold/30",
}

// These are used outside the component, so they search base data only.
// Inside the component, use merged lookups.
function getHeroNameBase(id: string): string {
  return HEROES.find(h => h.id === id)?.name ?? id
}

const emptyRule: CounterRule = {
  enemyTags: [],
  counterId: "",
  winRate: 60,
  reason: "",
  difficulty: "Easy",
  priority: 80,
}

const emptyItemRule: ItemCounterRule = {
  itemIds: [],
  targetHeroIds: [],
  reason: "",
  phase: "early",
  priority: 80,
}

const ADMIN_SESSION_KEY = "mlbb-admin-auth"
const ADMIN_PASSWORD = "bearki"

function isSessionValid(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true"
}

export default function AdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [passwordInput, setPasswordInput] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState("")

  useEffect(() => {
    if (isSessionValid()) {
      setIsAuthenticated(true)
    }
    setAuthLoading(false)
  }, [])

  const handleLogin = () => {
    setAuthError("")
    if (!passwordInput) {
      setAuthError("กรุณาใส่รหัสผ่าน")
      return
    }
    if (passwordInput === ADMIN_PASSWORD) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true")
      setIsAuthenticated(true)
      setPasswordInput("")
    } else {
      setAuthError("รหัสผ่านไม่ถูกต้อง")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAuthenticated(false)
    setPasswordInput("")
  }

  const [activeTab, setActiveTab] = useState<AdminTab>("rules")
  const [customRules, setCustomRules] = useState<CounterRule[]>([])
  const [itemCounterRules, setItemCounterRules] = useState<ItemCounterRule[]>([])
  const [customHeroesList, setCustomHeroesList] = useState<Hero[]>([])
  const [customItemDefsList, setCustomItemDefsList] = useState<ItemDef[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSource, setFilterSource] = useState<"all" | "base" | "custom">("all")
  const [filterDifficulty, setFilterDifficulty] = useState<"all" | "Easy" | "Medium" | "Hard">("all")
  const [sortField, setSortField] = useState<"priority" | "winRate" | "difficulty">("priority")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  // Dialog states
  const [formOpen, setFormOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<CounterRule>({ ...emptyRule })
  const [tagInput, setTagInput] = useState("")
  const [showAllTags, setShowAllTags] = useState(false)

  // Item counter rule dialog states
  const [itemRuleFormOpen, setItemRuleFormOpen] = useState(false)
  const [editingItemRuleIndex, setEditingItemRuleIndex] = useState<number | null>(null)
  const [itemRuleFormData, setItemRuleFormData] = useState<ItemCounterRule>({ ...emptyItemRule })
  const [heroSearchQuery, setHeroSearchQuery] = useState("")
  const [itemSearchQuery, setItemSearchQuery] = useState("")

  // Hero management dialog states
  const [heroFormOpen, setHeroFormOpen] = useState(false)
  const [editingHeroIndex, setEditingHeroIndex] = useState<number | null>(null)
  const [heroFormData, setHeroFormData] = useState<Hero>({ ...emptyHero })
  const [heroTagInput, setHeroTagInput] = useState("")

  // Item definition dialog states
  const [itemDefFormOpen, setItemDefFormOpen] = useState(false)
  const [editingItemDefIndex, setEditingItemDefIndex] = useState<number | null>(null)
  const [itemDefFormData, setItemDefFormData] = useState<ItemDef>({ ...emptyItemDef })

  // Base override states
  const [baseHeroOverrides, setBaseHeroOverrides] = useState<Record<string, Partial<Hero>>>({})
  const [baseItemOverrides, setBaseItemOverrides] = useState<Record<string, Partial<ItemDef>>>({})
  const [editingBaseHeroId, setEditingBaseHeroId] = useState<string | null>(null)
  const [editingBaseItemId, setEditingBaseItemId] = useState<string | null>(null)

  // Import dialog
  const [importOpen, setImportOpen] = useState(false)
  const [importText, setImportText] = useState("")
  const [importError, setImportError] = useState("")

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  // Merged data: base (with overrides) + custom
  const mergedHeroes = useMemo(() => getAllHeroes(customHeroesList, baseHeroOverrides), [customHeroesList, baseHeroOverrides])
  const mergedItemDefs = useMemo(() => getAllItemDefs(customItemDefsList, baseItemOverrides), [customItemDefsList, baseItemOverrides])
  const allTags = useMemo(() => getAllTags(customHeroesList), [customHeroesList])
  const baseItems = useMemo(() => getAllItems(customItemDefsList), [customItemDefsList])

  // Apply overrides on top of base heroes/items for display
  const baseHeroesWithOverrides = useMemo(() => {
    return HEROES.map(h => {
      const ov = baseHeroOverrides[h.id]
      return ov ? { ...h, ...ov, id: h.id } : h
    })
  }, [baseHeroOverrides])

  const baseItemDefsWithOverrides = useMemo(() => {
    return getBaseItemDefs().map(i => {
      const ov = baseItemOverrides[i.id]
      return ov ? { ...i, ...ov, id: i.id } : i
    })
  }, [baseItemOverrides])

  // Lookup helpers using merged data
  const getHeroName = useCallback((id: string) => {
    return mergedHeroes.find(h => h.id === id)?.name ?? id
  }, [mergedHeroes])

  const getItemName = useCallback((id: string) => {
    return mergedItemDefs.find(i => i.id === id)?.name ?? id
  }, [mergedItemDefs])

  useEffect(() => {
    setCustomRules(getCustomRules())
    setItemCounterRules(getItemCounterRules())
    setCustomHeroesList(getCustomHeroes())
    setCustomItemDefsList(getCustomItemDefs())
    setBaseHeroOverrides(getBaseHeroOverrides())
    setBaseItemOverrides(getBaseItemOverrides())
  }, [])

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // ====== RULES LOGIC ======
  const allDisplayRules: DisplayRule[] = [
    ...COUNTER_RULES.map((r, i) => ({ ...r, source: "base" as RuleSource, originalIndex: i })),
    ...customRules.map((r, i) => ({ ...r, source: "custom" as RuleSource, originalIndex: i })),
  ]

  const filtered = allDisplayRules.filter(r => {
    if (filterSource !== "all" && r.source !== filterSource) return false
    if (filterDifficulty !== "all" && r.difficulty !== filterDifficulty) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const heroName = getHeroName(r.counterId).toLowerCase()
      const matchedNames = getMatchingHeroNames(r.enemyTags).join(" ").toLowerCase()
      const tagsStr = r.enemyTags.join(" ").toLowerCase()
      const reason = r.reason.toLowerCase()
      if (!heroName.includes(q) && !tagsStr.includes(q) && !reason.includes(q) && !r.counterId.includes(q) && !matchedNames.includes(q)) {
        return false
      }
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const mul = sortDir === "desc" ? -1 : 1
    if (sortField === "priority") return (a.priority - b.priority) * mul
    if (sortField === "winRate") return (a.winRate - b.winRate) * mul
    const dOrder = { Easy: 0, Medium: 1, Hard: 2 }
    return (dOrder[a.difficulty] - dOrder[b.difficulty]) * mul
  })

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === "desc" ? "asc" : "desc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronDown className="h-3 w-3 opacity-30" />
    return sortDir === "desc"
      ? <ChevronDown className="h-3 w-3 text-gold" />
      : <ChevronUp className="h-3 w-3 text-gold" />
  }

  // Form handlers
  const openCreateForm = () => {
    setEditingIndex(null)
    setFormData({ ...emptyRule })
    setTagInput("")
    setShowAllTags(false)
    setFormOpen(true)
  }

  const openEditForm = (rule: DisplayRule) => {
    if (rule.source === "base") return
    setEditingIndex(rule.originalIndex)
    setFormData({
      enemyTags: [...rule.enemyTags],
      counterId: rule.counterId,
      winRate: rule.winRate,
      reason: rule.reason,
      difficulty: rule.difficulty,
      priority: rule.priority,
    })
    setTagInput(rule.enemyTags.join(", "))
    setFormOpen(true)
  }

  const handleSave = () => {
    const tags = tagInput.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
    if (tags.length === 0) { showToast("Tags must not be empty", "error"); return }
    if (!formData.counterId) { showToast("Please select a counter hero", "error"); return }
    if (!formData.reason) { showToast("Please enter a reason", "error"); return }

    const rule: CounterRule = {
      ...formData,
      enemyTags: tags,
    }

    if (editingIndex !== null) {
      const updated = updateCustomRule(editingIndex, rule)
      setCustomRules(updated)
      showToast("Updated rule successfully")
    } else {
      const updated = addCustomRule(rule)
      setCustomRules(updated)
      showToast("Added new rule successfully")
    }
    setFormOpen(false)
  }

  const handleDelete = (rule: DisplayRule) => {
    if (rule.source === "base") return
    const updated = deleteCustomRule(rule.originalIndex)
    setCustomRules(updated)
    showToast("Deleted rule")
  }

  const handleReset = () => {
    resetCustomRules()
    setCustomRules([])
    showToast("Reset all custom rules")
  }

  const handleExport = () => {
    const json = exportRulesToJSON(customRules)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mlbb-custom-counter-rules.json"
    a.click()
    URL.revokeObjectURL(url)
    showToast(`Exported ${customRules.length} custom rules`)
  }

  const handleImport = () => {
    setImportError("")
    const parsed = importRulesFromJSON(importText)
    if (!parsed) {
      setImportError("Invalid JSON format. Please check the structure.")
      return
    }
    const merged = [...customRules, ...parsed]
    saveCustomRules(merged)
    setCustomRules(merged)
    setImportOpen(false)
    setImportText("")
    showToast(`Imported ${parsed.length} rules successfully`)
  }

  // ====== ITEM COUNTER RULES LOGIC ======
  const openCreateItemRuleForm = () => {
    setEditingItemRuleIndex(null)
    setItemRuleFormData({ ...emptyItemRule, itemIds: [], targetHeroIds: [] })
    setHeroSearchQuery("")
    setItemSearchQuery("")
    setItemRuleFormOpen(true)
  }

  const openEditItemRuleForm = (index: number, rule: ItemCounterRule) => {
    setEditingItemRuleIndex(index)
    setItemRuleFormData({ ...rule, itemIds: [...rule.itemIds], targetHeroIds: [...rule.targetHeroIds] })
    setHeroSearchQuery("")
    setItemSearchQuery("")
    setItemRuleFormOpen(true)
  }

  const handleSaveItemRule = () => {
    if (itemRuleFormData.itemIds.length === 0) { showToast("กรุณาเลือกไอเทมอย่างน้อย 1 ชิ้น", "error"); return }
    if (itemRuleFormData.targetHeroIds.length === 0) { showToast("กรุณาเลือกตัวละครที่จะแก้ทางอย่างน้อย 1 ตัว", "error"); return }
    if (!itemRuleFormData.reason) { showToast("กรุณาใส่เหตุผล", "error"); return }

    if (editingItemRuleIndex !== null) {
      const updated = updateItemCounterRule(editingItemRuleIndex, itemRuleFormData)
      setItemCounterRules(updated)
      showToast("อัพเดทสำเร็จ")
    } else {
      const updated = addItemCounterRule(itemRuleFormData)
      setItemCounterRules(updated)
      showToast("เพิ่มสำเร็จ")
    }
    setItemRuleFormOpen(false)
  }

  const handleDeleteItemRule = (index: number) => {
    const updated = deleteItemCounterRule(index)
    setItemCounterRules(updated)
    showToast("ลบสำเร็จ")
  }

  const handleResetItemRules = () => {
    resetItemCounterRules()
    setItemCounterRules([])
    showToast("ลบทั้งหมดสำเร็จ")
  }

  const toggleTargetHero = (heroId: string) => {
    setItemRuleFormData(d => ({
      ...d,
      targetHeroIds: d.targetHeroIds.includes(heroId)
        ? d.targetHeroIds.filter(id => id !== heroId)
        : [...d.targetHeroIds, heroId]
    }))
  }

  const toggleItemId = (itemId: string) => {
    setItemRuleFormData(d => ({
      ...d,
      itemIds: d.itemIds.includes(itemId)
        ? d.itemIds.filter(id => id !== itemId)
        : [...d.itemIds, itemId]
    }))
  }

  // ====== HERO MANAGEMENT LOGIC ======
  const openCreateHeroForm = () => {
    setEditingHeroIndex(null)
    setEditingBaseHeroId(null)
    setHeroFormData({ ...emptyHero })
    setHeroTagInput("")
    setHeroFormOpen(true)
  }

  const openEditHeroForm = (index: number, hero: Hero) => {
    setEditingHeroIndex(index)
    setEditingBaseHeroId(null)
    setHeroFormData({ ...hero, tags: [...hero.tags] })
    setHeroTagInput("")
    setHeroFormOpen(true)
  }

  const handleSaveHero = () => {
    // If editing a base hero override, delegate to that handler
    if (editingBaseHeroId) {
      handleSaveBaseHeroOverride()
      return
    }
    if (!heroFormData.name) { showToast("กรุณาใส่ชื่อตัวละคร", "error"); return }
    const hero: Hero = {
      ...heroFormData,
      id: heroFormData.id || heroFormData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      icon: heroFormData.icon || heroFormData.name.substring(0, 2).toUpperCase(),
    }
    if (editingHeroIndex !== null) {
      const updated = updateCustomHero(editingHeroIndex, hero)
      setCustomHeroesList(updated)
      showToast("อัพเดทตัวละครสำเร็จ")
    } else {
      const updated = addCustomHero(hero)
      setCustomHeroesList(updated)
      showToast("เพิ่มตัวละครสำเร็จ")
    }
    setHeroFormOpen(false)
  }

  const handleDeleteHero = (index: number) => {
    const updated = deleteCustomHero(index)
    setCustomHeroesList(updated)
    showToast("ลบตัวละครสำเร็จ")
  }

  const handleResetHeroes = () => {
    resetCustomHeroes()
    setCustomHeroesList([])
    showToast("ลบตัวละคร Custom ทั้งหมดสำเร็จ")
  }

  const addHeroTag = (tag: string) => {
    const t = tag.trim().toLowerCase()
    if (t && !heroFormData.tags.includes(t)) {
      setHeroFormData(d => ({ ...d, tags: [...d.tags, t] }))
    }
    setHeroTagInput("")
  }

  const removeHeroTag = (tag: string) => {
    setHeroFormData(d => ({ ...d, tags: d.tags.filter(t => t !== tag) }))
  }

  // ====== BASE HERO OVERRIDE LOGIC ======
  const openEditBaseHeroForm = (hero: Hero) => {
    setEditingBaseHeroId(hero.id)
    setEditingHeroIndex(null) // not editing a custom hero
    // Load from override if exists, otherwise from base
    const ov = baseHeroOverrides[hero.id]
    const merged = ov ? { ...hero, ...ov, id: hero.id } : { ...hero }
    setHeroFormData({ ...merged, tags: [...merged.tags] })
    setHeroTagInput("")
    setHeroFormOpen(true)
  }

  const handleSaveBaseHeroOverride = () => {
    if (!editingBaseHeroId) return
    const override: Partial<Hero> = {
      name: heroFormData.name,
      role: heroFormData.role,
      icon: heroFormData.icon,
      image: heroFormData.image,
      tags: [...heroFormData.tags],
    }
    const updated = setBaseHeroOverride(editingBaseHeroId, override)
    setBaseHeroOverrides({ ...updated })
    showToast("อัพเดทตัวละคร Base สำเร็จ")
    setHeroFormOpen(false)
    setEditingBaseHeroId(null)
  }

  const handleResetBaseHeroOverride = (heroId: string) => {
    const updated = removeBaseHeroOverride(heroId)
    setBaseHeroOverrides({ ...updated })
    showToast("รีเซ็ตกลับเป็นค่าเริ่มต้น")
  }

  const handleResetAllBaseHeroOverrides = () => {
    resetBaseHeroOverrides()
    setBaseHeroOverrides({})
    showToast("รีเซ็ตตัวละคร Base ทั้งหมดกลับเป็นค่าเริ่มต้น")
  }

  // ====== BASE ITEM OVERRIDE LOGIC ======
  const openEditBaseItemForm = (item: ItemDef) => {
    setEditingBaseItemId(item.id)
    setEditingItemDefIndex(null)
    const ov = baseItemOverrides[item.id]
    const merged = ov ? { ...item, ...ov, id: item.id } : { ...item }
    setItemDefFormData({ ...merged })
    setItemDefFormOpen(true)
  }

  const handleSaveBaseItemOverride = () => {
    if (!editingBaseItemId) return
    const override: Partial<ItemDef> = {
      name: itemDefFormData.name,
      icon: itemDefFormData.icon,
      image: itemDefFormData.image,
      stat: itemDefFormData.stat,
      price: itemDefFormData.price,
    }
    const updated = setBaseItemOverride(editingBaseItemId, override)
    setBaseItemOverrides({ ...updated })
    showToast("อัพเดทไอเทม Base สำเร็จ")
    setItemDefFormOpen(false)
    setEditingBaseItemId(null)
  }

  const handleResetBaseItemOverride = (itemId: string) => {
    const updated = removeBaseItemOverride(itemId)
    setBaseItemOverrides({ ...updated })
    showToast("รีเซ็ตกลับเป็นค่าเริ่มต้น")
  }

  const handleResetAllBaseItemOverrides = () => {
    resetBaseItemOverrides()
    setBaseItemOverrides({})
    showToast("รีเซ็ตไอเทม Base ทั้งหมดกลับเป็นค่าเริ่มต้น")
  }

  // ====== ITEM DEFINITION MANAGEMENT LOGIC ======
  const openCreateItemDefForm = () => {
    setEditingItemDefIndex(null)
    setEditingBaseItemId(null)
    setItemDefFormData({ ...emptyItemDef })
    setItemDefFormOpen(true)
  }

  const openEditItemDefForm = (index: number, item: ItemDef) => {
    setEditingItemDefIndex(index)
    setEditingBaseItemId(null)
    setItemDefFormData({ ...item })
    setItemDefFormOpen(true)
  }

  const handleSaveItemDef = () => {
    // If editing a base item override, delegate to that handler
    if (editingBaseItemId) {
      handleSaveBaseItemOverride()
      return
    }
    if (!itemDefFormData.name) { showToast("กรุณาใส่ชื่อไอเทม", "error"); return }
    const item: ItemDef = {
      ...itemDefFormData,
      id: itemDefFormData.id || itemDefFormData.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      icon: itemDefFormData.icon || itemDefFormData.name.substring(0, 2).toUpperCase(),
    }
    if (editingItemDefIndex !== null) {
      const updated = updateCustomItemDef(editingItemDefIndex, item)
      setCustomItemDefsList(updated)
      showToast("อัพเดทไอเทมสำเร็จ")
    } else {
      const updated = addCustomItemDef(item)
      setCustomItemDefsList(updated)
      showToast("เพิ่มไอเทมสำเร็จ")
    }
    setItemDefFormOpen(false)
  }

  const handleDeleteItemDef = (index: number) => {
    const updated = deleteCustomItemDef(index)
    setCustomItemDefsList(updated)
    showToast("ลบไอเทมสำเร็จ")
  }

  const handleResetItemDefs = () => {
    resetCustomItemDefs()
    setCustomItemDefsList([])
    showToast("ลบไอเทม Custom ทั้งหมดสำเร็จ")
  }

  const baseCount = COUNTER_RULES.length
  const customCount = customRules.length

  // Filter item counter rules by search
  const filteredItemRules = itemCounterRules.filter(rule => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    const itemNames = rule.itemIds.map(id => getItemName(id).toLowerCase()).join(" ")
    const heroNames = rule.targetHeroIds.map(id => getHeroName(id).toLowerCase()).join(" ")
    return itemNames.includes(q) || heroNames.includes(q) || rule.reason.toLowerCase().includes(q)
  }).sort((a, b) => b.priority - a.priority)

  // Loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="text-sm text-muted-foreground">{"Loading..."}</p>
        </div>
      </div>
    )
  }

  // Auth gate: login only
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
            {/* Lock icon */}
            <div className="mb-6 flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10">
                <Lock className="h-8 w-8 text-gold" />
              </div>
              <div className="text-center">
                <h1 className="text-lg font-bold text-foreground">
                  {"เข้าสู่ระบบ Admin"}
                </h1>
                <p className="mt-1 text-xs text-muted-foreground">
                  {"ใส่รหัสผ่านเพื่อเข้าหน้า Admin เฉพาะคนที่มีรหัสเท่านั้น"}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-pw" className="text-foreground text-xs">
                  {"รหัสผ่าน"}
                </Label>
                <div className="relative">
                  <Input
                    id="admin-pw"
                    type={showPassword ? "text" : "password"}
                    placeholder="ใส่รหัสผ่าน"
                    value={passwordInput}
                    onChange={(e) => { setPasswordInput(e.target.value); setAuthError("") }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLogin()
                    }}
                    className="bg-background border-border text-foreground pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {authError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2">
                  <p className="text-xs text-destructive">{authError}</p>
                </div>
              )}

              <Button
                onClick={handleLogin}
                className="w-full bg-gold text-primary-foreground hover:bg-gold-light"
              >
                <Lock className="h-4 w-4 mr-2" />
                {"เข้าสู่ระบบ"}
              </Button>
            </div>

            {/* Back link */}
            <div className="mt-4 text-center">
              <Link href="/" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors">
                <ArrowLeft className="h-3 w-3" />
                {"กลับหน้าหลัก"}
              </Link>
            </div>


          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 rounded-lg border px-4 py-3 shadow-lg transition-all ${
          toast.type === "success"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-destructive/30 bg-destructive/10 text-destructive"
        }`}>
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back to dashboard</span>
                </Button>
              </Link>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                <Shield className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  {"Admin "}<span className="text-gold">{"Panel"}</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  {"จัดการข้อมูล Counter Rules และไอเทมแก้ทาง (เพิ่ม / แก้ไข / ลบ)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/">
                <Button variant="outline" size="sm" className="border-border text-muted-foreground hover:text-foreground">
                  <Home className="h-4 w-4 mr-1" />
                  {"หน้าหลัก"}
                </Button>
              </Link>
              <Badge variant="outline" className="border-navy-light bg-navy/50 text-muted-foreground">
                Base: {baseCount}
              </Badge>
              <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold">
                Custom: {customCount}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                {"ออกจากระบบ"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-border bg-card/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => { setActiveTab("rules"); setSearchQuery("") }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "rules"
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Swords className="h-4 w-4" />
              {"Counter Rules"}
            </button>
            <button
              onClick={() => { setActiveTab("items"); setSearchQuery("") }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "items"
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Package className="h-4 w-4" />
              {"ไอเทมแก้ทาง"}
              {itemCounterRules.length > 0 && (
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-[10px] px-1.5 py-0">
                  {itemCounterRules.length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => { setActiveTab("heroes"); setSearchQuery("") }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "heroes"
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Users className="h-4 w-4" />
              {"ตัวละคร"}
              {customHeroesList.length > 0 && (
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-[10px] px-1.5 py-0">
                  +{customHeroesList.length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => { setActiveTab("itemdefs"); setSearchQuery("") }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "itemdefs"
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Tag className="h-4 w-4" />
              {"ไอเทม (รายการ)"}
              {customItemDefsList.length > 0 && (
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-[10px] px-1.5 py-0">
                  +{customItemDefsList.length}
                </Badge>
              )}
            </button>
            <button
              onClick={() => { setActiveTab("tierlist"); setSearchQuery("") }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "tierlist"
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Crown className="h-4 w-4" />
              {"Tier List"}
            </button>
          </div>
        </div>
      </div>

      {/* ====== RULES TAB ====== */}
      {activeTab === "rules" && (
        <>
          {/* Toolbar */}
          <div className="border-b border-border bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="ค้นหาตามชื่อฮีโร่, tags, reason..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-card border-border"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    <Select value={filterSource} onValueChange={(v) => setFilterSource(v as typeof filterSource)}>
                      <SelectTrigger className="w-[130px] bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="base">Base Only</SelectItem>
                        <SelectItem value="custom">Custom Only</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterDifficulty} onValueChange={(v) => setFilterDifficulty(v as typeof filterDifficulty)}>
                      <SelectTrigger className="w-[130px] bg-card border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Difficulty</SelectItem>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={openCreateForm} className="bg-gold text-primary-foreground hover:bg-gold-light">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule
                  </Button>
                  <Button variant="outline" onClick={handleExport} disabled={customCount === 0} className="border-border">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Dialog open={importOpen} onOpenChange={setImportOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-border">
                        <Upload className="h-4 w-4 mr-1" />
                        Import
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-card border-border sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle className="text-foreground">Import Counter Rules</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          {"วาง JSON ของ Counter Rules ที่ export ไว้ เพื่อ import เข้ามาเพิ่ม"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <Textarea
                          placeholder={'[\n  {\n    "enemyTags": ["dash"],\n    "counterId": "khufra",\n    "winRate": 65,\n    "reason": "...",\n    "difficulty": "Easy",\n    "priority": 90\n  }\n]'}
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                          className="min-h-[200px] font-mono text-sm bg-background border-border text-foreground"
                        />
                        {importError && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" /> {importError}
                          </p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setImportOpen(false)} className="border-border">Cancel</Button>
                        <Button onClick={handleImport} className="bg-gold text-primary-foreground hover:bg-gold-light">Import</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={customCount === 0} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reset
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">Reset Custom Rules?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          {"จะลบ Custom Rules ทั้งหมด ("}{customCount}{" rules) กลับไปใช้เฉพาะ Base Rules เท่านั้น action นี้ไม่สามารถย้อนกลับได้"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Reset All
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>

          {/* Rules Table */}
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground w-[80px]">Source</TableHead>
                      <TableHead className="text-muted-foreground">{"ตัวละครศัตรูที่ Match"}</TableHead>
                      <TableHead className="text-muted-foreground">Counter Hero</TableHead>
                      <TableHead className="text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("winRate")}>
                        <span className="inline-flex items-center gap-1">
                          WinRate <SortIcon field="winRate" />
                        </span>
                      </TableHead>
                      <TableHead className="text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("difficulty")}>
                        <span className="inline-flex items-center gap-1">
                          Difficulty <SortIcon field="difficulty" />
                        </span>
                      </TableHead>
                      <TableHead className="text-muted-foreground cursor-pointer select-none" onClick={() => toggleSort("priority")}>
                        <span className="inline-flex items-center gap-1">
                          Priority <SortIcon field="priority" />
                        </span>
                      </TableHead>
                      <TableHead className="text-muted-foreground">Reason</TableHead>
                      <TableHead className="text-muted-foreground w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sorted.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Swords className="h-8 w-8 opacity-30" />
                            <p>{"ไม่พบ Counter Rules"}</p>
                            <p className="text-xs">{"ลองเปลี่ยน filter หรือเพิ่ม rule ใหม่"}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      sorted.map((rule, i) => {
                        const matchedHeroNames = getMatchingHeroNames(rule.enemyTags)
                        return (
                          <TableRow key={`${rule.source}-${rule.originalIndex}-${i}`} className="border-border group">
                            <TableCell>
                              <Badge variant="outline" className={
                                rule.source === "custom"
                                  ? "border-gold/30 bg-gold/10 text-gold"
                                  : "border-border bg-muted/30 text-muted-foreground"
                              }>
                                {rule.source === "custom" ? "Custom" : "Base"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[220px]">
                                {matchedHeroNames.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {matchedHeroNames.slice(0, 5).map(name => (
                                      <Badge key={name} variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                                        {name}
                                      </Badge>
                                    ))}
                                    {matchedHeroNames.length > 5 && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border bg-muted/30 text-muted-foreground" title={matchedHeroNames.slice(5).join(", ")}>
                                        +{matchedHeroNames.length - 5}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-1">
                                    {rule.enemyTags.map(tag => (
                                      <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0 border-navy-light bg-navy/50 text-muted-foreground">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                <p className="text-[9px] text-muted-foreground/60 mt-0.5">
                                  {"tags: "}{rule.enemyTags.join(", ")}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-foreground">{getHeroName(rule.counterId)}</span>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-emerald-400">{rule.winRate}%</span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] ${DIFFICULTY_STYLES[rule.difficulty]}`}>
                                {rule.difficulty}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-mono text-sm text-muted-foreground">{rule.priority}</span>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs text-muted-foreground line-clamp-2 max-w-[250px]" title={rule.reason}>
                                {rule.reason}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              {rule.source === "custom" ? (
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-gold"
                                    onClick={() => openEditForm(rule)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-card border-border">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="text-foreground">Delete Rule?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground">
                                          {"ลบ rule สำหรับ "}<strong>{getHeroName(rule.counterId)}</strong>{" (ตัวละครที่ match: "}{matchedHeroNames.slice(0, 3).join(", ")}{matchedHeroNames.length > 3 ? "..." : ""}{")"}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(rule)} className="bg-destructive text-destructive-foreground">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground/40">{"read-only"}</span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              {"Showing "}{sorted.length}{" of "}{allDisplayRules.length}{" rules"}
            </p>
          </main>
        </>
      )}

      {/* ====== ITEMS TAB ====== */}
      {activeTab === "items" && (
        <>
          {/* Items Toolbar */}
          <div className="border-b border-border bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาตามชื่อไอเทม, ชื่อตัวละคร, เหตุผล..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card border-border"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={openCreateItemRuleForm} className="bg-gold text-primary-foreground hover:bg-gold-light">
                    <Plus className="h-4 w-4 mr-1" />
                    {"เพิ่มไอเทมแก้ทาง"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={itemCounterRules.length === 0} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        {"ลบทั้งหมด"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">{"ลบ Item Counter Rules ทั้งหมด?"}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          {"จะลบ Item Counter Rules ทั้งหมด ("}{itemCounterRules.length}{" rules) action นี้ไม่สามารถย้อนกลับได้"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetItemRules} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          {"ลบทั้งหมด"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Explanation */}
            <div className="mb-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
              <h3 className="text-sm font-bold text-gold mb-1">{"ไอเทมแก้ทาง - เลือกไอเทมไปแก้ตัวไหน"}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {"เลือกไอเทม 1 ชิ้น แล้วเลือกว่าจะเอาไปแก้ทางตัวละครตัวไหนบ้าง พร้อมใส่เหตุผลและช่วงเกมที่ควรซื้อ (ต้นเกม/ท้ายเกม) ข้อมูลจะรวมกับระบบไอเทมอัตโนมัติในหน้าหลัก"}
              </p>
            </div>

            {/* Base Items Reference */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                {"ไอเทมทั้งหมดในระบบ"}
                <Badge variant="outline" className="border-border bg-muted/30 text-muted-foreground text-[10px]">
                  {baseItems.length}
                </Badge>
              </h3>
              <div className="flex flex-wrap gap-2">
                {baseItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-navy/50 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-5 w-5 object-contain" loading="lazy" />
                      ) : (
                        <span className="font-mono text-[8px] font-bold text-gold">{item.icon}</span>
                      )}
                    </div>
                    <span className="text-xs text-foreground">{item.name}</span>
                    <span className="text-[10px] text-gold">{item.price.toLocaleString()}g</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Item Counter Rules Table */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Swords className="h-5 w-5 text-gold" />
                {"Item Counter Rules"}
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-xs">
                  {itemCounterRules.length}
                </Badge>
              </h3>

              {filteredItemRules.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
                  <Package className="h-8 w-8 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">{"ยังไม่มี Item Counter Rules"}</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">{"กดปุ่ม 'เพิ่มไอเทมแก้ทาง' เพื่อเลือกไอเทมไปแก้ตัวละคร"}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground">{"ไอเทม"}</TableHead>
                          <TableHead className="text-muted-foreground">{"แก้ทางตัวละคร"}</TableHead>
                          <TableHead className="text-muted-foreground">{"ช่วง��กม"}</TableHead>
                          <TableHead className="text-muted-foreground">Priority</TableHead>
                          <TableHead className="text-muted-foreground">{"เหตุผล"}</TableHead>
                          <TableHead className="text-muted-foreground w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItemRules.map((rule, idx) => {
                          return (
                            <TableRow key={`item-rule-${idx}`} className="border-border group">
                              <TableCell>
                                <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                                  {rule.itemIds.map(itemId => {
                                    const item = getItemById(itemId)
                                    return (
                                      <div key={itemId} className="flex items-center gap-1.5 rounded-md border border-gold/20 bg-gold/5 px-2 py-1">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-navy/50 overflow-hidden">
                                          {item?.image ? (
                                            <img src={item.image} alt={item?.name ?? itemId} className="h-5 w-5 object-contain" loading="lazy" />
                                          ) : (
                                            <span className="font-mono text-[8px] font-bold text-gold">{item?.icon ?? "?"}</span>
                                          )}
                                        </div>
                                        <span className="text-xs font-medium text-foreground">{item?.name ?? itemId}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-[250px]">
                                  {rule.targetHeroIds.slice(0, 6).map(heroId => (
                                    <Badge key={heroId} variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                                      {getHeroName(heroId)}
                                    </Badge>
                                  ))}
                                  {rule.targetHeroIds.length > 6 && (
                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border bg-muted/30 text-muted-foreground" title={rule.targetHeroIds.slice(6).map(getHeroName).join(", ")}>
                                      +{rule.targetHeroIds.length - 6}
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`text-[10px] ${PHASE_STYLES[rule.phase]}`}>
                                  {rule.phase === "early" ? "ต้นเกม" : "ท้��ยเกม"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-mono text-sm text-muted-foreground">{rule.priority}</span>
                              </TableCell>
                              <TableCell>
                                <p className="text-xs text-muted-foreground line-clamp-2 max-w-[250px]" title={rule.reason}>
                                  {rule.reason}
                                </p>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-gold"
                                    onClick={() => openEditItemRuleForm(idx, rule)}
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        <span className="sr-only">Delete</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-card border-border">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="text-foreground">{"ลบ Item Counter Rule?"}</AlertDialogTitle>
                                        <AlertDialogDescription className="text-muted-foreground">
                                          {"ลบ "}<strong>{rule.itemIds.map(getItemName).join(", ")}</strong>{" -> "}{rule.targetHeroIds.slice(0, 3).map(getHeroName).join(", ")}{rule.targetHeroIds.length > 3 ? "..." : ""}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteItemRule(idx)} className="bg-destructive text-destructive-foreground">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground text-center">
                {"Showing "}{filteredItemRules.length}{" of "}{itemCounterRules.length}{" item counter rules"}
              </p>
            </div>
          </main>
        </>
      )}

      {/* ====== HEROES TAB ====== */}
      {activeTab === "heroes" && (
        <>
          {/* Heroes Toolbar */}
          <div className="border-b border-border bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาตัวละคร..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card border-border"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={openCreateHeroForm} className="bg-gold text-primary-foreground hover:bg-gold-light">
                    <Plus className="h-4 w-4 mr-1" />
                    {"เพิ่มตัวละคร"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={customHeroesList.length === 0} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        {"ลบ Custom ทั้งหมด"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">{"ลบตัวละคร Custom ทั้งหมด?"}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          {"จะลบตัวละคร Custom ทั้งหมด ("}{customHeroesList.length}{" ตัว) action นี้ไม่สามารถย้อนกลับได้"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetHeroes} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          {"ลบทั้งหมด"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Explanation */}
            <div className="mb-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
              <h3 className="text-sm font-bold text-gold mb-1">{"จัดการตัวละคร - แก้ไข Base / เพิ่ม Custom ได้ทั้งหมด"}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {"แก้ไขตัวละคร Base ได้ทุกตัว (ชื่อ รูปภาพ ตำแหน่ง Tags) หรือเพิ่มตัวละครใหม่ที่ยังไม่มีในระบบ เมื่อเกมอัพเดทตัวใหม่มาสามารถเพิ่มเองได้เลย การแก้ไข Base จะรีเซ็ตกลับค่าเดิมได้"}
              </p>
            </div>

            {/* Base Heroes - Editable */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {"ตัวละคร Base ในระบบ"}
                  <Badge variant="outline" className="border-border bg-muted/30 text-muted-foreground text-[10px]">
                    {HEROES.length}
                  </Badge>
                  {Object.keys(baseHeroOverrides).length > 0 && (
                    <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-[10px]">
                      {"แก้ไขแล้ว "}{Object.keys(baseHeroOverrides).length}
                    </Badge>
                  )}
                </h3>
                {Object.keys(baseHeroOverrides).length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs h-7">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        {"รีเซ็ตทั้งหมด"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">{"รีเซ็ตตัวละคร Base ทั้งหมด?"}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          {"จะรีเซ็ตตัวละคร Base ทั้งหมดกลับเป็นค่าเริ่มต้น ("}{Object.keys(baseHeroOverrides).length}{" ตัวที่แก้ไข)"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetAllBaseHeroOverrides} className="bg-destructive text-destructive-foreground">
                          {"รีเซ���ตทั้งหมด"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground w-[60px]">{"รูป"}</TableHead>
                        <TableHead className="text-muted-foreground">{"ชื่อ"}</TableHead>
                        <TableHead className="text-muted-foreground">{"ตำแหน่ง"}</TableHead>
                        <TableHead className="text-muted-foreground">Tags</TableHead>
                        <TableHead className="text-muted-foreground w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {baseHeroesWithOverrides.filter(h => {
                        if (!searchQuery) return true
                        const q = searchQuery.toLowerCase()
                        return h.name.toLowerCase().includes(q) || h.role.toLowerCase().includes(q) || h.tags.join(" ").toLowerCase().includes(q)
                      }).map(hero => {
                        const isOverridden = !!baseHeroOverrides[hero.id]
                        return (
                          <TableRow key={hero.id} className={`border-border group ${isOverridden ? "bg-gold/5" : ""}`}>
                            <TableCell>
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/50 overflow-hidden border border-border">
                                {hero.image ? (
                                  <img src={hero.image} alt={hero.name} className="h-7 w-7 object-contain" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none" }} />
                                ) : (
                                  <span className="font-mono text-[8px] font-bold text-gold">{hero.icon}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-foreground">{hero.name}</span>
                                {isOverridden && (
                                  <Badge variant="outline" className="text-[8px] px-1 py-0 border-gold/40 bg-gold/10 text-gold">
                                    {"แก้ไขแล้ว"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[9px] text-muted-foreground">{hero.id}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] ${
                                hero.role === "Fighter" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                                hero.role === "Mage" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                                hero.role === "Marksman" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                hero.role === "Assassin" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                hero.role === "Tank" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                                "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                              }`}>
                                {hero.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[250px]">
                                {hero.tags.slice(0, 4).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-[9px] px-1 py-0 border-border bg-muted/30 text-muted-foreground">
                                    {tag}
                                  </Badge>
                                ))}
                                {hero.tags.length > 4 && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-border bg-muted/30 text-muted-foreground">
                                    +{hero.tags.length - 4}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-gold"
                                  onClick={() => openEditBaseHeroForm(hero)}
                                >
                                  <Pencil className="h-3 w-3" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                {isOverridden && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleResetBaseHeroOverride(hero.id)}
                                    title="รีเซ็ตกลับค่าเดิม"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                    <span className="sr-only">Reset</span>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Custom Heroes Table */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" />
                {"ตัวละคร Custom"}
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-xs">
                  {customHeroesList.length}
                </Badge>
              </h3>

              {customHeroesList.filter(h => {
                if (!searchQuery) return true
                const q = searchQuery.toLowerCase()
                return h.name.toLowerCase().includes(q) || h.role.toLowerCase().includes(q)
              }).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
                  <Users className="h-8 w-8 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">{"ยังไม่มีตัวละคร Custom"}</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">{"กดปุ่ม 'เพิ่มตัวละคร' เพื่อเพิ่มตัวละครให���่"}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground w-[60px]">{"รูป"}</TableHead>
                          <TableHead className="text-muted-foreground">{"ชื่อ"}</TableHead>
                          <TableHead className="text-muted-foreground">{"ตำแหน่ง"}</TableHead>
                          <TableHead className="text-muted-foreground">Tags</TableHead>
                          <TableHead className="text-muted-foreground">{"รูปภาพ URL"}</TableHead>
                          <TableHead className="text-muted-foreground w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customHeroesList.filter(h => {
                          if (!searchQuery) return true
                          const q = searchQuery.toLowerCase()
                          return h.name.toLowerCase().includes(q) || h.role.toLowerCase().includes(q)
                        }).map((hero, idx) => (
                          <TableRow key={`custom-hero-${idx}`} className="border-border group">
                            <TableCell>
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/50 overflow-hidden border border-border">
                                {hero.image ? (
                                  <img src={hero.image} alt={hero.name} className="h-8 w-8 object-contain" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none" }} />
                                ) : (
                                  <span className="font-mono text-xs font-bold text-gold">{hero.icon}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-foreground">{hero.name}</span>
                              <p className="text-[9px] text-muted-foreground">ID: {hero.id}</p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] ${
                                hero.role === "Fighter" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                                hero.role === "Mage" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" :
                                hero.role === "Marksman" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                                hero.role === "Assassin" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                hero.role === "Tank" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                                "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                              }`}>
                                {hero.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {hero.tags.slice(0, 5).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-[9px] px-1 py-0 border-border bg-muted/30 text-muted-foreground">
                                    {tag}
                                  </Badge>
                                ))}
                                {hero.tags.length > 5 && (
                                  <Badge variant="outline" className="text-[9px] px-1 py-0 border-border bg-muted/30 text-muted-foreground">
                                    +{hero.tags.length - 5}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[200px]" title={hero.image}>
                                {hero.image || "-"}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-gold"
                                  onClick={() => openEditHeroForm(idx, hero)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                      <Trash2 className="h-3.5 w-3.5" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-card border-border">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-foreground">{"ลบตัวละคร?"}</AlertDialogTitle>
                                      <AlertDialogDescription className="text-muted-foreground">
                                        {"ลบ "}<strong>{hero.name}</strong>{" ออกจากระบบ"}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteHero(idx)} className="bg-destructive text-destructive-foreground">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* ====== ITEM DEFS TAB ====== */}
      {activeTab === "itemdefs" && (
        <>
          {/* Item Defs Toolbar */}
          <div className="border-b border-border bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาไอเท��..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card border-border"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button onClick={openCreateItemDefForm} className="bg-gold text-primary-foreground hover:bg-gold-light">
                    <Plus className="h-4 w-4 mr-1" />
                    {"เพิ่มไอเทม"}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" disabled={customItemDefsList.length === 0} className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        {"ลบ Custom ทั้งหมด"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">{"ลบไอเทม Custom ทั้งหมด?"}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          {"จะลบไอเทม Custom ทั้งหมด ("}{customItemDefsList.length}{" ชิ้น) action นี้ไม่สามารถย้อนกลับได้"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetItemDefs} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          {"ลบทั้งหมด"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Explanation */}
            <div className="mb-6 rounded-xl border border-gold/20 bg-gold/5 p-4">
              <h3 className="text-sm font-bold text-gold mb-1">{"จัดการไอเทม - แก้ไข Base / เพิ่ม Custom ได้ทั้งหมด"}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {"แก้ไขไอเทม Base ได้ทุกชิ้น (ชื่อ รูปภาพ สถิติ ราคา) หรือเพิ่มไอเทมใหม่ที่ยังไม่มีในระบบ เมื่อเกมอัพเดทไอเทมใหม่มาสามารถเพิ่มเองได้เลย การแก้ไข Base จะรีเซ็ตกลับค่าเดิมได้"}
              </p>
            </div>

            {/* Base Items - Editable */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  {"ไอเทม Base ในระบบ"}
                  <Badge variant="outline" className="border-border bg-muted/30 text-muted-foreground text-[10px]">
                    {getBaseItemDefs().length}
                  </Badge>
                  {Object.keys(baseItemOverrides).length > 0 && (
                    <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-[10px]">
                      {"แก้ไขแล้ว "}{Object.keys(baseItemOverrides).length}
                    </Badge>
                  )}
                </h3>
                {Object.keys(baseItemOverrides).length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs h-7">
                        <RotateCcw className="h-3 w-3 mr-1" />
                        {"รีเซ็ตทั้งหมด"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-foreground">{"รีเซ็ตไอเทม Base ทั้งหมด?"}</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          {"จะรีเซ็ตไอเทม Base ทั้งหมดกลับเป็นค่าเริ่มต้น ("}{Object.keys(baseItemOverrides).length}{" ชิ้นที่แก้ไข)"}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetAllBaseItemOverrides} className="bg-destructive text-destructive-foreground">
                          {"รีเซ็ตทั้งหมด"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground w-[60px]">{"รูป"}</TableHead>
                        <TableHead className="text-muted-foreground">{"ชื่อ"}</TableHead>
                        <TableHead className="text-muted-foreground">{"สถิติ"}</TableHead>
                        <TableHead className="text-muted-foreground">{"ราคา"}</TableHead>
                        <TableHead className="text-muted-foreground w-[100px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {baseItemDefsWithOverrides.filter(item => {
                        if (!searchQuery) return true
                        const q = searchQuery.toLowerCase()
                        return item.name.toLowerCase().includes(q) || item.stat.toLowerCase().includes(q)
                      }).map(item => {
                        const isOverridden = !!baseItemOverrides[item.id]
                        return (
                          <TableRow key={item.id} className={`border-border group ${isOverridden ? "bg-gold/5" : ""}`}>
                            <TableCell>
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy/50 overflow-hidden border border-border">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="h-7 w-7 object-contain" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none" }} />
                                ) : (
                                  <span className="font-mono text-[8px] font-bold text-gold">{item.icon}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-foreground">{item.name}</span>
                                {isOverridden && (
                                  <Badge variant="outline" className="text-[8px] px-1 py-0 border-gold/40 bg-gold/10 text-gold">
                                    {"แก้ไขแล้ว"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[9px] text-muted-foreground">{item.id}</p>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-muted-foreground">{item.stat || "-"}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-gold font-mono">{item.price.toLocaleString()}g</span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-muted-foreground hover:text-gold"
                                  onClick={() => openEditBaseItemForm(item)}
                                >
                                  <Pencil className="h-3 w-3" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                {isOverridden && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                    onClick={() => handleResetBaseItemOverride(item.id)}
                                    title="รีเซ็ตกลับค่าเดิม"
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                    <span className="sr-only">Reset</span>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Custom Item Defs Table */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5 text-gold" />
                {"ไอเทม Custom"}
                <Badge variant="outline" className="border-gold/30 bg-gold/10 text-gold text-xs">
                  {customItemDefsList.length}
                </Badge>
              </h3>

              {customItemDefsList.filter(item => {
                if (!searchQuery) return true
                const q = searchQuery.toLowerCase()
                return item.name.toLowerCase().includes(q) || item.stat.toLowerCase().includes(q)
              }).length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
                  <Package className="h-8 w-8 text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">{"ยังไม่มีไอเทม Custom"}</p>
                  <p className="text-muted-foreground/60 text-xs mt-1">{"กดปุ่ม 'เพิ่มไอเทม' เพื่อเพิ่มไอเทมใหม่"}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                          <TableHead className="text-muted-foreground w-[60px]">{"รูป"}</TableHead>
                          <TableHead className="text-muted-foreground">{"ชื่อ"}</TableHead>
                          <TableHead className="text-muted-foreground">{"สถิติ"}</TableHead>
                          <TableHead className="text-muted-foreground">{"ราคา"}</TableHead>
                          <TableHead className="text-muted-foreground">{"รูปภาพ URL"}</TableHead>
                          <TableHead className="text-muted-foreground w-[100px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customItemDefsList.filter(item => {
                          if (!searchQuery) return true
                          const q = searchQuery.toLowerCase()
                          return item.name.toLowerCase().includes(q) || item.stat.toLowerCase().includes(q)
                        }).map((item, idx) => (
                          <TableRow key={`custom-item-${idx}`} className="border-border group">
                            <TableCell>
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy/50 overflow-hidden border border-border">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="h-8 w-8 object-contain" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none" }} />
                                ) : (
                                  <span className="font-mono text-xs font-bold text-gold">{item.icon}</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-foreground">{item.name}</span>
                              <p className="text-[9px] text-muted-foreground">ID: {item.id}</p>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-muted-foreground">{item.stat || "-"}</span>
                            </TableCell>
                            <TableCell>
                              <span className="text-xs text-gold font-mono">{item.price.toLocaleString()}g</span>
                            </TableCell>
                            <TableCell>
                              <p className="text-[10px] text-muted-foreground truncate max-w-[200px]" title={item.image}>
                                {item.image || "-"}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-gold"
                                  onClick={() => openEditItemDefForm(idx, item)}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                      <Trash2 className="h-3.5 w-3.5" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent className="bg-card border-border">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-foreground">{"ลบไอเทม?"}</AlertDialogTitle>
                                      <AlertDialogDescription className="text-muted-foreground">
                                        {"ลบ "}<strong>{item.name}</strong>{" ออกจากระบบ"}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteItemDef(idx)} className="bg-destructive text-destructive-foreground">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </>
      )}

      {/* ====== TIER LIST TAB ====== */}
      {activeTab === "tierlist" && (
        <AdminTierList showToast={showToast} />
      )}

      {/* Add/Edit Rule Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingIndex !== null ? "Edit Counter Rule" : "Add Counter Rule"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingIndex !== null
                ? "แก้ไข Counter Rule ที่มีอยู่"
                : "เพิ่ม Counter Rule ใหม่สำหรับแก้ทางศัตรู"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Enemy Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-foreground">{"ตัวละครศัตรู (Enemy Tags)"}</Label>

              {/* Quick fill from hero */}
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground">{"เลือกฮีโร่ศัต��ูเพื่อใส่ Tags อัตโนมัติ:"}</p>
                <Select
                  value=""
                  onValueChange={(heroId) => {
                    const hero = mergedHeroes.find(h => h.id === heroId)
                    if (hero) setTagInput(hero.tags.join(", "))
                  }}
                >
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="-- เลือกฮีโร่เพื่อ fill tags --" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px]">
                    {mergedHeroes.map(h => (
                      <SelectItem key={h.id} value={h.id}>
                        {h.name} ({h.role}) - {h.tags.join(", ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Input
                id="tags"
                placeholder="dash, burst, physical (comma separated)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="bg-background border-border text-foreground"
              />

              {/* Preview matched heroes */}
              {tagInput.trim() && (() => {
                const tags = tagInput.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)
                const matched = getMatchingHeroNames(tags)
                return matched.length > 0 ? (
                  <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2">
                    <p className="text-[10px] text-cyan-400 mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {"ตัวละครที่ match ("}{matched.length}{")"}{":"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {matched.slice(0, 10).map(name => (
                        <Badge key={name} variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                          {name}
                        </Badge>
                      ))}
                      {matched.length > 10 && (
                        <span className="text-[10px] text-cyan-400/60">+{matched.length - 10} more</span>
                      )}
                    </div>
                  </div>
                ) : null
              })()}

              {/* Selected tags display */}
              {tagInput.trim() && (
                <div className="flex flex-wrap gap-1">
                  {tagInput.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border border-gold/50 bg-gold/20 text-gold"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => {
                          const current = tagInput.split(",").map(t => t.trim()).filter(Boolean)
                          setTagInput(current.filter(t => t !== tag).join(", "))
                        }}
                        className="hover:text-foreground ml-0.5"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Tag buttons */}
              <div className="flex flex-wrap gap-1">
                {(showAllTags ? allTags : allTags.slice(0, 20)).map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const current = tagInput.split(",").map(t => t.trim()).filter(Boolean)
                      if (current.includes(tag)) {
                        setTagInput(current.filter(t => t !== tag).join(", "))
                      } else {
                        setTagInput([...current, tag].join(", "))
                      }
                    }}
                    className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
                      tagInput.split(",").map(t => t.trim()).includes(tag)
                        ? "border-gold/50 bg-gold/20 text-gold"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-gold/30"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {allTags.length > 20 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTags(v => !v)}
                    className="px-2 py-0.5 text-[10px] rounded border border-dashed border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                  >
                    {showAllTags ? "Show less" : `+${allTags.length - 20} more`}
                  </button>
                )}
              </div>
            </div>

            {/* Counter Hero */}
            <div className="space-y-2">
              <Label htmlFor="counter-hero" className="text-foreground">Counter Hero</Label>
              <Select value={formData.counterId} onValueChange={(v) => setFormData(d => ({ ...d, counterId: v }))}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select hero..." />
                </SelectTrigger>
                <SelectContent className="max-h-[250px]">
                  {mergedHeroes.map(h => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name} ({h.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Win Rate */}
            <div className="space-y-2">
              <Label htmlFor="winrate" className="text-foreground">Win Rate (%)</Label>
              <Input
                id="winrate"
                type="number"
                min={40}
                max={90}
                value={formData.winRate}
                onChange={(e) => setFormData(d => ({ ...d, winRate: Number(e.target.value) }))}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label className="text-foreground">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(v) => setFormData(d => ({ ...d, difficulty: v as CounterRule["difficulty"] }))}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">{"Easy - ง่าย"}</SelectItem>
                  <SelectItem value="Medium">{"Medium - ปานกลาง"}</SelectItem>
                  <SelectItem value="Hard">{"Hard - ยาก"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-foreground">Priority (1-100)</Label>
              <Input
                id="priority"
                type="number"
                min={1}
                max={100}
                value={formData.priority}
                onChange={(e) => setFormData(d => ({ ...d, priority: Number(e.target.value) }))}
                className="bg-background border-border text-foreground"
              />
              <p className="text-[10px] text-muted-foreground">{"ยิ่งสูง = แนะนำก่อน"}</p>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-foreground">Reason</Label>
              <Textarea
                id="reason"
                placeholder="เหตุผลว่าทำไมฮีโร่นี้ถึง counter ได้..."
                value={formData.reason}
                onChange={(e) => setFormData(d => ({ ...d, reason: e.target.value }))}
                className="min-h-[80px] bg-background border-border text-foreground"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gold text-primary-foreground hover:bg-gold-light">
              {editingIndex !== null ? "Save Changes" : "Add Rule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Item Counter Rule Dialog */}
      <Dialog open={itemRuleFormOpen} onOpenChange={setItemRuleFormOpen}>
        <DialogContent className="bg-card border-border sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingItemRuleIndex !== null ? "แก้ไขไอเทมแก้ทาง" : "เพิ่มไอเทมแก้ทาง"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingItemRuleIndex !== null
                ? "แก้ไขว่าไอเทมเหล่านี้จะแก้ทางตัวไหน"
                : "เลือกไอเทมหลายชิ้นพร้อมกัน แล้วเลือกตัวละครที่จะเอาไปแก้ทาง"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Select Items (multi-select with search) */}
            <div className="space-y-2">
              <Label className="text-foreground">
                {"เลือกไอเทม"}{" "}
                <span className="text-gold font-mono">({itemRuleFormData.itemIds.length})</span>
              </Label>

              {/* Selected items preview */}
              {itemRuleFormData.itemIds.length > 0 && (
                <div className="rounded-lg border border-gold/20 bg-gold/5 p-2">
                  <p className="text-[10px] text-gold mb-1.5 flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {"ไอเทมที่เลือก:"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {itemRuleFormData.itemIds.map(itemId => {
                      const item = getItemById(itemId)
                      return (
                        <button
                          key={itemId}
                          type="button"
                          onClick={() => toggleItemId(itemId)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-md border border-gold/30 bg-gold/10 text-gold hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors"
                        >
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-navy/50 overflow-hidden">
                            {item?.image ? (
                              <img src={item.image} alt={item?.name ?? itemId} className="h-4 w-4 object-contain" />
                            ) : (
                              <span className="font-mono text-[7px] font-bold">{item?.icon ?? "?"}</span>
                            )}
                          </div>
                          {item?.name ?? itemId}
                          <span>x</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Item search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาไอเทมตามชื่อ..."
                  value={itemSearchQuery}
                  onChange={(e) => setItemSearchQuery(e.target.value)}
                  className="pl-9 bg-background border-border text-foreground h-9 text-sm"
                />
              </div>

              {/* Item grid */}
              <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border bg-background p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {baseItems.filter(item => {
                    if (!itemSearchQuery) return true
                    const q = itemSearchQuery.toLowerCase()
                    return item.name.toLowerCase().includes(q) || item.stat.toLowerCase().includes(q)
                  }).map(item => {
                    const isSelected = itemRuleFormData.itemIds.includes(item.id)
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleItemId(item.id)}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-gold/10 border border-gold/30 text-gold"
                            : "border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-navy/50 overflow-hidden border border-border">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-5 w-5 object-contain" loading="lazy" />
                          ) : (
                            <span className="font-mono text-[8px] font-bold text-gold">{item.icon}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate font-medium ${isSelected ? "text-gold" : "text-foreground"}`}>{item.name}</p>
                          <p className="text-[9px] text-muted-foreground truncate">{item.price.toLocaleString()}g</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Select Target Heroes */}
            <div className="space-y-2">
              <Label className="text-foreground">
                {"เลือกตัวละครที่จะแก้ทาง"}{" "}
                <span className="text-gold font-mono">({itemRuleFormData.targetHeroIds.length})</span>
              </Label>

              {/* Selected heroes preview */}
              {itemRuleFormData.targetHeroIds.length > 0 && (
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-2">
                  <p className="text-[10px] text-cyan-400 mb-1.5 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {"ตัวละครที่เลือก:"}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {itemRuleFormData.targetHeroIds.map(heroId => (
                      <button
                        key={heroId}
                        type="button"
                        onClick={() => toggleTargetHero(heroId)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors"
                      >
                        {getHeroName(heroId)}
                        <span>x</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Hero search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาตัวละคร..."
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  className="pl-9 bg-background border-border text-foreground h-9 text-sm"
                />
              </div>

              {/* Hero grid */}
              <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border bg-background p-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                  {mergedHeroes.filter(h => {
                    if (!heroSearchQuery) return true
                    const q = heroSearchQuery.toLowerCase()
                    return h.name.toLowerCase().includes(q) || h.role.toLowerCase().includes(q)
                  }).map(hero => {
                    const isSelected = itemRuleFormData.targetHeroIds.includes(hero.id)
                    return (
                      <button
                        key={hero.id}
                        type="button"
                        onClick={() => toggleTargetHero(hero.id)}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                            : "border border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-navy/50 overflow-hidden">
                          <img src={hero.image} alt={hero.name} className="h-5 w-5 object-contain" loading="lazy"
                            onError={(e) => { e.currentTarget.style.display = "none" }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className={`truncate font-medium ${isSelected ? "text-cyan-400" : "text-foreground"}`}>{hero.name}</p>
                          <p className="text-[9px] text-muted-foreground">{hero.role}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Phase */}
            <div className="space-y-2">
              <Label className="text-foreground">{"ช่วงเกมที่ควรซื้อ"}</Label>
              <Select value={itemRuleFormData.phase} onValueChange={(v) => setItemRuleFormData(d => ({ ...d, phase: v as ItemPhase }))}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="early">{"ต้นเกม (Early Game)"}</SelectItem>
                  <SelectItem value="late">{"ท้ายเกม (Late Game)"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="item-priority" className="text-foreground">Priority (1-100)</Label>
              <Input
                id="item-priority"
                type="number"
                min={1}
                max={100}
                value={itemRuleFormData.priority}
                onChange={(e) => setItemRuleFormData(d => ({ ...d, priority: Number(e.target.value) }))}
                className="bg-background border-border text-foreground"
              />
              <p className="text-[10px] text-muted-foreground">{"ยิ่งสูง = แนะนำก่อน"}</p>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="item-reason" className="text-foreground">{"เหตุผลที่���ช้แก้ทาง"}</Label>
              <Textarea
                id="item-reason"
                placeholder="ทำไมไอเทมนี้ถึงเหมาะแก้ทางตัวละครที่เลือก..."
                value={itemRuleFormData.reason}
                onChange={(e) => setItemRuleFormData(d => ({ ...d, reason: e.target.value }))}
                className="min-h-[80px] bg-background border-border text-foreground"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setItemRuleFormOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleSaveItemRule} className="bg-gold text-primary-foreground hover:bg-gold-light">
              {editingItemRuleIndex !== null ? "Save Changes" : "เพิ่มไอเทมแก้ทาง"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Hero Dialog */}
      <Dialog open={heroFormOpen} onOpenChange={setHeroFormOpen}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingBaseHeroId ? "แก้ไขตัวละคร Base" : editingHeroIndex !== null ? "แก้ไขตัวละคร Custom" : "เพิ่มตัวละครใหม่"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingBaseHeroId
                ? "แก้ไขข้อมูลตัวละคร Base เปลี่ยนชื่อ รูปภาพ ตำแหน่ง หรือ Tags ได้"
                : editingHeroIndex !== null
                ? "แก้ไขข้อมูลตัวละคร Custom ที่เลือก"
                : "เพิ่มตัวละครใหม่ที่ยังไม่มีในร���บบ เมื่อเกมอัพเดทตัวใหม่มาสามารถเพิ่มเองได้เลย"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Hero Name */}
            <div className="space-y-2">
              <Label htmlFor="hero-name" className="text-foreground">{"ชื่อตัวละคร *"}</Label>
              <Input
                id="hero-name"
                placeholder="เช่น Novaria, Zhuxin, Suyou..."
                value={heroFormData.name}
                onChange={(e) => setHeroFormData(d => ({ ...d, name: e.target.value }))}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Hero ID - hidden when editing base hero */}
            {!editingBaseHeroId && (
              <div className="space-y-2">
                <Label htmlFor="hero-id" className="text-foreground">
                  {"ID (อัตโนมัติจากชื่อ ถ้าไม่ใ��่)"}
                </Label>
                <Input
                  id="hero-id"
                  placeholder="เช่น novaria, zhuxin..."
                  value={heroFormData.id}
                  onChange={(e) => setHeroFormData(d => ({ ...d, id: e.target.value }))}
                  className="bg-background border-border text-foreground"
                />
                <p className="text-[10px] text-muted-foreground">{"ถ้าปล่อยว่าง จะสร้างจากชื่อโดยอัตโนมัติ"}</p>
              </div>
            )}

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-foreground">{"ตำแหน่ง (Role)"}</Label>
              <Select value={heroFormData.role} onValueChange={(v) => setHeroFormData(d => ({ ...d, role: v as HeroRole }))}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HERO_ROLES.map(role => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="hero-image" className="text-foreground flex items-center gap-1.5">
                <ImagePlus className="h-3.5 w-3.5" />
                {"URL รูปภาพ"}
              </Label>
              <Input
                id="hero-image"
                placeholder="https://example.com/hero-image.png"
                value={heroFormData.image}
                onChange={(e) => setHeroFormData(d => ({ ...d, image: e.target.value }))}
                className="bg-background border-border text-foreground"
              />
              {heroFormData.image && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy/50 overflow-hidden border border-border">
                    <img
                      src={heroFormData.image}
                      alt="Preview"
                      className="h-10 w-10 object-contain"
                      onError={(e) => { e.currentTarget.style.display = "none" }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{"Preview รูปภาพ"}</p>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">{"ใส่ URL รูปภาพ .png .jpg .webp (ถ้าไม่ใส่จะใช้ตัวอักษรย่อแทน)"}</p>
            </div>

            {/* Icon (short text) */}
            <div className="space-y-2">
              <Label htmlFor="hero-icon" className="text-foreground">{"ตัวอักษรย���อ (Icon)"}</Label>
              <Input
                id="hero-icon"
                placeholder="เช่น NV, ZX..."
                maxLength={3}
                value={heroFormData.icon}
                onChange={(e) => setHeroFormData(d => ({ ...d, icon: e.target.value }))}
                className="bg-background border-border text-foreground w-24"
              />
              <p className="text-[10px] text-muted-foreground">{"2-3 ตัวอักษร แสดงเมื่อไม่มีรูป"}</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-foreground">{"Tags (สำหรับระบบ Counter)"}</Label>

              {/* Current tags */}
              {heroFormData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {heroFormData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border border-gold/50 bg-gold/20 text-gold"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeHeroTag(tag)}
                        className="hover:text-foreground ml-0.5"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add tag input */}
              <div className="flex gap-2">
                <Input
                  placeholder="พิมพ์ tag แล้วกด Enter หรือกด +"
                  value={heroTagInput}
                  onChange={(e) => setHeroTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addHeroTag(heroTagInput)
                    }
                  }}
                  className="bg-background border-border text-foreground flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="border-border shrink-0"
                  onClick={() => addHeroTag(heroTagInput)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Quick tag buttons */}
              <div className="flex flex-wrap gap-1">
                {["dash", "burst", "cc", "sustain", "physical", "magic", "melee", "ranged", "immune", "shield", "heal", "silence", "projectile", "hook", "lockdown", "zone", "summon", "clone", "camo", "transform", "global", "antidash", "antiheal", "crit", "truedmg", "sustained", "aoe", "channel", "purify", "reset", "stack", "execute", "speed"].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (heroFormData.tags.includes(tag)) {
                        removeHeroTag(tag)
                      } else {
                        addHeroTag(tag)
                      }
                    }}
                    className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
                      heroFormData.tags.includes(tag)
                        ? "border-gold/50 bg-gold/20 text-gold"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-gold/30"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setHeroFormOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleSaveHero} className="bg-gold text-primary-foreground hover:bg-gold-light">
              {editingBaseHeroId ? "บันทึกการแก้ไข" : editingHeroIndex !== null ? "Save Changes" : "เพิ่มตัวละคร"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Item Definition Dialog */}
      <Dialog open={itemDefFormOpen} onOpenChange={setItemDefFormOpen}>
        <DialogContent className="bg-card border-border sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingBaseItemId ? "แก้ไขไอเทม Base" : editingItemDefIndex !== null ? "แก้ไขไอเทม Custom" : "เพิ่มไอเทมใหม่"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingBaseItemId
                ? "แก้ไขข้อมูลไอเทม Base เปลี่ยนชื่อ รูปภาพ สถิติ หรือราคาได้"
                : editingItemDefIndex !== null
                ? "แก้ไขข้อมูลไอเทม Custom ที่เลือก"
                : "เพิ่มไอเทมใหม่ที่ยังไม่มีในระบบ เมื่อเกมอัพเดทไอเทมใหม่มาสามารถเพิ่มเ��งได้เลย"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Item Name */}
            <div className="space-y-2">
              <Label htmlFor="itemdef-name" className="text-foreground">{"ชื่อไอเทม *"}</Label>
              <Input
                id="itemdef-name"
                placeholder="เช่น Fleeting Time, Genius Wand..."
                value={itemDefFormData.name}
                onChange={(e) => setItemDefFormData(d => ({ ...d, name: e.target.value }))}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Item ID - hidden when editing base item */}
            {!editingBaseItemId && (
              <div className="space-y-2">
                <Label htmlFor="itemdef-id" className="text-foreground">
                  {"ID (อัตโนมัติจากชื่อ ถ้าไม่ใส่)"}
                </Label>
                <Input
                  id="itemdef-id"
                  placeholder="เช่น fleeting-time, genius-wand..."
                  value={itemDefFormData.id}
                  onChange={(e) => setItemDefFormData(d => ({ ...d, id: e.target.value }))}
                  className="bg-background border-border text-foreground"
                />
                <p className="text-[10px] text-muted-foreground">{"ถ้าปล่อยว่���ง จะสร้างจากชื่อโดยอัตโนมัติ"}</p>
              </div>
            )}

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="itemdef-image" className="text-foreground flex items-center gap-1.5">
                <ImagePlus className="h-3.5 w-3.5" />
                {"URL รูปภาพ"}
              </Label>
              <Input
                id="itemdef-image"
                placeholder="https://example.com/item-image.png"
                value={itemDefFormData.image}
                onChange={(e) => setItemDefFormData(d => ({ ...d, image: e.target.value }))}
                className="bg-background border-border text-foreground"
              />
              {itemDefFormData.image && (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-2">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy/50 overflow-hidden border border-border">
                    <img
                      src={itemDefFormData.image}
                      alt="Preview"
                      className="h-10 w-10 object-contain"
                      onError={(e) => { e.currentTarget.style.display = "none" }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{"Preview รูปภาพ"}</p>
                </div>
              )}
              <p className="text-[10px] text-muted-foreground">{"ใส่ URL รูปภาพ .png .jpg .webp (ถ้าไม่ใส่จะใช้ตัวอักษรย่อแทน)"}</p>
            </div>

            {/* Icon (short text) */}
            <div className="space-y-2">
              <Label htmlFor="itemdef-icon" className="text-foreground">{"ตัวอักษรย่อ (Icon)"}</Label>
              <Input
                id="itemdef-icon"
                placeholder="เช่น FT, GW..."
                maxLength={3}
                value={itemDefFormData.icon}
                onChange={(e) => setItemDefFormData(d => ({ ...d, icon: e.target.value }))}
                className="bg-background border-border text-foreground w-24"
              />
              <p className="text-[10px] text-muted-foreground">{"2-3 ตัวอักษร แสดงเมื่อไม่มีรูป"}</p>
            </div>

            {/* Stat */}
            <div className="space-y-2">
              <Label htmlFor="itemdef-stat" className="text-foreground">{"สถิติ (Stat)"}</Label>
              <Input
                id="itemdef-stat"
                placeholder="เช่น +65 Magic Power, +10% CD Reduction"
                value={itemDefFormData.stat}
                onChange={(e) => setItemDefFormData(d => ({ ...d, stat: e.target.value }))}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="itemdef-price" className="text-foreground">{"ราคา (Gold)"}</Label>
              <Input
                id="itemdef-price"
                type="number"
                min={0}
                max={10000}
                placeholder="เช่น 2010"
                value={itemDefFormData.price}
                onChange={(e) => setItemDefFormData(d => ({ ...d, price: Number(e.target.value) }))}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setItemDefFormOpen(false)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleSaveItemDef} className="bg-gold text-primary-foreground hover:bg-gold-light">
              {editingBaseItemId ? "บันทึกการแก้ไข" : editingItemDefIndex !== null ? "Save Changes" : "เพิ่มไอเทม"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
