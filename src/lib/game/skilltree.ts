import { Stat } from './types';

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  aethCost: number;
  branch: 'aether' | 'combat' | 'shadow' | 'imperial';
  tier: 1 | 2 | 3 | 4 | 5;
  statBonus?: Partial<Record<Stat, number>>;
  hpBonus?: number;
  mpBonus?: number;
  abilityUnlock?: string;
  dependencies: string[];
}

export const SKILL_TREE: SkillNode[] = [
  // ── AETHER BRANCH (cyan) ─────────────────────────────────────
  {
    id: 'aether_spark',
    name: 'Aether Spark',
    branch: 'aether', tier: 1,
    description: 'Ignite the Aethrix within. AET +5, INT +3.',
    aethCost: 10,
    statBonus: { AET: 5, INT: 3 },
    dependencies: [],
  },
  {
    id: 'aether_attunement',
    name: 'Aether Attunement',
    branch: 'aether', tier: 2,
    description: 'Deepen your bond with the rift. AET +10, MP +50.',
    aethCost: 25,
    statBonus: { AET: 10 },
    mpBonus: 50,
    dependencies: ['aether_spark'],
  },
  {
    id: 'rift_sight',
    name: 'Rift Sight',
    branch: 'aether', tier: 3,
    description: 'See through dimensional barriers. PER +12, INT +6.',
    aethCost: 50,
    statBonus: { PER: 12, INT: 6 },
    dependencies: ['aether_attunement'],
  },
  {
    id: 'aether_overload',
    name: 'Aether Overload',
    branch: 'aether', tier: 4,
    description: 'Channel raw rift energy. AET +20, SPR +10. Unlocks: Resonance Overload.',
    aethCost: 100,
    statBonus: { AET: 20, SPR: 10 },
    abilityUnlock: 'Resonance Overload',
    dependencies: ['rift_sight'],
  },
  {
    id: 'aethrix_ascension',
    name: 'Aethrix Ascension',
    branch: 'aether', tier: 5,
    description: 'Become one with the Aethrix. AET +30, INT +15, MP +200. Unlocks: Aethrix Pulse.',
    aethCost: 250,
    statBonus: { AET: 30, INT: 15 },
    mpBonus: 200,
    abilityUnlock: 'Aethrix Pulse',
    dependencies: ['aether_overload'],
  },

  // ── COMBAT BRANCH (red) ──────────────────────────────────────
  {
    id: 'iron_body',
    name: 'Iron Body',
    branch: 'combat', tier: 1,
    description: 'Harden your body against punishment. CON +5, HP +40.',
    aethCost: 10,
    statBonus: { CON: 5 },
    hpBonus: 40,
    dependencies: [],
  },
  {
    id: 'battle_hardened',
    name: 'Battle Hardened',
    branch: 'combat', tier: 2,
    description: 'Scars make you stronger. STR +8, CON +4.',
    aethCost: 25,
    statBonus: { STR: 8, CON: 4 },
    dependencies: ['iron_body'],
  },
  {
    id: 'imperial_might',
    name: 'Imperial Might',
    branch: 'combat', tier: 3,
    description: 'The empire\'s strength flows through you. STR +15, RES +8. Unlocks: Empire\'s Decree.',
    aethCost: 50,
    statBonus: { STR: 15, RES: 8 },
    abilityUnlock: "Empire's Decree",
    dependencies: ['battle_hardened'],
  },
  {
    id: 'blood_surge',
    name: 'Blood Surge',
    branch: 'combat', tier: 4,
    description: 'Pain becomes power. STR +20, HP +100. Unlocks: Blood Sacrifice.',
    aethCost: 100,
    statBonus: { STR: 20 },
    hpBonus: 100,
    abilityUnlock: 'Blood Sacrifice',
    dependencies: ['imperial_might'],
  },
  {
    id: 'warlord',
    name: 'Warlord',
    branch: 'combat', tier: 5,
    description: 'You are the weapon. STR +30, CON +20, HP +200. Unlocks: Sanguine Blade.',
    aethCost: 250,
    statBonus: { STR: 30, CON: 20 },
    hpBonus: 200,
    abilityUnlock: 'Sanguine Blade',
    dependencies: ['blood_surge'],
  },

  // ── SHADOW BRANCH (purple) ───────────────────────────────────
  {
    id: 'light_step',
    name: 'Light Step',
    branch: 'shadow', tier: 1,
    description: 'Move without sound. DEX +5, SPD +3.',
    aethCost: 10,
    statBonus: { DEX: 5, SPD: 3 },
    dependencies: [],
  },
  {
    id: 'void_step',
    name: 'Void Step',
    branch: 'shadow', tier: 2,
    description: 'Phase briefly through reality. SPD +8, DEX +6.',
    aethCost: 25,
    statBonus: { SPD: 8, DEX: 6 },
    dependencies: ['light_step'],
  },
  {
    id: 'shadow_veil',
    name: 'Shadow Veil',
    branch: 'shadow', tier: 3,
    description: 'Become difficult to perceive. DEX +12, LCK +8. Unlocks: Stealth.',
    aethCost: 50,
    statBonus: { DEX: 12, LCK: 8 },
    abilityUnlock: 'Stealth',
    dependencies: ['void_step'],
  },
  {
    id: 'critical_edge',
    name: 'Critical Edge',
    branch: 'shadow', tier: 4,
    description: 'Strike where it hurts most. LCK +15, DEX +10. Unlocks: Critical Strike.',
    aethCost: 100,
    statBonus: { LCK: 15, DEX: 10 },
    abilityUnlock: 'Critical Strike',
    dependencies: ['shadow_veil'],
  },
  {
    id: 'void_reaper_mastery',
    name: 'Void Reaper Mastery',
    branch: 'shadow', tier: 5,
    description: 'Death itself fears you. DEX +25, LCK +20, SPD +15. Unlocks: Shadow Step.',
    aethCost: 250,
    statBonus: { DEX: 25, LCK: 20, SPD: 15 },
    abilityUnlock: 'Shadow Step',
    dependencies: ['critical_edge'],
  },

  // ── IMPERIAL BRANCH (gold) ───────────────────────────────────
  {
    id: 'core_resilience',
    name: 'Core Resilience',
    branch: 'imperial', tier: 1,
    description: 'The empire does not break. RES +5, WIS +3.',
    aethCost: 10,
    statBonus: { RES: 5, WIS: 3 },
    dependencies: [],
  },
  {
    id: 'inquisitor_mind',
    name: 'Inquisitor Mind',
    branch: 'imperial', tier: 2,
    description: 'See through lies and illusions. WIS +8, PER +6.',
    aethCost: 25,
    statBonus: { WIS: 8, PER: 6 },
    dependencies: ['core_resilience'],
  },
  {
    id: 'imperial_authority',
    name: 'Imperial Authority',
    branch: 'imperial', tier: 3,
    description: 'Your presence commands obedience. CHA +12, RES +8. Unlocks: Confession Aura.',
    aethCost: 50,
    statBonus: { CHA: 12, RES: 8 },
    abilityUnlock: 'Confession Aura',
    dependencies: ['inquisitor_mind'],
  },
  {
    id: 'rift_warden_pact',
    name: 'Rift Warden Pact',
    branch: 'imperial', tier: 4,
    description: 'Bound to protect the empire\'s rifts. RES +15, AET +10. Unlocks: Rift Barrier.',
    aethCost: 100,
    statBonus: { RES: 15, AET: 10 },
    abilityUnlock: 'Rift Barrier',
    dependencies: ['imperial_authority'],
  },
  {
    id: 'tiena_nueble_chosen',
    name: 'Tiena-Nueble Chosen',
    branch: 'imperial', tier: 5,
    description: 'The empire\'s full power flows through you. All stats +10, HP +150. Unlocks: Warden\'s Aegis.',
    aethCost: 250,
    statBonus: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10, LCK: 10, SPD: 10, AET: 10, SPR: 10, PER: 10, RES: 10 },
    hpBonus: 150,
    abilityUnlock: "Warden's Aegis",
    dependencies: ['rift_warden_pact'],
  },
];
