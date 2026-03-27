"use client";

import React, { useState, useEffect } from 'react';
import { Character } from '@/lib/game/types';
import { processAttack } from '@/lib/game/combat';
import { motion, AnimatePresence } from 'framer-motion';

interface CombatViewProps {
  party: Character[];
  enemies: Character[];
  onCombatEnd: (victory: boolean) => void;
}

const HealthBar: React.FC<{ current: number; max: number; label: string; color?: string }> = ({
  current,
  max,
  label,
  color = "bg-red-600"
}) => {
  const percent = Math.max(0, (current / max) * 100);
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between text-[10px] uppercase mb-1">
        <span>{label}</span>
        <span>{Math.ceil(current)} / {max}</span>
      </div>
      <div className="h-2 bg-gray-800 border border-gray-700 overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${percent}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

export default function CombatView({ party, enemies: initialEnemies, onCombatEnd }: CombatViewProps) {
  const [currentEnemies, setCurrentEnemies] = useState<Character[]>(initialEnemies);
  const [currentParty, setCurrentParty] = useState<Character[]>(party);
  const [combatLog, setCombatLog] = useState<string[]>(["BATTLE COMMENCED..."]);
  const [turn, setTurn] = useState<"PLAYER" | "ENEMY">("PLAYER");
  const [isProcessing, setIsProcessing] = useState(false);

  const addLog = (msg: string) => {
    setCombatLog(prev => [...prev.slice(-9), msg]);
  };

  const executeAttack = (attacker: Character, target: Character) => {
    setIsProcessing(true);
    const result = processAttack(attacker, target);
    addLog(result.log);

    if (turn === "PLAYER") {
      setCurrentEnemies(prev => prev.map(e => 
        e.name === target.name ? { ...e, hp: { ...e.hp, current: e.hp.current - result.damage } } : e
      ));
    } else {
      setCurrentParty(prev => prev.map(p => 
        p.name === target.name ? { ...p, hp: { ...p.hp, current: p.hp.current - result.damage } } : p
      ));
    }

    setTimeout(() => {
      setIsProcessing(false);
      checkBattleStatus();
    }, 800);
  };

  const checkBattleStatus = () => {
    const aliveEnemies = currentEnemies.filter(e => e.hp.current > 0);
    const aliveParty = currentParty.filter(p => p.hp.current > 0);

    if (aliveEnemies.length === 0) {
      addLog("VICTORY! THE ABOMINATIONS ARE PURGED.");
      setTimeout(() => onCombatEnd(true), 2000);
    } else if (aliveParty.length === 0) {
      addLog("DEFEAT... YOUR MEMORIES FADE TO BLACK.");
      setTimeout(() => onCombatEnd(false), 2000);
    } else {
      setTurn(turn === "PLAYER" ? "ENEMY" : "PLAYER");
    }
  };

  // Simple Enemy AI
  useEffect(() => {
    if (turn === "ENEMY" && !isProcessing) {
      const aliveParty = currentParty.filter(p => p.hp.current > 0);
      const attacker = currentEnemies.find(e => e.hp.current > 0);
      if (attacker && aliveParty.length > 0) {
        const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
        executeAttack(attacker, target);
      }
    }
  }, [turn, isProcessing]);

  return (
    <div className="flex flex-col w-full max-w-4xl bg-black border border-aethrix-gray p-6 font-mono">
      <div className="grid grid-cols-2 gap-12 mb-8">
        {/* Party Side */}
        <div className="space-y-6">
          <h3 className="text-aethrix-gold border-b border-aethrix-gold pb-1 mb-4 uppercase tracking-widest text-sm">Imperial Party</h3>
          {currentParty.map((member, i) => (
            <div key={i} className={`p-2 ${member.hp.current <= 0 ? 'opacity-30' : ''}`}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-white text-sm font-bold">{member.name}</span>
                <span className="text-aethrix-cyan text-[10px]">{member.characterClass.name} [LVL {member.level}]</span>
              </div>
              <HealthBar current={member.hp.current} max={member.hp.max} label="HP" />
              <HealthBar current={member.mp.current} max={member.mp.max} label="MP" color="bg-cyan-600" />
              {turn === "PLAYER" && member.hp.current > 0 && !isProcessing && (
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => executeAttack(member, currentEnemies[0])}
                    className="text-[10px] border border-aethrix-gold px-2 py-1 hover:bg-aethrix-gold hover:text-black"
                  >
                    ATTACK
                  </button>
                  <button className="text-[10px] border border-aethrix-cyan px-2 py-1 hover:bg-aethrix-cyan hover:text-black">
                    AETHER
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enemy Side */}
        <div className="space-y-6">
          <h3 className="text-aethrix-crimson border-b border-aethrix-crimson pb-1 mb-4 uppercase tracking-widest text-sm text-right">Abominations</h3>
          {currentEnemies.map((enemy, i) => (
            <div key={i} className={`p-2 text-right ${enemy.hp.current <= 0 ? 'opacity-30' : ''}`}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-aethrix-crimson text-[10px]">{enemy.race.name}</span>
                <span className="text-white text-sm font-bold">{enemy.name}</span>
              </div>
              <HealthBar current={enemy.hp.current} max={enemy.hp.max} label="HP" color="bg-red-900" />
            </div>
          ))}
        </div>
      </div>

      {/* Combat Log */}
      <div className="mt-auto border border-gray-800 bg-gray-950 p-4 h-48 overflow-y-hidden flex flex-col justify-end">
        <AnimatePresence>
          {combatLog.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] mb-1 tracking-tight"
            >
              <span className="text-aethrix-cyan mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
        {isProcessing && (
          <motion.div
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="text-aethrix-gold text-[10px] mt-2 uppercase"
          >
            Processing...
          </motion.div>
        )}
      </div>
    </div>
  );
}
