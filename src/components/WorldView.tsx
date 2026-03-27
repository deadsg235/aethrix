"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Continent, Area, Character } from '@/lib/game/types';
import { WORLD } from '@/lib/game/world';

interface Props {
  party: Character[];
  onEnterArea: (area: Area, continent: Continent) => void;
  onOpenQuestBoard: (areaId: string) => void;
  onOpenMarket: (area: Area) => void;
  onOpenBlacksmith: (area: Area) => void;
  onOpenSafeHub: (area: Area) => void;
  onOpenStory: () => void;
  onOpenSkillTree: () => void;
}

const dangerColor = ['', 'text-green-400', 'text-yellow-400', 'text-orange-400', 'text-red-400', 'text-red-600'];
const dangerLabel = ['', 'Safe', 'Low', 'Moderate', 'Dangerous', 'Lethal'];

export default function WorldView({ party, onEnterArea, onOpenQuestBoard, onOpenMarket, onOpenBlacksmith, onOpenSafeHub, onOpenStory, onOpenSkillTree }: Props) {
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(null);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const player = party[0];

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <div className="text-aethrix-gold text-[10px] tracking-widest uppercase">World Map — Tiena-Nueble Chronicles</div>
          <div className="text-xl font-black uppercase tracking-widest terminal-text">
            {selectedContinent ? selectedContinent.name : 'Select a Continent'}
          </div>
        </div>
        <div className="flex gap-6 text-xs">
          <div><span className="text-gray-500">LVL</span> <span className="text-white font-bold">{player?.level}</span></div>
          <div><span className="text-red-400">HP</span> <span className="text-white font-bold">{Math.ceil(player?.hp.current)}/{player?.hp.max}</span></div>
          <div><span className="text-aethrix-gold">AETH</span> <span className="text-white font-bold">{player?.aethBalance}</span></div>
          <div><span className="text-yellow-600">Gold</span> <span className="text-white font-bold">{player?.gold}</span></div>
          <button onClick={onOpenSkillTree} className="border border-purple-700 px-3 py-1 text-[10px] uppercase hover:border-purple-400 hover:text-purple-400 transition-all">
            Skill Tree
          </button>
          <button onClick={onOpenStory} className="border border-gray-700 px-3 py-1 text-[10px] uppercase hover:border-aethrix-gold hover:text-aethrix-gold transition-all">
            Story Log
          </button>
        </div>
      </div>

      {!selectedContinent ? (
        /* CONTINENT SELECTION */
        <div className="grid md:grid-cols-3 gap-6">
          {WORLD.map((continent, i) => (
            <motion.button key={continent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedContinent(continent)}
              className="border border-gray-700 p-6 text-left hover:border-aethrix-gold hover:bg-white/5 transition-all group">
              <div className="text-aethrix-gold text-[10px] uppercase tracking-widest mb-1">Continent {i + 1}</div>
              <div className="text-xl font-black uppercase mb-3 group-hover:text-aethrix-gold transition-colors">{continent.name}</div>
              <p className="text-gray-400 text-xs leading-relaxed mb-4">{continent.description}</p>
              <div className="text-[10px] text-gray-600 border-t border-gray-800 pt-3">
                {continent.areas.length} Areas · {continent.areas.filter(a => a.blacksmith?.isLegendary).length} Legendary Smiths
              </div>
            </motion.button>
          ))}
        </div>
      ) : !selectedArea ? (
        /* AREA SELECTION */
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setSelectedContinent(null)} className="text-gray-500 hover:text-white text-[10px] uppercase">← Continents</button>
            <div className="text-gray-400 text-xs">{selectedContinent.lore}</div>
          </div>
          <div className="grid md:grid-cols-5 gap-4">
            {selectedContinent.areas.map((area, i) => (
              <motion.button key={area.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedArea(area)}
                className="border border-gray-700 p-4 text-left hover:border-aethrix-gold hover:bg-white/5 transition-all group">
                <div className={`text-[9px] uppercase tracking-widest mb-1 ${dangerColor[area.dangerLevel]}`}>
                  ⚠ {dangerLabel[area.dangerLevel]}
                </div>
                <div className="text-sm font-bold uppercase mb-2 group-hover:text-aethrix-gold transition-colors leading-tight">{area.name}</div>
                <p className="text-[10px] text-gray-500 leading-relaxed mb-3">{area.description}</p>
                <div className="flex flex-wrap gap-1">
                  {area.safeHub && <span className="text-[8px] border border-green-800 text-green-600 px-1">SAFE HUB</span>}
                  {area.market && <span className="text-[8px] border border-yellow-800 text-yellow-600 px-1">MARKET</span>}
                  {area.blacksmith && <span className={`text-[8px] border px-1 ${area.blacksmith.isLegendary ? 'border-purple-500 text-purple-400' : 'border-gray-600 text-gray-400'}`}>
                    {area.blacksmith.isLegendary ? '★ LEGENDARY SMITH' : 'SMITH'}
                  </span>}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        /* AREA DETAIL */
        <div>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setSelectedArea(null)} className="text-gray-500 hover:text-white text-[10px] uppercase">← {selectedContinent.name}</button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className={`text-[10px] uppercase tracking-widest mb-1 ${dangerColor[selectedArea.dangerLevel]}`}>
                Danger: {dangerLabel[selectedArea.dangerLevel]}
              </div>
              <h2 className="text-3xl font-black uppercase terminal-text mb-4">{selectedArea.name}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{selectedArea.description}</p>
              <p className="text-gray-600 text-xs leading-relaxed italic border-l-2 border-gray-800 pl-4">{selectedArea.lore}</p>

              <div className="mt-6 space-y-2">
                <button onClick={() => onEnterArea(selectedArea, selectedContinent)}
                  className="w-full border border-aethrix-crimson py-3 text-sm uppercase tracking-widest hover:bg-aethrix-crimson hover:text-white transition-all">
                  ⚔ Enter Area — Combat
                </button>
                {selectedArea.questIds.length > 0 && (
                  <button onClick={() => onOpenQuestBoard(selectedArea.id)}
                    className="w-full border border-aethrix-gold py-3 text-sm uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
                    📋 Quest Board
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {selectedArea.safeHub && (
                <div className="border border-green-900 p-4">
                  <div className="text-green-400 text-[10px] uppercase tracking-widest mb-1">Safe Hub</div>
                  <div className="font-bold text-sm mb-1">{selectedArea.safeHub.name}</div>
                  <p className="text-gray-500 text-xs mb-3">{selectedArea.safeHub.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {selectedArea.safeHub.services.map(s => (
                      <span key={s} className="text-[9px] border border-green-900 text-green-600 px-1 uppercase">{s}</span>
                    ))}
                  </div>
                  <button onClick={() => onOpenSafeHub(selectedArea)}
                    className="w-full border border-green-800 py-2 text-[10px] uppercase hover:bg-green-900/30 transition-all">
                    Enter Safe Hub
                  </button>
                </div>
              )}

              {selectedArea.market && (
                <div className="border border-yellow-900 p-4">
                  <div className="text-yellow-600 text-[10px] uppercase tracking-widest mb-1">Market</div>
                  <div className="font-bold text-sm mb-1">{selectedArea.market.name}</div>
                  <div className="text-gray-500 text-xs mb-3">{selectedArea.market.itemIds.length} items available</div>
                  <button onClick={() => onOpenMarket(selectedArea)}
                    className="w-full border border-yellow-800 py-2 text-[10px] uppercase hover:bg-yellow-900/30 transition-all">
                    Browse Market
                  </button>
                </div>
              )}

              {selectedArea.blacksmith && (
                <div className={`border p-4 ${selectedArea.blacksmith.isLegendary ? 'border-purple-700' : 'border-gray-700'}`}>
                  <div className={`text-[10px] uppercase tracking-widest mb-1 ${selectedArea.blacksmith.isLegendary ? 'text-purple-400' : 'text-gray-400'}`}>
                    {selectedArea.blacksmith.isLegendary ? '★ Legendary Blacksmith' : 'Blacksmith'}
                  </div>
                  <div className="font-bold text-sm mb-1">{selectedArea.blacksmith.name}</div>
                  <p className="text-gray-500 text-xs mb-3 italic">{selectedArea.blacksmith.lore}</p>
                  <button onClick={() => onOpenBlacksmith(selectedArea)}
                    className={`w-full border py-2 text-[10px] uppercase transition-all ${selectedArea.blacksmith.isLegendary ? 'border-purple-700 hover:bg-purple-900/30' : 'border-gray-700 hover:bg-gray-900/30'}`}>
                    Visit Forge
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
