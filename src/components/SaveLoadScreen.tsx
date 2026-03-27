"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '@/lib/game/types';
import {
  SaveMeta, SaveData,
  saveToSlot, loadSlot, deleteSlot,
  loadAuto, getAllSaveMeta,
  autoSave,
} from '@/lib/game/save';

interface Props {
  currentState: GameState | null;
  onLoad: (state: GameState) => void;
  onBack: () => void;
}

type Slot = 'auto' | 1 | 2 | 3;

export default function SaveLoadScreen({ currentState, onLoad, onBack }: Props) {
  const [metas, setMetas] = useState<(SaveMeta | null)[]>([null, null, null, null]);
  const [confirmDelete, setConfirmDelete] = useState<Slot | null>(null);
  const [confirmSave, setConfirmSave] = useState<1 | 2 | 3 | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const refresh = () => setMetas(getAllSaveMeta());
  useEffect(() => { refresh(); }, []);

  const handleSave = (slot: 1 | 2 | 3) => {
    if (!currentState) return;
    if (metas[slot] && confirmSave !== slot) { setConfirmSave(slot); return; }
    saveToSlot(currentState, slot);
    setConfirmSave(null);
    refresh();
    notify(`Saved to Slot ${slot}`);
  };

  const handleLoad = (slot: Slot) => {
    const data: SaveData | null = slot === 'auto' ? loadAuto() : loadSlot(slot as 1 | 2 | 3);
    if (!data) return;
    onLoad(data.state);
    notify(`Loaded from ${slot === 'auto' ? 'Auto Save' : `Slot ${slot}`}`);
  };

  const handleDelete = (slot: Slot) => {
    if (confirmDelete !== slot) { setConfirmDelete(slot); return; }
    if (slot !== 'auto') deleteSlot(slot as 1 | 2 | 3);
    setConfirmDelete(null);
    refresh();
    notify('Save deleted');
  };

  const slotLabels: Record<Slot, string> = {
    auto: 'Auto Save', 1: 'Slot 1', 2: 'Slot 2', 3: 'Slot 3',
  };

  const slots: Slot[] = ['auto', 1, 2, 3];

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-4">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
          <div>
            <div className="text-aethrix-gold text-[10px] tracking-widest uppercase">Chronicle Archive</div>
            <h1 className="text-2xl font-black uppercase tracking-widest terminal-text">Save / Load</h1>
          </div>
        </div>

        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 border border-aethrix-gold bg-aethrix-gold/10 px-4 py-2 text-xs text-aethrix-gold uppercase tracking-widest text-center">
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current session info */}
        {currentState?.party[0] && (
          <div className="border border-gray-800 p-4 mb-6 bg-gray-950">
            <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Current Session</div>
            <div className="flex gap-6 text-xs">
              <div><span className="text-gray-500">Name</span> <span className="text-white font-bold ml-2">{currentState.party[0].name}</span></div>
              <div><span className="text-gray-500">Level</span> <span className="text-white font-bold ml-2">{currentState.party[0].level}</span></div>
              <div><span className="text-aethrix-gold">AETH</span> <span className="text-white font-bold ml-2">{currentState.party[0].aethBalance}</span></div>
              <div><span className="text-yellow-600">Gold</span> <span className="text-white font-bold ml-2">{currentState.party[0].gold}</span></div>
              <div><span className="text-gray-500">Skills</span> <span className="text-white font-bold ml-2">{currentState.unlockedSkills?.length ?? 0}</span></div>
            </div>
          </div>
        )}

        {/* Save slots */}
        <div className="space-y-3">
          {slots.map((slot, i) => {
            const meta = metas[i];
            const isAuto = slot === 'auto';
            const canSaveHere = !isAuto && !!currentState?.party[0];

            return (
              <motion.div key={slot} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                className={`border p-4 ${meta ? 'border-gray-700' : 'border-gray-900'}`}>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`text-[9px] border px-2 py-0.5 uppercase ${isAuto ? 'border-aethrix-cyan text-aethrix-cyan' : 'border-gray-600 text-gray-500'}`}>
                      {slotLabels[slot]}
                    </div>
                    {meta ? (
                      <div>
                        <div className="text-sm font-bold text-white">{meta.playerName}
                          <span className="text-gray-500 font-normal text-xs ml-2">Lv.{meta.playerLevel}</span>
                        </div>
                        <div className="flex gap-4 mt-1 text-[10px]">
                          <span className="text-aethrix-gold">{meta.aethBalance} AETH</span>
                          <span className="text-yellow-700">{meta.gold}g</span>
                          <span className="text-gray-600">{meta.unlockedSkills} skills</span>
                          <span className="text-gray-600">{meta.questsActive} quests active</span>
                          <span className="text-gray-700">{new Date(meta.savedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-700 text-sm">— Empty —</div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/* Load */}
                    {meta && (
                      <button onClick={() => handleLoad(slot)}
                        className="border border-aethrix-gold px-3 py-1 text-[9px] uppercase hover:bg-aethrix-gold hover:text-black transition-all">
                        Load
                      </button>
                    )}

                    {/* Save (manual slots only) */}
                    {canSaveHere && (
                      confirmSave === slot ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleSave(slot as 1 | 2 | 3)}
                            className="border border-yellow-600 px-3 py-1 text-[9px] uppercase hover:bg-yellow-600 hover:text-black transition-all">
                            Overwrite?
                          </button>
                          <button onClick={() => setConfirmSave(null)}
                            className="border border-gray-700 px-2 py-1 text-[9px] uppercase hover:border-gray-500 transition-all">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleSave(slot as 1 | 2 | 3)}
                          className="border border-gray-600 px-3 py-1 text-[9px] uppercase hover:border-aethrix-gold hover:text-aethrix-gold transition-all">
                          Save
                        </button>
                      )
                    )}

                    {/* Delete */}
                    {meta && !isAuto && (
                      confirmDelete === slot ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleDelete(slot)}
                            className="border border-red-700 px-3 py-1 text-[9px] uppercase hover:bg-red-700 transition-all">
                            Delete?
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="border border-gray-700 px-2 py-1 text-[9px] uppercase hover:border-gray-500 transition-all">
                            ✕
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleDelete(slot)}
                          className="border border-gray-800 px-3 py-1 text-[9px] uppercase hover:border-red-700 hover:text-red-500 transition-all">
                          Del
                        </button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 text-center text-[9px] text-gray-700 uppercase tracking-widest">
          Auto-save triggers on every phase transition · Manual slots persist indefinitely
        </div>
      </div>
    </div>
  );
}
