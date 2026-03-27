"use client";

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import { GameState, Character, Area, Continent, Quest, Item, StoryChoice, Stat } from '@/lib/game/types';
import { RACES, SUBRACES, CLASSES } from '@/lib/game/data';
import { createCharacter } from '@/lib/game/character';
import { ALL_QUESTS } from '@/lib/game/quests';
import { ITEMS } from '@/lib/game/items';
import { AETH_TOKEN } from '@/lib/game/token';
import {
  autoSave, hasAnySave, loadAuto,
} from '@/lib/game/save';
import { SkillNode } from '@/lib/game/skilltree';

import Logo from '@/components/Logo';
import CharacterCreation from '@/components/CharacterCreation';
import StoryView from '@/components/StoryView';
import WorldView from '@/components/WorldView';
import QuestBoard from '@/components/QuestBoard';
import MarketView from '@/components/MarketView';
import SafeHubView from '@/components/SafeHubView';
import CombatView from '@/components/CombatView';
import SkillTreeView from '@/components/SkillTreeView';
import SaveLoadScreen from '@/components/SaveLoadScreen';
import WalletBar from '@/components/WalletBar';

// ── GameShell — defined OUTSIDE Home to keep stable component identity ────────
interface GameShellProps {
  player: Character | undefined;
  notification: string | null;
  onWalletConnect: (pk: string, bal: number) => void;
  onWalletDisconnect: () => void;
  onWalletBalanceUpdate: (bal: number) => void;
  onOpenSaveLoad: () => void;
  onOpenSkillTree: () => void;
  children: React.ReactNode;
}

function GameShell({
  player, notification,
  onWalletConnect, onWalletDisconnect, onWalletBalanceUpdate,
  onOpenSaveLoad, onOpenSkillTree, children,
}: GameShellProps) {
  return (
    <div className="pt-10">
      <WalletBar
        player={player}
        onWalletConnect={onWalletConnect}
        onWalletDisconnect={onWalletDisconnect}
        onWalletBalanceUpdate={onWalletBalanceUpdate}
        onOpenSaveLoad={onOpenSaveLoad}
        onOpenSkillTree={onOpenSkillTree}
      />
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-12 right-4 z-50 bg-black border border-aethrix-gold px-4 py-2 text-xs text-aethrix-gold uppercase tracking-widest shadow-lg pointer-events-none"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function spawnEnemies(areaId: string, playerLevel: number): Character[] {
  const templates: Record<string, { name: string; raceIdx: number; classIdx: number }[]> = {
    default:                [{ name: 'Void Abomination',     raceIdx: 7, classIdx: 2 }],
    valdris_capital:        [{ name: 'Imperial Deserter',    raceIdx: 1, classIdx: 0 }],
    valdris_ashfields:      [{ name: 'Ash Wraith',           raceIdx: 6, classIdx: 2 }],
    valdris_ironmines:      [{ name: 'Mine Horror',          raceIdx: 3, classIdx: 2 }],
    valdris_border:         [{ name: 'Fringe Raider',        raceIdx: 6, classIdx: 3 }],
    valdris_riftgate:       [{ name: 'Rift Abomination',     raceIdx: 4, classIdx: 2 }],
    nocthar_duskport:       [{ name: 'Dusk Thief',           raceIdx: 6, classIdx: 3 }],
    nocthar_voidmarsh:      [{ name: 'Void Revenant',        raceIdx: 7, classIdx: 2 }],
    nocthar_obsidian_spire: [{ name: 'Spire Guardian',       raceIdx: 2, classIdx: 0 }],
    nocthar_fringe_camp:    [{ name: 'Fringe Champion',      raceIdx: 0, classIdx: 7 }],
    nocthar_heart:          [{ name: 'Storm Titan',          raceIdx: 4, classIdx: 6 }],
    solmara_tidehaven:      [{ name: 'Archive Guardian',     raceIdx: 5, classIdx: 4 }],
    solmara_drowned_city:   [{ name: 'Drowned Guardian',     raceIdx: 1, classIdx: 0 }],
    solmara_crystal_wastes: [{ name: 'Crystal Elemental',    raceIdx: 4, classIdx: 1 }],
    solmara_vault:          [{ name: 'Vault Sentinel',       raceIdx: 5, classIdx: 4 }],
    solmara_origin:         [{ name: 'Origin Guardian',      raceIdx: 4, classIdx: 1 }],
  };
  const tpls = templates[areaId] ?? templates.default;
  return tpls.slice(0, 1).map(t => {
    const e = createCharacter(t.name, RACES[t.raceIdx], SUBRACES[Math.floor(Math.random() * 8)], CLASSES[t.classIdx]);
    const scale = Math.max(1, playerLevel - 1);
    (Object.keys(e.currentStats) as Stat[]).forEach(s => { e.currentStats[s] += scale * 2; });
    e.hp.max = e.currentStats.CON * 10 + e.currentStats.STR * 2 + scale * 20;
    e.hp.current = e.hp.max;
    return e;
  });
}

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
    unlockedSkills: [],
    walletPublicKey: null,
    walletAethBalance: null,
    walletAethSpent: 0,
    log: [],
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [gs, setGs] = useState<GameState>(makeInitialState);
  const [activeArea, setActiveArea] = useState<Area | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [saveExists, setSaveExists] = useState(false);
  const prevPhaseRef = useRef<GameState['phase']>('LANDING');

  // Check for existing saves on mount
  useEffect(() => { setSaveExists(hasAnySave()); }, []);

  // Auto-save on every phase transition (except LANDING / CHARACTER_CREATION)
  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = gs.phase;
    if (
      gs.phase !== prev &&
      gs.party.length > 0 &&
      gs.phase !== 'LANDING' &&
      gs.phase !== 'CHARACTER_CREATION'
    ) {
      autoSave(gs);
      setSaveExists(true);
    }
  }, [gs.phase]);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const updatePlayer = useCallback((updater: (c: Character) => Character) => {
    setGs(prev => ({
      ...prev,
      party: prev.party.map((c, i) => i === 0 ? updater(c) : c),
    }));
  }, []);

  const player = gs.party[0];

  // ── Wallet sync ───────────────────────────────────────────────────────────
  const handleWalletConnect = useCallback((publicKey: string, balance: number) => {
    setGs(prev => ({ ...prev, walletPublicKey: publicKey, walletAethBalance: balance }));
  }, []);

  const handleWalletDisconnect = useCallback(() => {
    setGs(prev => ({ ...prev, walletPublicKey: null, walletAethBalance: null }));
  }, []);

  const handleWalletBalanceUpdate = useCallback((balance: number) => {
    setGs(prev => ({ ...prev, walletAethBalance: balance }));
  }, []);

  // ── Phase helper ──────────────────────────────────────────────────────────
  const goTo = useCallback((phase: GameState['phase']) => {
    setGs(prev => ({ ...prev, phase }));
  }, []);

  // ── Story ─────────────────────────────────────────────────────────────────
  const handleStoryChoice = useCallback((choice: StoryChoice, nextNodeId: string) => {
    setGs(prev => {
      const newFlags = choice.effect.setFlag
        ? [...prev.storyFlags, choice.effect.setFlag]
        : prev.storyFlags;

      const newParty = prev.party.map((c, i) => {
        if (i !== 0) return c;
        let u = { ...c, currentStats: { ...c.currentStats } };
        if (choice.effect.statBonus) {
          Object.entries(choice.effect.statBonus).forEach(([s, v]) => {
            u.currentStats[s as Stat] = (u.currentStats[s as Stat] ?? 0) + (v ?? 0);
          });
        }
        if (choice.effect.aethReward) u.aethBalance += choice.effect.aethReward;
        if (choice.effect.goldReward) u.gold += choice.effect.goldReward;
        if (choice.effect.addItem && ITEMS[choice.effect.addItem]) {
          u.inventory = [...u.inventory, ITEMS[choice.effect.addItem]];
        }
        return u;
      });

      let newQuests = prev.quests;
      if (choice.effect.addQuest) {
        const q = ALL_QUESTS.find(q => q.id === choice.effect.addQuest);
        if (q && !prev.quests.find(pq => pq.id === q.id)) {
          newQuests = [...prev.quests, { ...q, status: 'active' }];
        }
      }

      return { ...prev, storyNodeId: nextNodeId, storyFlags: newFlags, party: newParty, quests: newQuests };
    });
  }, []);

  // ── Quests ────────────────────────────────────────────────────────────────
  const handleAcceptQuest = useCallback((quest: Quest) => {
    setGs(prev => {
      if (prev.quests.find(q => q.id === quest.id)) return prev;
      return { ...prev, quests: [...prev.quests, { ...quest, status: 'active' }] };
    });
    notify(`Quest accepted: ${quest.title}`);
  }, [notify]);

  // ── Buy item — supports wallet AETH as source ─────────────────────────────
  const handleBuy = useCallback((item: Item, currency: 'aeth' | 'gold' | 'wallet_aeth') => {
    updatePlayer(c => {
      if (currency === 'aeth') {
        if (c.aethBalance < item.aethCost) { notify('Not enough in-game AETH'); return c; }
        return { ...c, aethBalance: c.aethBalance - item.aethCost, inventory: [...c.inventory, item] };
      }
      if (currency === 'wallet_aeth') {
        const walletBal = gs.walletAethBalance ?? 0;
        if (walletBal < item.aethCost) { notify('Not enough wallet AETH'); return c; }
        // Deduct from wallet balance in game state and track spend
        setGs(prev => ({
          ...prev,
          walletAethBalance: (prev.walletAethBalance ?? 0) - item.aethCost,
          walletAethSpent: prev.walletAethSpent + item.aethCost,
        }));
        return { ...c, inventory: [...c.inventory, item] };
      }
      // gold
      if (!item.goldCost || c.gold < item.goldCost) { notify('Not enough Gold'); return c; }
      return { ...c, gold: c.gold - item.goldCost, inventory: [...c.inventory, item] };
    });
    notify(`Purchased: ${item.name}`);
  }, [gs.walletAethBalance, notify, updatePlayer]);

  // ── Safe hub ──────────────────────────────────────────────────────────────
  const handleRest = useCallback(() => {
    updatePlayer(c => ({ ...c, hp: { ...c.hp, current: c.hp.max }, mp: { ...c.mp, current: c.mp.max } }));
    notify('Fully rested. HP and MP restored.');
  }, [updatePlayer, notify]);

  const handleHeal = useCallback(() => {
    updatePlayer(c => {
      const cost = Math.floor((c.hp.max - c.hp.current) * 0.5);
      if (c.gold < cost) { notify('Not enough gold'); return c; }
      return { ...c, gold: c.gold - cost, hp: { ...c.hp, current: c.hp.max } };
    });
    notify('Healed to full HP.');
  }, [updatePlayer, notify]);

  // ── Combat ────────────────────────────────────────────────────────────────
  const handleCombatEnd = useCallback((victory: boolean) => {
    if (victory) {
      const expGain  = 200 + (player?.level ?? 1) * 50;
      const goldGain = 50  + Math.floor(Math.random() * 100);
      const aethGain = Math.floor(Math.random() * 10) + 5;
      updatePlayer(c => ({
        ...c,
        exp: c.exp + expGain,
        gold: c.gold + goldGain,
        aethBalance: c.aethBalance + aethGain,
      }));
      notify(`Victory! +${expGain} EXP  +${goldGain} Gold  +${aethGain} AETH`);
    } else {
      notify('Defeated… returning to safe ground.');
    }
    setGs(prev => ({ ...prev, phase: prev.combatReturnPhase, enemies: [] }));
  }, [player, updatePlayer, notify]);

  // ── Character creation ────────────────────────────────────────────────────
  const handleCharacterCreated = useCallback((character: Character) => {
    const companion = createCharacter('Valen', RACES[1], SUBRACES[7], CLASSES[5]);
    companion.gold = 0;
    companion.aethBalance = 0;
    setGs(prev => ({
      ...prev,
      phase: 'STORY',
      party: [character, companion],
      storyNodeId: 'intro',
    }));
  }, []);

  // ── Enter area ────────────────────────────────────────────────────────────
  const handleEnterArea = useCallback((area: Area, continent: Continent) => {
    const enemies = spawnEnemies(area.id, player?.level ?? 1);
    setActiveArea(area);
    setGs(prev => ({
      ...prev,
      phase: 'COMBAT',
      enemies,
      activeAreaId: area.id,
      activeContinentId: continent.id,
      combatReturnPhase: 'WORLD',
    }));
  }, [player]);

  // ── Skill unlock ──────────────────────────────────────────────────────────
  const handleSkillUnlock = useCallback((node: SkillNode, source: 'wallet' | 'ingame') => {
    setGs(prev => {
      if (prev.unlockedSkills.includes(node.id)) return prev;

      const newParty = prev.party.map((c, i) => {
        if (i !== 0) return c;
        let u = { ...c, currentStats: { ...c.currentStats } };
        if (node.statBonus) {
          Object.entries(node.statBonus).forEach(([s, v]) => {
            u.currentStats[s as Stat] = (u.currentStats[s as Stat] ?? 0) + (v ?? 0);
          });
        }
        if (node.hpBonus) u.hp = { max: u.hp.max + node.hpBonus, current: u.hp.current + node.hpBonus };
        if (node.mpBonus) u.mp = { max: u.mp.max + node.mpBonus, current: u.mp.current + node.mpBonus };
        if (source === 'ingame') u.aethBalance = u.aethBalance - node.aethCost;
        return u;
      });

      const walletUpdate = source === 'wallet'
        ? {
            walletAethBalance: (prev.walletAethBalance ?? 0) - node.aethCost,
            walletAethSpent: prev.walletAethSpent + node.aethCost,
          }
        : {};

      return {
        ...prev,
        ...walletUpdate,
        unlockedSkills: [...prev.unlockedSkills, node.id],
        party: newParty,
      };
    });
    notify(`Skill unlocked: ${node.name}`);
  }, [notify]);

  // ── Save / Load ───────────────────────────────────────────────────────────
  const handleLoadState = useCallback((state: GameState) => {
    setGs({
      ...makeInitialState(),   // ensures new fields exist
      ...state,
      phase: 'WORLD',
      walletPublicKey: null,   // never persist wallet key across sessions
      walletAethBalance: null,
    });
    setSaveExists(true);
    notify('Game loaded.');
  }, [notify]);

  const handleNewGame = useCallback(() => {
    setGs({ ...makeInitialState(), phase: 'CHARACTER_CREATION' });
  }, []);

  const handleContinue = useCallback(() => {
    const saved = loadAuto();
    if (saved) { setGs({ ...saved.state, phase: 'WORLD' }); notify('Game loaded.'); }
  }, [notify]);

  // shell props — memoized so WalletBar effects don't fire on every render
  const shellProps = React.useMemo(() => ({
    player,
    notification,
    onWalletConnect: handleWalletConnect,
    onWalletDisconnect: handleWalletDisconnect,
    onWalletBalanceUpdate: handleWalletBalanceUpdate,
    onOpenSaveLoad: () => goTo('SAVE_LOAD'),
    onOpenSkillTree: () => goTo('SKILL_TREE'),
  }), [player, notification, handleWalletConnect, handleWalletDisconnect, handleWalletBalanceUpdate, goTo]);

  // ── RENDER ────────────────────────────────────────────────────────────────

  if (gs.phase === 'CHARACTER_CREATION') {
    return <CharacterCreation onComplete={handleCharacterCreated} />;
  }

  if (gs.phase === 'STORY') {
    return (
      <GameShell {...shellProps}>
        <StoryView
          nodeId={gs.storyNodeId}
          flags={gs.storyFlags}
          onChoice={handleStoryChoice}
          onOpenWorld={() => goTo('WORLD')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'WORLD') {
    return (
      <GameShell {...shellProps}>
        <WorldView
          party={gs.party}
          onEnterArea={handleEnterArea}
          onOpenQuestBoard={areaId => setGs(prev => ({ ...prev, phase: 'QUEST_BOARD', activeAreaId: areaId }))}
          onOpenMarket={area => { setActiveArea(area); goTo('MARKET'); }}
          onOpenBlacksmith={area => { setActiveArea(area); goTo('BLACKSMITH'); }}
          onOpenSafeHub={area => { setActiveArea(area); goTo('SAFE_HUB'); }}
          onOpenStory={() => goTo('STORY')}
          onOpenSkillTree={() => goTo('SKILL_TREE')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'QUEST_BOARD' && gs.activeAreaId) {
    return (
      <GameShell {...shellProps}>
        <QuestBoard
          areaId={gs.activeAreaId}
          activeQuests={gs.quests}
          playerLevel={player?.level ?? 1}
          onAcceptQuest={handleAcceptQuest}
          onBack={() => goTo('WORLD')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'MARKET' && activeArea) {
    return (
      <GameShell {...shellProps}>
        <MarketView
          area={activeArea}
          player={player}
          walletAethBalance={gs.walletAethBalance}
          isBlacksmith={false}
          onBuy={handleBuy}
          onBack={() => goTo('WORLD')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'BLACKSMITH' && activeArea) {
    return (
      <GameShell {...shellProps}>
        <MarketView
          area={activeArea}
          player={player}
          walletAethBalance={gs.walletAethBalance}
          isBlacksmith={true}
          onBuy={handleBuy}
          onBack={() => goTo('WORLD')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'SAFE_HUB' && activeArea) {
    return (
      <GameShell {...shellProps}>
        <SafeHubView
          area={activeArea}
          player={player}
          onRest={handleRest}
          onHeal={handleHeal}
          onBack={() => goTo('WORLD')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'SKILL_TREE') {
    return (
      <GameShell {...shellProps}>
        <SkillTreeView
          player={player}
          walletAethBalance={gs.walletAethBalance}
          unlockedSkills={gs.unlockedSkills}
          onUnlock={handleSkillUnlock}
          onBack={() => goTo('WORLD')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'SAVE_LOAD') {
    return (
      <GameShell {...shellProps}>
        <SaveLoadScreen
          currentState={gs}
          onLoad={handleLoadState}
          onBack={() => goTo(gs.party.length > 0 ? 'WORLD' : 'LANDING')}
        />
      </GameShell>
    );
  }

  if (gs.phase === 'COMBAT') {
    return (
      <GameShell {...shellProps}>
        <main className="flex min-h-screen flex-col items-center justify-center p-8 font-mono bg-black text-aethrix-gold overflow-hidden">
          <CombatView
            party={gs.party}
            enemies={gs.enemies}
            onCombatEnd={handleCombatEnd}
          />
        </main>
      </GameShell>
    );
  }

  // ── LANDING ───────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen bg-black text-white font-mono selection:bg-aethrix-gold selection:text-black">
      <div className="fixed inset-0 z-0">
        <Image src="/images/aethrix-banner.png" alt="Aethrix" fill className="object-cover opacity-40 brightness-50" priority />
        <div className="absolute inset-0 vignette" />
        <div className="absolute inset-0 gritty-overlay" />
        <div className="scanline" />
      </div>

      <nav className="relative z-50 flex justify-between items-center px-8 py-6 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-aethrix-gold flex items-center justify-center font-bold text-aethrix-gold bg-black">A</div>
          <span className="text-xl font-bold tracking-[0.3em] uppercase terminal-text">Aethrix</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[10px] tracking-widest uppercase text-gray-400">
          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-aethrix-gold transition-colors">Buy AETH</a>
          <a href={AETH_TOKEN.dexUrl} target="_blank" rel="noopener noreferrer" className="hover:text-aethrix-gold transition-colors">Chart</a>
          <a href={AETH_TOKEN.jupiterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-aethrix-cyan transition-colors">Jupiter</a>
          <span className="text-gray-800 text-[8px] font-mono">{AETH_TOKEN.contract}</span>
        </div>
        <div className="flex gap-3">
          {saveExists && (
            <button onClick={handleContinue}
              className="px-4 py-2 border border-gray-600 text-[10px] tracking-widest hover:border-aethrix-cyan hover:text-aethrix-cyan transition-all">
              CONTINUE
            </button>
          )}
          <button onClick={handleNewGame}
            className="px-6 py-2 border border-aethrix-gold text-[10px] tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
            NEW GAME
          </button>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-8 text-center pt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="max-w-4xl">
          <Logo className="mb-12 scale-125" />
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 terminal-text">Tiena-Nueble</h1>
          <p className="text-aethrix-gold text-lg md:text-xl tracking-[0.4em] uppercase font-light mb-4 glow-cyan">The One World Government</p>

          {/* Token CA display */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <span className="text-gray-600 text-[10px] uppercase tracking-widest">AETH Token</span>
            <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
              className="text-aethrix-gold text-[10px] font-mono hover:underline">
              {AETH_TOKEN.contract}
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-left mb-16">
            {[
              { label: '3 Continents', sub: '15 areas · markets · blacksmiths', color: 'border-aethrix-gold' },
              { label: '9 Main Quests', sub: 'Full branching storyline · 3 endings', color: 'border-aethrix-cyan' },
              { label: 'AETH Economy', sub: 'Real Phantom wallet · skill tree · items', color: 'border-purple-500' },
            ].map(f => (
              <div key={f.label} className={`border-l-2 ${f.color} pl-4 py-2 bg-black/40`}>
                <div className="font-bold uppercase tracking-widest text-sm">{f.label}</div>
                <div className="text-gray-500 text-xs mt-1">{f.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={handleNewGame}
              className="px-12 py-4 bg-aethrix-gold text-black font-black uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1">
              Begin the Chronicle
            </button>
            {saveExists && (
              <button onClick={handleContinue}
                className="px-12 py-4 border border-aethrix-gold text-aethrix-gold font-black uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
                Continue
              </button>
            )}
          </div>
        </motion.div>
      </section>

      <footer className="relative z-10 py-12 px-8 border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-600 text-[10px] uppercase tracking-widest">
            © 2026 Tiena-Nueble High Command
          </p>
          <div className="flex items-center gap-2 border border-gray-800 px-4 py-2">
            <span className="text-[9px] text-gray-600 uppercase">AETH</span>
            <span className="text-[9px] text-aethrix-gold/60 font-mono">{AETH_TOKEN.contract}</span>
          </div>
          <div className="flex gap-6">
            <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-aethrix-gold hover:underline uppercase">pump.fun</a>
            <a href={AETH_TOKEN.dexUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 hover:text-white uppercase">DexScreener</a>
            <a href={AETH_TOKEN.jupiterUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gray-500 hover:text-aethrix-cyan uppercase">Jupiter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
