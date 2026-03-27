import { Race, SubRace, Class, Stats } from './types';

const defaultStats: Stats = {
  STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10,
  LCK: 10, SPD: 10, AET: 10, SPR: 10, PER: 10, RES: 10
};

export const RACES: Race[] = [
  // User provided
  { name: 'Beast-race', description: 'Primal warriors with heightened senses.', statModifiers: { STR: 2, DEX: 1, CON: 1, INT: -2 } },
  { name: 'Terran', description: 'Versatile and resilient survivors.', statModifiers: { CON: 1, CHA: 1, RES: 1, LCK: 1 } },
  { name: 'Dragon-kin', description: 'Noble descendants of the great drakes.', statModifiers: { STR: 2, INT: 1, RES: 2, AET: 1, DEX: -2 } },
  { name: 'Obsidian-kin', description: 'Living stone infused with volcanic energy.', statModifiers: { CON: 3, STR: 1, SPD: -2, SPR: 1 } },
  // Devised
  { name: 'Aetherials', description: 'Beings of pure energy from the rift.', statModifiers: { AET: 3, INT: 2, STR: -3, CON: -2 } },
  { name: 'Stone-Kin', description: 'Stoic protectors carved from the earth.', statModifiers: { CON: 2, RES: 2, WIS: 1, SPD: -1 } },
  { name: 'Shadow-Step', description: 'Nimble scouts from the dark fringes.', statModifiers: { DEX: 3, SPD: 2, PER: 1, STR: -2 } },
  { name: 'Void-Touched', description: 'Corrupted by the void, powerful but unstable.', statModifiers: { LCK: 3, WIS: 2, CHA: -3, RES: -2 } }
];

export const SUBRACES: SubRace[] = [
  // User provided
  { name: 'Esper', description: 'Telepathic affinity.', statModifiers: { INT: 2, PER: 1 } },
  { name: 'Darkblood', description: 'Cursed lineage.', statModifiers: { SPR: -2, STR: 2, LCK: 2 } },
  { name: 'Angelblood', description: 'Divine resonance.', statModifiers: { CHA: 2, RES: 2 } },
  { name: 'Hebronic', description: 'Ancient engineering mastery.', statModifiers: { WIS: 2, INT: 1 } },
  // Devised
  { name: 'Rift-Walker', description: 'Phase through reality.', statModifiers: { SPD: 2, DEX: 1 } },
  { name: 'Star-Soul', description: 'Infused with stellar mana.', statModifiers: { AET: 2, SPR: 1 } },
  { name: 'Primal-Fang', description: 'Instinctual lethality.', statModifiers: { STR: 1, DEX: 1, PER: 1 } },
  { name: 'Iron-Bound', description: 'Unbreakable resolve.', statModifiers: { CON: 1, RES: 2 } }
];

export const CLASSES: Class[] = [
  {
    name: 'Empire Vanguard',
    description: 'The iron fist of the Tiena-Nueble.',
    baseStats: { ...defaultStats, STR: 15, CON: 14, RES: 12 },
    abilities: ['Iron Guard', 'Shield Bash', 'Empire\'s Decree']
  },
  {
    name: 'Aether Weaver',
    description: 'Master of the blue flow.',
    baseStats: { ...defaultStats, INT: 16, AET: 15, SPR: 12 },
    abilities: ['Aether Pulse', 'Mana Shield', 'Resonance Overload']
  },
  {
    name: 'Soul Reaper',
    description: 'Extracting life from the void.',
    baseStats: { ...defaultStats, STR: 14, LCK: 14, SPR: 12 },
    abilities: ['Life Siphon', 'Ghost Slash', 'Reaper\'s Mark']
  },
  {
    name: 'Void Stalker',
    description: 'Invisible death.',
    baseStats: { ...defaultStats, DEX: 16, SPD: 15, PER: 13 },
    abilities: ['Stealth', 'Critical Strike', 'Shadow Step']
  },
  {
    name: 'Imperial Inquisitor',
    description: 'Slaying heresy through status.',
    baseStats: { ...defaultStats, WIS: 15, PER: 14, RES: 13 },
    abilities: ['Heresy Purge', 'Stun Lock', 'Confession Aura']
  },
  {
    name: 'Rift Warden',
    description: 'Dimensional shield.',
    baseStats: { ...defaultStats, CON: 15, WIS: 14, AET: 13 },
    abilities: ['Rift Barrier', 'Dimension Swap', 'Warden\'s Aegis']
  },
  {
    name: 'Storm Caller',
    description: 'Wrath of the heavens.',
    baseStats: { ...defaultStats, INT: 15, SPR: 14, LCK: 13 },
    abilities: ['Chain Lightning', 'Static Field', 'Eye of the Storm']
  },
  {
    name: 'Blood Knight',
    description: 'Power through pain.',
    baseStats: { ...defaultStats, CON: 16, STR: 15, RES: 12 },
    abilities: ['Blood Sacrifice', 'Sanguine Blade', 'Vengeful Strike']
  }
];
