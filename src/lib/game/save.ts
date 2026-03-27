import { GameState } from './types';

const SAVE_KEY = 'aethrix_save_v3';
const isBrowser = typeof window !== 'undefined';

export function saveGame(state: GameState): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...state, lastSaved: Date.now() }));
  } catch (e) {
    console.error('Save failed', e);
  }
}

export function loadGame(): GameState | null {
  if (!isBrowser) return null;
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
  if (!isBrowser) return;
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  if (!isBrowser) return false;
  return !!localStorage.getItem(SAVE_KEY);
}
