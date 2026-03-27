"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Area, Character } from '@/lib/game/types';

interface Props {
  area: Area;
  player: Character;
  onRest: () => void;
  onHeal: () => void;
  onBack: () => void;
}

export default function SafeHubView({ area, player, onRest, onHeal, onBack }: Props) {
  const hub = area.safeHub;
  if (!hub) return null;

  const healCost = Math.floor((player.hp.max - player.hp.current) * 0.5);
  const isFullHp = player.hp.current >= player.hp.max;

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
          <div className="text-green-400 text-[10px] uppercase tracking-widest">Safe Hub — {area.name}</div>
        </div>

        <div className="border border-green-900 p-8 mb-6">
          <h1 className="text-2xl font-black uppercase terminal-text mb-2">{hub.name}</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{hub.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-800 p-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">HP</div>
              <div className="text-sm"><span className="text-red-400">{Math.ceil(player.hp.current)}</span> / {player.hp.max}</div>
            </div>
            <div className="border border-gray-800 p-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">MP</div>
              <div className="text-sm"><span className="text-cyan-400">{Math.ceil(player.mp.current)}</span> / {player.mp.max}</div>
            </div>
            <div className="border border-gray-800 p-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">Gold</div>
              <div className="text-sm text-yellow-600 font-bold">{player.gold}</div>
            </div>
            <div className="border border-gray-800 p-3">
              <div className="text-[10px] text-gray-500 uppercase mb-1">AETH</div>
              <div className="text-sm text-aethrix-gold font-bold">{player.aethBalance}</div>
            </div>
          </div>

          <div className="space-y-3">
            {hub.services.includes('inn') && (
              <motion.button whileHover={{ scale: 1.01 }} onClick={onRest}
                className="w-full border border-green-800 py-3 text-sm uppercase tracking-widest hover:bg-green-900/30 transition-all">
                🛏 Rest at Inn — Fully Restore HP & MP (Free)
              </motion.button>
            )}
            {hub.services.includes('healer') && (
              <motion.button whileHover={{ scale: 1.01 }} onClick={onHeal}
                disabled={isFullHp}
                className="w-full border border-cyan-900 py-3 text-sm uppercase tracking-widest hover:bg-cyan-900/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                ✚ Healer — Restore HP ({isFullHp ? 'Full' : `${healCost}g`})
              </motion.button>
            )}
            {hub.services.includes('teleport') && (
              <div className="w-full border border-gray-700 py-3 text-sm uppercase tracking-widest text-center text-gray-500">
                ⬡ Teleport Network — Coming Soon
              </div>
            )}
            {hub.services.includes('storage') && (
              <div className="w-full border border-gray-700 py-3 text-sm uppercase tracking-widest text-center text-gray-500">
                📦 Storage — Coming Soon
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-gray-600 text-[10px] uppercase tracking-widest">
          You are safe here. The empire's reach does not extend to this place.
        </div>
      </div>
    </div>
  );
}
