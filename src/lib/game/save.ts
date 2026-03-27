import { Character } from './types';

const SAVE_KEY = 'aethrix_save_v1';

export interface GameSave {
  party: Character[];
  inventory: string[];
  lastSaved: number;
}

export function saveGame(party: Character[], inventory: string[]): void {
  const save: GameSave = {
    party,
    inventory,
    lastSaved: Date.now(),
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function loadGame(): GameSave | null {
  const data = localStorage.getItem(SAVE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as GameSave;
  } catch (e) {
    console.error("Failed to load save", e);
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}
