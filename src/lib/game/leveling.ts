import { Character, Stat } from './types';

export function getExpNeeded(level: number): number {
  return Math.floor(Math.pow(level, 2) * 100);
}

export function levelUp(character: Character): Character {
  const newLevel = character.level + 1;
  const newCharacter = { ...character, level: newLevel, exp: 0 };
  
  // Stat growth - simple +2 to primary, +1 to others
  (Object.keys(newCharacter.currentStats) as Stat[]).forEach(stat => {
    newCharacter.currentStats[stat] += 1;
    newCharacter.baseStats[stat] += 1;
  });

  // Recalculate Max HP/MP
  newCharacter.hp.max = newCharacter.currentStats.CON * 10 + newCharacter.currentStats.STR * 2;
  newCharacter.mp.max = newCharacter.currentStats.INT * 10 + newCharacter.currentStats.AET * 5;
  
  // Fully heal on level up
  newCharacter.hp.current = newCharacter.hp.max;
  newCharacter.mp.current = newCharacter.mp.max;

  return newCharacter;
}

export function addExp(character: Character, amount: number): { character: Character, leveledUp: boolean } {
  let char = { ...character };
  char.exp += amount;
  let leveledUp = false;

  while (char.exp >= getExpNeeded(char.level)) {
    char.exp -= getExpNeeded(char.level);
    char = levelUp(char);
    leveledUp = true;
  }

  return { character: char, leveledUp };
}
