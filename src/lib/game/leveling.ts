import { Character, Stat } from './types';

export function getExpNeeded(level: number): number {
  return Math.floor(Math.pow(level, 2) * 100);
}

export function levelUp(character: Character): Character {
  const newLevel = character.level + 1;
  const newCharacter = { 
    ...character, 
    level: newLevel, 
    exp: 0,
    skillPoints: character.skillPoints + 1,
    attributePoints: character.attributePoints + 5
  };
  
  // No automatic stat growth anymore

  // Recalculate Max HP/MP (including a small natural growth per level)
  const levelBonus = newLevel * 5;
  newCharacter.hp.max = newCharacter.currentStats.CON * 10 + newCharacter.currentStats.STR * 2 + levelBonus;
  newCharacter.mp.max = newCharacter.currentStats.INT * 10 + newCharacter.currentStats.AET * 5 + levelBonus;
  
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
