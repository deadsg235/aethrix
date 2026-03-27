import { Character, Class, Race, SubRace, Stat, Stats } from './types';

export function calculateStats(
  baseStats: Stats,
  race: Race,
  subRace: SubRace
): Stats {
  const currentStats = { ...baseStats };

  // Apply Race modifiers
  Object.entries(race.statModifiers).forEach(([stat, mod]) => {
    currentStats[stat as Stat] += mod || 0;
  });

  // Apply SubRace modifiers
  Object.entries(subRace.statModifiers).forEach(([stat, mod]) => {
    currentStats[stat as Stat] += mod || 0;
  });

  return currentStats;
}

export function createCharacter(
  name: string,
  race: Race,
  subRace: SubRace,
  charClass: Class
): Character {
  const baseStats = { ...charClass.baseStats };
  const currentStats = calculateStats(baseStats, race, subRace);

  // HP = CON * 10 + STR * 2
  const maxHP = currentStats.CON * 10 + currentStats.STR * 2;
  // MP = INT * 10 + AET * 5
  const maxMP = currentStats.INT * 10 + currentStats.AET * 5;

  return {
    name,
    level: 1,
    exp: 0,
    race,
    subRace,
    characterClass: charClass,
    baseStats,
    currentStats,
    hp: { current: maxHP, max: maxHP },
    mp: { current: maxMP, max: maxMP },
    statusEffects: [],
  };
}

// Ess with Amnesia starts strong
export function createEss(race: Race, subRace: SubRace, charClass: Class): Character {
  const ess = createCharacter("Ess", race, subRace, charClass);
  // Boost stats for "strong" amnesiac
  (Object.keys(ess.currentStats) as Stat[]).forEach(stat => {
    ess.currentStats[stat] += 5;
  });
  ess.hp.max += 50;
  ess.hp.current = ess.hp.max;
  return ess;
}
