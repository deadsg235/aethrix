"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Area, Character, Item, ItemRarity } from '@/lib/game/types';
import { ITEMS } from '@/lib/game/items';
import { AETH_TOKEN, canAffordAeth, canAffordGold } from '@/lib/game/token';

interface Props {
  area: Area;
  player: Character;
  walletAethBalance: number | null;
  isBlacksmith?: boolean;
  onBuy: (item: Item, currency: 'aeth' | 'gold' | 'wallet_aeth') => void;
  onBack: () => void;
}

const rarityColor: Record<ItemRarity, string> = {
  Common:    'border-gray-600 text-gray-400',
  Uncommon:  'border-green-700 text-green-400',
  Rare:      'border-blue-600 text-blue-400',
  Legendary: 'border-purple-500 text-purple-400',
};
const rarityBg: Record<ItemRarity, string> = {
  Common: '', Uncommon: 'bg-green-950/20', Rare: 'bg-blue-950/20', Legendary: 'bg-purple-950/30',
};

export default function MarketView({ area, player, walletAethBalance, isBlacksmith = false, onBuy, onBack }: Props) {
  const [selected, setSelected] = useState<Item | null>(null);

  const source  = isBlacksmith ? area.blacksmith : area.market;
  const itemIds = source?.itemIds ?? [];
  const items   = itemIds.map(id => ITEMS[id]).filter(Boolean);
  const title   = isBlacksmith ? area.blacksmith?.name : area.market?.name;
  const lore    = isBlacksmith ? area.blacksmith?.lore : undefined;

  const walletCanAfford = (item: Item) =>
    walletAethBalance !== null &&
    item.walletAethCost !== undefined &&
    item.walletAethCost > 0 &&
    walletAethBalance >= item.walletAethCost;

  const formatWalletCost = (cost: number) =>
    cost.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-2">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
          <div className={`text-[10px] uppercase tracking-widest ${isBlacksmith && area.blacksmith?.isLegendary ? 'text-purple-400' : 'text-aethrix-gold'}`}>
            {isBlacksmith ? (area.blacksmith?.isLegendary ? '★ Legendary Forge' : 'Blacksmith') : 'Market'}
          </div>
        </div>
        <h1 className="text-2xl font-black uppercase tracking-widest terminal-text mb-1">{title}</h1>
        {lore && <p className="text-gray-500 text-xs italic mb-4 max-w-xl">{lore}</p>}

        {/* Balance bar */}
        <div className="flex flex-wrap gap-4 mb-6 border border-gray-800 p-3">
          <div className="text-xs">
            <span className="text-gray-500 uppercase text-[9px]">In-Game AETH</span>
            <span className="text-aethrix-gold font-bold ml-2">{player.aethBalance}</span>
          </div>
          <div className="w-px bg-gray-800" />
          <div className="text-xs">
            <span className="text-gray-500 uppercase text-[9px]">Wallet AETH</span>
            <span className={`font-bold ml-2 ${walletAethBalance !== null ? 'text-aethrix-gold' : 'text-gray-600'}`}>
              {walletAethBalance !== null ? formatWalletCost(walletAethBalance) : 'Not connected'}
            </span>
          </div>
          <div className="w-px bg-gray-800" />
          <div className="text-xs">
            <span className="text-gray-500 uppercase text-[9px]">Gold</span>
            <span className="text-yellow-600 font-bold ml-2">{player.gold}</span>
          </div>
          <div className="w-px bg-gray-800" />
          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
            className="text-[9px] text-aethrix-gold border border-aethrix-gold/30 px-2 py-0.5 hover:bg-aethrix-gold hover:text-black transition-all">
            Buy AETH ↗
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Item grid */}
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, i) => (
              <motion.button key={item.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(item)}
                className={`border p-3 text-left transition-all ${rarityColor[item.rarity]} ${rarityBg[item.rarity]} ${selected?.id === item.id ? 'ring-1 ring-aethrix-gold' : 'hover:bg-white/5'}`}>
                <div className={`text-[8px] uppercase tracking-widest mb-1 ${rarityColor[item.rarity].split(' ')[1]}`}>{item.rarity}</div>
                <div className="text-xs font-bold leading-tight mb-1">{item.name}</div>
                <div className="text-[9px] text-gray-500 mb-2">{item.type}</div>
                {/* Wallet price — prominent */}
                {item.walletAethCost && item.walletAethCost > 0 && (
                  <div className="text-[10px] text-aethrix-gold font-bold">
                    {formatWalletCost(item.walletAethCost)} AETH
                  </div>
                )}
                {/* In-game price */}
                <div className="text-[9px] text-aethrix-gold/50">{item.aethCost} in-game</div>
                {item.goldCost && <div className="text-[9px] text-yellow-800">{item.goldCost}g</div>}
              </motion.button>
            ))}
          </div>

          {/* Detail panel */}
          <div>
            {selected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`border p-6 sticky top-16 ${rarityColor[selected.rarity]} ${rarityBg[selected.rarity]}`}>

                <div className={`text-[9px] uppercase tracking-widest mb-1 ${rarityColor[selected.rarity].split(' ')[1]}`}>
                  {selected.rarity} {selected.type}
                </div>
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

                {/* Pricing table */}
                <div className="border border-gray-800 p-3 mb-4 space-y-2">
                  {/* Real wallet AETH cost */}
                  {selected.walletAethCost && selected.walletAethCost > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[9px] text-gray-500 uppercase">Wallet AETH</div>
                        <div className="text-[8px] text-gray-700 font-mono">{AETH_TOKEN.contract.slice(0,10)}...</div>
                      </div>
                      <span className={`font-bold text-sm ${walletCanAfford(selected) ? 'text-aethrix-gold' : 'text-red-500'}`}>
                        {formatWalletCost(selected.walletAethCost)} AETH
                      </span>
                    </div>
                  )}
                  {/* In-game AETH cost */}
                  <div className="flex justify-between text-xs border-t border-gray-900 pt-2">
                    <span className="text-gray-500">In-Game AETH</span>
                    <span className={`font-bold ${canAffordAeth(player.aethBalance, selected.aethCost) ? 'text-aethrix-gold/70' : 'text-red-500'}`}>
                      {selected.aethCost}
                    </span>
                  </div>
                  {/* Gold cost */}
                  {selected.goldCost && (
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Gold</span>
                      <span className={`font-bold ${canAffordGold(player.gold, selected.goldCost) ? 'text-yellow-600' : 'text-red-500'}`}>
                        {selected.goldCost}g
                      </span>
                    </div>
                  )}
                </div>

                {/* Buy buttons */}
                <div className="space-y-2">

                  {/* Wallet AETH — real token */}
                  {selected.walletAethCost && selected.walletAethCost > 0 && (
                    <button onClick={() => onBuy(selected, 'wallet_aeth')}
                      disabled={!walletCanAfford(selected)}
                      className="w-full border border-aethrix-gold py-2.5 text-[10px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      {walletAethBalance === null
                        ? '🔗 Connect Phantom to use wallet AETH'
                        : !walletCanAfford(selected)
                          ? `Need ${formatWalletCost(selected.walletAethCost)} AETH (have ${formatWalletCost(walletAethBalance)})`
                          : `Buy with Wallet AETH — ${formatWalletCost(selected.walletAethCost)} AETH`
                      }
                    </button>
                  )}

                  {/* In-game AETH */}
                  <button onClick={() => onBuy(selected, 'aeth')}
                    disabled={!canAffordAeth(player.aethBalance, selected.aethCost)}
                    className="w-full border border-aethrix-gold/40 py-2 text-[10px] uppercase tracking-widest hover:border-aethrix-gold hover:text-aethrix-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    In-Game AETH — {selected.aethCost} (have {player.aethBalance})
                  </button>

                  {/* Gold */}
                  {selected.goldCost && !selected.blacksmithOnly && (
                    <button onClick={() => onBuy(selected, 'gold')}
                      disabled={!canAffordGold(player.gold, selected.goldCost)}
                      className="w-full border border-yellow-800 py-2 text-[10px] uppercase tracking-widest hover:bg-yellow-900/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                      Gold — {selected.goldCost}g (have {player.gold}g)
                    </button>
                  )}

                  {selected.blacksmithOnly && (
                    <div className="text-[9px] text-purple-400 text-center border border-purple-900 py-2">
                      ★ Legendary — AETH Only
                    </div>
                  )}
                </div>

                {/* Get AETH CTA */}
                {!walletCanAfford(selected) && !canAffordAeth(player.aethBalance, selected.aethCost) && (
                  <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between mt-3 border border-aethrix-gold/30 px-4 py-2 text-[9px] text-aethrix-gold hover:bg-aethrix-gold hover:text-black transition-all group">
                    <span className="uppercase tracking-widest">Get AETH on pump.fun</span>
                    <span className="font-mono group-hover:text-black">{AETH_TOKEN.contract.slice(0, 12)}...</span>
                  </a>
                )}
              </motion.div>
            ) : (
              <div className="border border-gray-800 p-6 text-gray-600 text-sm text-center sticky top-16">
                Select an item to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
