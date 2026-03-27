"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';
import CombatView from '@/components/CombatView';
import { RACES, SUBRACES, CLASSES } from '@/lib/game/data';
import { createEss, createCharacter } from '@/lib/game/character';
import { Character } from '@/lib/game/types';

type ViewState = "LANDING" | "GAME";

export default function Home() {
  const [view, setView] = useState<ViewState>("LANDING");
  const [gameState, setGameState] = useState<"MENU" | "COMBAT">("MENU");
  const [party, setParty] = useState<Character[]>([]);
  const [enemies, setEnemies] = useState<Character[]>([]);

  const startNewGame = () => {
    const ess = createEss(RACES[4], SUBRACES[4], CLASSES[0]);
    const companion = createCharacter("Valen", RACES[1], SUBRACES[7], CLASSES[5]);
    setParty([ess, companion]);
    const enemy1 = createCharacter("Void Abomination", RACES[7], SUBRACES[1], CLASSES[2]);
    setEnemies([enemy1]);
    setView("GAME");
    setGameState("COMBAT");
  };

  if (view === "GAME") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono bg-black text-aethrix-gold overflow-hidden">
        <CombatView 
          party={party} 
          enemies={enemies} 
          onCombatEnd={() => setView("LANDING")} 
        />
      </main>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white font-mono selection:bg-aethrix-gold selection:text-black">
      {/* Background Hero Image */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="/images/aethrix-banner.png" 
          alt="Aethrix Background" 
          fill 
          className="object-cover opacity-40 brightness-50"
          priority
        />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 gritty-overlay" />
        <div className="scanline" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex justify-between items-center px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-aethrix-gold flex items-center justify-center font-bold text-aethrix-gold bg-black">A</div>
          <span className="text-xl font-bold tracking-[0.3em] uppercase terminal-text">Aethrix</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] tracking-widest uppercase text-gray-400">
          <a href="#" className="hover:text-aethrix-gold transition-colors">Lore</a>
          <a href="#" className="hover:text-aethrix-gold transition-colors">Empire</a>
          <a href="#" className="hover:text-aethrix-gold transition-colors">Tokens</a>
          <a href="#" className="hover:text-aethrix-gold transition-colors">Manifesto</a>
        </div>
        <button 
          onClick={startNewGame}
          className="px-6 py-2 border border-aethrix-gold text-[10px] tracking-widest hover:bg-aethrix-gold hover:text-black transition-all"
        >
          ENTER CHRONICLE
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <Logo className="mb-12 scale-125" />
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 terminal-text">
            Tiena-Nueble
          </h1>
          <p className="text-aethrix-gold text-lg md:text-xl tracking-[0.4em] uppercase font-light mb-12 glow-cyan">
            The One World Government
          </p>
          
          <div className="grid md:grid-cols-2 gap-12 text-left mb-16">
            <div className="space-y-4 border-l-2 border-aethrix-gold pl-6 py-2 bg-black/40 backdrop-blur-sm">
              <h3 className="text-white font-bold uppercase tracking-widest">The Empire</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Spanning across the core systems, the Tiena-Nueble has forged a peace through iron. But history is written in blood, and the empire's reach is finally meeting its limits.
              </p>
            </div>
            <div className="space-y-4 border-l-2 border-aethrix-crimson pl-6 py-2 bg-black/40 backdrop-blur-sm">
              <h3 className="text-aethrix-crimson font-bold uppercase tracking-widest">The Fringe</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Beyond the golden gates lie the abominations and races of the outer dark. They do not seek peace. They seek the end of the Tiena-Nueble.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Character Section */}
      <section className="relative z-10 py-32 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative h-[600px] w-full"
          >
            <Image 
              src="/images/ess_poster.png" 
              alt="Ess Character" 
              fill 
              className="object-cover border border-white/10 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-aethrix-gold text-[10px] tracking-[0.5em] uppercase">Protagonist</span>
              <h2 className="text-5xl font-black uppercase terminal-text">Ess</h2>
            </div>
          </motion.div>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold uppercase tracking-widest mb-6 border-b border-aethrix-gold pb-4 inline-block">Amnesia Protocol</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                You awaken with no name, only the power to command the Aether. The Empire claims you as a hero. The Fringe whispers you are their savior. Both fear what you might remember.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-aethrix-gold font-bold">12 STATS</span>
                <p className="text-xs text-gray-500 uppercase">Complex attribute system governing every move.</p>
              </div>
              <div className="space-y-2">
                <span className="text-aethrix-cyan font-bold">AETH UTILITY</span>
                <p className="text-xs text-gray-500 uppercase">Real utility through the Aethrix token ecosystem.</p>
              </div>
              <div className="space-y-2">
                <span className="text-aethrix-crimson font-bold">8 CLASSES</span>
                <p className="text-xs text-gray-500 uppercase">From Aether Weavers to Imperial Inquisitors.</p>
              </div>
              <div className="space-y-2">
                <span className="text-white font-bold">8 RACES</span>
                <p className="text-xs text-gray-500 uppercase">Diverse lineages with unique survival traits.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lore Section */}
      <section className="relative z-10 py-32 px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black uppercase tracking-widest mb-12">Historic Battles</h2>
          <div className="space-y-12 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2 hidden md:block" />
            
            {[
              { year: "AGE 0", title: "The Great Unification", desc: "Tiena-Nueble unites the warring clans under one banner." },
              { year: "AGE 412", title: "Fall of the Obsidian Gate", desc: "The first encounter with the Abominations of the Fringe." },
              { year: "AGE 890", title: "Aetherial Awakening", desc: "The discovery of the Aethrix token and the power it holds." }
            ].map((battle, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="relative z-20 bg-black/80 border border-white/10 p-8 hover:border-aethrix-gold transition-colors backdrop-blur-md"
              >
                <span className="text-aethrix-gold font-bold tracking-widest">{battle.year}</span>
                <h3 className="text-2xl font-bold uppercase mt-2 mb-4">{battle.title}</h3>
                <p className="text-gray-400 text-sm">{battle.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-8 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border border-aethrix-gold flex items-center justify-center font-bold text-aethrix-gold text-xs">A</div>
              <span className="text-lg font-bold tracking-widest uppercase">Aethrix</span>
            </div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest max-w-xs">
              © 2026 Tiena-Nueble High Command. All rights reserved. Secured by Aethrix Protocol.
            </p>
          </div>
          
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-aethrix-gold uppercase tracking-[0.3em] font-bold mb-2">Systems</span>
              <a href="#" className="text-xs text-gray-500 hover:text-white uppercase transition-colors">Combat</a>
              <a href="#" className="text-xs text-gray-500 hover:text-white uppercase transition-colors">Stats</a>
              <a href="#" className="text-xs text-gray-500 hover:text-white uppercase transition-colors">Skill Tree</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-aethrix-gold uppercase tracking-[0.3em] font-bold mb-2">Network</span>
              <a href="#" className="text-xs text-gray-500 hover:text-white uppercase transition-colors">Discord</a>
              <a href="#" className="text-xs text-gray-500 hover:text-white uppercase transition-colors">X / Twitter</a>
              <a href="#" className="text-xs text-gray-500 hover:text-white uppercase transition-colors">Whitepaper</a>
            </div>
          </div>
          
          <button className="px-12 py-4 bg-aethrix-gold text-black font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1">
            Join the Empire
          </button>
        </div>
      </footer>
    </div>
  );
}
