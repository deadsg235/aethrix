"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Race, SubRace, Class, Character } from '@/lib/game/types';
import { RACES, SUBRACES, CLASSES } from '@/lib/game/data';
import { createEss } from '@/lib/game/character';
import { STARTING_AETH, STARTING_GOLD } from '@/lib/game/token';

interface Props {
  onComplete: (character: Character) => void;
}

type Step = 'race' | 'subrace' | 'class' | 'name' | 'confirm';

export default function CharacterCreation({ onComplete }: Props) {
  const [step, setStep] = useState<Step>('race');
  const [name, setName] = useState('Ess');
  const [selectedRace, setSelectedRace] = useState<Race | null>(null);
  const [selectedSubRace, setSelectedSubRace] = useState<SubRace | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  const rarityColor: Record<string, string> = {
    'Beast-race': 'border-orange-600', Terran: 'border-gray-400',
    'Dragon-kin': 'border-purple-500', 'Obsidian-kin': 'border-stone-500',
    Aetherials: 'border-cyan-400', 'Stone-Kin': 'border-yellow-700',
    'Shadow-Step': 'border-indigo-500', 'Void-Touched': 'border-red-700',
  };

  const classColor: Record<string, string> = {
    'Empire Vanguard': 'border-yellow-500', 'Aether Weaver': 'border-cyan-400',
    'Soul Reaper': 'border-purple-600', 'Void Stalker': 'border-gray-500',
    'Imperial Inquisitor': 'border-red-500', 'Rift Warden': 'border-blue-500',
    'Storm Caller': 'border-yellow-300', 'Blood Knight': 'border-red-800',
  };

  const preview = selectedRace && selectedSubRace && selectedClass
    ? createEss(selectedRace, selectedSubRace, selectedClass)
    : null;

  const handleFinish = () => {
    if (!selectedRace || !selectedSubRace || !selectedClass) return;
    const char = createEss(selectedRace, selectedSubRace, selectedClass);
    char.name = name || 'Ess';
    char.gold = STARTING_GOLD;
    char.aethBalance = STARTING_AETH;
    onComplete(char);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-aethrix-gold text-[10px] tracking-[0.5em] uppercase mb-2">Amnesia Protocol — Identity Reconstruction</p>
          <h1 className="text-4xl font-black uppercase tracking-widest terminal-text">Who Are You?</h1>
          <div className="flex justify-center gap-2 mt-6">
            {(['race','subrace','class','name','confirm'] as Step[]).map((s, i) => (
              <div key={s} className={`w-8 h-1 ${step === s ? 'bg-aethrix-gold' : i < (['race','subrace','class','name','confirm'] as Step[]).indexOf(step) ? 'bg-aethrix-cyan' : 'bg-gray-800'}`} />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP: RACE */}
          {step === 'race' && (
            <motion.div key="race" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 className="text-xl uppercase tracking-widest mb-6 text-aethrix-gold">Choose Your Race</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {RACES.map(race => (
                  <button key={race.name} onClick={() => { setSelectedRace(race); setStep('subrace'); }}
                    className={`border p-4 text-left hover:bg-white/5 transition-all ${rarityColor[race.name] || 'border-gray-700'}`}>
                    <div className="font-bold text-sm uppercase mb-1">{race.name}</div>
                    <div className="text-[10px] text-gray-400 leading-relaxed">{race.description}</div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Object.entries(race.statModifiers).map(([s, v]) => (
                        <span key={s} className={`text-[9px] px-1 ${(v ?? 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {s} {(v ?? 0) > 0 ? '+' : ''}{v}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: SUBRACE */}
          {step === 'subrace' && (
            <motion.div key="subrace" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setStep('race')} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
                <h2 className="text-xl uppercase tracking-widest text-aethrix-gold">Choose Your Lineage</h2>
              </div>
              <p className="text-gray-500 text-xs mb-6">Race: <span className="text-white">{selectedRace?.name}</span></p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SUBRACES.map(sub => (
                  <button key={sub.name} onClick={() => { setSelectedSubRace(sub); setStep('class'); }}
                    className="border border-gray-700 p-4 text-left hover:border-aethrix-cyan hover:bg-white/5 transition-all">
                    <div className="font-bold text-sm uppercase mb-1 text-aethrix-cyan">{sub.name}</div>
                    <div className="text-[10px] text-gray-400 leading-relaxed">{sub.description}</div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {Object.entries(sub.statModifiers).map(([s, v]) => (
                        <span key={s} className={`text-[9px] px-1 ${(v ?? 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {s} {(v ?? 0) > 0 ? '+' : ''}{v}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: CLASS */}
          {step === 'class' && (
            <motion.div key="class" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setStep('subrace')} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
                <h2 className="text-xl uppercase tracking-widest text-aethrix-gold">Choose Your Class</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CLASSES.map(cls => (
                  <button key={cls.name} onClick={() => { setSelectedClass(cls); setStep('name'); }}
                    className={`border p-4 text-left hover:bg-white/5 transition-all ${classColor[cls.name] || 'border-gray-700'}`}>
                    <div className="font-bold text-sm uppercase mb-1">{cls.name}</div>
                    <div className="text-[10px] text-gray-400 leading-relaxed mb-2">{cls.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {cls.abilities.map(a => (
                        <span key={a} className="text-[9px] text-aethrix-gold border border-aethrix-gold/30 px-1">{a}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP: NAME */}
          {step === 'name' && (
            <motion.div key="name" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="max-w-md mx-auto text-center">
              <div className="flex items-center gap-4 mb-6 justify-center">
                <button onClick={() => setStep('class')} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
                <h2 className="text-xl uppercase tracking-widest text-aethrix-gold">Your Name</h2>
              </div>
              <p className="text-gray-400 text-sm mb-8">You remember nothing. But a name surfaces from the void. You can keep it — or choose your own.</p>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)} maxLength={20}
                className="w-full bg-black border border-aethrix-gold text-white text-center text-2xl font-bold p-4 tracking-widest uppercase focus:outline-none focus:border-aethrix-cyan"
                placeholder="ESS"
              />
              <button onClick={() => setStep('confirm')}
                className="mt-8 w-full border border-aethrix-gold py-3 text-sm uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
                This Is Who I Am →
              </button>
            </motion.div>
          )}

          {/* STEP: CONFIRM */}
          {step === 'confirm' && preview && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setStep('name')} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
                <h2 className="text-xl uppercase tracking-widest text-aethrix-gold">Identity Confirmed</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-aethrix-gold p-6 space-y-3">
                  <div className="text-2xl font-black uppercase terminal-text">{name || 'Ess'}</div>
                  <div className="text-aethrix-cyan text-xs uppercase">{selectedRace?.name} / {selectedSubRace?.name}</div>
                  <div className="text-gray-400 text-xs uppercase">{selectedClass?.name}</div>
                  <div className="border-t border-gray-800 pt-3 grid grid-cols-2 gap-1">
                    {Object.entries(preview.currentStats).map(([s, v]) => (
                      <div key={s} className="flex justify-between text-[10px]">
                        <span className="text-gray-500">{s}</span>
                        <span className="text-white font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-800 pt-3 space-y-1">
                    <div className="flex justify-between text-xs"><span className="text-red-400">HP</span><span>{preview.hp.max}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-cyan-400">MP</span><span>{preview.mp.max}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-aethrix-gold">AETH</span><span>{STARTING_AETH}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-yellow-600">Gold</span><span>{STARTING_GOLD}</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border border-gray-800 p-4">
                    <div className="text-[10px] text-aethrix-gold uppercase tracking-widest mb-2">Abilities</div>
                    {selectedClass?.abilities.map(a => (
                      <div key={a} className="text-xs text-gray-300 py-1 border-b border-gray-900">{a}</div>
                    ))}
                  </div>
                  <div className="border border-gray-800 p-4">
                    <div className="text-[10px] text-aethrix-gold uppercase tracking-widest mb-2">Lore</div>
                    <p className="text-xs text-gray-400 leading-relaxed">{selectedRace?.description} {selectedSubRace?.description}</p>
                  </div>
                  <button onClick={handleFinish}
                    className="w-full bg-aethrix-gold text-black font-black uppercase tracking-widest py-4 hover:bg-white transition-all">
                    BEGIN THE CHRONICLE →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
