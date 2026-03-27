"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character } from '@/lib/game/types';
import { SKILL_TREE, SkillNode } from '@/lib/game/skilltree';
import { usePhantom } from '@/hooks/usePhantom';
import { AETH_TOKEN } from '@/lib/game/token';

interface Props {
  player: Character;
  unlockedSkills: string[];
  onUnlock: (node: SkillNode, source: 'wallet' | 'ingame') => void;
  onBack: () => void;
}

const BRANCH_META = {
  aether:   { label: 'Aether',   color: 'border-cyan-500',   text: 'text-cyan-400',   bg: 'bg-cyan-950/30',   ring: 'ring-cyan-500'   },
  combat:   { label: 'Combat',   color: 'border-red-600',    text: 'text-red-400',    bg: 'bg-red-950/30',    ring: 'ring-red-600'    },
  shadow:   { label: 'Shadow',   color: 'border-purple-600', text: 'text-purple-400', bg: 'bg-purple-950/30', ring: 'ring-purple-600' },
  imperial: { label: 'Imperial', color: 'border-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-950/20', ring: 'ring-yellow-500' },
} as const;

type Branch = keyof typeof BRANCH_META;

export default function SkillTreeView({ player, unlockedSkills, onUnlock, onBack }: Props) {
  const wallet = usePhantom();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [activeBranch, setActiveBranch] = useState<Branch>('aether');
  const [confirmNode, setConfirmNode] = useState<{ node: SkillNode; source: 'wallet' | 'ingame' } | null>(null);
  const [copied, setCopied] = useState(false);

  const isUnlocked = (id: string) => unlockedSkills.includes(id);

  const canUnlock = (node: SkillNode): { ok: boolean; reason?: string } => {
    if (isUnlocked(node.id)) return { ok: false, reason: 'Already unlocked' };
    if (!node.dependencies.every(d => isUnlocked(d))) return { ok: false, reason: 'Unlock prerequisites first' };
    return { ok: true };
  };

  const canAffordWallet = (node: SkillNode) =>
    wallet.connected && wallet.aethBalance !== null && wallet.aethBalance >= node.aethCost;

  const canAffordIngame = (node: SkillNode) => player.aethBalance >= node.aethCost;

  const branchNodes = SKILL_TREE.filter(n => n.branch === activeBranch).sort((a, b) => a.tier - b.tier);
  const totalSpent = SKILL_TREE.filter(n => isUnlocked(n.id)).reduce((s, n) => s + n.aethCost, 0);

  const copyCA = () => {
    navigator.clipboard.writeText(AETH_TOKEN.contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    if (!confirmNode) return;
    onUnlock(confirmNode.node, confirmNode.source);
    setConfirmNode(null);
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">

      {/* ── Token Banner ─────────────────────────────────────────── */}
      <div className="bg-black border-b border-aethrix-gold/30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-aethrix-gold font-black text-lg tracking-widest">AETH</span>
            <span className="text-gray-600 text-xs ml-2">Aethrix Token · Solana</span>
          </div>
          <div className="flex items-center gap-2 border border-gray-800 px-3 py-1">
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">CA</span>
            <span className="text-[10px] text-aethrix-gold font-mono">{AETH_TOKEN.contract}</span>
            <button onClick={copyCA} className="text-[9px] text-gray-600 hover:text-aethrix-gold transition-colors ml-1">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
            className="border border-aethrix-gold px-3 py-1 text-[9px] uppercase text-aethrix-gold hover:bg-aethrix-gold hover:text-black transition-all">
            Buy on pump.fun ↗
          </a>
          <a href={AETH_TOKEN.dexUrl} target="_blank" rel="noopener noreferrer"
            className="border border-gray-700 px-3 py-1 text-[9px] uppercase text-gray-400 hover:border-aethrix-cyan hover:text-aethrix-cyan transition-all">
            DexScreener ↗
          </a>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
            <div>
              <div className="text-aethrix-gold text-[10px] tracking-widest uppercase">Aethrix Power System</div>
              <h1 className="text-2xl font-black uppercase tracking-widest terminal-text">Skill Tree</h1>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-aethrix-gold font-bold">{unlockedSkills.length}</span>/{SKILL_TREE.length} unlocked
            <span className="ml-3 text-gray-700">{totalSpent} AETH spent</span>
          </div>
        </div>

        {/* ── Wallet Panel ─────────────────────────────────────────── */}
        <div className={`border mb-6 p-4 transition-all ${wallet.connected ? 'border-green-800 bg-green-950/10' : 'border-gray-800 bg-gray-950/50'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">

            {/* Left: connection status */}
            <div className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${wallet.connected ? 'bg-green-400 shadow-[0_0_6px_#4ade80]' : 'bg-gray-700'}`} />
              <div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">Phantom Wallet</div>
                {wallet.connected && wallet.publicKey ? (
                  <div className="text-xs text-white font-mono">
                    {wallet.publicKey.slice(0, 8)}...{wallet.publicKey.slice(-6)}
                  </div>
                ) : (
                  <div className="text-xs text-gray-600">Not connected</div>
                )}
              </div>

              {/* Wallet AETH balance */}
              {wallet.connected && (
                <div className="border-l border-gray-800 pl-4">
                  <div className="text-[10px] text-gray-500 uppercase mb-0.5">
                    Wallet AETH
                    <span className="ml-1 text-gray-700 normal-case">({AETH_TOKEN.contract.slice(0,6)}...)</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-aethrix-gold font-bold text-base">
                      {wallet.aethBalance === null ? (
                        <span className="text-gray-600 text-xs animate-pulse">Loading...</span>
                      ) : (
                        wallet.aethBalance.toLocaleString()
                      )}
                    </span>
                    <span className="text-gray-600 text-[9px]">AETH</span>
                  </div>
                </div>
              )}

              {/* In-game AETH balance */}
              <div className={`${wallet.connected ? 'border-l border-gray-800 pl-4' : ''}`}>
                <div className="text-[10px] text-gray-500 uppercase mb-0.5">In-Game AETH</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-aethrix-gold font-bold text-base">{player.aethBalance.toLocaleString()}</span>
                  <span className="text-gray-600 text-[9px]">AETH</span>
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {wallet.error && (
                <div className="text-red-400 text-[10px] border border-red-900 px-2 py-1 max-w-[220px]">
                  {wallet.error}
                </div>
              )}
              {!wallet.connected ? (
                <button onClick={wallet.connect} disabled={wallet.connecting}
                  className="border border-aethrix-gold px-5 py-2 text-[10px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all disabled:opacity-40">
                  {wallet.connecting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">◌</span> Connecting...
                    </span>
                  ) : 'Connect Phantom'}
                </button>
              ) : (
                <>
                  <button onClick={wallet.refreshBalance}
                    className="border border-gray-700 px-3 py-2 text-[10px] uppercase hover:border-aethrix-cyan hover:text-aethrix-cyan transition-all">
                    ↻ Refresh
                  </button>
                  <button onClick={wallet.disconnect}
                    className="border border-gray-700 px-3 py-2 text-[10px] uppercase hover:border-red-600 hover:text-red-400 transition-all">
                    Disconnect
                  </button>
                </>
              )}
              <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
                className="border border-aethrix-gold/50 px-3 py-2 text-[10px] uppercase text-aethrix-gold hover:bg-aethrix-gold hover:text-black transition-all">
                Get AETH ↗
              </a>
            </div>
          </div>

          {/* CA row always visible */}
          <div className="mt-3 pt-3 border-t border-gray-900 flex items-center gap-3">
            <span className="text-[9px] text-gray-600 uppercase tracking-widest">Token Contract</span>
            <span className="text-[10px] text-aethrix-gold/70 font-mono">{AETH_TOKEN.contract}</span>
            <button onClick={copyCA} className="text-[9px] border border-gray-800 px-2 py-0.5 hover:border-aethrix-gold hover:text-aethrix-gold transition-all">
              {copied ? '✓ Copied' : 'Copy CA'}
            </button>
            <span className="text-[9px] text-gray-700">· Solana · pump.fun</span>
          </div>
        </div>

        {/* ── Branch Tabs ──────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(Object.keys(BRANCH_META) as Branch[]).map(branch => {
            const meta = BRANCH_META[branch];
            const done = SKILL_TREE.filter(n => n.branch === branch && isUnlocked(n.id)).length;
            const total = SKILL_TREE.filter(n => n.branch === branch).length;
            const pct = Math.round((done / total) * 100);
            return (
              <button key={branch} onClick={() => { setActiveBranch(branch); setSelectedNode(null); }}
                className={`border py-3 px-4 text-left transition-all relative overflow-hidden ${activeBranch === branch ? `${meta.color} ${meta.bg}` : 'border-gray-800 hover:border-gray-600'}`}>
                {/* Progress bar */}
                <div className={`absolute bottom-0 left-0 h-0.5 transition-all ${activeBranch === branch ? meta.color.replace('border-', 'bg-') : 'bg-gray-800'}`}
                  style={{ width: `${pct}%` }} />
                <div className={`text-[10px] font-bold uppercase tracking-widest ${activeBranch === branch ? meta.text : 'text-gray-500'}`}>
                  {meta.label}
                </div>
                <div className="text-[8px] text-gray-600 mt-1">{done}/{total} · {pct}%</div>
              </button>
            );
          })}
        </div>

        {/* ── Main Grid ────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Skill Nodes */}
          <div className="space-y-2">
            {branchNodes.map((node, i) => {
              const unlocked = isUnlocked(node.id);
              const { ok, reason } = canUnlock(node);
              const meta = BRANCH_META[node.branch];
              return (
                <motion.button key={node.id}
                  initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  className={`w-full text-left border p-4 transition-all ${
                    unlocked ? `${meta.color} ${meta.bg}` :
                    ok ? 'border-gray-700 hover:border-gray-500 hover:bg-white/5' :
                    'border-gray-900 opacity-40'
                  } ${selectedNode?.id === node.id ? `ring-1 ${meta.ring}` : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] border px-1 ${meta.color} ${meta.text}`}>T{node.tier}</span>
                      <span className={`font-bold text-sm ${unlocked ? meta.text : ok ? 'text-white' : 'text-gray-600'}`}>
                        {node.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {unlocked
                        ? <span className="text-[9px] text-green-400">✓ UNLOCKED</span>
                        : !ok
                          ? <span className="text-[9px] text-gray-700">🔒 {reason}</span>
                          : null
                      }
                      <span className={`text-[10px] font-bold ${unlocked ? 'text-gray-600 line-through' : 'text-aethrix-gold'}`}>
                        {node.aethCost} AETH
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{node.description}</p>
                  {node.abilityUnlock && (
                    <div className={`text-[9px] mt-1 ${unlocked ? meta.text : 'text-gray-700'}`}>
                      ★ {node.abilityUnlock}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Detail Panel */}
          <div className="sticky top-6 space-y-4">
            <AnimatePresence mode="wait">
              {selectedNode ? (() => {
                const node = selectedNode;
                const unlocked = isUnlocked(node.id);
                const { ok, reason } = canUnlock(node);
                const meta = BRANCH_META[node.branch];
                const affordWallet = canAffordWallet(node);
                const affordIngame = canAffordIngame(node);

                return (
                  <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={`border p-6 ${unlocked ? `${meta.color} ${meta.bg}` : 'border-gray-700'}`}>

                    <div className={`text-[8px] border px-1 uppercase inline-block mb-3 ${meta.color} ${meta.text}`}>
                      {meta.label} · Tier {node.tier}
                    </div>
                    <h2 className={`text-xl font-black uppercase mb-2 ${unlocked ? meta.text : 'text-white'}`}>{node.name}</h2>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{node.description}</p>

                    {/* Stat bonuses */}
                    {node.statBonus && Object.keys(node.statBonus).length > 0 && (
                      <div className="mb-4">
                        <div className={`text-[9px] uppercase tracking-widest mb-2 ${meta.text}`}>Stat Bonuses</div>
                        <div className="grid grid-cols-4 gap-1">
                          {Object.entries(node.statBonus).map(([s, v]) => (
                            <div key={s} className="border border-gray-800 px-2 py-1 text-center">
                              <div className="text-[8px] text-gray-600">{s}</div>
                              <div className="text-green-400 text-xs font-bold">+{v}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(node.hpBonus || node.mpBonus) && (
                      <div className="flex gap-4 mb-4">
                        {node.hpBonus && <div className="text-xs border border-red-900 px-2 py-1"><span className="text-red-400">HP</span> <span className="text-green-400 font-bold">+{node.hpBonus}</span></div>}
                        {node.mpBonus && <div className="text-xs border border-cyan-900 px-2 py-1"><span className="text-cyan-400">MP</span> <span className="text-green-400 font-bold">+{node.mpBonus}</span></div>}
                      </div>
                    )}

                    {node.abilityUnlock && (
                      <div className={`border ${meta.color} ${meta.bg} p-2 mb-4 text-xs ${meta.text}`}>
                        ★ Unlocks Ability: <span className="font-bold">{node.abilityUnlock}</span>
                      </div>
                    )}

                    {/* Dependencies */}
                    {node.dependencies.length > 0 && (
                      <div className="mb-4">
                        <div className="text-[9px] text-gray-600 uppercase tracking-widest mb-1">Prerequisites</div>
                        {node.dependencies.map(dep => {
                          const depNode = SKILL_TREE.find(n => n.id === dep);
                          return (
                            <div key={dep} className={`text-[10px] flex items-center gap-1 ${isUnlocked(dep) ? 'text-green-400' : 'text-red-500'}`}>
                              {isUnlocked(dep) ? '✓' : '✗'} {depNode?.name ?? dep}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Cost box */}
                    <div className="border border-gray-800 p-3 mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[9px] text-gray-600 uppercase mb-1">Cost</div>
                        <div className="text-aethrix-gold font-bold text-xl">{node.aethCost} AETH</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[9px] text-gray-600 uppercase mb-1">Token</div>
                        <div className="text-[9px] text-aethrix-gold/60 font-mono">{AETH_TOKEN.contract.slice(0,8)}...</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {unlocked ? (
                      <div className={`border ${meta.color} py-3 text-center text-sm ${meta.text} font-bold uppercase tracking-widest`}>
                        ✓ Skill Unlocked
                      </div>
                    ) : !ok ? (
                      <div className="border border-gray-800 py-3 text-center text-xs text-gray-600 uppercase">{reason}</div>
                    ) : (
                      <div className="space-y-2">
                        {/* Wallet AETH */}
                        <div>
                          <button onClick={() => setConfirmNode({ node, source: 'wallet' })}
                            disabled={!wallet.connected || !affordWallet}
                            className="w-full border border-aethrix-gold py-3 text-[10px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            {!wallet.connected
                              ? '🔗 Connect Phantom to use wallet AETH'
                              : !affordWallet
                                ? `Insufficient wallet AETH (have ${wallet.aethBalance ?? 0}, need ${node.aethCost})`
                                : `Unlock with Wallet AETH — ${wallet.aethBalance?.toLocaleString()} available`
                            }
                          </button>
                          {!wallet.connected && (
                            <button onClick={wallet.connect}
                              className="w-full mt-1 border border-aethrix-gold/40 py-2 text-[9px] uppercase text-aethrix-gold/70 hover:border-aethrix-gold hover:text-aethrix-gold transition-all">
                              Connect Phantom Wallet
                            </button>
                          )}
                        </div>

                        {/* In-game AETH */}
                        <button onClick={() => setConfirmNode({ node, source: 'ingame' })}
                          disabled={!affordIngame}
                          className="w-full border border-gray-600 py-3 text-[10px] uppercase tracking-widest hover:border-aethrix-gold hover:text-aethrix-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                          {!affordIngame
                            ? `Insufficient in-game AETH (have ${player.aethBalance}, need ${node.aethCost})`
                            : `Unlock with In-Game AETH — ${player.aethBalance} available`
                          }
                        </button>

                        {/* Get AETH CTA */}
                        {!affordWallet && !affordIngame && (
                          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-between border border-aethrix-gold/40 px-4 py-3 text-[10px] text-aethrix-gold hover:bg-aethrix-gold hover:text-black transition-all group">
                            <span className="uppercase tracking-widest">Buy AETH on pump.fun</span>
                            <span className="font-mono text-[9px] group-hover:text-black">{AETH_TOKEN.contract.slice(0,12)}...</span>
                          </a>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })() : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border border-gray-800 p-8 text-center">
                  <div className="text-gray-700 text-sm mb-4">Select a skill to view details</div>
                  <div className="text-[9px] text-gray-800 font-mono">{AETH_TOKEN.contract}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Confirm Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmNode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
              className="bg-black border border-aethrix-gold p-8 max-w-md w-full">

              <div className="text-aethrix-gold text-[10px] uppercase tracking-widest mb-1">Confirm Skill Unlock</div>
              <h2 className="text-2xl font-black uppercase mb-1">{confirmNode.node.name}</h2>
              <div className={`text-[9px] uppercase mb-6 ${BRANCH_META[confirmNode.node.branch].text}`}>
                {BRANCH_META[confirmNode.node.branch].label} Branch · Tier {confirmNode.node.tier}
              </div>

              <div className="border border-gray-800 p-4 mb-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Cost</span>
                  <span className="text-aethrix-gold font-bold">{confirmNode.node.aethCost} AETH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Source</span>
                  <span className="text-white font-bold capitalize">
                    {confirmNode.source === 'wallet' ? '🔗 Phantom Wallet' : '🎮 In-Game Balance'}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Token</span>
                  <span className="text-aethrix-gold/60 font-mono text-[9px]">{AETH_TOKEN.contract}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Balance after</span>
                  <span className="text-white font-bold">
                    {confirmNode.source === 'wallet'
                      ? `${((wallet.aethBalance ?? 0) - confirmNode.node.aethCost).toLocaleString()} AETH`
                      : `${player.aethBalance - confirmNode.node.aethCost} AETH`
                    }
                  </span>
                </div>
              </div>

              {confirmNode.source === 'wallet' && (
                <div className="border border-yellow-900/50 bg-yellow-950/20 p-3 mb-4 text-[9px] text-yellow-500 leading-relaxed">
                  Your real Phantom wallet AETH balance is verified on-chain via the Solana RPC.
                  The deduction is tracked in-game — no on-chain transaction is sent.
                  To spend real AETH, use the in-game economy or visit pump.fun.
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleConfirm}
                  className="flex-1 bg-aethrix-gold text-black font-black uppercase py-3 text-sm hover:bg-white transition-all">
                  Confirm Unlock
                </button>
                <button onClick={() => setConfirmNode(null)}
                  className="flex-1 border border-gray-700 py-3 text-sm uppercase hover:border-gray-500 transition-all">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
