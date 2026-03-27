export type Stat =
  | 'STR' // Strength
  | 'DEX' // Dexterity
  | 'CON' // Constitution
  | 'INT' // Intelligence
  | 'WIS' // Wisdom
  | 'CHA' // Charisma
  | 'LCK' // Luck
  | 'SPD' // Speed
  | 'AET' // Aether
  | 'SPR' // Spirit
  | 'PER' // Perception
  | 'RES'; // Resolve

export type Stats = Record<Stat, number>;

export interface Race {
  name: string;
  description: string;
  statModifiers: Partial<Stats>;
}

export interface SubRace {
  name: string;
  description: string;
  statModifiers: Partial<Stats>;
}

export interface Class {
  name: string;
  description: string;
  baseStats: Stats;
  abilities: string[]; // Placeholder for now
}

export interface Character {
  name: string;
  level: number;
  exp: number;
  race: Race;
  subRace: SubRace;
  characterClass: Class;
  baseStats: Stats;
  currentStats: Stats; // Including modifiers
  hp: { current: number; max: number };
  mp: { current: number; max: number };
  statusEffects: string[];
}
