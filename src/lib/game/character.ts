import { Character, Class, Race, SubRace, Stat, Stats } from './types';
import { STARTING_AETH, STARTING_GOLD } from './token';

export function calculateStats(baseStats: Stats, race: Race, subRace: SubRace): Stats {
  const s = { ...baseStats };
  Object.entries(race.statModifiers).forEach(([k, v]) => { s[k as Stat] += v || 0; });
  Object.entries(subRace.statModifiers).forEach(([k, v]) => { s[k as Stat] += v || 0; });
  return s;
}

export function createCharacter(name: string, race: Race, subRace: SubRace, charClass: Class): Character {
  const baseStats = { ...charClass.baseStats };
  const currentStats = calculateStats(baseStats, race, subRace);
  const maxHP = currentStats.CON * 10 + currentStats.STR * 2;
  const maxMP = currentStats.INT * 10 + currentStats.AET * 5;
  return {
    id: `${name}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name, level: 1, exp: 0,
    race, subRace, characterClass: charClass,
    baseStats, currentStats,
    hp: { current: maxHP, max: maxHP },
    mp: { current: maxMP, max: maxMP },
    statusEffects: [],
    gold: 0, aethBalance: 0, inventory: [],
  };
}

export function createEss(race: Race, subRace: SubRace, charClass: Class): Character {
  const ess = createCharacter('Ess', race, subRace, charClass);
  (Object.keys(ess.currentStats) as Stat[]).forEach(s => { ess.currentStats[s] += 5; });
  ess.hp.max += 50;
  ess.hp.current = ess.hp.max;
  ess.gold = STARTING_GOLD;
  ess.aethBalance = STARTING_AETH;
  return ess;
}
