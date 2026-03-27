import { GameState } from './types';

const SAVE_KEY = 'aethrix_save_v3';

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
  } catch (e) {
    console.error('Save failed', e);
  }
}

export function loadGame(): GameState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    return JSON.parse(data) as GameState;
  } catch (e) {
    console.error('Load failed', e);
    return null;
  }
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  return !!localStorage.getItem(SAVE_KEY);
}
