export type Stat =
  | 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'
  | 'LCK' | 'SPD' | 'AET' | 'SPR' | 'PER' | 'RES';

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
  abilities: string[];
}

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
export type ItemType = 'Weapon' | 'Armor' | 'Consumable' | 'Relic' | 'Token';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  rarity: ItemRarity;
  statBonus?: Partial<Stats>;
  hpBonus?: number;
  mpBonus?: number;
  aethCost: number;       // price in AETH tokens
  goldCost?: number;      // price in in-game gold (free currency)
  blacksmithOnly?: boolean;
  effect?: string;
}

export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';
export type QuestType = 'main' | 'side' | 'notice';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  objectives: QuestObjective[];
  rewardGold: number;
  rewardExp: number;
  rewardAeth: number;
  rewardItems?: string[];   // item ids
  status: QuestStatus;
  requiredLevel?: number;
  areaId?: string;
}

export interface SafeHub {
  name: string;
  description: string;
  services: ('inn' | 'healer' | 'storage' | 'teleport')[];
}

export interface Market {
  name: string;
  itemIds: string[];        // references to ITEMS map
}

export interface Blacksmith {
  name: string;
  lore: string;
  isLegendary: boolean;
  itemIds: string[];
}

export interface Area {
  id: string;
  name: string;
  description: string;
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  safeHub?: SafeHub;
  market?: Market;
  blacksmith?: Blacksmith;
  questIds: string[];
  enemyPool: string[];
  lore: string;
}

export interface Continent {
  id: string;
  name: string;
  description: string;
  lore: string;
  areas: Area[];
}

export type StoryChoiceEffect = {
  statBonus?: Partial<Stats>;
  addItem?: string;
  addQuest?: string;
  setFlag?: string;
  aethReward?: number;
  goldReward?: number;
};

export interface StoryChoice {
  id: string;
  text: string;
  effect: StoryChoiceEffect;
  nextNodeId: string;
  requiresFlag?: string;
}

export interface StoryNode {
  id: string;
  title: string;
  text: string;
  choices: StoryChoice[];
  isEnding?: boolean;
  chapterNumber?: number;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  exp: number;
  race: Race;
  subRace: SubRace;
  characterClass: Class;
  baseStats: Stats;
  currentStats: Stats;
  hp: { current: number; max: number };
  mp: { current: number; max: number };
  statusEffects: string[];
  gold: number;
  aethBalance: number;
  inventory: Item[];
  equippedWeapon?: Item;
  equippedArmor?: Item;
}

export interface GameState {
  phase: 'LANDING' | 'CHARACTER_CREATION' | 'STORY' | 'WORLD' | 'COMBAT' | 'MARKET' | 'BLACKSMITH' | 'QUEST_BOARD' | 'SAFE_HUB' | 'SKILL_TREE';
  party: Character[];
  activeAreaId: string | null;
  activeContinentId: string | null;
  quests: Quest[];
  storyNodeId: string;
  storyFlags: string[];
  enemies: Character[];
  combatReturnPhase: 'WORLD' | 'STORY';
  unlockedSkills: string[];
  log: string[];
}
