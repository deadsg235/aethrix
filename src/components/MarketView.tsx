"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Area, Character, Item, ItemRarity } from '@/lib/game/types';
import { ITEMS } from '@/lib/game/items';
import { AETH_TOKEN, canAffordAeth, canAffordGold } from '@/lib/game/token';

interface Props {
  area: Area;
  player: Character;
  isBlacksmith?: boolean;
  onBuy: (item: Item, currency: 'aeth' | 'gold') => void;
  onBack: () => void;
}

const rarityColor: Record<ItemRarity, string> = {
  Common: 'border-gray-600 text-gray-400',
  Uncommon: 'border-green-700 text-green-400',
  Rare: 'border-blue-600 text-blue-400',
  Legendary: 'border-purple-500 text-purple-400',
};

const rarityBg: Record<ItemRarity, string> = {
  Common: '', Uncommon: 'bg-green-950/20', Rare: 'bg-blue-950/20', Legendary: 'bg-purple-950/30',
};

export default function MarketView({ area, player, isBlacksmith = false, onBuy, onBack }: Props) {
  const [selected, setSelected] = useState<Item | null>(null);
  const source = isBlacksmith ? area.blacksmith : area.market;
  const itemIds = source?.itemIds || [];
  const items = itemIds.map(id => ITEMS[id]).filter(Boolean);
  const title = isBlacksmith ? area.blacksmith?.name : area.market?.name;
  const lore = isBlacksmith ? area.blacksmith?.lore : undefined;

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
          <div className={`text-[10px] uppercase tracking-widest ${isBlacksmith && area.blacksmith?.isLegendary ? 'text-purple-400' : 'text-aethrix-gold'}`}>
            {isBlacksmith ? (area.blacksmith?.isLegendary ? '★ Legendary Forge' : 'Blacksmith') : 'Market'}
          </div>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest terminal-text mb-1">{title}</h1>
        {lore && <p className="text-gray-500 text-xs italic mb-6 max-w-xl">{lore}</p>}

        {/* Wallet */}
        <div className="flex gap-6 mb-6 border border-gray-800 p-3 w-fit">
          <div className="text-xs"><span className="text-aethrix-gold">AETH</span> <span className="font-bold">{player.aethBalance}</span></div>
          <div className="text-xs"><span className="text-yellow-600">Gold</span> <span className="font-bold">{player.gold}</span></div>
          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
            className="text-[9px] text-aethrix-gold border border-aethrix-gold/30 px-2 hover:bg-aethrix-gold hover:text-black transition-all">
            Buy AETH ↗
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Item Grid */}
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, i) => (
              <motion.button key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(item)}
                className={`border p-3 text-left transition-all ${rarityColor[item.rarity]} ${rarityBg[item.rarity]} ${selected?.id === item.id ? 'ring-1 ring-aethrix-gold' : 'hover:bg-white/5'}`}>
                <div className={`text-[8px] uppercase tracking-widest mb-1 ${rarityColor[item.rarity].split(' ')[1]}`}>{item.rarity}</div>
                <div className="text-xs font-bold leading-tight mb-1">{item.name}</div>
                <div className="text-[9px] text-gray-500">{item.type}</div>
                <div className="mt-2 text-[10px] text-aethrix-gold font-bold">{item.aethCost} AETH</div>
                {item.goldCost && <div className="text-[9px] text-yellow-700">{item.goldCost}g</div>}
              </motion.button>
            ))}
          </div>

          {/* Item Detail */}
          <div>
            {selected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`border p-6 sticky top-6 ${rarityColor[selected.rarity]} ${rarityBg[selected.rarity]}`}>
                <div className={`text-[9px] uppercase tracking-widest mb-1 ${rarityColor[selected.rarity].split(' ')[1]}`}>{selected.rarity} {selected.type}</div>
                <h2 className="text-xl font-black uppercase mb-3">{selected.name}</h2>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">{selected.description}</p>

                {selected.statBonus && Object.keys(selected.statBonus).length > 0 && (
                  <div className="mb-4">
                    <div className="text-[10px] text-aethrix-gold uppercase tracking-widest mb-2">Stat Bonuses</div>
                    <div className="grid grid-cols-3 gap-1">
                      {Object.entries(selected.statBonus).map(([s, v]) => (
                        <div key={s} className="flex justify-between text-[10px] border border-gray-800 px-2 py-1">
                          <span className="text-gray-500">{s}</span>
                          <span className="text-green-400">+{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(selected.hpBonus || selected.mpBonus) && (
                  <div className="mb-4 flex gap-4">
                    {selected.hpBonus && <div className="text-xs"><span className="text-red-400">HP</span> <span className="text-green-400">+{selected.hpBonus}</span></div>}
                    {selected.mpBonus && <div className="text-xs"><span className="text-cyan-400">MP</span> <span className="text-green-400">+{selected.mpBonus}</span></div>}
                  </div>
                )}

                <div className="border border-gray-800 p-3 mb-4 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">AETH Cost</span>
                    <span className={`font-bold ${canAffordAeth(player.aethBalance, selected.aethCost) ? 'text-aethrix-gold' : 'text-red-500'}`}>
                      {selected.aethCost} AETH
                    </span>
                  </div>
                  {selected.goldCost && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Gold Cost</span>
                      <span className={`font-bold ${canAffordGold(player.gold, selected.goldCost) ? 'text-yellow-600' : 'text-red-500'}`}>
                        {selected.goldCost}g
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => onBuy(selected, 'aeth')}
                    disabled={!canAffordAeth(player.aethBalance, selected.aethCost)}
                    className="w-full border border-aethrix-gold py-2 text-[10px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    Buy with AETH ({selected.aethCost})
                  </button>
                  {selected.goldCost && !selected.blacksmithOnly && (
                    <button
                      onClick={() => onBuy(selected, 'gold')}
                      disabled={!canAffordGold(player.gold, selected.goldCost)}
                      className="w-full border border-yellow-700 py-2 text-[10px] uppercase tracking-widest hover:bg-yellow-900/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      Buy with Gold ({selected.goldCost}g)
                    </button>
                  )}
                  {selected.blacksmithOnly && (
                    <div className="text-[9px] text-purple-400 text-center border border-purple-900 py-2">
                      ★ Legendary — AETH Only
                    </div>
                  )}
                </div>

                {!canAffordAeth(player.aethBalance, selected.aethCost) && (
                  <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
                    className="block mt-3 text-center text-[9px] text-aethrix-gold border border-aethrix-gold/30 py-2 hover:bg-aethrix-gold hover:text-black transition-all">
                    Get AETH on pump.fun ↗
                  </a>
                )}
              </motion.div>
            ) : (
              <div className="border border-gray-800 p-6 text-gray-600 text-sm text-center">
                Select an item to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
