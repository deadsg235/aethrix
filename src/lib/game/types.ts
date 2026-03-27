export type Stat =
  | 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA'
  | 'LCK' | 'SPD' | 'AET' | 'SPR' | 'PER' | 'RES';

export type Stats = Record<Stat, number>;

export interface Race {
  name: string;
  description: string;
  lore: string;
  statModifiers: Partial<Stats>;
  passiveAbility: string;
}

export interface SubRace {
  name: string;
  description: string;
  statModifiers: Partial<Stats>;
  passiveAbility: string;
}

export interface Class {
  name: string;
  description: string;
  lore: string;
  baseStats: Stats;
  abilities: string[];
  advancedAbilities: string[];   // unlocked at level 30+
  masterAbilities: string[];     // unlocked at level 60+
  legendaryAbility: string;      // unlocked at level 100
}

export type ItemRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type ItemType = 'Weapon' | 'Armor' | 'Consumable' | 'Relic' | 'Token' | 'Crafting' | 'Key';

export interface Item {
  id: string;
  name: string;
  description: string;
  lore?: string;
  type: ItemType;
  rarity: ItemRarity;
  statBonus?: Partial<Stats>;
  hpBonus?: number;
  mpBonus?: number;
  aethCost: number;
  walletAethCost?: number;
  goldCost?: number;
  blacksmithOnly?: boolean;
  craftingRecipe?: string[];     // item ids required to craft
  requiredLevel?: number;
  effect?: string;
  setId?: string;                // equipment set bonus
}

export type QuestStatus = 'available' | 'active' | 'completed' | 'failed';
export type QuestType = 'main' | 'side' | 'notice' | 'dungeon' | 'faction' | 'legendary';

export interface QuestObjective {
  id: string;
  description: string;
  completed: boolean;
  count?: number;
  required?: number;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  lore?: string;
  type: QuestType;
  act?: 1 | 2 | 3;
  objectives: QuestObjective[];
  rewardGold: number;
  rewardExp: number;
  rewardAeth: number;
  rewardItems?: string[];
  rewardReputation?: { factionId: string; amount: number }[];
  status: QuestStatus;
  requiredLevel?: number;
  requiredQuests?: string[];
  areaId?: string;
  dungeonId?: string;
}

export interface SafeHub {
  name: string;
  description: string;
  services: ('inn' | 'healer' | 'storage' | 'teleport' | 'crafting' | 'training' | 'auction')[];
}

export interface Market {
  name: string;
  itemIds: string[];
  refreshDays?: number;
}

export interface Blacksmith {
  name: string;
  lore: string;
  isLegendary: boolean;
  isMythic?: boolean;
  itemIds: string[];
  craftingItemIds?: string[];
}

export interface DungeonFloor {
  id: string;
  name: string;
  description: string;
  enemyPool: string[];
  bossId?: string;
  loot: string[];
}

export interface Dungeon {
  id: string;
  name: string;
  description: string;
  lore: string;
  floors: DungeonFloor[];
  requiredLevel: number;
  areaId: string;
  rewardItems: string[];
  rewardAeth: number;
  isMythic?: boolean;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  safeHub?: SafeHub;
  market?: Market;
  blacksmith?: Blacksmith;
  dungeon?: Dungeon;
  questIds: string[];
  enemyPool: string[];
  eliteEnemyPool?: string[];
  bossId?: string;
  lore: string;
  act: 1 | 2 | 3;
  unlockRequirement?: string;
}

export interface Continent {
  id: string;
  name: string;
  description: string;
  lore: string;
  act: 1 | 2 | 3;
  areas: Area[];
}

export type FactionAlignment = 'empire' | 'fringe' | 'neutral' | 'ancient' | 'void';

export interface Faction {
  id: string;
  name: string;
  description: string;
  lore: string;
  alignment: FactionAlignment;
  maxReputation: number;
  reputationTiers: { threshold: number; title: string; perks: string[] }[];
}

export type StoryChoiceEffect = {
  statBonus?: Partial<Stats>;
  addItem?: string;
  addQuest?: string;
  setFlag?: string;
  removeFlag?: string;
  aethReward?: number;
  goldReward?: number;
  expReward?: number;
  reputationChange?: { factionId: string; amount: number }[];
};

export interface StoryChoice {
  id: string;
  text: string;
  effect: StoryChoiceEffect;
  nextNodeId: string;
  requiresFlag?: string;
  requiresLevel?: number;
  requiresFaction?: { id: string; minRep: number };
}

export interface StoryNode {
  id: string;
  title: string;
  text: string;
  choices: StoryChoice[];
  isEnding?: boolean;
  chapterNumber?: number;
  act?: 1 | 2 | 3;
  speaker?: string;
}

export interface CraftingRecipe {
  id: string;
  name: string;
  resultItemId: string;
  ingredients: { itemId: string; quantity: number }[];
  goldCost: number;
  aethCost: number;
  requiredLevel: number;
  requiredBlacksmith?: boolean;
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
  equippedRelic?: Item;
  reputation: Record<string, number>;
  completedQuests: string[];
  kills: number;
  playtimeMinutes: number;
  newGamePlusCount: number;
  titles: string[];
  activeTitle?: string;
}

export interface GameState {
  phase: 'LANDING' | 'CHARACTER_CREATION' | 'STORY' | 'WORLD' | 'COMBAT' |
         'MARKET' | 'BLACKSMITH' | 'QUEST_BOARD' | 'SAFE_HUB' | 'SKILL_TREE' |
         'SAVE_LOAD' | 'DUNGEON' | 'CRAFTING' | 'FACTION_HUB' | 'CODEX';
  act: 1 | 2 | 3;
  party: Character[];
  activeAreaId: string | null;
  activeContinentId: string | null;
  activeDungeonId: string | null;
  activeDungeonFloor: number;
  quests: Quest[];
  storyNodeId: string;
  storyFlags: string[];
  enemies: Character[];
  combatReturnPhase: 'WORLD' | 'STORY' | 'DUNGEON';
  unlockedSkills: string[];
  unlockedAreas: string[];
  unlockedContinents: string[];
  discoveredLore: string[];
  walletPublicKey: string | null;
  walletAethBalance: number | null;
  walletAethSpent: number;
  sessionStartTime: number;
  totalPlaytimeMinutes: number;
  newGamePlusCount: number;
  log: string[];
}
