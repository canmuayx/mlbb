export type HeroRole = "Fighter" | "Mage" | "Marksman" | "Assassin" | "Tank" | "Support"

export interface Hero {
  id: string
  name: string
  role: HeroRole
  icon: string
  image: string
  /** Gameplay tags used for counter logic */
  tags: string[]
}

export interface CounterPick {
  hero: Hero
  winRate: number
  reason: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export interface CounterItem {
  id: string
  name: string
  icon: string
  image: string
  description: string
  price: number
  stat: string
}

/** Shape for a custom item definition (user-created) */
export interface ItemDef {
  id: string
  name: string
  icon: string
  image: string
  stat: string
  price: number
}

export type ItemPhase = "early" | "late"

export interface ItemCounterRule {
  /** Array of item IDs to use as counters */
  itemIds: string[]
  /** Array of hero IDs this item is meant to counter */
  targetHeroIds: string[]
  /** Why this item counters those heroes */
  reason: string
  /** When to buy this item */
  phase: ItemPhase
  /** Priority for ordering */
  priority: number
}

const IMG = "https://akmwebstatic.yuanzhanapp.com/web/madmin/"

// ====== HEROES (with tags that describe their strengths/weaknesses) ======
export const HEROES: Hero[] = [
  // Assassin
  { id: "ling", name: "Ling", role: "Assassin", icon: "LI", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["dash", "wall", "burst", "physical", "melee"] },
  { id: "fanny", name: "Fanny", role: "Assassin", icon: "FA", image: `${IMG}image_523a730c11b8c22fc6c3fcc5575c29a2.png`, tags: ["cable", "dash", "burst", "physical", "melee", "energy"] },
  { id: "lancelot", name: "Lancelot", role: "Assassin", icon: "LA", image: `${IMG}image_eabcac3c9021b5537605283aa6bac461.png`, tags: ["dash", "immune", "burst", "physical", "melee"] },
  { id: "gusion", name: "Gusion", role: "Assassin", icon: "GU", image: `${IMG}image_4348913ce6e58e49c47e13113af0f352.png`, tags: ["dash", "burst", "magic", "melee", "projectile"] },
  { id: "hayabusa", name: "Hayabusa", role: "Assassin", icon: "HA", image: `${IMG}image_9be54f0bee987aa88c2dd73c054c7e1d.png`, tags: ["dash", "split", "burst", "physical", "melee"] },
  { id: "helcurt", name: "Helcurt", role: "Assassin", icon: "HE", image: `${IMG}image_2baf1efb2d414acedf4a89b6fa330ad2.png`, tags: ["silence", "dash", "burst", "physical", "melee"] },
  { id: "saber", name: "Saber", role: "Assassin", icon: "SA", image: `https://akmweb.youngjoygame.com/web/madmin/image/35a5d68d1704e2c4c6323abd4859a622.jpg?w=100-100-4b3f67`, tags: ["dash", "lockdown", "burst", "physical", "melee"] },
  { id: "karina", name: "Karina", role: "Assassin", icon: "KA", image: `https://akmweb.youngjoygame.com/web/madmin/image/1691dbbde8237768590768a90510d5a6.jpg?w=100-100-f7fcc4`, tags: ["dash", "burst", "magic", "melee", "reset"] },
  { id: "benedetta", name: "Benedetta", role: "Assassin", icon: "BE", image: `${IMG}image_0d9c7f4e24b247af55c8a7a7e3faa43a.png`, tags: ["dash", "immune", "burst", "physical", "melee"] },
  { id: "joy", name: "Joy", role: "Assassin", icon: "JO", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["dash", "burst", "magic", "melee"] },
  { id: "natalia", name: "Natalia", role: "Assassin", icon: "NT", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["burst", "physical", "melee", "camo", "silence"] },
  { id: "selena", name: "Selena", role: "Assassin", icon: "SE", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["cc", "burst", "magic", "ranged", "transform"] },
  { id: "hanzo", name: "Hanzo", role: "Assassin", icon: "HZ", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["burst", "physical", "melee", "clone", "ranged"] },
  { id: "yi-sun-shin", name: "Yi Sun-shin", role: "Assassin", icon: "YS", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["burst", "physical", "ranged", "global"] },
  { id: "aamon", name: "Aamon", role: "Assassin", icon: "AM", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["burst", "magic", "melee", "camo"] },
  { id: "nolan", name: "Nolan", role: "Assassin", icon: "NO", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["dash", "burst", "physical", "melee"] },
  { id: "julian", name: "Julian", role: "Assassin", icon: "JU", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["dash", "burst", "magic", "melee"] },
  { id: "suyou", name: "Suyou", role: "Assassin", icon: "SY", image: `${IMG}image_d3e1e41eaae99efb9e5e2aa3fbe5c2b3.png`, tags: ["dash", "burst", "physical", "melee"] },
  // Fighter
  { id: "chou", name: "Chou", role: "Fighter", icon: "CH", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "cc", "immune", "burst", "physical", "melee"] },
  { id: "esmeralda", name: "Esmeralda", role: "Fighter", icon: "ES", image: `${IMG}image_b691012cb168b31b172da8b62552e746.png`, tags: ["shield", "sustain", "magic", "melee"] },
  { id: "yu-zhong", name: "Yu Zhong", role: "Fighter", icon: "YZ", image: `${IMG}image_b691012cb168b31b172da8b62552e746.png`, tags: ["sustain", "cc", "physical", "melee", "transform"] },
  { id: "paquito", name: "Paquito", role: "Fighter", icon: "PA", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "cc", "burst", "physical", "melee"] },
  { id: "thamuz", name: "Thamuz", role: "Fighter", icon: "TH", image: `${IMG}image_5348df62801bc2fe1c093f8607c2e4a2.png`, tags: ["sustain", "physical", "melee"] },
  { id: "xborg", name: "X.Borg", role: "Fighter", icon: "XB", image: `${IMG}image_1d4d7dfe38cb5e0fcfcf06b8af6b2103.png`, tags: ["truedmg", "sustained", "physical", "melee"] },
  { id: "aldous", name: "Aldous", role: "Fighter", icon: "AL", image: `${IMG}image_433f9653743e72e1e152428d26838f9e.png`, tags: ["burst", "physical", "melee", "global", "stack"] },
  { id: "alucard", name: "Alucard", role: "Fighter", icon: "AU", image: `${IMG}image_2f53289ddd423fa9bc95d380b6d79719.jpg`, tags: ["dash", "sustain", "burst", "physical", "melee"] },
  { id: "argus", name: "Argus", role: "Fighter", icon: "AR", image: `${IMG}image_2207669dcfd1d516133c922cb01de4da.png`, tags: ["immortal", "dash", "physical", "melee"] },
  { id: "badang", name: "Badang", role: "Fighter", icon: "BD", image: `${IMG}image_686f5e16b9d129d7012751241943c2c9.png`, tags: ["cc", "wall", "burst", "physical", "melee"] },
  { id: "balmond", name: "Balmond", role: "Fighter", icon: "BL", image: `${IMG}image_be884c14d560f6bc5827e2a663439f94.png`, tags: ["sustain", "physical", "melee", "execute"] },
  { id: "freya", name: "Freya", role: "Fighter", icon: "FR", image: `${IMG}image_a9a20c5d2a4a94af878a62c07ea373e0.jpg`, tags: ["dash", "cc", "burst", "physical", "melee"] },
  { id: "guinevere", name: "Guinevere", role: "Fighter", icon: "GN", image: `${IMG}image_0bb9349ff0a17747c126ea107a11e6cd.png`, tags: ["dash", "cc", "burst", "magic", "melee"] },
  { id: "jawhead", name: "Jawhead", role: "Fighter", icon: "JW", image: `${IMG}image_9bddad128d45821b7fd6abb9773d7c53.png`, tags: ["cc", "throw", "burst", "physical", "melee"] },
  { id: "lapu-lapu", name: "Lapu-Lapu", role: "Fighter", icon: "LL", image: `${IMG}image_8b60cceca5b04e97da7372f12bfeb612.jpg`, tags: ["burst", "physical", "melee", "transform"] },
  { id: "leomord", name: "Leomord", role: "Fighter", icon: "LM", image: `${IMG}image_99740402a9e53c1aed74d25541b4f2c5.png`, tags: ["dash", "burst", "physical", "melee", "mount"] },
  { id: "martis", name: "Martis", role: "Fighter", icon: "MA", image: `${IMG}image_f6b745cc6347b4666c8ae31e5bb8edaa.png`, tags: ["cc", "dash", "physical", "melee", "immune"] },
  { id: "minsitthar", name: "Minsitthar", role: "Fighter", icon: "MI", image: `${IMG}image_90e07d7b0c04bdb13304d239644dc151.png`, tags: ["antidash", "cc", "physical", "melee", "hook"] },
  { id: "ruby", name: "Ruby", role: "Fighter", icon: "RU", image: `${IMG}image_98cb31daec57c34479b8722130c4e3d0.jpg`, tags: ["sustain", "cc", "physical", "melee"] },
  { id: "sun", name: "Sun", role: "Fighter", icon: "SU", image: `${IMG}image_802a9c5f922e63054fcf11aa7d012482.png`, tags: ["clone", "physical", "melee", "sustained"] },
  { id: "terizla", name: "Terizla", role: "Fighter", icon: "TE", image: `${IMG}image_45c908d0d59990c13d229ab22db05ebb.png`, tags: ["cc", "sustained", "physical", "melee", "slow"] },
  { id: "zilong", name: "Zilong", role: "Fighter", icon: "ZI", image: `${IMG}image_3bbb2c2b8a78d0d63ecd62d74048fcf4.jpg`, tags: ["dash", "burst", "physical", "melee", "speed"] },
  { id: "bane", name: "Bane", role: "Fighter", icon: "BN2", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["burst", "physical", "melee", "sustained", "summon"] },
  { id: "alpha", name: "Alpha", role: "Fighter", icon: "AP", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "cc", "burst", "physical", "melee", "sustain"] },
  { id: "dyrroth", name: "Dyrroth", role: "Fighter", icon: "DY", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "burst", "physical", "melee"] },
  { id: "khaleed", name: "Khaleed", role: "Fighter", icon: "KL", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "cc", "sustain", "physical", "melee"] },
  { id: "silvanna", name: "Silvanna", role: "Fighter", icon: "SV", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "cc", "burst", "magic", "melee", "lockdown"] },
  { id: "masha", name: "Masha", role: "Fighter", icon: "MS", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["sustained", "physical", "melee", "speed"] },
  { id: "phoveus", name: "Phoveus", role: "Fighter", icon: "PV", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["cc", "sustain", "magic", "melee", "antidash"] },
  { id: "aulus", name: "Aulus", role: "Fighter", icon: "AUL", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["cc", "sustained", "physical", "melee", "stack"] },
  { id: "yin", name: "Yin", role: "Fighter", icon: "YN", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "burst", "physical", "melee", "lockdown"] },
  { id: "fredrinn", name: "Fredrinn", role: "Fighter", icon: "FD", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["cc", "sustained", "physical", "melee", "reflect"] },
  { id: "arlott", name: "Arlott", role: "Fighter", icon: "ARL", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "cc", "burst", "physical", "melee"] },
  { id: "cici", name: "Cici", role: "Fighter", icon: "CI", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "sustain", "physical", "melee"] },
  { id: "lukas", name: "Lukas", role: "Fighter", icon: "LK", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["sustain", "physical", "melee", "transform"] },
  { id: "sora", name: "Sora", role: "Fighter", icon: "SR", image: `${IMG}image_a3dd4a2b8bd5b8f25a8dd520f2c1c71a.png`, tags: ["dash", "burst", "cc", "physical", "melee", "transform", "stack"] },
  // Mage
  { id: "lunox", name: "Lunox", role: "Mage", icon: "LU", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["burst", "sustain", "magic", "immune", "ranged"] },
  { id: "kagura", name: "Kagura", role: "Mage", icon: "KG", image: `${IMG}image_732a35fdfffc4d5618f4e3a1f71e39a7.png`, tags: ["burst", "cc", "magic", "purify", "ranged", "projectile"] },
  { id: "valentina", name: "Valentina", role: "Mage", icon: "VA", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["burst", "cc", "magic", "copy", "ranged"] },
  { id: "yve", name: "Yve", role: "Mage", icon: "YV", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["zone", "cc", "magic", "ranged", "channel"] },
  { id: "pharsa", name: "Pharsa", role: "Mage", icon: "PH", image: `${IMG}image_212e59ee7c8490397278ba68c8063a19.png`, tags: ["burst", "magic", "ranged", "channel", "fly"] },
  { id: "cecilion", name: "Cecilion", role: "Mage", icon: "CE", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["burst", "magic", "ranged", "scaling"] },
  { id: "alice", name: "Alice", role: "Mage", icon: "AI", image: `${IMG}image_7f0da9c3ddefff4530e8dbe17054c45e.png`, tags: ["sustain", "magic", "melee", "channel"] },
  { id: "aurora", name: "Aurora", role: "Mage", icon: "AO", image: `${IMG}image_e03bc05ecfcc5b9a97c7dc0b36767d61.png`, tags: ["burst", "cc", "magic", "ranged", "freeze"] },
  { id: "chang-e", name: "Chang'e", role: "Mage", icon: "CG", image: `${IMG}image_1a6b949d43ed33a7ad939ee4a0420b3e.png`, tags: ["burst", "magic", "ranged", "channel"] },
  { id: "cyclops", name: "Cyclops", role: "Mage", icon: "CY", image: `${IMG}image_cef4d89fd02965d3aae272c30990dbe8.png`, tags: ["burst", "cc", "magic", "ranged"] },
  { id: "eudora", name: "Eudora", role: "Mage", icon: "EU", image: `${IMG}image_ed32e3c71ecd41652fc54a7efd02aba4.jpg`, tags: ["burst", "cc", "magic", "ranged"] },
  { id: "harith", name: "Harith", role: "Mage", icon: "HI", image: `${IMG}image_6df4352d8f0d6ce429ad308d323c6206.png`, tags: ["dash", "burst", "magic", "melee"] },
  { id: "harley", name: "Harley", role: "Mage", icon: "HL", image: `${IMG}image_a2f1d7806d874283c83913f14a533bb0.png`, tags: ["dash", "burst", "magic", "ranged", "teleport"] },
  { id: "kadita", name: "Kadita", role: "Mage", icon: "KD", image: `${IMG}image_c8bec784a42a812db26ea3f34c029fdc.png`, tags: ["burst", "cc", "magic", "immune", "ranged"] },
  { id: "lylia", name: "Lylia", role: "Mage", icon: "LY", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["burst", "magic", "ranged", "rewind"] },
  { id: "nana", name: "Nana", role: "Mage", icon: "NA", image: `${IMG}image_08d0332be76ff7bdd894f7c7227be56c.png`, tags: ["cc", "magic", "ranged", "transform", "revive"] },
  { id: "odette", name: "Odette", role: "Mage", icon: "OD", image: `${IMG}image_52fb977cbea359297a830eef50cc33c2.png`, tags: ["burst", "cc", "magic", "ranged", "channel"] },
  { id: "vale", name: "Vale", role: "Mage", icon: "VL", image: `${IMG}image_de9363822c6d50d5dde8500a05b9657b.png`, tags: ["burst", "cc", "magic", "ranged"] },
  { id: "valir", name: "Valir", role: "Mage", icon: "VR", image: `${IMG}image_11c3284b5ea83dfd377f4d1b9724c960.jpg`, tags: ["cc", "magic", "ranged", "pushback", "sustained"] },
  { id: "vexana", name: "Vexana", role: "Mage", icon: "VX", image: `${IMG}image_b77a4d3d94ddbc2302603ba74e95a326.png`, tags: ["burst", "cc", "magic", "ranged", "summon"] },
  { id: "zhask", name: "Zhask", role: "Mage", icon: "ZH", image: `${IMG}image_ca13970038ce4d7590d2f271b6c6f7f5.png`, tags: ["zone", "magic", "ranged", "summon", "sustained"] },
  { id: "gord", name: "Gord", role: "Mage", icon: "GD", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["burst", "magic", "ranged", "channel"] },
  { id: "luo-yi", name: "Luo Yi", role: "Mage", icon: "LI2", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["cc", "magic", "ranged", "teleport"] },
  { id: "xavier", name: "Xavier", role: "Mage", icon: "XV", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["burst", "magic", "ranged", "longrange", "projectile"] },
  { id: "novaria", name: "Novaria", role: "Mage", icon: "NV", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["burst", "magic", "ranged", "projectile"] },
  { id: "zhuxin", name: "Zhuxin", role: "Mage", icon: "ZX", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["cc", "sustained", "magic", "ranged"] },
  { id: "zetian", name: "Zetian", role: "Mage", icon: "ZT", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["cc", "burst", "magic", "ranged"] },
  { id: "kimmy", name: "Kimmy", role: "Mage", icon: "KM", image: `${IMG}image_823bd0fce2a95b8452d52750df8d35f5.png`, tags: ["sustained", "magic", "ranged", "physical"] },
  // Marksman
  { id: "beatrix", name: "Beatrix", role: "Marksman", icon: "BT", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["burst", "physical", "ranged", "multiweapon"] },
  { id: "wanwan", name: "Wanwan", role: "Marksman", icon: "WW", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["dash", "burst", "physical", "ranged", "purify"] },
  { id: "brody", name: "Brody", role: "Marksman", icon: "BR", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["burst", "physical", "ranged", "stack"] },
  { id: "moskov", name: "Moskov", role: "Marksman", icon: "MO", image: `${IMG}image_1ec30f6756a980ef6567f304484efb64.png`, tags: ["dash", "cc", "physical", "ranged"] },
  { id: "bruno", name: "Bruno", role: "Marksman", icon: "BN", image: `${IMG}image_46fd4d9fa09a27e61b7481e1aeaa0615.png`, tags: ["burst", "physical", "ranged", "crit"] },
  { id: "claude", name: "Claude", role: "Marksman", icon: "CL", image: `${IMG}image_99318a0a409d80f0f2d4b47ee63b6bda.png`, tags: ["dash", "burst", "physical", "ranged", "aoe"] },
  { id: "clint", name: "Clint", role: "Marksman", icon: "CT", image: `${IMG}image_324e2b04393700944b2b54f2f6c939b5.jpg`, tags: ["burst", "physical", "ranged"] },
  { id: "granger", name: "Granger", role: "Marksman", icon: "GR", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["dash", "burst", "physical", "ranged"] },
  { id: "hanabi", name: "Hanabi", role: "Marksman", icon: "HB", image: `${IMG}image_2dd679133fc379d77bbe4aefbf5d2d5a.png`, tags: ["physical", "ranged", "ccimmune", "sustained"] },
  { id: "irithel", name: "Irithel", role: "Marksman", icon: "IR", image: `${IMG}image_1a30fb8c6fc6086fc2b3c9795e7305e6.png`, tags: ["burst", "physical", "ranged", "crit"] },
  { id: "karrie", name: "Karrie", role: "Marksman", icon: "KR", image: `${IMG}image_2ae89c203ad1488fa1af6b7e51dae488.png`, tags: ["truedmg", "physical", "ranged", "sustained"] },
  { id: "layla", name: "Layla", role: "Marksman", icon: "LO", image: `${IMG}image_a05a03db633cc03ef3f733d2786073c4.jpg`, tags: ["burst", "physical", "ranged", "longrange"] },
  { id: "lesley", name: "Lesley", role: "Marksman", icon: "LE", image: `${IMG}image_501184878b7de1c9e625233928627551.png`, tags: ["burst", "physical", "ranged", "crit", "camo"] },
  { id: "melissa", name: "Melissa", role: "Marksman", icon: "ML", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["burst", "physical", "ranged", "zone"] },
  { id: "miya", name: "Miya", role: "Marksman", icon: "MY", image: `${IMG}image_a844f9aa51baefa6878801edd85fec5e.png`, tags: ["physical", "ranged", "purify", "sustained"] },
  { id: "roger", name: "Roger", role: "Marksman", icon: "RO", image: `${IMG}image_d2f1ce4289d7399177b7f8a25bdf593d.png`, tags: ["dash", "burst", "physical", "transform"] },
  { id: "popol-and-kupa", name: "Popol and Kupa", role: "Marksman", icon: "PK", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["cc", "physical", "ranged", "summon"] },
  { id: "natan", name: "Natan", role: "Marksman", icon: "NN", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["burst", "magic", "ranged"] },
  { id: "ixia", name: "Ixia", role: "Marksman", icon: "IX", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["burst", "physical", "ranged", "sustained"] },
  { id: "edith", name: "Edith", role: "Marksman", icon: "ED", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["cc", "burst", "physical", "ranged", "transform"] },
  { id: "obsidia", name: "Obsidia", role: "Marksman", icon: "OB", image: `${IMG}image_c7e48401ff0d33cb91ff1b4a59b3c0cf.png`, tags: ["burst", "physical", "ranged"] },
  // Tank
  { id: "atlas", name: "Atlas", role: "Tank", icon: "AT", image: `${IMG}image_398cd0a73db63a4b098ab28de5953a0d.png`, tags: ["cc", "magic", "melee", "aoe", "setup"] },
  { id: "khufra", name: "Khufra", role: "Tank", icon: "KH", image: `${IMG}image_398cd0a73db63a4b098ab28de5953a0d.png`, tags: ["antidash", "cc", "magic", "melee"] },
  { id: "franco", name: "Franco", role: "Tank", icon: "FN", image: `${IMG}image_07605801972ede9147e9769ac7991aa0.png`, tags: ["cc", "hook", "physical", "melee", "lockdown"] },
  { id: "tigreal", name: "Tigreal", role: "Tank", icon: "TI", image: `${IMG}image_23a7a603ff9d20074777d52e2eb202f3.jpg`, tags: ["cc", "physical", "melee", "aoe", "setup"] },
  { id: "akai", name: "Akai", role: "Tank", icon: "AK", image: `${IMG}image_5f694a5e98b116d1cbb143c8e766019b.png`, tags: ["cc", "physical", "melee", "pushback"] },
  { id: "baxia", name: "Baxia", role: "Tank", icon: "BX", image: `${IMG}image_398cd0a73db63a4b098ab28de5953a0d.png`, tags: ["antiheal", "magic", "melee", "dash"] },
  { id: "belerick", name: "Belerick", role: "Tank", icon: "BK", image: `${IMG}image_f9b01617505b9562d3bbc75e9d392c91.jpg`, tags: ["cc", "sustain", "magic", "melee", "reflect"] },
  { id: "gatotkaca", name: "Gatotkaca", role: "Tank", icon: "GT", image: `${IMG}image_8b7e7d0bf164c78553806661deb1d672.png`, tags: ["cc", "magic", "melee", "taunt", "global"] },
  { id: "gloo", name: "Gloo", role: "Tank", icon: "GL", image: `${IMG}image_398cd0a73db63a4b098ab28de5953a0d.png`, tags: ["cc", "sustain", "magic", "melee", "attach"] },
  { id: "grock", name: "Grock", role: "Tank", icon: "GK", image: `${IMG}image_47c9a9a373919fd9cc0c68ff7788b32a.png`, tags: ["cc", "physical", "melee", "wall"] },
  { id: "hilda", name: "Hilda", role: "Tank", icon: "HD", image: `${IMG}image_fec6f3923209642a74789e42c41a2038.png`, tags: ["burst", "physical", "melee", "bush", "sustain"] },
  { id: "hylos", name: "Hylos", role: "Tank", icon: "HY", image: `${IMG}image_f3ddb1088279d711417234034024223d.png`, tags: ["cc", "sustain", "magic", "melee"] },
  { id: "johnson", name: "Johnson", role: "Tank", icon: "JN", image: `${IMG}image_bb588518788b5eefec870813bfdb8944.png`, tags: ["cc", "magic", "melee", "global", "transform"] },
  { id: "lolita", name: "Lolita", role: "Tank", icon: "LT", image: `${IMG}image_007ce553513122fdab39684dbbe215e3.png`, tags: ["cc", "physical", "melee", "block", "shield"] },
  { id: "minotaur", name: "Minotaur", role: "Tank", icon: "MN", image: `https://akmweb.youngjoygame.com/web/madmin/image/1ec5d92a9e0981838a6b362cd21cbdb0.jpg?w=100-100-3c0d15`, tags: ["cc", "sustain", "magic", "melee", "heal"] },
  { id: "uranus", name: "Uranus", role: "Tank", icon: "UR", image: `${IMG}image_03f3e7982542f805a4ec9e5659ed217e.png`, tags: ["sustain", "magic", "melee"] },
  { id: "barats", name: "Barats", role: "Tank", icon: "BR2", image: `${IMG}image_398cd0a73db63a4b098ab28de5953a0d.png`, tags: ["cc", "physical", "melee", "stack", "sustained"] },
  // Support
  { id: "angela", name: "Angela", role: "Support", icon: "AG", image: `${IMG}image_feffcc9c39731586e645dbef2ce70afd.png`, tags: ["cc", "sustain", "magic", "ranged", "attach"] },
  { id: "diggie", name: "Diggie", role: "Support", icon: "DI", image: `${IMG}image_84b30de71c6315ecc936a8b4d5076efc.png`, tags: ["cc", "magic", "ranged", "purify", "anticchero"] },
  { id: "estes", name: "Estes", role: "Support", icon: "ET", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["sustain", "magic", "ranged", "heal"] },
  { id: "floryn", name: "Floryn", role: "Support", icon: "FL", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["sustain", "magic", "ranged", "heal", "global"] },
  { id: "mathilda", name: "Mathilda", role: "Support", icon: "MT", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["dash", "cc", "physical", "melee"] },
  { id: "rafaela", name: "Rafaela", role: "Support", icon: "RA", image: `${IMG}image_549ab8159821398b48e7e79ceb298396.png`, tags: ["sustain", "cc", "magic", "ranged", "heal", "speed"] },
  { id: "kaja", name: "Kaja", role: "Support", icon: "KJ", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["cc", "magic", "melee", "lockdown"] },
  { id: "faramis", name: "Faramis", role: "Support", icon: "FM", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["magic", "ranged", "revive"] },
  { id: "carmilla", name: "Carmilla", role: "Support", icon: "CM", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["cc", "magic", "melee", "sustain"] },
  { id: "chip", name: "Chip", role: "Support", icon: "CP", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["cc", "magic", "ranged", "teleport"] },
  { id: "kalea", name: "Kalea", role: "Support", icon: "KLE", image: `${IMG}image_42b2d76fe927ce57a1d29e220e2b5eea.png`, tags: ["cc", "sustain", "magic", "melee"] },
]

export const ROLE_COLORS: Record<HeroRole, string> = {
  Fighter: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Mage: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Marksman: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Assassin: "bg-red-500/20 text-red-400 border-red-500/30",
  Tank: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Support: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
}

export const ROLE_BG_COLORS: Record<HeroRole, string> = {
  Fighter: "from-orange-600 to-orange-800",
  Mage: "from-blue-600 to-blue-800",
  Marksman: "from-yellow-600 to-yellow-800",
  Assassin: "from-red-600 to-red-800",
  Tank: "from-emerald-600 to-emerald-800",
  Support: "from-cyan-600 to-cyan-800",
}

// ====== COUNTER RULES ENGINE ======
// Each rule defines: which enemy tags trigger it, which counter hero is good, why, how easy, how good (priority)
export interface CounterRule {
  /** Tags the ENEMY hero must have (all must match) */
  enemyTags: string[]
  /** Counter hero ID */
  counterId: string
  /** Win rate estimate */
  winRate: number
  /** Reason in Thai */
  reason: string
  difficulty: "Easy" | "Medium" | "Hard"
  /** Higher = shows first */
  priority: number
}

export const COUNTER_RULES: CounterRule[] = [
  // --- Anti-Dash heroes ---
  { enemyTags: ["dash"], counterId: "khufra", winRate: 65, reason: "Khufra สกิล 2 (Bouncing Ball) หยุด Dash ของศัตรูได้ทุกสกิล ทำให้หมดทางหนีหรือเข้าถึงเป้าหมาย", difficulty: "Easy", priority: 95 },
  { enemyTags: ["dash"], counterId: "minsitthar", winRate: 63, reason: "Minsitthar Ultimate สร้างโซนห้ามใช้ Dash/Blink ทำให้ศัตรูหนีไม่ได้เลย", difficulty: "Easy", priority: 90 },
  { enemyTags: ["dash"], counterId: "franco", winRate: 60, reason: "Franco ใช้ Hook จับศัตรูแล้วกด Ultimate ล็อคไว้ ทำให้ Dash ไม่มีความหมาย", difficulty: "Medium", priority: 75 },

  // --- Anti-Cable (Fanny specific) ---
  { enemyTags: ["cable"], counterId: "khufra", winRate: 72, reason: "Khufra เป็นตัวแก้ที่ดีที่สุดของ Fanny สกิล 2 หยุดการบินเคเบิลได้ทันที", difficulty: "Easy", priority: 100 },
  { enemyTags: ["cable"], counterId: "minsitthar", winRate: 70, reason: "Minsitthar Ultimate สร้างโซนห้าม Dash/Blink ทำให้ Fanny บินผ่านโซนไม่ได้เลย", difficulty: "Easy", priority: 98 },
  { enemyTags: ["cable"], counterId: "saber", winRate: 62, reason: "Saber Ultimate ล็อค Fanny ไว้กับที่ ทำให้หยุดบินทันที", difficulty: "Easy", priority: 85 },
  { enemyTags: ["cable"], counterId: "chou", winRate: 55, reason: "Chou สามารถเตะ Fanny ออกจากเคเบิล ถ้าจับจังหวะได้จะ CC ล็อคไว้ให้ทีมรุม", difficulty: "Hard", priority: 60 },
  { enemyTags: ["cable"], counterId: "akai", winRate: 58, reason: "Akai Ultimate หมุนดัน Fanny ให้ติดกำแพง ตัดเคเบิลทั้งหมด", difficulty: "Medium", priority: 70 },

  // --- Anti-Immune (Lancelot, Benedetta, etc.) ---
  { enemyTags: ["immune"], counterId: "saber", winRate: 62, reason: "Saber Ultimate Suppress ล็อคศัตรูไว้ก่อนที่จะใช้สกิล Immune ได้", difficulty: "Easy", priority: 88 },
  { enemyTags: ["immune"], counterId: "franco", winRate: 60, reason: "Franco Ultimate Suppress ล็อคศัตรูไว้ไม่ให้ใช้สกิล Immune", difficulty: "Medium", priority: 82 },
  { enemyTags: ["immune"], counterId: "karina", winRate: 56, reason: "Karina สามารถรอจังหวะหลัง Immune หมดแล้วเข้า Burst ได้ทันที", difficulty: "Medium", priority: 50 },

  // --- Anti-Burst Physical ---
  { enemyTags: ["burst", "physical"], counterId: "lolita", winRate: 58, reason: "Lolita สกิล 2 Shield กั้นดาเมจ Projectile ป้องกันทีมจาก Physical Burst", difficulty: "Medium", priority: 65 },
  { enemyTags: ["burst", "physical"], counterId: "gatotkaca", winRate: 60, reason: "Gatotkaca Passive แปลง Physical Damage ที่รับเป็น Magic Power ยิ่งโดนตียิ่งแข็ง", difficulty: "Easy", priority: 70 },
  { enemyTags: ["burst", "physical"], counterId: "belerick", winRate: 58, reason: "Belerick Passive สะท้อน Damage กลับ ทำให้ศัตรูที่ Burst เจ็บตัวเองด้วย", difficulty: "Easy", priority: 60 },

  // --- Anti-Burst Magic ---
  { enemyTags: ["burst", "magic"], counterId: "lolita", winRate: 62, reason: "Lolita สกิล 2 Shield บล็อกดาเมจ Magic Projectile ป้องกันทีมทั้งหมด", difficulty: "Easy", priority: 80 },
  { enemyTags: ["burst", "magic"], counterId: "diggie", winRate: 58, reason: "Diggie Ultimate Purify ทั้งทีม หลุดจาก CC และ��ดดาเมจ Magic Burst", difficulty: "Easy", priority: 65 },

  // --- Anti-Sustain / Anti-Heal ---
  { enemyTags: ["sustain"], counterId: "baxia", winRate: 67, reason: "Baxia Passive ลด HP Regen/Shield ของศัตรูรอบตัว ทำให้ดูดเลือดแทบไม่ได้", difficulty: "Easy", priority: 95 },
  { enemyTags: ["sustain"], counterId: "karrie", winRate: 62, reason: "Karrie ยิง True Damage ตาม %HP สูง เจาะทะลุความอึดของศัตรูที่ดูดเลือด", difficulty: "Easy", priority: 80 },
  { enemyTags: ["sustain"], counterId: "xborg", winRate: 58, reason: "X.Borg ดาเมจ True Damage จากไฟ ทำให้ศัตรูที่ด�������ดเลือดรับดาเมจตลอด", difficulty: "Medium", priority: 65 },
  { enemyTags: ["sustain"], counterId: "esmeralda", winRate: 57, reason: "Esmeralda ดูด Shield ของศัตรูมาเป็นของตัวเอง สู้ยาวได้ดีกว่า", difficulty: "Medium", priority: 60 },

  // --- Anti-Shield ---
  { enemyTags: ["shield"], counterId: "baxia", winRate: 65, reason: "Baxia Passive ลด Shield Generation ของศัตรูรอบตัว ตัดกำลังอย่างมาก", difficulty: "Easy", priority: 90 },
  { enemyTags: ["shield"], counterId: "karrie", winRate: 63, reason: "Karrie True Damage ตาม %HP ทะลุ Shield ได้โดยตรง", difficulty: "Easy", priority: 85 },
  { enemyTags: ["shield"], counterId: "lunox", winRate: 58, reason: "Lunox Chaos mode ดาเมจเจาะ DEF สูง ทำลาย Shield ได้เร็ว", difficulty: "Medium", priority: 65 },

  // --- Anti-CC heroes (Purify/Immune heroes counter CC enemies) ---
  { enemyTags: ["cc"], counterId: "diggie", winRate: 68, reason: "Diggie Ultimate Purify ปลด CC ทั้งทีม ทำให้ CC ศัตรูไร้ค่าทันที", difficulty: "Easy", priority: 95 },
  { enemyTags: ["cc"], counterId: "kagura", winRate: 57, reason: "Kagura สกิล 2 Purify หลุดจาก CC แล้วตอบโต้ศัตรูกลับได้", difficulty: "Hard", priority: 55 },
  { enemyTags: ["cc"], counterId: "wanwan", winRate: 56, reason: "Wanwan Passive Dash หลบ CC ได้ แถมถ้าเปิดจุดอ่อนครบจะ Ultimate ลอยตัว", difficulty: "Hard", priority: 50 },

  // --- Anti-Channel (Odette, Pharsa, Yve, Chang'e, etc.) ---
  { enemyTags: ["channel"], counterId: "saber", winRate: 67, reason: "Saber Ultimate ตัด Channel ของศัตรูทันทีด้วย Suppress ไม่สามารถต้านทานได้", difficulty: "Easy", priority: 95 },
  { enemyTags: ["channel"], counterId: "franco", winRate: 65, reason: "Franco Ultimate Suppress หยุด Channel ของศัตรูทันที ไม่ว่าจะกำลังร่ายอะไร", difficulty: "Medium", priority: 90 },
  { enemyTags: ["channel"], counterId: "helcurt", winRate: 63, reason: "Helcurt Silence ทำให้ศัตรูที่กำ���ัง Channel หยุดใช้สกิลทันที", difficulty: "Easy", priority: 88 },
  { enemyTags: ["channel"], counterId: "chou", winRate: 60, reason: "Chou เตะศัตรูออกจากตำแหน่ง Channel ด้วย Ultimate", difficulty: "Medium", priority: 75 },
  { enemyTags: ["channel"], counterId: "atlas", winRate: 58, reason: "Atlas Ultimate จับศัตรูที่กำลัง Channel ให้หยุดทันที", difficulty: "Medium", priority: 70 },

  // --- Anti-Silence heroes ---
  { enemyTags: ["silence"], counterId: "diggie", winRate: 65, reason: "Diggie Ultimate Purify ปลด Silence ทั้งทีมทันที", difficulty: "Easy", priority: 90 },
  { enemyTags: ["silence"], counterId: "kagura", winRate: 55, reason: "Kagura สกิล 2 Purify หลุดจาก Silence ได้", difficulty: "Medium", priority: 60 },

  // --- Anti-Projectile ---
  { enemyTags: ["projectile"], counterId: "lolita", winRate: 68, reason: "Lolita สกิล 2 Shield บล็อก Projectile ทั้งหมด ทำให้ดาเมจหายไปหมดเลย", difficulty: "Easy", priority: 98 },

  // --- Anti-Summon/Clone ---
  { enemyTags: ["summon"], counterId: "xborg", winRate: 60, reason: "X.Borg ไฟเผาทั้ง Summon และตัวจริง ทำลายได้เร็ว", difficulty: "Easy", priority: 75 },
  { enemyTags: ["summon"], counterId: "valir", winRate: 58, reason: "Valir ไฟเผา Summon/Clone หมดเร็ว แถมผลักตัวจริงออก", difficulty: "Medium", priority: 70 },
  { enemyTags: ["clone"], counterId: "xborg", winRate: 63, reason: "X.Borg True Damage ไฟเผา Clone ของศัตรูหมดเร็วมาก", difficulty: "Easy", priority: 85 },
  { enemyTags: ["clone"], counterId: "valir", winRate: 60, reason: "Valir ไฟเผาตัว Clone หมดเร็ว แถมผลักตัวจริงออกจากระยะ", difficulty: "Easy", priority: 80 },
  { enemyTags: ["clone"], counterId: "chang-e", winRate: 58, reason: "Chang'e Ultimate ยิงไล่ทำลาย Clone ทั้งหมดพร้อมกัน", difficulty: "Medium", priority: 72 },

  // --- Anti-Hook ---
  { enemyTags: ["hook"], counterId: "diggie", winRate: 65, reason: "Diggie Ultimate Purify ปลดทีมจาก Hook + CC ทันที", difficulty: "Easy", priority: 85 },
  { enemyTags: ["hook"], counterId: "chou", winRate: 58, reason: "Chou สกิล 2 Immune หลบ Hook ได้ถ้าจับจังหวะดี", difficulty: "Hard", priority: 55 },

  // --- Anti-Global (Aldous, Johnson, etc.) ---
  { enemyTags: ["global"], counterId: "khufra", winRate: 63, reason: "Khufra สกิล 2 หยุดศัตรูที่บินมาด้วย Ultimate Global", difficulty: "Easy", priority: 85 },
  { enemyTags: ["global"], counterId: "diggie", winRate: 62, reason: "Diggie Ultimate Purify ทั้งทีม หลุดจากการถูกจับหลัง Global เข้ามา", difficulty: "Easy", priority: 80 },
  { enemyTags: ["global"], counterId: "franco", winRate: 58, reason: "Franco Ultimate Suppress ล็อคศัตรูที่บินมาทันที", difficulty: "Medium", priority: 70 },

  // --- Anti-Immortal (Argus) ---
  { enemyTags: ["immortal"], counterId: "franco", winRate: 63, reason: "Franco Ultimate ล็อค Argus ไว้ เทสกิลรอให้หมดเวลา Immortal แล้วจัดการ", difficulty: "Easy", priority: 90 },
  { enemyTags: ["immortal"], counterId: "khufra", winRate: 60, reason: "Khufra CC ล็อค Argus จนหมดเวลา Ultimate Immortal", difficulty: "Easy", priority: 85 },
  { enemyTags: ["immortal"], counterId: "atlas", winRate: 58, reason: "Atlas Ultimate จับ Argus ไว้ รอหมดเวลา Immortal แล้วทีมรุม", difficulty: "Medium", priority: 75 },

  // --- Anti-Attach (Angela, Gloo) ---
  { enemyTags: ["attach"], counterId: "saber", winRate: 62, reason: "Saber Ultimate ล็อคศัตรูก่อนที่จะ Attach เข้าตัวเพื่อนทัน", difficulty: "Easy", priority: 85 },
  { enemyTags: ["attach"], counterId: "helcurt", winRate: 60, reason: "Helcurt Silence ทำให้ศัตรูใช้สกิล Attach ไม่ได้", difficulty: "Easy", priority: 80 },

  // --- Anti-Heal ---
  { enemyTags: ["heal"], counterId: "baxia", winRate: 70, reason: "Baxia Passive ลด HP Regen/Heal ทำให้การ Heal ของศัตรูแทบไร้ค่า", difficulty: "Easy", priority: 98 },
  { enemyTags: ["heal"], counterId: "esmeralda", winRate: 55, reason: "Esmeralda ดูด Shield ��ทน Heal ทำให้ศัตรูที่ Heal ไ��้เปรียบน้อยลง", difficulty: "Medium", priority: 50 },

  // --- Anti-Transform (Yu Zhong, Roger, Johnson) ---
  { enemyTags: ["transform"], counterId: "saber", winRate: 62, reason: "Saber Ultimate ล็อคศัตรูก่อนหรือระหว่าง Transform ได้", difficulty: "Easy", priority: 80 },
  { enemyTags: ["transform"], counterId: "khufra", winRate: 60, reason: "Khufra สกิล 2 หยุดการเคลื่อนที่ของศัตรูทั้งร่างปกติและ Transform", difficulty: "Easy", priority: 75 },

  // --- Anti-Lockdown (Saber, Franco) ---
  { enemyTags: ["lockdown"], counterId: "diggie", winRate: 68, reason: "Diggie Ultimate Purify ปลดทีมจาก Suppress/Lockdown ทันที", difficulty: "Easy", priority: 95 },
  { enemyTags: ["lockdown"], counterId: "lancelot", winRate: 60, reason: "Lancelot สกิล 2 Immune หลบ Ultimate Suppress ได้", difficulty: "Medium", priority: 70 },
  { enemyTags: ["lockdown"], counterId: "chou", winRate: 58, reason: "Chou สกิล 2 Immune หลบ Lockdown แล้วตอบโต้ได้", difficulty: "Medium", priority: 65 },

  // --- Anti-Wall (Grock, Badang) ---
  { enemyTags: ["wall"], counterId: "diggie", winRate: 65, reason: "Diggie Ultimate Purify ทั้งทีม หลุดจากการติดกำแพง/CC ทันที", difficulty: "Easy", priority: 85 },
  { enemyTags: ["wall"], counterId: "lancelot", winRate: 60, reason: "Lancelot สกิล 2 Immune ทะลุกำแพงศัตรูได้", difficulty: "Medium", priority: 70 },
  { enemyTags: ["wall"], counterId: "kagura", winRate: 58, reason: "Kagura สกิล 2 Purify หลุดจากกำแพงศัตรูได้ทันที", difficulty: "Medium", priority: 65 },

  // --- Anti-Fly ---
  { enemyTags: ["fly"], counterId: "saber", winRate: 67, reason: "Saber Ultimate ดึงศัตรูลงจากการบินทันที ด้วย Suppress", difficulty: "Easy", priority: 95 },
  { enemyTags: ["fly"], counterId: "helcurt", winRate: 63, reason: "Helcurt Silence ทำให้ศัตรูที่บินอยู่หยุดบินทันที", difficulty: "Easy", priority: 85 },

  // --- Anti-Setup (Atlas, Tigreal AoE CC) ---
  { enemyTags: ["setup"], counterId: "diggie", winRate: 70, reason: "Diggie Ultimate Purify ทั้งทีม ทำให้ Setup AoE CC ของศัตรูไร้ค่าทันที", difficulty: "Easy", priority: 98 },
  { enemyTags: ["setup"], counterId: "valir", winRate: 62, reason: "Valir สกิล 2 ผลักศัตรู Tank ออกก่อนเข้ามาตั้ง CC", difficulty: "Easy", priority: 82 },
  { enemyTags: ["setup"], counterId: "wanwan", winRate: 56, reason: "Wanwan Dash หลบ CC Setup จาก Tank ได้ด้วย Passive", difficulty: "Hard", priority: 55 },

  // --- Anti-Pushback ---
  { enemyTags: ["pushback"], counterId: "lancelot", winRate: 60, reason: "Lancelot สกิล 2 Immune ทำให้ไม่ถูกผลักได้", difficulty: "Medium", priority: 70 },
  { enemyTags: ["pushback"], counterId: "chou", winRate: 58, reason: "Chou สกิล 2 Immune หลบการถูกผลักได้", difficulty: "Medium", priority: 65 },
  { enemyTags: ["pushback"], counterId: "kagura", winRate: 55, reason: "Kagura Purify หลุดจากการถูกผลักได้ทันที", difficulty: "Medium", priority: 55 },

  // --- Anti-Taunt ---
  { enemyTags: ["taunt"], counterId: "diggie", winRate: 68, reason: "Diggie Ultimate Purify ปลด Taunt ทั้งทีมทันที", difficulty: "Easy", priority: 90 },
  { enemyTags: ["taunt"], counterId: "kagura", winRate: 58, reason: "Kagura สกิล 2 Purify หลุดจาก Taunt ได้", difficulty: "Medium", priority: 60 },

  // --- Anti-Zone/Sustained ---
  { enemyTags: ["zone"], counterId: "saber", winRate: 62, reason: "Saber Ultimate Suppress ดึงศัตรูออกจาก Zone ที่ตั้งไว้", difficulty: "Easy", priority: 80 },
  { enemyTags: ["zone"], counterId: "franco", winRate: 60, reason: "Franco Hook ดึงศัตรูออกจากโซนควบคุมที่ตั้งไว้", difficulty: "Medium", priority: 75 },
  { enemyTags: ["zone"], counterId: "lancelot", winRate: 58, reason: "Lancelot Dash เข้าถึงศัตรูในโซนแล้ว Immune หลบดาเมจ", difficulty: "Medium", priority: 65 },

  // --- Anti-Copy (Valentina) ---
  { enemyTags: ["copy"], counterId: "saber", winRate: 63, reason: "Saber Ultimate ล็อค Valentina ก่อนที่จะขโมย Ultimate ได้", difficulty: "Easy", priority: 88 },
  { enemyTags: ["copy"], counterId: "helcurt", winRate: 60, reason: "Helcurt Silence ตัดการใช้สกิลของ Valentina ทั้งหมด", difficulty: "Medium", priority: 80 },

  // --- Anti-Rewind (Lylia) ---
  { enemyTags: ["rewind"], counterId: "saber", winRate: 63, reason: "Saber Ultimate ล็อค Lylia ก่อน Rewind ด้วย Ultimate ได้", difficulty: "Easy", priority: 88 },
  { enemyTags: ["rewind"], counterId: "helcurt", winRate: 60, reason: "Helcurt Silence ทำให้ Lylia ใช้ Ultimate Rewind ไม่ได้", difficulty: "Easy", priority: 82 },

  // --- Anti-Revive (Nana Passive) ---
  { enemyTags: ["revive"], counterId: "saber", winRate: 60, reason: "Saber Burst Damage เก็บ Nana ได้เร็ว ทั้งก่อนและหลัง Revive", difficulty: "Easy", priority: 70 },
  { enemyTags: ["revive"], counterId: "helcurt", winRate: 58, reason: "Helcurt Silence ทำให้ Nana ใช้สกิลไม่ได้เลย รอเก็บหลัง Revive", difficulty: "Medium", priority: 65 },

  // --- Anti-Freeze ---
  { enemyTags: ["freeze"], counterId: "diggie", winRate: 68, reason: "Diggie Ultimate Purify ปลด Freeze ทั้งทีมทันที", difficulty: "Easy", priority: 95 },
  { enemyTags: ["freeze"], counterId: "lancelot", winRate: 60, reason: "Lancelot Immune หลบ Freeze แล้วเข้า Burst", difficulty: "Medium", priority: 70 },
  { enemyTags: ["freeze"], counterId: "chou", winRate: 58, reason: "Chou สกิล 2 Immune หลบ Freeze ของ Aurora ได้", difficulty: "Medium", priority: 65 },

  // --- Anti-Teleport ---
  { enemyTags: ["teleport"], counterId: "saber", winRate: 63, reason: "Saber Ultimate ล็อคศัตรูก่อนที่จะ Teleport หนีได้", difficulty: "Easy", priority: 88 },
  { enemyTags: ["teleport"], counterId: "helcurt", winRate: 60, reason: "Helcurt Silence ทำให้ศัตรู Teleport กลับไม่ได้", difficulty: "Easy", priority: 80 },

  // --- Anti-Crit ---
  { enemyTags: ["crit"], counterId: "lolita", winRate: 58, reason: "Lolita Shield บล็อก Projectile/Critical Hit จากศัตรูระยะไกล", difficulty: "Easy", priority: 65 },
  { enemyTags: ["crit"], counterId: "gatotkaca", winRate: 60, reason: "Gatotkaca ยิ่งโดน Crit ยิ่งแข็ง เพราะ Passive แปลง Physical Damage เป็น Magic Power", difficulty: "Easy", priority: 70 },

  // --- Anti-Stack (Aldous, Cecilion, Brody) ---
  { enemyTags: ["stack"], counterId: "saber", winRate: 62, reason: "Saber Burst เก็บศัตรูที่กำลัง Stack ก��อนท��่จะแข็งแกร่งพอ", difficulty: "Easy", priority: 80 },
  { enemyTags: ["stack"], counterId: "helcurt", winRate: 58, reason: "Helcurt Burst + Silence เก็บศัตรูที่ Stack ก่อนจ��� Scale เต็ม", difficulty: "Medium", priority: 70 },
  { enemyTags: ["stack"], counterId: "lancelot", winRate: 57, reason: "Lancelot Burst เข้าเก็บศั��รูที่ Stack ตั้งแต่ต้นเกมก่อนจะ Scale", difficulty: "Medium", priority: 65 },

  // --- Anti-Long Range ---
  { enemyTags: ["longrange"], counterId: "saber", winRate: 65, reason: "Saber Ultimate บินเข้าถึงศัตรูระยะไกลแล้ว Suppress ล็อคทันที", difficulty: "Easy", priority: 92 },
  { enemyTags: ["longrange"], counterId: "lancelot", winRate: 62, reason: "Lancelot Dash หลายครั้งเข้าถึงศัตรูระยะไกลได้เร็ว", difficulty: "Medium", priority: 80 },
  { enemyTags: ["longrange"], counterId: "gusion", winRate: 60, reason: "Gusion Combo Dash เข้าเก็บศัตรูระยะไกลที่ตัวบาง", difficulty: "Hard", priority: 72 },

  // --- Anti-Camo (Lesley, etc.) ---
  { enemyTags: ["camo"], counterId: "saber", winRate: 63, reason: "Saber Ultimate ตามเป้าหมายอัตโนมัติ ไม่กลัว Camo/Invisible", difficulty: "Easy", priority: 85 },
  { enemyTags: ["camo"], counterId: "helcurt", winRate: 58, reason: "Helcurt Ultimate มืดทั้งแมพ + เข้า Burst เก็บได้ง่ายเพราะศัตรูมองไม่เห็นเช่นกัน", difficulty: "Medium", priority: 70 },

  // --- Anti-Execute ---
  { enemyTags: ["execute"], counterId: "diggie", winRate: 60, reason: "Diggie Ultimate Purify + Shield ช่วยทีมรอดจาก Execute ที่ HP ต่ำ", difficulty: "Easy", priority: 72 },

  // --- Anti-Speed ---
  { enemyTags: ["speed"], counterId: "saber", winRate: 62, reason: "Saber Ultimate ล็อคศัตรูที่วิ่งเร็ว ไม่ว่าจะ Movement Speed เท่าไหร่", difficulty: "Easy", priority: 82 },
  { enemyTags: ["speed"], counterId: "franco", winRate: 58, reason: "Franco Hook จับศัตรูที่วิ่งเร็วได้ถ้าเล็งแม่น", difficulty: "Hard", priority: 60 },

  // --- Anti-Block (Lolita) ---
  { enemyTags: ["block"], counterId: "esmeralda", winRate: 63, reason: "Esmeralda ดาเมจทะลุ Shield ของ Lolita เพราะเป็น Melee ไม่ใช่ Projectile", difficulty: "Easy", priority: 88 },
  { enemyTags: ["block"], counterId: "chou", winRate: 60, reason: "Chou เตะ Lolita ออกขณะตั้ง Shield หรือ Ultimate", difficulty: "Medium", priority: 75 },
  { enemyTags: ["block"], counterId: "franco", winRate: 58, reason: "Franco Hook ดึง Lolita ออกจากตำแหน่ง Block ได้", difficulty: "Medium", priority: 68 },

  // --- Anti-Reflect ---
  { enemyTags: ["reflect"], counterId: "karrie", winRate: 62, reason: "Karrie True Damage ไม่ถูก Reflect กลับ สามารถตี Belerick ได้ปลอดภัย", difficulty: "Easy", priority: 80 },
  { enemyTags: ["reflect"], counterId: "lunox", winRate: 58, reason: "Lunox Chaos mode ดาเมจไม่ถูก Reflect ทำลาย Tank ได้เร็ว", difficulty: "Medium", priority: 65 },

  // --- Anti-CCImmune (Hanabi) ---
  { enemyTags: ["ccimmune"], counterId: "saber", winRate: 62, reason: "Saber Ultimate Suppress ทะลุ CC Immune ของ Hanabi ได้", difficulty: "Easy", priority: 85 },
  { enemyTags: ["ccimmune"], counterId: "franco", winRate: 60, reason: "Franco Ultimate Suppress ทะลุ CC Immune เพราะเป็น Suppress", difficulty: "Medium", priority: 78 },

  // --- Anti-Throw ---
  { enemyTags: ["throw"], counterId: "diggie", winRate: 63, reason: "Diggie Ultimate Purify ปลดทีมหลังถูกโยนทันที", difficulty: "Easy", priority: 82 },
  { enemyTags: ["throw"], counterId: "chou", winRate: 58, reason: "Chou สกิล 2 Immune หลบการถูกจับโยนได้", difficulty: "Medium", priority: 65 },

  // --- Anti-Antidash (Khufra, Minsitthar themselves can be countered) ---
  { enemyTags: ["antidash"], counterId: "karrie", winRate: 63, reason: "Karrie True Damage ตาม %HP เจาะทะลุ DEF สูงของ Tank Anti-Dash", difficulty: "Easy", priority: 80 },
  { enemyTags: ["antidash"], counterId: "valir", winRate: 60, reason: "Valir ผลักกลับ Tank Anti-Dash ไม่ให้เข้ามาใกล้ตัว", difficulty: "Medium", priority: 72 },
  { enemyTags: ["antidash"], counterId: "esmeralda", winRate: 58, reason: "Esmeralda ดูด Shield สู้ยาวชนะ Tank ได้", difficulty: "Medium", priority: 65 },

  // --- Anti-Antiheal (Baxia) ---
  { enemyTags: ["antiheal"], counterId: "karrie", winRate: 63, reason: "Karrie True Damage ตาม %HP เจาะทะลุ DEF ของ Baxia", difficulty: "Easy", priority: 82 },
  { enemyTags: ["antiheal"], counterId: "valir", winRate: 60, reason: "Valir ผลักกลับ Baxia ไม่ให้กลิ้งเข้ามาใกล้", difficulty: "Medium", priority: 70 },
  { enemyTags: ["antiheal"], counterId: "lunox", winRate: 58, reason: "Lunox Chaos mode ดาเมจเจาะ DEF ทำลาย Baxia ได้เร็ว", difficulty: "Medium", priority: 62 },

  // --- Anti-Mount ---
  { enemyTags: ["mount"], counterId: "saber", winRate: 62, reason: "Saber Ultimate ล็อคศัตรูให้ตกจากม้า/พาหนะทันที", difficulty: "Easy", priority: 82 },
  { enemyTags: ["mount"], counterId: "khufra", winRate: 60, reason: "Khufra สกิล 2 หยุดการเคลื่อนที่บนพาหนะ", difficulty: "Easy", priority: 78 },

  // --- General melee assassin counters ---
  { enemyTags: ["burst", "melee"], counterId: "atlas", winRate: 58, reason: "Atlas Ultimate จับ Assassin ที่พุ่งเข้ามา ล็อคไว้ให้ทีมรุม", difficulty: "Medium", priority: 55 },
  { enemyTags: ["burst", "melee"], counterId: "tigreal", winRate: 56, reason: "Tigreal Ultimate ดึง Assassin ที่เข้ามา Burst ไว้ใกล้ตัว ให้ทีมช่วยจัดการ", difficulty: "Medium", priority: 45 },

  // --- General ranged MM counters ---
  { enemyTags: ["physical", "ranged"], counterId: "saber", winRate: 64, reason: "Saber Ultimate บินเข้าล็อค Marksman ที่ยืนห่างทีมได้ทันที", difficulty: "Easy", priority: 82 },
  { enemyTags: ["physical", "ranged"], counterId: "lancelot", winRate: 60, reason: "Lancelot Dash เข้าถึง Marksman แล้ว Burst เก็บได้เร็ว", difficulty: "Medium", priority: 72 },
  { enemyTags: ["physical", "ranged"], counterId: "gusion", winRate: 58, reason: "Gusion Combo Dash เข���าเก็บ Marksman ที่ตัวบาง", difficulty: "Hard", priority: 62 },
  { enemyTags: ["physical", "ranged"], counterId: "helcurt", winRate: 57, reason: "Helcurt Silence + Burst เก็บ Marksman ที่อยู่คนเดียว", difficulty: "Medium", priority: 58 },
  { enemyTags: ["physical", "ranged"], counterId: "hayabusa", winRate: 55, reason: "Hayabusa Ultimate ล����อค Marksman แบบ 1v1 ทีมช่วยไม่ได้", difficulty: "Medium", priority: 52 },

  // --- General mage counters ---
  { enemyTags: ["magic", "ranged"], counterId: "saber", winRate: 63, reason: "Saber Ultimate ���็อค Mage ที่ตัวบาง ฆ่าได้ในชุดเดียว", difficulty: "Easy", priority: 80 },
  { enemyTags: ["magic", "ranged"], counterId: "helcurt", winRate: 60, reason: "Helcurt Silence ทำให้ Mage ใช้สกิลไม่ได้ แล้วเข้า Burst", difficulty: "Easy", priority: 75 },
  { enemyTags: ["magic", "ranged"], counterId: "lancelot", winRate: 58, reason: "Lancelot Immune หลบสกิล Mage แล้วเข้า Burst เก็บ", difficulty: "Medium", priority: 68 },

  // --- General tank counters ---
  { enemyTags: ["melee"], counterId: "valir", winRate: 58, reason: "Valir สกิล 2 ผลักศัตรู Melee ออกไม่ให้เข้ามาใกล้ตัว", difficulty: "Medium", priority: 40 },

  // --- Anti-Purify ---
  { enemyTags: ["purify"], counterId: "saber", winRate: 62, reason: "Saber Ultimate เป็น Suppress ที่ Purify ปลดไม่ได้", difficulty: "Easy", priority: 85 },
  { enemyTags: ["purify"], counterId: "franco", winRate: 60, reason: "Franco Ultimate เป็น Suppress ที่ Purify ปลดไม่ได้", difficulty: "Medium", priority: 78 },

  // --- Anti-Reset (Karina) ---
  { enemyTags: ["reset"], counterId: "saber", winRate: 63, reason: "Saber Ultimate ล็อค Karina ก่อนที่จะเก็บคนแรกเพื่อ Reset สกิล", difficulty: "Easy", priority: 88 },
  { enemyTags: ["reset"], counterId: "khufra", winRate: 60, reason: "Khufra หยุด Dash ของ Karina ทำให้เข้าเก็บไม่ได้", difficulty: "Easy", priority: 82 },
  { enemyTags: ["reset"], counterId: "franco", winRate: 58, reason: "Franco Ultimate Suppress ล็อค Karina ก่อน Reset", difficulty: "Medium", priority: 72 },

  // --- Anti-Scaling ---
  { enemyTags: ["scaling"], counterId: "saber", winRate: 63, reason: "Saber เก็บศัตรูที่ต้อง Scale ตั้งแต่ต้นเกม กดไม่ให้ Farm", difficulty: "Easy", priority: 82 },
  { enemyTags: ["scaling"], counterId: "lancelot", winRate: 60, reason: "Lancelot Burst เก็บศัตรูที่กำลัง Farm Scale ได้ตั้งแต่ต้นเกม", difficulty: "Medium", priority: 72 },

  // --- Anti-AoE ---
  { enemyTags: ["aoe"], counterId: "diggie", winRate: 62, reason: "Diggie Ultimate Purify + Shield ป้องกันทีมจาก AoE Damage/CC", difficulty: "Easy", priority: 78 },
  { enemyTags: ["aoe"], counterId: "lolita", winRate: 58, reason: "Lolita Shield บล็อก AoE Projectile ป้องกันทีม", difficulty: "Easy", priority: 70 },

  // --- Anti-Multi-weapon (Beatrix) ---
  { enemyTags: ["multiweapon"], counterId: "saber", winRate: 64, reason: "Saber Ultimate ล็อค Beatrix ไว้ ทำให้ไม่สามารถเปลี่ยนปืนหรือหนีได้", difficulty: "Easy", priority: 90 },
  { enemyTags: ["multiweapon"], counterId: "lancelot", winRate: 60, reason: "Lancelot เข้าถึง Beatrix ได้เร็ว มี Immune หลบปืนลูกซอง", difficulty: "Medium", priority: 78 },
  { enemyTags: ["multiweapon"], counterId: "hayabusa", winRate: 58, reason: "Hayabusa ใช้ Ultimate ล็อค Beatrix แบบ 1v1 ทีมช่วยไม่ได้", difficulty: "Medium", priority: 72 },

  // --- Anti-Energy ---
  { enemyTags: ["energy"], counterId: "saber", winRate: 62, reason: "Saber Burst เก็บศัตรูที่ต้องจัดการ Energy ก่อนที่จะ Farm เต็ม", difficulty: "Easy", priority: 78 },

  // --- Anti-Anticchero (Diggie) ---
  { enemyTags: ["anticchero"], counterId: "helcurt", winRate: 60, reason: "Helcurt Silence ทำให้ Diggie ใช้ Ultimate Purify ไม่ทัน", difficulty: "Medium", priority: 72 },
  { enemyTags: ["anticchero"], counterId: "saber", winRate: 58, reason: "Saber Ultimate ล็อค Diggie ก่อนที่จะ Purify ทีม", difficulty: "Medium", priority: 68 },

  // =====================================================
  // META SEASON S35 / February 2026 COUNTER RULES
  // =====================================================

  // --- Anti-Sora (Fighter/Assassin, dash+burst+transform+stack) ---
  { enemyTags: ["dash", "transform", "stack"], counterId: "phoveus", winRate: 68, reason: "Phoveus ได้ Reset สกิลทุกครั้งที่ Sora ใช้ Dash กระโดดตามไม่หยุด ทำให้ Sora เปลี่ยนฟอร์มไม่ทัน", difficulty: "Easy", priority: 96 },
  { enemyTags: ["dash", "transform", "stack"], counterId: "khufra", winRate: 65, reason: "Khufra สกิล 2 หยุด Dash ของ Sora ได้ทันที ไม่ว่าจะเป็นฟอร์ม Thunder หรือ Torrent", difficulty: "Easy", priority: 92 },
  { enemyTags: ["dash", "transform", "stack"], counterId: "saber", winRate: 63, reason: "Saber Ultimate Suppress ล็อค Sora ก่อนที่จะ Cloudstep ครบ 5 Stack และ Transform ได้", difficulty: "Easy", priority: 88 },

  // --- Anti-Phoveus (S+ meta Fighter, antidash) ---
  { enemyTags: ["antidash", "cc", "sustain"], counterId: "karrie", winRate: 65, reason: "Karrie True Damage ตาม %HP เจาะทะลุความอึดของ Phoveus ได้ดี", difficulty: "Easy", priority: 90 },
  { enemyTags: ["antidash", "cc", "sustain"], counterId: "valir", winRate: 63, reason: "Valir ผลักกลับ Phoveus ไม่ให้กระโดดเข้ามา แถมตี Sustained Damage", difficulty: "Easy", priority: 85 },
  { enemyTags: ["antidash", "cc", "sustain"], counterId: "xborg", winRate: 60, reason: "X.Borg True Damage ไฟเผาลด HP Phoveus ต่อเนื่อง ไม่กลัว Dash", difficulty: "Medium", priority: 78 },

  // --- Anti-Yin (S+ meta Fighter, lockdown) ---
  { enemyTags: ["dash", "burst", "lockdown"], counterId: "diggie", winRate: 67, reason: "Diggie Ultimate Purify ปลดทีมจาก Domain ของ Yin ทันที", difficulty: "Easy", priority: 95 },
  { enemyTags: ["dash", "burst", "lockdown"], counterId: "wanwan", winRate: 63, reason: "Wanwan เปิดจุดอ่อนครบแล้ว Ultimate ลอยตัว สู้ Yin ใน Domain ได้", difficulty: "Medium", priority: 82 },
  { enemyTags: ["dash", "burst", "lockdown"], counterId: "benedetta", winRate: 60, reason: "Benedetta Immune หลบสกิลของ Yin ใน Domain แล้วตอบโต้ได้", difficulty: "Hard", priority: 72 },

  // --- Anti-Fredrinn (S+ meta Tank/Fighter, reflect) ---
  { enemyTags: ["cc", "sustained", "reflect"], counterId: "karrie", winRate: 65, reason: "Karrie True Damage ตาม %HP เจาะ Fredrinn ที่มี Gray HP ไม่ให้สะสมดาเมจ Ultimate", difficulty: "Easy", priority: 88 },
  { enemyTags: ["cc", "sustained", "reflect"], counterId: "xborg", winRate: 62, reason: "X.Borg True Damage ต่อเนื่องลด HP Fredrinn ไม่ให้สะสม Crystal Energy ง่าย", difficulty: "Medium", priority: 80 },
  { enemyTags: ["cc", "sustained", "reflect"], counterId: "lunox", winRate: 60, reason: "Lunox Chaos mode ดาเมจเจาะ DEF สูง ตี Fredrinn ได้ดีก่อนสะสม Crystal Energy", difficulty: "Medium", priority: 72 },

  // --- Anti-Julian (S+ meta Assassin, dash+burst+magic) ---
  { enemyTags: ["dash", "burst", "magic", "melee"], counterId: "phoveus", winRate: 67, reason: "Phoveus กระโดดตาม Julian ทุกครั้งที่���ช้ Dash ท���ให้เล่นสกิลลำบาก", difficulty: "Easy", priority: 92 },
  { enemyTags: ["dash", "burst", "magic", "melee"], counterId: "khufra", winRate: 64, reason: "Khufra หยุด Dash ของ Julian ตัด Combo ทั้งชุดทันที", difficulty: "Easy", priority: 88 },

  // --- Anti-Zhuxin (S+ meta Mage, cc+sustained) ---
  { enemyTags: ["cc", "sustained", "magic", "ranged"], counterId: "saber", winRate: 65, reason: "Saber Ultimate ล็อค Zhuxin ก่อนเข้า Team Fight ฆ่าได้ในชุดเดียว", difficulty: "Easy", priority: 90 },
  { enemyTags: ["cc", "sustained", "magic", "ranged"], counterId: "helcurt", winRate: 63, reason: "Helcurt Silence ตัด Combo Zhuxin แล้ว Burst เก็บ", difficulty: "Easy", priority: 85 },
  { enemyTags: ["cc", "sustained", "magic", "ranged"], counterId: "lancelot", winRate: 60, reason: "Lancelot Immune หลบ CC ของ Zhuxin แล้วเข้า Burst เก็บ", difficulty: "Medium", priority: 78 },

  // --- Anti-Obsidia (S+ meta Marksman) ---
  { enemyTags: ["burst", "physical", "ranged"], counterId: "saber", winRate: 66, reason: "Saber Ultimate บินเข้า Suppress Obsidia ที่ตัวบาง ฆ่าได้ในชุดเดียว", difficulty: "Easy", priority: 92 },
  { enemyTags: ["burst", "physical", "ranged"], counterId: "lancelot", winRate: 62, reason: "Lancelot Dash เข้าถึง Obsidia แล้ว Burst เก็บ มี Immune หลบสกิล", difficulty: "Medium", priority: 82 },
  { enemyTags: ["burst", "physical", "ranged"], counterId: "hayabusa", winRate: 60, reason: "Hayabusa Ultimate ล็อค Obsidia แบบ 1v1 ทีมช่วยไม่ได้", difficulty: "Medium", priority: 76 },

  // --- Anti-Cici (S+ meta Fighter, dash+sustain) ---
  { enemyTags: ["dash", "sustain", "physical", "melee"], counterId: "phoveus", winRate: 66, reason: "Phoveus กระโดดตาม Cici ทุกครั้งที่ใช้ Dash ทำให้หนีไม่ได้", difficulty: "Easy", priority: 90 },
  { enemyTags: ["dash", "sustain", "physical", "melee"], counterId: "baxia", winRate: 63, reason: "Baxia Passive ลด Regen/Sustain ของ Cici ทำให้ดูดเลือดแทบไม่ได้", difficulty: "Easy", priority: 85 },
  { enemyTags: ["dash", "sustain", "physical", "melee"], counterId: "khufra", winRate: 60, reason: "Khufra สกิล 2 หยุด Dash ของ Cici ตัด Combo ทันที", difficulty: "Easy", priority: 80 },

  // --- Anti-Lukas (S+ meta Fighter, sustain+transform) ---
  { enemyTags: ["sustain", "physical", "melee", "transform"], counterId: "baxia", winRate: 65, reason: "Baxia Passive ลด HP Regen ของ Lukas ทำให้สู้ยาวไม่ได้", difficulty: "Easy", priority: 88 },
  { enemyTags: ["sustain", "physical", "melee", "transform"], counterId: "saber", winRate: 62, reason: "Saber Ultimate Suppress ล็อค Lukas ก่อนที่จะ Transform ได้", difficulty: "Easy", priority: 82 },

  // --- Anti-Mathilda (S+ meta Support, dash) ---
  { enemyTags: ["dash", "cc", "physical", "melee"], counterId: "phoveus", winRate: 65, reason: "Phoveus กระโดดตาม Mathilda ทุกครั้งที่ Dash เข้ามา ทำให้ Roam ลำบาก", difficulty: "Easy", priority: 88 },
  { enemyTags: ["dash", "cc", "physical", "melee"], counterId: "khufra", winRate: 63, reason: "Khufra สกิล 2 หยุด Dash ของ Mathilda ��ัด Engage ทันที", difficulty: "Easy", priority: 84 },

  // --- Anti-Chip (S+ meta Support, teleport) ---
  { enemyTags: ["cc", "magic", "ranged", "teleport"], counterId: "saber", winRate: 63, reason: "Saber Ultimate ล็อค Chip ก่อนที่จะ Teleport ทีมหนีได้", difficulty: "Easy", priority: 86 },
  { enemyTags: ["cc", "magic", "ranged", "teleport"], counterId: "helcurt", winRate: 60, reason: "Helcurt Silence ตัดการใช้ Teleport ของ Chip ทำให้ทีมศัตรูหนีไม่ได้", difficulty: "Medium", priority: 80 },

  // --- Anti-Harith (S+ meta Mage, dash+burst) ---
  { enemyTags: ["dash", "burst", "magic", "melee"], counterId: "saber", winRate: 65, reason: "Saber Ultimate ล็อค Harith ก่อนที่จะ Dash หนีด้วย Enhanced Basic Attack", difficulty: "Easy", priority: 90 },

  // --- Anti-Arlott (S+ meta Fighter, dash+cc+burst) ---
  { enemyTags: ["dash", "cc", "burst", "physical", "melee"], counterId: "phoveus", winRate: 66, reason: "Phoveus กระโดดตาม Arlott ทุกครั้งที่ Dash ทำให้ Engage ไม่สำเร็จ", difficulty: "Easy", priority: 92 },
  { enemyTags: ["dash", "cc", "burst", "physical", "melee"], counterId: "khufra", winRate: 63, reason: "Khufra สกิล 2 หยุด Dash ของ Arlott ตัด Combo ทั้งชุด", difficulty: "Easy", priority: 88 },

  // --- Anti-Kalea (S+ meta Support/Fighter) ---
  { enemyTags: ["cc", "sustain", "magic", "melee"], counterId: "baxia", winRate: 63, reason: "Baxia Passive ลด Sustain ของ Kalea ทำให้อยู่ยาวไม่ได้", difficulty: "Easy", priority: 85 },
  { enemyTags: ["cc", "sustain", "magic", "melee"], counterId: "karrie", winRate: 60, reason: "Karrie True Damage ตาม %HP เจาะ Kalea ที่มี HP สูงได้ดี", difficulty: "Easy", priority: 78 },

  // --- Anti-Floryn (S+ meta Support, heal+global) ---
  { enemyTags: ["sustain", "magic", "ranged", "heal", "global"], counterId: "baxia", winRate: 70, reason: "Baxia Passive ลด Heal ของ Floryn ทำให้ Heal ทีมแทบไม่ได้ผล", difficulty: "Easy", priority: 95 },
  { enemyTags: ["sustain", "magic", "ranged", "heal", "global"], counterId: "saber", winRate: 63, reason: "Saber Ultimate บินเข้าเก็บ Floryn ที่ตัวบางมากก่อนจะ Heal ทีม", difficulty: "Easy", priority: 88 },

  // --- Anti-Kaja (S+ meta Support, lockdown) ---
  { enemyTags: ["cc", "magic", "melee", "lockdown"], counterId: "diggie", winRate: 68, reason: "Diggie Ultimate Purify ปลด Suppress ของ Kaja ทั้งทีมทันที", difficulty: "Easy", priority: 95 },
  { enemyTags: ["cc", "magic", "melee", "lockdown"], counterId: "lancelot", winRate: 60, reason: "Lancelot สกิล 2 Immune หลบ Ultimate ของ Kaja ได้", difficulty: "Medium", priority: 72 },

  // --- Anti-Edith (S+ meta Marksman/Tank, transform) ---
  { enemyTags: ["cc", "burst", "physical", "ranged", "transform"], counterId: "saber", winRate: 64, reason: "Saber Ultimate ล็อค Edith ก่อนที่จะ Transform เป็นร่าง Ranged", difficulty: "Easy", priority: 88 },
  { enemyTags: ["cc", "burst", "physical", "ranged", "transform"], counterId: "khufra", winRate: 61, reason: "Khufra CC ต่อเนื่องใส่ Edith ทั้ง 2 ร่าง ทำให้เล่นยาก", difficulty: "Easy", priority: 82 },

  // --- Anti-Natan (S+ meta Marksman, burst+magic) ---
  { enemyTags: ["burst", "magic", "ranged"], counterId: "saber", winRate: 65, reason: "Saber Ultimate บินเข้าล็อค Natan ที่ตัวบาง เก็บได้ง่าย", difficulty: "Easy", priority: 90 },
  { enemyTags: ["burst", "magic", "ranged"], counterId: "helcurt", winRate: 62, reason: "Helcurt Silence ตัดสกิลของ Natan แล้ว Burst เก็บ", difficulty: "Medium", priority: 82 },
]

// ==============================================================================
// ITEM DEFINITIONS
// แก้ไขไอเทมได้ที่นี่: เปลี่ยน name / image / stat / price
// ถ้าต้องการใส่รูป ให้ใส่ URL รูปในฟิลด์ image (รองรับ .png .jpg .webp)
// ตัวอย่าง: image: "/images/items/blade-armor.png" (วางรูปไว้ที่ public/images/items/)
// หรือใช้ URL ภายนอก: image: "https://example.com/blade-armor.png"
// ถ้าปล่อยว่าง "" จะแสดงตัวอักษรย่อแทน
// ==============================================================================
const ITEMS = {
  bladeArmor: { id: "blade-armor", name: "Blade Armor", icon: "BA", image: "https://static.wikia.nocookie.net/mobile-legends/images/d/d9/Blade_Armor.png/revision/latest?cb=20240728123118", stat: "+90 Physical DEF", price: 1660 },
  windOfNature: { id: "wind-of-nature", name: "Wind of Nature", icon: "WN", image: "", stat: "+30 Physical ATK, +20% ATK Speed", price: 1910 },
  antiqueCuirass: { id: "antique-cuirass", name: "Antique Cuirass", icon: "AC", image: "", stat: "+920 HP, +54 Physical DEF", price: 2170 },
  immortality: { id: "immortality", name: "Immortality", icon: "IM", image: "", stat: "+800 HP, +40 Physical DEF", price: 2120 },
  winterTruncheon: { id: "winter-truncheon", name: "Winter Truncheon", icon: "WT", image: "", stat: "+60 Magic Power, +25 Physical DEF", price: 1910 },
  athenasShield: { id: "athenas-shield", name: "Athena's Shield", icon: "AS", image: "", stat: "+900 HP, +62 Magic DEF", price: 2150 },
  toughBoots: { id: "tough-boots", name: "Tough Boots", icon: "TB", image: "", stat: "+22 Magic DEF, -30% CC Duration", price: 700 },
  radiantArmor: { id: "radiant-armor", name: "Radiant Armor", icon: "RA", image: "", stat: "+950 HP, +52 Magic DEF", price: 1880 },
  necklaceOfDurance: { id: "necklace-of-durance", name: "Necklace of Durance", icon: "ND", image: "", stat: "+60 Magic Power, +10% CD Reduction", price: 2010 },
  seaHalberd: { id: "sea-halberd", name: "Sea Halberd", icon: "SH", image: "", stat: "+80 Physical ATK, +25% ATK Speed", price: 2050 },
  divineGlaive: { id: "divine-glaive", name: "Divine Glaive", icon: "DG", image: "", stat: "+65 Magic Power, +40% Magic PEN", price: 1970 },
  dominanceIce: { id: "dominance-ice", name: "Dominance Ice", icon: "DI", image: "", stat: "+500 Mana, +70 Physical DEF", price: 2010 },
  twilightArmor: { id: "twilight-armor", name: "Twilight Armor", icon: "TA", image: "", stat: "+1200 HP, +400 Mana", price: 2260 },
  maleficRoar: { id: "malefic-roar", name: "Malefic Roar", icon: "MR", image: "", stat: "+60 Physical ATK, +40% Physical PEN", price: 2060 },
  warriorBoots: { id: "warrior-boots", name: "Warrior Boots", icon: "WB", image: "", stat: "+22 Physical DEF", price: 720 },
} as const

function mkItem(base: typeof ITEMS[keyof typeof ITEMS], description: string): CounterItem {
  return { ...base, description }
}

// ====== ITEM RECOMMENDATION ENGINE ======
function getItemsForEnemy(enemy: Hero): { earlyItems: CounterItem[]; lateItems: CounterItem[] } {
  const t = enemy.tags
  const isPhysical = t.includes("physical")
  const isMagic = t.includes("magic")
  const isSustain = t.includes("sustain") || t.includes("heal")
  const isBurst = t.includes("burst")
  const isCC = t.includes("cc") || t.includes("freeze") || t.includes("setup")
  const isCrit = t.includes("crit")

  const earlyItems: CounterItem[] = []
  const lateItems: CounterItem[] = []

  if (isPhysical) {
    earlyItems.push(mkItem(ITEMS.bladeArmor, `สะท้อน Physical Damage กลับ ทำให้ ${enemy.name} ตีแล้วเจ็บตัวเอง`))
    earlyItems.push(mkItem(ITEMS.windOfNature, `กด Active เพื่อ Immune Physical Damage 2 วินาที หลบ Burst ของ ${enemy.name}`))
    lateItems.push(mkItem(ITEMS.antiqueCuirass, `ลด Physical ATK ศัตรูที่โจมตีเรา สะสมหลายชั้น ตัดกำลัง ${enemy.name}`))
    lateItems.push(mkItem(ITEMS.immortality, `ฟื้นคืนชีพเมื่อตาย ทำให้ ${enemy.name} ต้องฆ่าเราอีกรอบ`))
    if (isCrit) {
      lateItems.push(mkItem(ITEMS.twilightArmor, `ลด Critical/Burst Damage สูงจาก ${enemy.name}`))
    }
    if (isSustain) {
      earlyItems.push(mkItem(ITEMS.seaHalberd, `ลดการ Regen HP ของ ${enemy.name} 50% สำหรับ Physical Hero`))
      lateItems.push(mkItem(ITEMS.dominanceIce, `ลด Regen และ ATK Speed ของ ${enemy.name} รอบตัว`))
    }
  }

  if (isMagic) {
    earlyItems.push(mkItem(ITEMS.athenasShield, `ดูด Magic Damage อัตโนมัติ ลดผลกระทบจาก Burst ของ ${enemy.name}`))
    earlyItems.push(mkItem(ITEMS.toughBoots, `ลดระยะเวลา CC 30% และเพิ่ม Magic DEF ต้านทาน ${enemy.name}`))
    lateItems.push(mkItem(ITEMS.radiantArmor, `ลด Magic Damage ต่อเนื่อง สะสมหลายชั้น เหมาะสู้ ${enemy.name}`))
    if (isSustain) {
      earlyItems.push(mkItem(ITEMS.necklaceOfDurance, `ลดการ Regen HP ของ ${enemy.name} 50% ตัดพลังดูดเลือด`))
      lateItems.push(mkItem(ITEMS.dominanceIce, `ลด Regen ของ ${enemy.name} รอบตัว`))
    }
    if (isBurst) {
      lateItems.push(mkItem(ITEMS.winterTruncheon, `แข็งตัว 2 วินาที หลบ Combo ของ ${enemy.name} ได้ทั้งชุด`))
    }
    lateItems.push(mkItem(ITEMS.immortality, `ฟื้นคืนชีพหลังถูก ${enemy.name} Burst`))
  }

  if (isCC && !isMagic) {
    earlyItems.push(mkItem(ITEMS.toughBoots, `ลดระยะเวลา CC 30% จากสกิลของ ${enemy.name}`))
  }

  // For Tank enemies
  if (enemy.role === "Tank" && !isSustain) {
    earlyItems.push(mkItem(ITEMS.toughBoots, `ลด CC Duration จากสกิลของ ${enemy.name}`))
    lateItems.push(mkItem(ITEMS.maleficRoar, `เจาะ Physical DEF สูงของ ${enemy.name}`))
    lateItems.push(mkItem(ITEMS.divineGlaive, `เจาะ Magic DEF ถ้าเล่น Mage สู้ ${enemy.name}`))
  }

  // Ensure at least 2 early and 2 late
  if (earlyItems.length < 2) {
    if (!earlyItems.find(i => i.id === "tough-boots")) {
      earlyItems.push(mkItem(ITEMS.toughBoots, `ลด CC Duration จากสกิลของ ${enemy.name}`))
    }
    if (!earlyItems.find(i => i.id === "warrior-boots") && isPhysical) {
      earlyItems.push(mkItem(ITEMS.warriorBoots, `เพิ���ม Physical DEF ต้นเกม ป้องกัน ${enemy.name}`))
    }
  }
  if (lateItems.length < 2) {
    if (!lateItems.find(i => i.id === "immortality")) {
      lateItems.push(mkItem(ITEMS.immortality, `ฟื้นคืนชีพหลังถูก ${enemy.name} เก็บ`))
    }
  }

  // Deduplicate by id
  const dedup = (arr: CounterItem[]) => {
    const seen = new Set<string>()
    return arr.filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true })
  }

  return {
    earlyItems: dedup(earlyItems).slice(0, 4),
    lateItems: dedup(lateItems).slice(0, 5),
  }
}

// ====== COUNTER GENERATION ======
function generateCounters(enemy: Hero, customRules?: CounterRule[], customHeroes?: Hero[], baseHeroOverrides?: Record<string, Partial<Hero>>): CounterPick[] {
  const allRules = customRules ? [...COUNTER_RULES, ...customRules] : COUNTER_RULES
  const allHeroes = getAllHeroes(customHeroes, baseHeroOverrides)
  const matched: { rule: CounterRule; matchCount: number }[] = []

  for (const rule of allRules) {
    // Don't counter yourself
    if (rule.counterId === enemy.id) continue
    // Check all enemy tags match
    if (rule.enemyTags.every(tag => enemy.tags.includes(tag))) {
      matched.push({ rule, matchCount: rule.enemyTags.length })
    }
  }

  // Group by counter hero, take highest priority rule per hero
  const byHero = new Map<string, { rule: CounterRule; matchCount: number }>()
  for (const m of matched) {
    const existing = byHero.get(m.rule.counterId)
    if (!existing || m.rule.priority > existing.rule.priority) {
      byHero.set(m.rule.counterId, m)
    }
  }

  // Sort by priority descending
  const sorted = Array.from(byHero.values())
    .sort((a, b) => b.rule.priority - a.rule.priority)

  // Take top 12
  const top = sorted.slice(0, 12)

  return top.map(({ rule }) => {
    const counterHero = allHeroes.find(h => h.id === rule.counterId)
    if (!counterHero) return null
    return {
      hero: counterHero,
      winRate: rule.winRate,
      reason: rule.reason,
      difficulty: rule.difficulty,
    }
  }).filter((x): x is CounterPick => x !== null)
}

// ====== MERGED DATA HELPERS ======
// These functions merge base (hardcoded) data with custom (user-created) data.
// Custom heroes/items are injected from the store at call sites.

/** Merge base heroes with overrides and user-created custom heroes */
export function getAllHeroes(customHeroes?: Hero[], baseOverrides?: Record<string, Partial<Hero>>): Hero[] {
  const map = new Map<string, Hero>()
  for (const h of HEROES) {
    // Apply base overrides if present
    if (baseOverrides && baseOverrides[h.id]) {
      map.set(h.id, { ...h, ...baseOverrides[h.id], id: h.id })
    } else {
      map.set(h.id, h)
    }
  }
  // Add custom heroes (new heroes added by user)
  if (customHeroes) {
    for (const h of customHeroes) map.set(h.id, h)
  }
  return Array.from(map.values())
}

/** Merge base items with overrides and user-created custom item definitions */
export function getAllItemDefs(customItemDefs?: ItemDef[], baseOverrides?: Record<string, Partial<ItemDef>>): ItemDef[] {
  const map = new Map<string, ItemDef>()
  for (const i of Object.values(ITEMS)) {
    const def: ItemDef = { id: i.id, name: i.name, icon: i.icon, image: i.image, stat: i.stat, price: i.price }
    if (baseOverrides && baseOverrides[i.id]) {
      map.set(i.id, { ...def, ...baseOverrides[i.id], id: i.id })
    } else {
      map.set(i.id, def)
    }
  }
  if (customItemDefs) {
    for (const i of customItemDefs) map.set(i.id, i)
  }
  return Array.from(map.values())
}

// ====== PUBLIC API ======
export function searchHeroes(query: string, customHeroes?: Hero[], baseHeroOverrides?: Record<string, Partial<Hero>>): Hero[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const heroes = getAllHeroes(customHeroes, baseHeroOverrides)
  return heroes.filter(h =>
    h.name.toLowerCase().includes(q) ||
    h.role.toLowerCase().includes(q) ||
    h.id.toLowerCase().includes(q)
  )
}

export function getCounterData(heroId: string, customRules?: CounterRule[], customHeroes?: Hero[], baseHeroOverrides?: Record<string, Partial<Hero>>): { counters: CounterPick[]; earlyItems: CounterItem[]; lateItems: CounterItem[] } | null {
  const heroes = getAllHeroes(customHeroes, baseHeroOverrides)
  const enemy = heroes.find(h => h.id === heroId)
  if (!enemy) return null

  const counters = generateCounters(enemy, customRules, customHeroes, baseHeroOverrides)
  if (counters.length === 0) return null

  const { earlyItems, lateItems } = getItemsForEnemy(enemy)

  return { counters, earlyItems, lateItems }
}

/** Get all unique tags used across heroes */
export function getAllTags(customHeroes?: Hero[]): string[] {
  const tagSet = new Set<string>()
  for (const h of getAllHeroes(customHeroes)) {
    for (const t of h.tags) tagSet.add(t)
  }
  return Array.from(tagSet).sort()
}

/** Get heroes that match ALL given enemy tags */
export function getMatchingHeroes(enemyTags: string[], customHeroes?: Hero[]): Hero[] {
  return getAllHeroes(customHeroes).filter(h => enemyTags.every(tag => h.tags.includes(tag)))
}

/** Get hero names that match ALL given enemy tags (for display) */
export function getMatchingHeroNames(enemyTags: string[], customHeroes?: Hero[]): string[] {
  return getMatchingHeroes(enemyTags, customHeroes).map(h => h.name)
}

/** Get all items as CounterItem array (for display) */
export function getAllItems(customItemDefs?: ItemDef[]): CounterItem[] {
  return getAllItemDefs(customItemDefs).map(item => ({ ...item, description: "" }))
}

/** Get item info by ID (searches base + custom) */
export function getItemById(itemId: string, customItemDefs?: ItemDef[]): ItemDef | undefined {
  return getAllItemDefs(customItemDefs).find(i => i.id === itemId)
}

/** Get hero by ID (searches base + custom) */
export function getHeroById(heroId: string, customHeroes?: Hero[]): Hero | undefined {
  return getAllHeroes(customHeroes).find(h => h.id === heroId)
}

/** Merge custom item counter rules into getCounterData results */
export function getCounterDataWithCustomItems(
  heroId: string,
  customRules?: CounterRule[],
  itemCounterRules?: ItemCounterRule[],
  customHeroes?: Hero[],
  customItemDefs?: ItemDef[],
  baseHeroOverrides?: Record<string, Partial<Hero>>,
  baseItemOverrides?: Record<string, Partial<ItemDef>>
): { counters: CounterPick[]; earlyItems: CounterItem[]; lateItems: CounterItem[] } | null {
  const base = getCounterData(heroId, customRules, customHeroes, baseHeroOverrides)
  if (!base) return null

  if (!itemCounterRules || itemCounterRules.length === 0) return base

  const matchingItemRules = itemCounterRules
    .filter(r => r.targetHeroIds.includes(heroId))
    .sort((a, b) => b.priority - a.priority)

  for (const rule of matchingItemRules) {
    for (const itemId of rule.itemIds) {
      const item = getItemById(itemId, customItemDefs)
      if (!item) continue

      const counterItem: CounterItem = {
        ...item,
        description: rule.reason,
      }

      if (rule.phase === "early") {
        if (!base.earlyItems.find(i => i.id === item.id)) {
          base.earlyItems.push(counterItem)
        }
      } else {
        if (!base.lateItems.find(i => i.id === item.id)) {
          base.lateItems.push(counterItem)
        }
      }
    }
  }

  return base
}

/** Get the base HEROES array (read-only, for admin display) */
export function getBaseHeroes(): Hero[] {
  return HEROES
}

/** Get the base ITEMS as ItemDef array (read-only, for admin display) */
export function getBaseItemDefs(): ItemDef[] {
  return Object.values(ITEMS).map(i => ({
    id: i.id, name: i.name, icon: i.icon, image: i.image, stat: i.stat, price: i.price,
  }))
}
