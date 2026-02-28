import { HEROES, type HeroRole } from "./mlbb-data"

export type TierRank = "SS" | "S" | "A" | "B" | "C" | "D"

export type LaneType = "Roam" | "Exp" | "Jungle" | "Mid" | "Gold"

export interface TierHero {
  id: string
  name: string
  role: HeroRole
  image: string
  icon: string
}

export interface TierEntry {
  tier: TierRank
  heroes: TierHero[]
}

export interface LaneTierList {
  lane: LaneType
  label: string
  icon: string
  tiers: TierEntry[]
}

export interface TierListData {
  updatedAt: string
  nextUpdateAt: string
  source: string
  patch: string
  lanes: LaneTierList[]
  overall: TierEntry[]
}

/** Map hero name to HEROES entry for image/icon lookup */
function findHero(name: string): TierHero | null {
  const normalized = name.toLowerCase().trim()
  const hero = HEROES.find(
    (h) =>
      h.name.toLowerCase() === normalized ||
      h.id === normalized.replace(/[\s'\.]/g, "-")
  )
  if (hero) {
    return { id: hero.id, name: hero.name, role: hero.role, image: hero.image, icon: hero.icon }
  }
  return {
    id: normalized.replace(/[\s'\.]/g, "-"),
    name: name.trim(),
    role: "Fighter",
    image: "",
    icon: name.trim().substring(0, 2).toUpperCase(),
  }
}

function h(str: string): TierHero[] {
  return str
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .map((n) => findHero(n))
    .filter((hero): hero is TierHero => hero !== null)
}

// ====== Lane-based tier data (Feb 2026, Patch 1.9.48 - Mythic+ Pro mode) ======
// Source: mlbb.gg / mlbbmeta.com - updated for the current lane meta

const ROAM_TIERS: TierEntry[] = [
  { tier: "SS", heroes: h("Gatotkaca, Belerick, Chip, Kalea") },
  { tier: "S", heroes: h("Khufra, Atlas, Tigreal, Lolita, Hylos, Edith, Carmilla, Johnson") },
  { tier: "A", heroes: h("Franco, Gloo, Barats, Mathilda, Floryn, Diggie, Angela, Estes") },
  { tier: "B", heroes: h("Akai, Minotaur, Rafaela, Kaja, Faramis") },
  { tier: "C", heroes: h("Uranus, Grock, Baxia") },
]

const EXP_TIERS: TierEntry[] = [
  { tier: "SS", heroes: h("Lukas, Suyou, Cici, Phoveus, Yin") },
  { tier: "S", heroes: h("Arlott, Fredrinn, Badang, Martis, Alpha, Guinevere, Esmeralda, X.Borg, Yu Zhong") },
  { tier: "A", heroes: h("Khaleed, Jawhead, Chou, Sun, Argus, Freya, Lapu-Lapu, Aulus, Thamuz, Masha") },
  { tier: "B", heroes: h("Balmond, Silvanna, Ruby, Zilong, Dyrroth, Terizla, Leomord, Aldous") },
  { tier: "C", heroes: h("Minsitthar, Hilda, Bane, Alucard") },
  { tier: "D", heroes: h("Paquito") },
]

const JUNGLE_TIERS: TierEntry[] = [
  { tier: "SS", heroes: h("Fanny, Hayabusa, Ling, Suyou") },
  { tier: "S", heroes: h("Helcurt, Saber, Benedetta, Julian, Lancelot, Karina, Hanzo, Selena, Gusion, Aamon") },
  { tier: "A", heroes: h("Joy, Nolan, Roger, Alpha, Yin, Granger, Barats") },
  { tier: "B", heroes: h("Natalia, Yi Sun-shin, Alucard, Zilong") },
  { tier: "C", heroes: h("Harley") },
]

const MID_TIERS: TierEntry[] = [
  { tier: "SS", heroes: h("Zhuxin, Kagura, Zetian") },
  { tier: "S", heroes: h("Xavier, Vale, Lunox, Aurora, Gord, Zhask, Kimmy, Yve, Valentina, Eudora") },
  { tier: "A", heroes: h("Pharsa, Cecilion, Harley, Harith, Chang'e, Luo Yi, Kadita, Odette, Nana, Lylia") },
  { tier: "B", heroes: h("Cyclops, Vexana, Valir, Alice") },
  { tier: "C", heroes: h("Novaria") },
]

const GOLD_TIERS: TierEntry[] = [
  { tier: "SS", heroes: h("Moskov, Miya, Granger, Melissa") },
  { tier: "S", heroes: h("Beatrix, Wanwan, Layla, Lesley, Bruno, Natan, Ixia, Edith") },
  { tier: "A", heroes: h("Brody, Hanabi, Clint, Claude, Irithel, Popol and Kupa, Karrie") },
  { tier: "B", heroes: h("Kimmy, Obsidia") },
]

function buildOverallTiers(): TierEntry[] {
  const allLanes = [ROAM_TIERS, EXP_TIERS, JUNGLE_TIERS, MID_TIERS, GOLD_TIERS]
  const tierMap = new Map<TierRank, TierHero[]>()
  const tiers: TierRank[] = ["SS", "S", "A", "B", "C", "D"]
  tiers.forEach((t) => tierMap.set(t, []))

  for (const laneTiers of allLanes) {
    for (const entry of laneTiers) {
      const existing = tierMap.get(entry.tier) ?? []
      existing.push(...entry.heroes)
      tierMap.set(entry.tier, existing)
    }
  }

  // Deduplicate: keep the highest tier a hero appears in
  const heroHighestTier = new Map<string, TierRank>()
  for (const t of tiers) {
    const heroes = tierMap.get(t) ?? []
    for (const hero of heroes) {
      if (!heroHighestTier.has(hero.id)) {
        heroHighestTier.set(hero.id, t)
      }
    }
  }

  return tiers
    .map((t) => {
      const heroes = tierMap.get(t) ?? []
      const seen = new Set<string>()
      const unique = heroes.filter((hero) => {
        if (seen.has(hero.id)) return false
        if (heroHighestTier.get(hero.id) !== t) return false
        seen.add(hero.id)
        return true
      })
      return { tier: t, heroes: unique }
    })
    .filter((entry) => entry.heroes.length > 0)
}

/** Compute next update: every 24 hours from the last update at midnight UTC */
function computeNextUpdate(fromDate: Date): Date {
  const next = new Date(fromDate)
  next.setUTCDate(next.getUTCDate() + 1)
  next.setUTCHours(0, 0, 0, 0)
  return next
}

const LAST_UPDATED = new Date("2026-02-28T00:00:00Z")

export function getTierListData(): TierListData {
  const now = new Date()
  let nextUpdate = computeNextUpdate(LAST_UPDATED)
  while (nextUpdate <= now) {
    nextUpdate = computeNextUpdate(nextUpdate)
  }

  return {
    updatedAt: LAST_UPDATED.toISOString(),
    nextUpdateAt: nextUpdate.toISOString(),
    source: "mlbb.gg / mlbbmeta.com",
    patch: "Patch 1.9.48",
    lanes: [
      { lane: "Roam", label: "โรมมิ่ง", icon: "shield", tiers: ROAM_TIERS },
      { lane: "Exp", label: "เลนประสบการณ์", icon: "swords", tiers: EXP_TIERS },
      { lane: "Jungle", label: "ป่า", icon: "trees", tiers: JUNGLE_TIERS },
      { lane: "Mid", label: "เลนกลาง", icon: "zap", tiers: MID_TIERS },
      { lane: "Gold", label: "เลนทอง", icon: "coins", tiers: GOLD_TIERS },
    ],
    overall: buildOverallTiers(),
  }
}
