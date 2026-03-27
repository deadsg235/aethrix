"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Character } from '@/lib/game/types';
import { processAttack } from '@/lib/game/combat';
import { motion } from 'framer-motion';

interface Props {
  party: Character[];
  enemies: Character[];
  onCombatEnd: (victory: boolean) => void;
}

const HealthBar = ({ current, max, label, color = 'bg-red-600' }: { current: number; max: number; label: string; color?: string }) => {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between text-[10px] uppercase mb-1">
        <span>{label}</span>
        <span>{Math.ceil(current)} / {max}</span>
      </div>
      <div className="h-2 bg-gray-800 border border-gray-700 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default function CombatView({ party, enemies: initialEnemies, onCombatEnd }: Props) {
  const [enemies, setEnemies] = useState<Character[]>(initialEnemies);
  const [partyState, setPartyState] = useState<Character[]>(party);
  const [log, setLog] = useState<{ id: number; text: string }[]>([{ id: 0, text: 'BATTLE COMMENCED...' }]);
  const [turn, setTurn] = useState<'PLAYER' | 'ENEMY'>('PLAYER');
  const [processing, setProcessing] = useState(false);
  const logIdRef = useRef(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addLog = useCallback((text: string) => {
    setLog(prev => [...prev.slice(-9), { id: logIdRef.current++, text }]);
  }, []);

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  useEffect(() => () => clearTimer(), []);

  const executeAttack = useCallback((attacker: Character, target: Character, isPlayer: boolean) => {
    setProcessing(true);
    const result = processAttack(attacker, target);
    addLog(result.log);

    if (isPlayer) {
      setEnemies(prev => {
        const next = prev.map(e => e.name === target.name
          ? { ...e, hp: { ...e.hp, current: Math.max(0, e.hp.current - result.damage) } } : e);
        const allDead = next.every(e => e.hp.current <= 0);
        if (allDead) {
          addLog('VICTORY! THE ABOMINATIONS ARE PURGED.');
          timerRef.current = setTimeout(() => onCombatEnd(true), 1200);
        } else {
          timerRef.current = setTimeout(() => { setProcessing(false); setTurn('ENEMY'); }, 700);
        }
        return next;
      });
    } else {
      setPartyState(prev => {
        const next = prev.map(p => p.name === target.name
          ? { ...p, hp: { ...p.hp, current: Math.max(0, p.hp.current - result.damage) } } : p);
        const allDead = next.every(p => p.hp.current <= 0);
        if (allDead) {
          addLog('DEFEAT... YOUR MEMORIES FADE TO BLACK.');
          timerRef.current = setTimeout(() => onCombatEnd(false), 1200);
        } else {
          timerRef.current = setTimeout(() => { setProcessing(false); setTurn('PLAYER'); }, 700);
        }
        return next;
      });
    }
  }, [addLog, onCombatEnd]);

  // Enemy AI turn
  useEffect(() => {
    if (turn !== 'ENEMY' || processing) return;
    const alive = partyState.filter(p => p.hp.current > 0);
    const attacker = enemies.find(e => e.hp.current > 0);
    if (attacker && alive.length > 0) {
      const target = alive[Math.floor(Math.random() * alive.length)];
      timerRef.current = setTimeout(() => executeAttack(attacker, target, false), 400);
    }
  }, [turn, processing]);

  return (
    <div className="flex flex-col w-full max-w-4xl bg-black border border-aethrix-gray p-6 font-mono">
      <div className="grid grid-cols-2 gap-12 mb-8">

        {/* Party */}
        <div className="space-y-6">
          <h3 className="text-aethrix-gold border-b border-aethrix-gold pb-1 mb-4 uppercase tracking-widest text-sm">Imperial Party</h3>
          {partyState.map((member, i) => (
            <div key={member.id ?? i} className={`p-2 ${member.hp.current <= 0 ? 'opacity-30' : ''}`}>
              <div className="flex justify-between items-end mb-2">
                <span className="text-white text-sm font-bold">{member.name}</span>
                <span className="text-aethrix-cyan text-[10px]">{member.characterClass.name} [LVL {member.level}]</span>
              </div>
              <HealthBar current={member.hp.current} max={member.hp.max} label="HP" />
              <HealthBar current={member.mp.current} max={member.mp.max} label="MP" color="bg-cyan-600" />
              {turn === 'PLAYER' && member.hp.current > 0 && !processing && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => executeAttack(member, enemies.find(e => e.hp.current > 0)!, true)}
                    className="text-[10px] border border-aethrix-gold px-2 py-1 hover:bg-aethrix-gold hover:text-black transition-colors">
                    ATTACK
                  </button>
                  <button className="text-[10px] border border-aethrix-cyan px-2 py-1 hover:bg-aethrix-cyan hover:text-black transition-colors">
                    AETHER
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Enemies */}
        <div className="space-y-6">
          <h3 className="text-aethrix-crimson border-b border-aethrix-crimson pb-1 mb-4 uppercase tracking-widest text-sm text-right">Abominations</h3>
          {enemies.map((enemy, i) => (
            <div key={enemy.id ?? i} className={`p-2 text-right ${enemy.hp.current <= 0 ? 'opacity-30' : ''}`}>
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
      <div className="border border-gray-800 bg-gray-950 p-4 h-48 overflow-hidden flex flex-col justify-end">
        {log.map((entry, i) => (
          <motion.div key={entry.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[11px] mb-1 tracking-tight">
            <span className="text-aethrix-cyan mr-2 opacity-50">[{String(i).padStart(2, '0')}]</span>
            {entry.text}
          </motion.div>
        ))}
        {processing && (
          <div className="text-aethrix-gold text-[10px] mt-1 uppercase opacity-60">...</div>
        )}
      </div>
    </div>
  );
}
