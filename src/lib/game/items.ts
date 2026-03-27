import { Item } from './types';

// walletAethCost = real AETH token amount from Phantom wallet
// aethCost       = in-game AETH earned from combat/quests
// goldCost       = in-game gold (free currency)

export const ITEMS: Record<string, Item> = {
  // ── CONSUMABLES ──────────────────────────────────────────────
  health_potion: {
    id: 'health_potion', name: 'Crimson Vial', type: 'Consumable', rarity: 'Common',
    description: 'Restores 80 HP. Standard imperial field ration.',
    hpBonus: 80,
    aethCost: 5, walletAethCost: 100, goldCost: 50,
  },
  aether_shard: {
    id: 'aether_shard', name: 'Aether Shard', type: 'Consumable', rarity: 'Uncommon',
    description: 'Restores 60 MP. Crystallised rift energy.',
    mpBonus: 60,
    aethCost: 10, walletAethCost: 250, goldCost: 120,
  },
  void_elixir: {
    id: 'void_elixir', name: 'Void Elixir', type: 'Consumable', rarity: 'Rare',
    description: 'Fully restores HP and MP. Tastes like oblivion.',
    hpBonus: 9999, mpBonus: 9999,
    aethCost: 50, walletAethCost: 1000, goldCost: 800,
  },

  // ── COMMON WEAPONS ───────────────────────────────────────────
  iron_blade: {
    id: 'iron_blade', name: 'Iron Blade', type: 'Weapon', rarity: 'Common',
    description: 'Standard imperial infantry sword.',
    statBonus: { STR: 3 },
    aethCost: 15, walletAethCost: 200, goldCost: 200,
  },
  scout_bow: {
    id: 'scout_bow', name: 'Scout Bow', type: 'Weapon', rarity: 'Common',
    description: 'Light recurve bow used by fringe scouts.',
    statBonus: { DEX: 3, PER: 2 },
    aethCost: 15, walletAethCost: 200, goldCost: 200,
  },
  aether_staff: {
    id: 'aether_staff', name: 'Aether Staff', type: 'Weapon', rarity: 'Uncommon',
    description: 'Channels raw rift energy into focused blasts.',
    statBonus: { AET: 5, INT: 3 },
    aethCost: 30, walletAethCost: 500, goldCost: 450,
  },

  // ── COMMON ARMOR ─────────────────────────────────────────────
  leather_vest: {
    id: 'leather_vest', name: 'Leather Vest', type: 'Armor', rarity: 'Common',
    description: 'Basic protection. Better than nothing.',
    statBonus: { CON: 2 }, hpBonus: 30,
    aethCost: 12, walletAethCost: 150, goldCost: 150,
  },
  imperial_plate: {
    id: 'imperial_plate', name: 'Imperial Plate', type: 'Armor', rarity: 'Uncommon',
    description: 'Standard-issue Tiena-Nueble heavy armor.',
    statBonus: { CON: 5, RES: 3 }, hpBonus: 80,
    aethCost: 40, walletAethCost: 750, goldCost: 600,
  },
  shadow_cloak: {
    id: 'shadow_cloak', name: 'Shadow Cloak', type: 'Armor', rarity: 'Rare',
    description: 'Woven from void-silk. Reduces enemy perception.',
    statBonus: { DEX: 4, SPD: 3, PER: 2 },
    aethCost: 60, walletAethCost: 2000, goldCost: 900,
  },

  // ── RARE ITEMS ───────────────────────────────────────────────
  rift_gauntlet: {
    id: 'rift_gauntlet', name: 'Rift Gauntlet', type: 'Weapon', rarity: 'Rare',
    description: 'Punches through dimensional barriers. Literally.',
    statBonus: { STR: 6, AET: 4, SPD: 2 },
    aethCost: 80, walletAethCost: 2500, goldCost: 1200,
  },
  obsidian_shield: {
    id: 'obsidian_shield', name: 'Obsidian Shield', type: 'Armor', rarity: 'Rare',
    description: 'Forged from volcanic stone. Near-impenetrable.',
    statBonus: { CON: 8, RES: 6 }, hpBonus: 120,
    aethCost: 90, walletAethCost: 3000, goldCost: 1400,
  },
  void_compass: {
    id: 'void_compass', name: 'Void Compass', type: 'Relic', rarity: 'Rare',
    description: 'Points toward the nearest rift anomaly. Or your doom.',
    statBonus: { PER: 8, LCK: 4 },
    aethCost: 70, walletAethCost: 2000, goldCost: 1000,
  },

  // ── LEGENDARY — BLACKSMITH ONLY ──────────────────────────────
  aethrix_blade: {
    id: 'aethrix_blade', name: 'Aethrix Blade', type: 'Weapon', rarity: 'Legendary',
    description: 'Forged with AETH token energy. Cuts through reality itself.',
    statBonus: { STR: 15, AET: 12, DEX: 8 },
    blacksmithOnly: true,
    aethCost: 500, walletAethCost: 10000,
  },
  crown_of_tiena: {
    id: 'crown_of_tiena', name: 'Crown of Tiena-Nueble', type: 'Armor', rarity: 'Legendary',
    description: 'The lost crown of the first emperor. Grants imperial authority.',
    statBonus: { CHA: 15, RES: 12, WIS: 10 }, hpBonus: 300,
    blacksmithOnly: true,
    aethCost: 600, walletAethCost: 15000,
  },
  void_reaper: {
    id: 'void_reaper', name: 'Void Reaper', type: 'Weapon', rarity: 'Legendary',
    description: 'A scythe that harvests souls. The void hungers.',
    statBonus: { STR: 12, SPR: 15, LCK: 10 },
    blacksmithOnly: true,
    aethCost: 550, walletAethCost: 12000,
  },
  rift_mantle: {
    id: 'rift_mantle', name: 'Rift Mantle', type: 'Armor', rarity: 'Legendary',
    description: 'Woven from collapsed rift fabric. Phases incoming attacks.',
    statBonus: { AET: 14, CON: 10, SPD: 8 }, hpBonus: 250, mpBonus: 200,
    blacksmithOnly: true,
    aethCost: 580, walletAethCost: 12000,
  },
  aethrix_token_item: {
    id: 'aethrix_token_item', name: 'AETH Token', type: 'Token', rarity: 'Legendary',
    description: 'The Aethrix token. Contract: 6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
    aethCost: 0, walletAethCost: 0,
  },
};
