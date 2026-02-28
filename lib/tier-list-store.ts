import { HEROES, type HeroRole } from "./mlbb-data"
import type { TierRank, LaneType, TierHero, TierEntry, LaneTierList, TierListData } from "./tier-list-data"

const TIER_STORE_KEY = "mlbb-tier-list-data"
const TIER_META_KEY = "mlbb-tier-list-meta"

export interface TierListMeta {
  updatedAt: string
  patch: string
  source: string
}

export type LaneTierMap = Record<LaneType, Record<TierRank, string[]>> // lane -> tier -> hero ids

// ====== Default data (matches mlbb.io / mlbb.gg current meta) ======

function heroIds(names: string): string[] {
  return names
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .map((name) => {
      const hero = HEROES.find(
        (h) =>
          h.name.toLowerCase() === name.toLowerCase() ||
          h.id === name.toLowerCase().replace(/[\s'\.]/g, "-")
      )
      return hero?.id ?? name.toLowerCase().replace(/[\s'\.]/g, "-")
    })
}

const DEFAULT_TIERS: LaneTierMap = {
  Roam: {
    SS: heroIds("Gatotkaca, Belerick, Chip, Kalea"),
    S: heroIds("Khufra, Atlas, Tigreal, Lolita, Hylos, Edith, Carmilla, Johnson"),
    A: heroIds("Franco, Gloo, Barats, Mathilda, Floryn, Diggie, Angela, Estes"),
    B: heroIds("Akai, Minotaur, Rafaela, Kaja, Faramis"),
    C: heroIds("Uranus, Grock, Baxia"),
    D: [],
  },
  Exp: {
    SS: heroIds("Lukas, Suyou, Cici, Phoveus, Yin"),
    S: heroIds("Arlott, Fredrinn, Badang, Martis, Alpha, Guinevere, Esmeralda, X.Borg, Yu Zhong"),
    A: heroIds("Khaleed, Jawhead, Chou, Sun, Argus, Freya, Lapu-Lapu, Aulus, Thamuz, Masha"),
    B: heroIds("Balmond, Silvanna, Ruby, Zilong, Dyrroth, Terizla, Leomord, Aldous"),
    C: heroIds("Minsitthar, Hilda, Bane, Alucard"),
    D: heroIds("Paquito"),
  },
  Jungle: {
    SS: heroIds("Fanny, Hayabusa, Ling, Suyou"),
    S: heroIds("Helcurt, Saber, Benedetta, Julian, Lancelot, Karina, Hanzo, Selena, Gusion, Aamon"),
    A: heroIds("Joy, Nolan, Roger, Alpha, Yin, Granger, Barats"),
    B: heroIds("Natalia, Yi Sun-shin, Alucard, Zilong"),
    C: heroIds("Harley"),
    D: [],
  },
  Mid: {
    SS: heroIds("Zhuxin, Kagura, Zetian"),
    S: heroIds("Xavier, Vale, Lunox, Aurora, Gord, Zhask, Kimmy, Yve, Valentina, Eudora"),
    A: heroIds("Pharsa, Cecilion, Harley, Harith, Chang'e, Luo Yi, Kadita, Odette, Nana, Lylia"),
    B: heroIds("Cyclops, Vexana, Valir, Alice"),
    C: heroIds("Novaria"),
    D: [],
  },
  Gold: {
    SS: heroIds("Moskov, Miya, Granger, Melissa"),
    S: heroIds("Beatrix, Wanwan, Layla, Lesley, Bruno, Natan, Ixia, Edith"),
    A: heroIds("Brody, Hanabi, Clint, Claude, Irithel, Popol and Kupa, Karrie"),
    B: heroIds("Kimmy, Obsidia"),
    C: [],
    D: [],
  },
}

const DEFAULT_META: TierListMeta = {
  updatedAt: new Date().toISOString(),
  patch: "Patch 1.9.48",
  source: "mlbb.io",
}

// ====== Store functions ======

export function getTierMap(): LaneTierMap {
  if (typeof window === "undefined") return DEFAULT_TIERS
  try {
    const raw = localStorage.getItem(TIER_STORE_KEY)
    if (!raw) return DEFAULT_TIERS
    return JSON.parse(raw) as LaneTierMap
  } catch {
    return DEFAULT_TIERS
  }
}

export function saveTierMap(data: LaneTierMap): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TIER_STORE_KEY, JSON.stringify(data))
}

export function getTierMeta(): TierListMeta {
  if (typeof window === "undefined") return DEFAULT_META
  try {
    const raw = localStorage.getItem(TIER_META_KEY)
    if (!raw) return DEFAULT_META
    return JSON.parse(raw) as TierListMeta
  } catch {
    return DEFAULT_META
  }
}

export function saveTierMeta(meta: TierListMeta): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TIER_META_KEY, JSON.stringify(meta))
}

export function resetTierData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TIER_STORE_KEY)
  localStorage.removeItem(TIER_META_KEY)
}

// ====== Move hero between tiers ======
export function moveHeroTier(
  lane: LaneType,
  heroId: string,
  fromTier: TierRank,
  toTier: TierRank
): LaneTierMap {
  const data = getTierMap()
  // Remove from old tier
  data[lane][fromTier] = data[lane][fromTier].filter((id) => id !== heroId)
  // Add to new tier (avoid duplicates)
  if (!data[lane][toTier].includes(heroId)) {
    data[lane][toTier].push(heroId)
  }
  saveTierMap(data)
  return data
}

// ====== Add hero to a lane/tier ======
export function addHeroToTier(lane: LaneType, tier: TierRank, heroId: string): LaneTierMap {
  const data = getTierMap()
  // Remove from any existing tier in this lane first
  const tiers: TierRank[] = ["SS", "S", "A", "B", "C", "D"]
  for (const t of tiers) {
    data[lane][t] = data[lane][t].filter((id) => id !== heroId)
  }
  data[lane][tier].push(heroId)
  saveTierMap(data)
  return data
}

// ====== Remove hero from a lane ======
export function removeHeroFromLane(lane: LaneType, heroId: string): LaneTierMap {
  const data = getTierMap()
  const tiers: TierRank[] = ["SS", "S", "A", "B", "C", "D"]
  for (const t of tiers) {
    data[lane][t] = data[lane][t].filter((id) => id !== heroId)
  }
  saveTierMap(data)
  return data
}

// ====== Convert to display format ======
function heroIdToTierHero(heroId: string): TierHero {
  const hero = HEROES.find((h) => h.id === heroId)
  if (hero) {
    return { id: hero.id, name: hero.name, role: hero.role, image: hero.image, icon: hero.icon }
  }
  return {
    id: heroId,
    name: heroId,
    role: "Fighter" as HeroRole,
    image: "",
    icon: heroId.substring(0, 2).toUpperCase(),
  }
}

export function getStoreTierListData(): TierListData {
  const tierMap = getTierMap()
  const meta = getTierMeta()
  const tiers: TierRank[] = ["SS", "S", "A", "B", "C", "D"]

  const laneConfigs: { lane: LaneType; label: string; icon: string }[] = [
    { lane: "Roam", label: "โรมมิ่ง", icon: "shield" },
    { lane: "Exp", label: "เลนประสบการณ์", icon: "swords" },
    { lane: "Jungle", label: "ป่า", icon: "trees" },
    { lane: "Mid", label: "เลนกลาง", icon: "zap" },
    { lane: "Gold", label: "เลนทอง", icon: "coins" },
  ]

  const lanes: LaneTierList[] = laneConfigs.map((config) => ({
    lane: config.lane,
    label: config.label,
    icon: config.icon,
    tiers: tiers
      .map((t) => ({
        tier: t,
        heroes: (tierMap[config.lane]?.[t] ?? []).map(heroIdToTierHero),
      }))
      .filter((entry) => entry.heroes.length > 0),
  }))

  // Build overall
  const heroHighestTier = new Map<string, TierRank>()
  for (const lane of laneConfigs) {
    for (const t of tiers) {
      for (const heroId of tierMap[lane.lane]?.[t] ?? []) {
        if (!heroHighestTier.has(heroId)) {
          heroHighestTier.set(heroId, t)
        }
      }
    }
  }

  const overall: TierEntry[] = tiers
    .map((t) => {
      const heroes: TierHero[] = []
      const seen = new Set<string>()
      for (const lane of laneConfigs) {
        for (const heroId of tierMap[lane.lane]?.[t] ?? []) {
          if (!seen.has(heroId) && heroHighestTier.get(heroId) === t) {
            seen.add(heroId)
            heroes.push(heroIdToTierHero(heroId))
          }
        }
      }
      return { tier: t, heroes }
    })
    .filter((entry) => entry.heroes.length > 0)

  // Compute next update at midnight UTC
  const lastUpdate = new Date(meta.updatedAt)
  let nextUpdate = new Date(lastUpdate)
  nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1)
  nextUpdate.setUTCHours(0, 0, 0, 0)
  const now = new Date()
  while (nextUpdate <= now) {
    nextUpdate.setUTCDate(nextUpdate.getUTCDate() + 1)
  }

  return {
    updatedAt: meta.updatedAt,
    nextUpdateAt: nextUpdate.toISOString(),
    source: meta.source,
    patch: meta.patch,
    lanes,
    overall,
  }
}

// ====== Export / Import for backup ======
export function exportTierData(): string {
  const tierMap = getTierMap()
  const meta = getTierMeta()
  return JSON.stringify({ tierMap, meta }, null, 2)
}

export function importTierData(json: string): boolean {
  try {
    const parsed = JSON.parse(json)
    if (!parsed.tierMap || !parsed.meta) return false
    saveTierMap(parsed.tierMap)
    saveTierMeta(parsed.meta)
    return true
  } catch {
    return false
  }
}

// ====== Get heroes NOT in a specific lane (for adding) ======
export function getHeroesNotInLane(lane: LaneType): { id: string; name: string; role: HeroRole; image: string }[] {
  const tierMap = getTierMap()
  const tiers: TierRank[] = ["SS", "S", "A", "B", "C", "D"]
  const inLane = new Set<string>()
  for (const t of tiers) {
    for (const id of tierMap[lane]?.[t] ?? []) {
      inLane.add(id)
    }
  }
  return HEROES.filter((h) => !inLane.has(h.id)).map((h) => ({
    id: h.id,
    name: h.name,
    role: h.role,
    image: h.image,
  }))
}
