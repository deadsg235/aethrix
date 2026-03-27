"use client";

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { GameState, Character, Area, Continent, Quest, Item, StoryChoice } from '@/lib/game/types';
import { RACES, SUBRACES, CLASSES } from '@/lib/game/data';
import { createCharacter } from '@/lib/game/character';
import { ALL_QUESTS } from '@/lib/game/quests';
import { STORY_NODES } from '@/lib/game/story';
import { ITEMS } from '@/lib/game/items';
import { AETH_TOKEN, STARTING_AETH, STARTING_GOLD } from '@/lib/game/token';
import { saveGame, loadGame, deleteSave, hasSave } from '@/lib/game/save';

import Logo from '@/components/Logo';
import CharacterCreation from '@/components/CharacterCreation';
import StoryView from '@/components/StoryView';
import WorldView from '@/components/WorldView';
import QuestBoard from '@/components/QuestBoard';
import MarketView from '@/components/MarketView';
import SafeHubView from '@/components/SafeHubView';
import CombatView from '@/components/CombatView';

// ── Enemy factory ────────────────────────────────────────────────────────────
function spawnEnemies(areaId: string, playerLevel: number): Character[] {
  const enemyTemplates: Record<string, { name: string; raceIdx: number; classIdx: number }[]> = {
    default: [{ name: 'Void Abomination', raceIdx: 7, classIdx: 2 }],
    valdris_capital: [{ name: 'Imperial Deserter', raceIdx: 1, classIdx: 0 }, { name: 'Street Thug', raceIdx: 0, classIdx: 3 }],
    valdris_ashfields: [{ name: 'Ash Wraith', raceIdx: 6, classIdx: 2 }, { name: 'Fallen Soldier', raceIdx: 1, classIdx: 0 }],
    valdris_ironmines: [{ name: 'Mine Horror', raceIdx: 3, classIdx: 2 }, { name: 'Stone Golem', raceIdx: 2, classIdx: 0 }],
    valdris_border: [{ name: 'Fringe Raider', raceIdx: 6, classIdx: 3 }, { name: 'Void-Touched Warrior', raceIdx: 7, classIdx: 7 }],
    valdris_riftgate: [{ name: 'Rift Abomination', raceIdx: 4, classIdx: 2 }, { name: 'Corrupted Warden', raceIdx: 5, classIdx: 5 }],
    nocthar_duskport: [{ name: 'Dusk Thief', raceIdx: 6, classIdx: 3 }],
    nocthar_voidmarsh: [{ name: 'Void Revenant', raceIdx: 7, classIdx: 2 }, { name: 'Marsh Horror', raceIdx: 3, classIdx: 2 }],
    nocthar_obsidian_spire: [{ name: 'Spire Guardian', raceIdx: 2, classIdx: 0 }, { name: 'Obsidian Golem', raceIdx: 3, classIdx: 7 }],
    nocthar_fringe_camp: [{ name: 'Fringe Champion', raceIdx: 0, classIdx: 7 }, { name: 'Beast Rider', raceIdx: 0, classIdx: 0 }],
    nocthar_heart: [{ name: 'Storm Titan', raceIdx: 4, classIdx: 6 }, { name: 'Void Leviathan', raceIdx: 7, classIdx: 2 }],
    solmara_tidehaven: [{ name: 'Archive Guardian', raceIdx: 5, classIdx: 4 }],
    solmara_drowned_city: [{ name: 'Drowned Guardian', raceIdx: 1, classIdx: 0 }, { name: 'Ancient Construct', raceIdx: 5, classIdx: 5 }],
    solmara_crystal_wastes: [{ name: 'Crystal Elemental', raceIdx: 4, classIdx: 1 }, { name: 'Aether Wraith', raceIdx: 4, classIdx: 2 }],
    solmara_vault: [{ name: 'Vault Sentinel', raceIdx: 5, classIdx: 4 }, { name: 'Knowledge Horror', raceIdx: 7, classIdx: 1 }],
    solmara_origin: [{ name: 'Origin Guardian', raceIdx: 4, classIdx: 1 }, { name: 'Aethrix Construct', raceIdx: 4, classIdx: 5 }],
  };

  const templates = enemyTemplates[areaId] || enemyTemplates.default;
  return templates.slice(0, 1).map(t => {
    const enemy = createCharacter(t.name, RACES[t.raceIdx], SUBRACES[Math.floor(Math.random() * 8)], CLASSES[t.classIdx]);
    // Scale to player level
    const scale = Math.max(1, playerLevel - 1);
    Object.keys(enemy.currentStats).forEach(s => { (enemy.currentStats as Record<string, number>)[s] += scale * 2; });
    enemy.hp.max = enemy.currentStats.CON * 10 + enemy.currentStats.STR * 2 + scale * 20;
    enemy.hp.current = enemy.hp.max;
    return enemy;
  });
}

// ── Initial state ────────────────────────────────────────────────────────────
function makeInitialState(): GameState {
  return {
    phase: 'LANDING',
    party: [],
    activeAreaId: null,
    activeContinentId: null,
    quests: [],
    storyNodeId: 'intro',
    storyFlags: [],
    enemies: [],
    combatReturnPhase: 'WORLD',
    log: [],
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [gs, setGs] = useState<GameState>(makeInitialState);
  const [activeArea, setActiveArea] = useState<Area | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const updatePlayer = useCallback((updater: (c: Character) => Character) => {
    setGs(prev => ({ ...prev, party: prev.party.map((c, i) => i === 0 ? updater(c) : c) }));
  }, []);

  const player = gs.party[0];

  // ── Story choice handler ──────────────────────────────────────────────────
  const handleStoryChoice = (choice: StoryChoice, nextNodeId: string) => {
    setGs(prev => {
      const newFlags = choice.effect.setFlag ? [...prev.storyFlags, choice.effect.setFlag] : prev.storyFlags;
      const newParty = prev.party.map((c, i) => {
        if (i !== 0) return c;
        let updated = { ...c };
        if (choice.effect.statBonus) {
          updated.currentStats = { ...updated.currentStats };
          Object.entries(choice.effect.statBonus).forEach(([s, v]) => {
            (updated.currentStats as Record<string, number>)[s] = ((updated.currentStats as Record<string, number>)[s] || 0) + (v || 0);
          });
        }
        if (choice.effect.aethReward) updated.aethBalance += choice.effect.aethReward;
        if (choice.effect.goldReward) updated.gold += choice.effect.goldReward;
        if (choice.effect.addItem && ITEMS[choice.effect.addItem]) {
          updated.inventory = [...updated.inventory, ITEMS[choice.effect.addItem]];
        }
        return updated;
      });

      let newQuests = prev.quests;
      if (choice.effect.addQuest) {
        const q = ALL_QUESTS.find(q => q.id === choice.effect.addQuest);
        if (q && !prev.quests.find(pq => pq.id === q.id)) newQuests = [...prev.quests, { ...q, status: 'active' }];
      }

      return { ...prev, storyNodeId: nextNodeId, storyFlags: newFlags, party: newParty, quests: newQuests };
    });
  };

  // ── Quest accept ─────────────────────────────────────────────────────────
  const handleAcceptQuest = (quest: Quest) => {
    setGs(prev => {
      if (prev.quests.find(q => q.id === quest.id)) return prev;
      return { ...prev, quests: [...prev.quests, { ...quest, status: 'active' }] };
    });
    notify(`Quest accepted: ${quest.title}`);
  };

  // ── Buy item ─────────────────────────────────────────────────────────────
  const handleBuy = (item: Item, currency: 'aeth' | 'gold') => {
    updatePlayer(c => {
      if (currency === 'aeth') {
        if (c.aethBalance < item.aethCost) { notify('Not enough AETH'); return c; }
        return { ...c, aethBalance: c.aethBalance - item.aethCost, inventory: [...c.inventory, item] };
      } else {
        if (!item.goldCost || c.gold < item.goldCost) { notify('Not enough Gold'); return c; }
        return { ...c, gold: c.gold - item.goldCost, inventory: [...c.inventory, item] };
      }
    });
    notify(`Purchased: ${item.name}`);
  };

  // ── Safe hub ─────────────────────────────────────────────────────────────
  const handleRest = () => {
    updatePlayer(c => ({ ...c, hp: { ...c.hp, current: c.hp.max }, mp: { ...c.mp, current: c.mp.max } }));
    notify('Fully rested. HP and MP restored.');
  };

  const handleHeal = () => {
    updatePlayer(c => {
      const cost = Math.floor((c.hp.max - c.hp.current) * 0.5);
      if (c.gold < cost) { notify('Not enough gold'); return c; }
      return { ...c, gold: c.gold - cost, hp: { ...c.hp, current: c.hp.max } };
    });
    notify('Healed to full HP.');
  };

  // ── Combat end ───────────────────────────────────────────────────────────
  const handleCombatEnd = (victory: boolean) => {
    if (victory) {
      const expGain = 200 + (player?.level || 1) * 50;
      const goldGain = 50 + Math.floor(Math.random() * 100);
      const aethGain = Math.floor(Math.random() * 10) + 5;
      updatePlayer(c => ({ ...c, exp: c.exp + expGain, gold: c.gold + goldGain, aethBalance: c.aethBalance + aethGain }));
      notify(`Victory! +${expGain} EXP, +${goldGain} Gold, +${aethGain} AETH`);
    } else {
      notify('Defeated... returning to safe ground.');
    }
    setGs(prev => ({ ...prev, phase: gs.combatReturnPhase, enemies: [] }));
  };

  // ── Character creation complete ──────────────────────────────────────────
  const handleCharacterCreated = (character: Character) => {
    const companion = createCharacter('Valen', RACES[1], SUBRACES[7], CLASSES[5]);
    companion.gold = 0;
    companion.aethBalance = 0;
    setGs(prev => ({ ...prev, phase: 'STORY', party: [character, companion], storyNodeId: 'intro' }));
  };

  // ── Enter area for combat ────────────────────────────────────────────────
  const handleEnterArea = (area: Area, continent: Continent) => {
    const enemies = spawnEnemies(area.id, player?.level || 1);
    setActiveArea(area);
    setGs(prev => ({ ...prev, phase: 'COMBAT', enemies, activeAreaId: area.id, activeContinentId: continent.id, combatReturnPhase: 'WORLD' }));
  };

  // ── Save / Load ──────────────────────────────────────────────────────────
  const handleSave = () => { saveGame(gs); notify('Game saved.'); };
  const handleLoad = () => {
    const saved = loadGame();
    if (saved) { setGs(saved); notify('Game loaded.'); }
  };
  const handleNewGame = () => { deleteSave(); setGs({ ...makeInitialState(), phase: 'CHARACTER_CREATION' }); };

  // ── RENDER ───────────────────────────────────────────────────────────────

  if (gs.phase === 'CHARACTER_CREATION') {
    return <CharacterCreation onComplete={handleCharacterCreated} />;
  }

  if (gs.phase === 'STORY') {
    return (
      <StoryView
        nodeId={gs.storyNodeId}
        flags={gs.storyFlags}
        onChoice={handleStoryChoice}
        onOpenWorld={() => setGs(prev => ({ ...prev, phase: 'WORLD' }))}
      />
    );
  }

  if (gs.phase === 'WORLD') {
    return (
      <div className="relative">
        {notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-black border border-aethrix-gold px-4 py-2 text-xs text-aethrix-gold uppercase tracking-widest">
            {notification}
          </motion.div>
        )}
        <div className="fixed bottom-4 right-4 z-50 flex gap-2">
          <button onClick={handleSave} className="border border-gray-700 px-3 py-1 text-[9px] uppercase hover:border-aethrix-gold hover:text-aethrix-gold transition-all bg-black">
            Save
          </button>
        </div>
        <WorldView
          party={gs.party}
          onEnterArea={handleEnterArea}
          onOpenQuestBoard={(areaId) => {
            setGs(prev => ({ ...prev, phase: 'QUEST_BOARD', activeAreaId: areaId }));
          }}
          onOpenMarket={(area) => { setActiveArea(area); setGs(prev => ({ ...prev, phase: 'MARKET' })); }}
          onOpenBlacksmith={(area) => { setActiveArea(area); setGs(prev => ({ ...prev, phase: 'BLACKSMITH' })); }}
          onOpenSafeHub={(area) => { setActiveArea(area); setGs(prev => ({ ...prev, phase: 'SAFE_HUB' })); }}
          onOpenStory={() => setGs(prev => ({ ...prev, phase: 'STORY' }))}
        />
      </div>
    );
  }

  if (gs.phase === 'QUEST_BOARD' && gs.activeAreaId) {
    return (
      <QuestBoard
        areaId={gs.activeAreaId}
        activeQuests={gs.quests}
        playerLevel={player?.level || 1}
        onAcceptQuest={handleAcceptQuest}
        onBack={() => setGs(prev => ({ ...prev, phase: 'WORLD' }))}
      />
    );
  }

  if (gs.phase === 'MARKET' && activeArea) {
    return (
      <MarketView
        area={activeArea}
        player={player}
        isBlacksmith={false}
        onBuy={handleBuy}
        onBack={() => setGs(prev => ({ ...prev, phase: 'WORLD' }))}
      />
    );
  }

  if (gs.phase === 'BLACKSMITH' && activeArea) {
    return (
      <MarketView
        area={activeArea}
        player={player}
        isBlacksmith={true}
        onBuy={handleBuy}
        onBack={() => setGs(prev => ({ ...prev, phase: 'WORLD' }))}
      />
    );
  }

  if (gs.phase === 'SAFE_HUB' && activeArea) {
    return (
      <SafeHubView
        area={activeArea}
        player={player}
        onRest={handleRest}
        onHeal={handleHeal}
        onBack={() => setGs(prev => ({ ...prev, phase: 'WORLD' }))}
      />
    );
  }

  if (gs.phase === 'COMBAT') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono bg-black text-aethrix-gold overflow-hidden">
        <CombatView
          party={gs.party}
          enemies={gs.enemies}
          onCombatEnd={handleCombatEnd}
        />
      </main>
    );
  }

  // ── LANDING PAGE ─────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-black text-white font-mono selection:bg-aethrix-gold selection:text-black">
      <div className="fixed inset-0 z-0">
        <Image src="/images/aethrix-banner.png" alt="Aethrix Background" fill className="object-cover opacity-40 brightness-50" priority />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 gritty-overlay" />
        <div className="scanline" />
      </div>

      <nav className="relative z-50 flex justify-between items-center px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-aethrix-gold flex items-center justify-center font-bold text-aethrix-gold bg-black">A</div>
          <span className="text-xl font-bold tracking-[0.3em] uppercase terminal-text">Aethrix</span>
        </div>
        <div className="hidden md:flex gap-8 text-[10px] tracking-widest uppercase text-gray-400">
          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-aethrix-gold transition-colors">Buy AETH</a>
          <a href={AETH_TOKEN.dexUrl} target="_blank" rel="noopener noreferrer" className="hover:text-aethrix-gold transition-colors">Chart</a>
          <span className="text-gray-700 text-[8px] self-center">{AETH_TOKEN.contract.slice(0, 8)}...{AETH_TOKEN.contract.slice(-6)}</span>
        </div>
        <div className="flex gap-3">
          {hasSave() && (
            <button onClick={handleLoad} className="px-4 py-2 border border-gray-600 text-[10px] tracking-widest hover:border-aethrix-cyan hover:text-aethrix-cyan transition-all">
              CONTINUE
            </button>
          )}
          <button onClick={handleNewGame} className="px-6 py-2 border border-aethrix-gold text-[10px] tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
            NEW GAME
          </button>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-8 text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-4xl">
          <Logo className="mb-12 scale-125" />
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 terminal-text">Tiena-Nueble</h1>
          <p className="text-aethrix-gold text-lg md:text-xl tracking-[0.4em] uppercase font-light mb-4 glow-cyan">The One World Government</p>
          <p className="text-gray-500 text-xs tracking-widest mb-12">
            Token: <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer" className="text-aethrix-gold hover:underline">{AETH_TOKEN.contract}</a>
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left mb-16">
            {[
              { label: '3 Continents', sub: '15 Areas to explore', color: 'border-aethrix-gold' },
              { label: '9 Main Quests', sub: 'Full branching storyline', color: 'border-aethrix-cyan' },
              { label: 'AETH Economy', sub: 'Real token, in-game power', color: 'border-purple-500' },
            ].map(f => (
              <div key={f.label} className={`border-l-2 ${f.color} pl-4 py-2 bg-black/40`}>
                <div className="font-bold uppercase tracking-widest text-sm">{f.label}</div>
                <div className="text-gray-500 text-xs mt-1">{f.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={handleNewGame}
              className="px-12 py-4 bg-aethrix-gold text-black font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1">
              Begin the Chronicle
            </button>
            {hasSave() && (
              <button onClick={handleLoad}
                className="px-12 py-4 border border-aethrix-gold text-aethrix-gold font-black uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
                Continue
              </button>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 py-12 px-8 border-t border-white/5 bg-black text-center">
        <p className="text-gray-600 text-[10px] uppercase tracking-widest">
          © 2026 Tiena-Nueble High Command · AETH Token: {AETH_TOKEN.contract}
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-aethrix-gold hover:underline uppercase">Buy on pump.fun</a>
          <a href={AETH_TOKEN.dexUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 hover:text-white uppercase">DexScreener</a>
        </div>
      </footer>
    </div>
  );
}
