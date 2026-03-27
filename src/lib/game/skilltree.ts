import { Stat } from './types';

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  cost: number; // AETH or Level Points
  statBonus?: Partial<Record<Stat, number>>;
  unlocked: boolean;
  dependencies: string[];
}

export const INITIAL_SKILL_TREE: SkillNode[] = [
  {
    id: 'core_resilience',
    name: 'Core Resilience',
    description: 'Increase CON by 5.',
    cost: 10,
    statBonus: { CON: 5 },
    unlocked: false,
    dependencies: [],
  },
  {
    id: 'aether_attunement',
    name: 'Aether Attunement',
    description: 'Unlock the power of the Aethrix token. Increase AET by 10.',
    cost: 50,
    statBonus: { AET: 10 },
    unlocked: false,
    dependencies: ['core_resilience'],
  },
  {
    id: 'imperial_might',
    name: 'Imperial Might',
    description: 'The Tiena-Nueble grants you strength. STR +8.',
    cost: 30,
    statBonus: { STR: 8 },
    unlocked: false,
    dependencies: ['core_resilience'],
  },
  {
    id: 'void_sight',
    name: 'Void Sight',
    description: 'See the invisible. PER +12.',
    cost: 40,
    statBonus: { PER: 12 },
    unlocked: false,
    dependencies: ['aether_attunement'],
  }
];
