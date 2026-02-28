import type { CounterRule, CounterItem, ItemCounterRule, Hero, ItemDef } from "./mlbb-data"

const STORAGE_KEY = "mlbb-custom-counter-rules"
const ITEMS_STORAGE_KEY = "mlbb-custom-items"
const ITEM_COUNTER_RULES_KEY = "mlbb-item-counter-rules"
const CUSTOM_HEROES_KEY = "mlbb-custom-heroes"
const CUSTOM_ITEM_DEFS_KEY = "mlbb-custom-item-defs"
const BASE_HERO_OVERRIDES_KEY = "mlbb-base-hero-overrides"
const BASE_ITEM_OVERRIDES_KEY = "mlbb-base-item-overrides"

export function getCustomRules(): CounterRule[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CounterRule[]
  } catch {
    return []
  }
}

export function saveCustomRules(rules: CounterRule[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rules))
}

export function addCustomRule(rule: CounterRule): CounterRule[] {
  const rules = getCustomRules()
  rules.push(rule)
  saveCustomRules(rules)
  return rules
}

export function updateCustomRule(index: number, rule: CounterRule): CounterRule[] {
  const rules = getCustomRules()
  if (index >= 0 && index < rules.length) {
    rules[index] = rule
    saveCustomRules(rules)
  }
  return rules
}

export function deleteCustomRule(index: number): CounterRule[] {
  const rules = getCustomRules()
  if (index >= 0 && index < rules.length) {
    rules.splice(index, 1)
    saveCustomRules(rules)
  }
  return rules
}

export function resetCustomRules(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

export function exportRulesToJSON(rules: CounterRule[]): string {
  return JSON.stringify(rules, null, 2)
}

export function importRulesFromJSON(json: string): CounterRule[] | null {
  try {
    const parsed = JSON.parse(json)
    if (!Array.isArray(parsed)) return null
    // Validate shape
    for (const r of parsed) {
      if (
        !Array.isArray(r.enemyTags) ||
        typeof r.counterId !== "string" ||
        typeof r.winRate !== "number" ||
        typeof r.reason !== "string" ||
        !["Easy", "Medium", "Hard"].includes(r.difficulty) ||
        typeof r.priority !== "number"
      ) {
        return null
      }
    }
    return parsed as CounterRule[]
  } catch {
    return null
  }
}

// ====== Custom Items CRUD ======
export function getCustomItems(): CounterItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(ITEMS_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CounterItem[]
  } catch {
    return []
  }
}

export function saveCustomItems(items: CounterItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items))
}

export function addCustomItem(item: CounterItem): CounterItem[] {
  const items = getCustomItems()
  items.push(item)
  saveCustomItems(items)
  return items
}

export function updateCustomItem(index: number, item: CounterItem): CounterItem[] {
  const items = getCustomItems()
  if (index >= 0 && index < items.length) {
    items[index] = item
    saveCustomItems(items)
  }
  return items
}

export function deleteCustomItem(index: number): CounterItem[] {
  const items = getCustomItems()
  if (index >= 0 && index < items.length) {
    items.splice(index, 1)
    saveCustomItems(items)
  }
  return items
}

export function resetCustomItems(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ITEMS_STORAGE_KEY)
}

// ====== Item Counter Rules CRUD ======
export function getItemCounterRules(): ItemCounterRule[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(ITEM_COUNTER_RULES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ItemCounterRule[]
  } catch {
    return []
  }
}

export function saveItemCounterRules(rules: ItemCounterRule[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ITEM_COUNTER_RULES_KEY, JSON.stringify(rules))
}

export function addItemCounterRule(rule: ItemCounterRule): ItemCounterRule[] {
  const rules = getItemCounterRules()
  rules.push(rule)
  saveItemCounterRules(rules)
  return rules
}

export function updateItemCounterRule(index: number, rule: ItemCounterRule): ItemCounterRule[] {
  const rules = getItemCounterRules()
  if (index >= 0 && index < rules.length) {
    rules[index] = rule
    saveItemCounterRules(rules)
  }
  return rules
}

export function deleteItemCounterRule(index: number): ItemCounterRule[] {
  const rules = getItemCounterRules()
  if (index >= 0 && index < rules.length) {
    rules.splice(index, 1)
    saveItemCounterRules(rules)
  }
  return rules
}

export function resetItemCounterRules(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ITEM_COUNTER_RULES_KEY)
}

// ====== Custom Heroes CRUD ======
export function getCustomHeroes(): Hero[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CUSTOM_HEROES_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Hero[]
  } catch {
    return []
  }
}

export function saveCustomHeroes(heroes: Hero[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CUSTOM_HEROES_KEY, JSON.stringify(heroes))
}

export function addCustomHero(hero: Hero): Hero[] {
  const heroes = getCustomHeroes()
  heroes.push(hero)
  saveCustomHeroes(heroes)
  return heroes
}

export function updateCustomHero(index: number, hero: Hero): Hero[] {
  const heroes = getCustomHeroes()
  if (index >= 0 && index < heroes.length) {
    heroes[index] = hero
    saveCustomHeroes(heroes)
  }
  return heroes
}

export function deleteCustomHero(index: number): Hero[] {
  const heroes = getCustomHeroes()
  if (index >= 0 && index < heroes.length) {
    heroes.splice(index, 1)
    saveCustomHeroes(heroes)
  }
  return heroes
}

export function resetCustomHeroes(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CUSTOM_HEROES_KEY)
}

// ====== Custom Item Definitions CRUD ======
export function getCustomItemDefs(): ItemDef[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(CUSTOM_ITEM_DEFS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ItemDef[]
  } catch {
    return []
  }
}

export function saveCustomItemDefs(items: ItemDef[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CUSTOM_ITEM_DEFS_KEY, JSON.stringify(items))
}

export function addCustomItemDef(item: ItemDef): ItemDef[] {
  const items = getCustomItemDefs()
  items.push(item)
  saveCustomItemDefs(items)
  return items
}

export function updateCustomItemDef(index: number, item: ItemDef): ItemDef[] {
  const items = getCustomItemDefs()
  if (index >= 0 && index < items.length) {
    items[index] = item
    saveCustomItemDefs(items)
  }
  return items
}

export function deleteCustomItemDef(index: number): ItemDef[] {
  const items = getCustomItemDefs()
  if (index >= 0 && index < items.length) {
    items.splice(index, 1)
    saveCustomItemDefs(items)
  }
  return items
}

export function resetCustomItemDefs(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CUSTOM_ITEM_DEFS_KEY)
}

// ====== Base Hero Overrides (edit base heroes) ======
// Stored as a record keyed by hero ID with partial overrides
export function getBaseHeroOverrides(): Record<string, Partial<Hero>> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(BASE_HERO_OVERRIDES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, Partial<Hero>>
  } catch {
    return {}
  }
}

export function saveBaseHeroOverrides(overrides: Record<string, Partial<Hero>>): void {
  if (typeof window === "undefined") return
  localStorage.setItem(BASE_HERO_OVERRIDES_KEY, JSON.stringify(overrides))
}

export function setBaseHeroOverride(heroId: string, data: Partial<Hero>): Record<string, Partial<Hero>> {
  const overrides = getBaseHeroOverrides()
  overrides[heroId] = data
  saveBaseHeroOverrides(overrides)
  return overrides
}

export function removeBaseHeroOverride(heroId: string): Record<string, Partial<Hero>> {
  const overrides = getBaseHeroOverrides()
  delete overrides[heroId]
  saveBaseHeroOverrides(overrides)
  return overrides
}

export function resetBaseHeroOverrides(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(BASE_HERO_OVERRIDES_KEY)
}

// ====== Base Item Overrides (edit base items) ======
export function getBaseItemOverrides(): Record<string, Partial<ItemDef>> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(BASE_ITEM_OVERRIDES_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, Partial<ItemDef>>
  } catch {
    return {}
  }
}

export function saveBaseItemOverrides(overrides: Record<string, Partial<ItemDef>>): void {
  if (typeof window === "undefined") return
  localStorage.setItem(BASE_ITEM_OVERRIDES_KEY, JSON.stringify(overrides))
}

export function setBaseItemOverride(itemId: string, data: Partial<ItemDef>): Record<string, Partial<ItemDef>> {
  const overrides = getBaseItemOverrides()
  overrides[itemId] = data
  saveBaseItemOverrides(overrides)
  return overrides
}

export function removeBaseItemOverride(itemId: string): Record<string, Partial<ItemDef>> {
  const overrides = getBaseItemOverrides()
  delete overrides[itemId]
  saveBaseItemOverrides(overrides)
  return overrides
}

export function resetBaseItemOverrides(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(BASE_ITEM_OVERRIDES_KEY)
}
