import { Character, Stat } from './types';

export interface CombatResult {
  damage: number;
  isCrit: boolean;
  isHit: boolean;
  statusEffectApplied?: string;
  log: string;
}

export function rollDice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function processAttack(
  attacker: Character,
  defender: Character,
  isMagical: boolean = false
): CombatResult {
  const log: string[] = [];
  
  // 1. Hit Chance
  const hitStat = attacker.currentStats.DEX * 1.5 + attacker.currentStats.PER;
  const dodgeStat = defender.currentStats.SPD + defender.currentStats.DEX;
  const hitChance = Math.min(95, Math.max(50, 75 + (hitStat - dodgeStat)));
  const hitRoll = rollDice(1, 100);

  if (hitRoll > hitChance) {
    return { damage: 0, isCrit: false, isHit: false, log: `${attacker.name} missed!` };
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
  if (isCrit) {
    damage *= 2;
    log.push("CRITICAL HIT!");
  }

  // 4. Status Effects
  let statusEffectApplied: string | undefined;
  const stunChance = (attacker.currentStats.SPD - defender.currentStats.RES) * 2;
  if (rollDice(1, 100) < stunChance) {
    statusEffectApplied = "STUNNED";
    log.push(`${defender.name} is STUNNED!`);
  }

  log.push(`${attacker.name} deals ${damage} damage to ${defender.name}.`);

  return {
    damage,
    isCrit,
    isHit: true,
    statusEffectApplied,
    log: log.join(" ")
  };
}

export function handleTurn(party: Character[], enemies: Character[]): string[] {
  // Simple AI for now
  const logs: string[] = [];
  // ... Logic to simulate a full turn ...
  return logs;
}
