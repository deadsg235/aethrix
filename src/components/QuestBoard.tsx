"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Quest, QuestType } from '@/lib/game/types';
import { ALL_QUESTS } from '@/lib/game/quests';

interface Props {
  areaId: string;
  activeQuests: Quest[];
  playerLevel: number;
  onAcceptQuest: (quest: Quest) => void;
  onBack: () => void;
}

const typeLabel: Record<QuestType, string> = { main: 'Main Story', side: 'Side Quest', notice: 'Notice Board' };
const typeColor: Record<QuestType, string> = {
  main: 'border-aethrix-gold text-aethrix-gold',
  side: 'border-aethrix-cyan text-aethrix-cyan',
  notice: 'border-gray-500 text-gray-400',
};

export default function QuestBoard({ areaId, activeQuests, playerLevel, onAcceptQuest, onBack }: Props) {
  const [filter, setFilter] = useState<QuestType | 'all'>('all');
  const [selected, setSelected] = useState<Quest | null>(null);

  const areaQuests = ALL_QUESTS.filter(q => q.areaId === areaId);
  const filtered = areaQuests.filter(q => filter === 'all' || q.type === filter);
  const activeIds = new Set(activeQuests.map(q => q.id));

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
          <div>
            <div className="text-aethrix-gold text-[10px] tracking-widest uppercase">Notice Board & Quest Registry</div>
            <h1 className="text-2xl font-black uppercase tracking-widest terminal-text">Available Contracts</h1>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'main', 'side', 'notice'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest border transition-all ${filter === f ? 'border-aethrix-gold bg-aethrix-gold text-black' : 'border-gray-700 hover:border-gray-500'}`}>
              {f === 'all' ? 'All' : typeLabel[f]}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Quest List */}
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="text-gray-600 text-sm p-4 border border-gray-800">No contracts available in this area.</div>
            )}
            {filtered.map((quest, i) => {
              const isActive = activeIds.has(quest.id);
              const tooLow = (quest.requiredLevel || 1) > playerLevel;
              return (
                <motion.button key={quest.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(quest)}
                  className={`w-full text-left border p-4 transition-all ${selected?.id === quest.id ? 'border-aethrix-gold bg-white/5' : 'border-gray-800 hover:border-gray-600'} ${tooLow ? 'opacity-40' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] border px-1 uppercase ${typeColor[quest.type]}`}>{typeLabel[quest.type]}</span>
                    {isActive && <span className="text-[9px] text-green-400 border border-green-800 px-1">ACTIVE</span>}
                    {tooLow && <span className="text-[9px] text-red-500">LVL {quest.requiredLevel} REQ</span>}
                  </div>
                  <div className="font-bold text-sm mt-1">{quest.title}</div>
                  <div className="flex gap-3 mt-2 text-[10px]">
                    <span className="text-yellow-600">{quest.rewardGold}g</span>
                    <span className="text-aethrix-gold">{quest.rewardAeth} AETH</span>
                    <span className="text-gray-500">{quest.rewardExp} EXP</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Quest Detail */}
          <div>
            {selected ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-gray-700 p-6 sticky top-6">
                <div className={`text-[9px] border px-1 uppercase inline-block mb-3 ${typeColor[selected.type]}`}>{typeLabel[selected.type]}</div>
                <h2 className="text-xl font-black uppercase mb-4">{selected.title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{selected.description}</p>

                <div className="mb-6">
                  <div className="text-[10px] text-aethrix-gold uppercase tracking-widest mb-2">Objectives</div>
                  {selected.objectives.map(obj => (
                    <div key={obj.id} className="flex items-start gap-2 text-xs text-gray-300 py-1 border-b border-gray-900">
                      <span className="text-gray-600 mt-0.5">○</span>
                      {obj.description}
                    </div>
                  ))}
                </div>

                <div className="border border-gray-800 p-4 mb-6 space-y-2">
                  <div className="text-[10px] text-aethrix-gold uppercase tracking-widest mb-2">Rewards</div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Gold</span><span className="text-yellow-600 font-bold">{selected.rewardGold}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">AETH Token</span><span className="text-aethrix-gold font-bold">{selected.rewardAeth}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Experience</span><span className="text-cyan-400 font-bold">{selected.rewardExp}</span></div>
                  {selected.rewardItems && selected.rewardItems.length > 0 && (
                    <div className="flex justify-between text-xs"><span className="text-gray-500">Items</span><span className="text-purple-400 font-bold">{selected.rewardItems.length} item(s)</span></div>
                  )}
                </div>

                {activeIds.has(selected.id) ? (
                  <div className="w-full border border-green-800 py-3 text-center text-[10px] uppercase text-green-400">Quest Active</div>
                ) : (selected.requiredLevel || 1) > playerLevel ? (
                  <div className="w-full border border-red-900 py-3 text-center text-[10px] uppercase text-red-500">
                    Requires Level {selected.requiredLevel}
                  </div>
                ) : (
                  <button onClick={() => onAcceptQuest(selected)}
                    className="w-full border border-aethrix-gold py-3 text-[10px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
                    Accept Contract
                  </button>
                )}
              </motion.div>
            ) : (
              <div className="border border-gray-800 p-6 text-gray-600 text-sm text-center">
                Select a contract to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
