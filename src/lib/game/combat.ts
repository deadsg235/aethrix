import { Character, Stat, AppliedStatusEffect, ElementalType } from './types';
import { ALL_STATUS_EFFECTS } from './statusEffects';

export interface CombatResult {
  damage: number;
  isCrit: boolean;
  isHit: boolean;
  statusEffectsApplied: AppliedStatusEffect[];
  log: string;
}

export function rollDice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function processAttack(
  attacker: Character,
  defender: Character,
  isMagical: boolean = false,
  element: ElementalType = 'Physical'
): CombatResult {
  const log: string[] = [];
  const statusEffectsApplied: AppliedStatusEffect[] = [];
  
  // Check if attacker is stunned
  if (attacker.statusEffects.some(se => se.type === 'Control' && se.id === 'stun')) {
    return { damage: 0, isCrit: false, isHit: false, statusEffectsApplied: [], log: `${attacker.name} is STUNNED and cannot act!` };
  }

  // 1. Hit Chance
  const hitStat = attacker.currentStats.DEX * 1.5 + attacker.currentStats.PER;
  const dodgeStat = defender.currentStats.SPD + defender.currentStats.DEX;
  const hitChance = Math.min(95, Math.max(50, 75 + (hitStat - dodgeStat)));
  const hitRoll = rollDice(1, 100);

  if (hitRoll > hitChance) {
    return { damage: 0, isCrit: false, isHit: false, statusEffectsApplied: [], log: `${attacker.name} missed!` };
  }

  // 2. Critical Hit
  const critStat = attacker.currentStats.LCK * 2 + attacker.currentStats.DEX;
  const critResistance = defender.currentStats.PER + defender.currentStats.RES;
  const critChance = Math.min(40, Math.max(5, (critStat - critResistance) / 2));
  const critRoll = rollDice(1, 100);
  const isCrit = critRoll <= critChance;

  // 3. Damage Calculation
  const attackPower = isMagical 
    ? attacker.currentStats.INT * 2 + attacker.currentStats.AET 
    : attacker.currentStats.STR * 2 + attacker.currentStats.DEX;
  
  const defensePower = isMagical
    ? defender.currentStats.WIS * 1.5 + defender.currentStats.RES
    : defender.currentStats.CON * 1.5 + defender.currentStats.RES;

  let damage = Math.max(1, attackPower - (defensePower / 2));

  // 3a. Elemental Resistance
  const resistance = defender.elementalResistance[element] || 0;
  damage = Math.max(1, damage * (1 - (resistance / 100)));

  if (isCrit) {
    damage *= 2;
    log.push("CRITICAL HIT!");
  }

  damage = Math.floor(damage);

  // 4. Status Effects Application (Simplified for now)
  const stunChance = (attacker.currentStats.SPD - defender.currentStats.RES) * 2;
  if (rollDice(1, 100) < stunChance) {
    const stunEffect = ALL_STATUS_EFFECTS.find(se => se.id === 'stun');
    if (stunEffect) {
      statusEffectsApplied.push({ ...stunEffect, remainingDuration: stunEffect.duration || 1, casterId: attacker.id });
      log.push(`${defender.name} is STUNNED!`);
    }
  }

  log.push(`${attacker.name} deals ${damage} ${element} damage to ${defender.name}.`);

  return {
    damage,
    isCrit,
    isHit: true,
    statusEffectsApplied,
    log: log.join(" ")
  };
}

export function processStartOfTurn(character: Character): { character: Character, log: string[] } {
  const log: string[] = [];
  let char = { ...character };

  // Apply DoTs and other start of turn effects
  char.statusEffects.forEach(effect => {
    if (effect.type === 'DamageOverTime') {
      char.hp.current = Math.max(0, char.hp.current - (effect.magnitude || 0));
      log.push(`${char.name} takes ${effect.magnitude} damage from ${effect.name}.`);
    }
    if (effect.type === 'HealOverTime') {
      char.hp.current = Math.min(char.hp.max, char.hp.current + (effect.magnitude || 0));
      log.push(`${char.name} heals ${effect.magnitude} HP from ${effect.name}.`);
    }
  });

  return { character: char, log };
}

export function processEndOfTurn(character: Character): { character: Character, log: string[] } {
  const log: string[] = [];
  let char = { ...character };

  // Tick down durations
  char.statusEffects = char.statusEffects
    .map(effect => ({ ...effect, remainingDuration: effect.remainingDuration - 1 }))
    .filter(effect => effect.remainingDuration > 0);

  return { character: char, log };
}

export function handleTurn(party: Character[], enemies: Character[]): string[] {
  const logs: string[] = [];
  // ... Simplified turn logic for simulation ...
  return logs;
}
