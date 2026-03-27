import { GameState } from './types';

const SAVE_VERSION = 4;
const AUTO_SAVE_KEY = 'aethrix_auto_v4';
const SLOT_KEY = (n: 1 | 2 | 3) => `aethrix_slot${n}_v4`;

export interface SaveMeta {
  slot: 'auto' | 1 | 2 | 3;
  playerName: string;
  playerLevel: number;
  aethBalance: number;
  gold: number;
  unlockedSkills: number;
  questsActive: number;
  phase: string;
  savedAt: number;        // Date.now()
  version: number;
}

export interface SaveData {
  meta: SaveMeta;
  state: GameState;
}

const isBrowser = typeof window !== 'undefined';

function buildMeta(state: GameState, slot: SaveMeta['slot']): SaveMeta {
  const player = state.party[0];
  return {
    slot,
    playerName: player?.name ?? 'Unknown',
    playerLevel: player?.level ?? 1,
    aethBalance: player?.aethBalance ?? 0,
    gold: player?.gold ?? 0,
    unlockedSkills: state.unlockedSkills?.length ?? 0,
    questsActive: state.quests?.filter(q => q.status === 'active').length ?? 0,
    phase: state.phase,
    savedAt: Date.now(),
    version: SAVE_VERSION,
  };
}

function write(key: string, state: GameState, slot: SaveMeta['slot']): void {
  if (!isBrowser) return;
  try {
    const data: SaveData = { meta: buildMeta(state, slot), state };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Save write failed', e);
  }
}

function read(key: string): SaveData | null {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (!data?.state || !data?.meta) return null;
    return data;
  } catch {
    return null;
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

export function autoSave(state: GameState): void {
  write(AUTO_SAVE_KEY, state, 'auto');
}

export function saveToSlot(state: GameState, slot: 1 | 2 | 3): void {
  write(SLOT_KEY(slot), state, slot);
}

export function loadAuto(): SaveData | null {
  return read(AUTO_SAVE_KEY);
}

export function loadSlot(slot: 1 | 2 | 3): SaveData | null {
  return read(SLOT_KEY(slot));
}

export function deleteSlot(slot: 1 | 2 | 3): void {
  if (!isBrowser) return;
  localStorage.removeItem(SLOT_KEY(slot));
}

export function deleteAuto(): void {
  if (!isBrowser) return;
  localStorage.removeItem(AUTO_SAVE_KEY);
}

export function getAllSaveMeta(): (SaveMeta | null)[] {
  if (!isBrowser) return [null, null, null, null];
  return [
    read(AUTO_SAVE_KEY)?.meta ?? null,
    read(SLOT_KEY(1))?.meta ?? null,
    read(SLOT_KEY(2))?.meta ?? null,
    read(SLOT_KEY(3))?.meta ?? null,
  ];
}

export function hasAnySave(): boolean {
  if (!isBrowser) return false;
  return !!(
    localStorage.getItem(AUTO_SAVE_KEY) ||
    localStorage.getItem(SLOT_KEY(1)) ||
    localStorage.getItem(SLOT_KEY(2)) ||
    localStorage.getItem(SLOT_KEY(3))
  );
}

// Legacy compat — keep old key working
export function saveGame(state: GameState): void { autoSave(state); }
export function loadGame(): GameState | null { return loadAuto()?.state ?? null; }
export function deleteSave(): void { deleteAuto(); }
export function hasSave(): boolean { return hasAnySave(); }
