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
  aether:   { label: 'Aether',   color: 'border-cyan-500',   text: 'text-cyan-400',   bg: 'bg-cyan-950/30',   glow: 'shadow-cyan-500/20'   },
  combat:   { label: 'Combat',   color: 'border-red-600',    text: 'text-red-400',    bg: 'bg-red-950/30',    glow: 'shadow-red-500/20'    },
  shadow:   { label: 'Shadow',   color: 'border-purple-600', text: 'text-purple-400', bg: 'bg-purple-950/30', glow: 'shadow-purple-500/20' },
  imperial: { label: 'Imperial', color: 'border-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-950/20', glow: 'shadow-yellow-500/20' },
} as const;

type Branch = keyof typeof BRANCH_META;

export default function SkillTreeView({ player, unlockedSkills, onUnlock, onBack }: Props) {
  const wallet = usePhantom();
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);
  const [activeBranch, setActiveBranch] = useState<Branch>('aether');
  const [confirmNode, setConfirmNode] = useState<{ node: SkillNode; source: 'wallet' | 'ingame' } | null>(null);

  const isUnlocked = (id: string) => unlockedSkills.includes(id);

  const canUnlock = (node: SkillNode): { ok: boolean; reason?: string } => {
    if (isUnlocked(node.id)) return { ok: false, reason: 'Already unlocked' };
    const depsOk = node.dependencies.every(d => isUnlocked(d));
    if (!depsOk) return { ok: false, reason: 'Unlock prerequisites first' };
    return { ok: true };
  };

  const canAffordWallet = (node: SkillNode) =>
    wallet.connected && wallet.aethBalance !== null && wallet.aethBalance >= node.aethCost;

  const canAffordIngame = (node: SkillNode) =>
    player.aethBalance >= node.aethCost;

  const branchNodes = SKILL_TREE.filter(n => n.branch === activeBranch)
    .sort((a, b) => a.tier - b.tier);

  const handleConfirm = () => {
    if (!confirmNode) return;
    onUnlock(confirmNode.node, confirmNode.source);
    setConfirmNode(null);
    setSelectedNode(null);
  };

  const totalSpent = SKILL_TREE
    .filter(n => isUnlocked(n.id))
    .reduce((sum, n) => sum + n.aethCost, 0);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-500 hover:text-white text-[10px] uppercase">← Back</button>
            <div>
              <div className="text-aethrix-gold text-[10px] tracking-widest uppercase">Aethrix Power System</div>
              <h1 className="text-2xl font-black uppercase tracking-widest terminal-text">Skill Tree</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500">
              <span className="text-aethrix-gold font-bold">{unlockedSkills.length}</span> / {SKILL_TREE.length} unlocked
              <span className="ml-3 text-gray-700">({totalSpent} AETH spent)</span>
            </div>
          </div>
        </div>

        {/* Wallet Panel */}
        <div className={`border mb-6 p-4 flex items-center justify-between ${wallet.connected ? 'border-green-800 bg-green-950/20' : 'border-gray-800'}`}>
          <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${wallet.connected ? 'bg-green-400' : 'bg-gray-600'}`} />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500">Phantom Wallet</div>
              {wallet.connected && wallet.publicKey ? (
                <div className="text-xs text-white font-mono">
                  {wallet.publicKey.slice(0, 6)}...{wallet.publicKey.slice(-4)}
                </div>
              ) : (
                <div className="text-xs text-gray-600">Not connected</div>
              )}
            </div>
            {wallet.connected && (
              <div className="border-l border-gray-800 pl-4">
                <div className="text-[10px] text-gray-500 uppercase">Wallet AETH</div>
                <div className="text-aethrix-gold font-bold text-sm">
                  {wallet.aethBalance === null ? '...' : wallet.aethBalance.toLocaleString()}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="border-r border-gray-800 pr-4">
              <div className="text-[10px] text-gray-500 uppercase">In-Game AETH</div>
              <div className="text-aethrix-gold font-bold text-sm">{player.aethBalance}</div>
            </div>
            {wallet.error && <div className="text-red-400 text-[10px] max-w-[200px]">{wallet.error}</div>}
            {!wallet.connected ? (
              <button onClick={wallet.connect} disabled={wallet.connecting}
                className="border border-aethrix-gold px-4 py-2 text-[10px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all disabled:opacity-50">
                {wallet.connecting ? 'Connecting...' : 'Connect Phantom'}
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={wallet.refreshBalance}
                  className="border border-gray-700 px-3 py-2 text-[10px] uppercase hover:border-aethrix-cyan transition-all">
                  Refresh
                </button>
                <button onClick={wallet.disconnect}
                  className="border border-gray-700 px-3 py-2 text-[10px] uppercase hover:border-red-600 hover:text-red-400 transition-all">
                  Disconnect
                </button>
              </div>
            )}
            <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
              className="border border-aethrix-gold/40 px-3 py-2 text-[10px] uppercase text-aethrix-gold hover:bg-aethrix-gold hover:text-black transition-all">
              Buy AETH ↗
            </a>
          </div>
        </div>

        {/* Branch Tabs */}
        <div className="flex gap-2 mb-6">
          {(Object.keys(BRANCH_META) as Branch[]).map(branch => {
            const meta = BRANCH_META[branch];
            const branchUnlocked = SKILL_TREE.filter(n => n.branch === branch && isUnlocked(n.id)).length;
            const branchTotal = SKILL_TREE.filter(n => n.branch === branch).length;
            return (
              <button key={branch} onClick={() => setActiveBranch(branch)}
                className={`flex-1 border py-3 text-[10px] uppercase tracking-widest transition-all ${activeBranch === branch ? `${meta.color} ${meta.bg} ${meta.text}` : 'border-gray-800 text-gray-600 hover:border-gray-600'}`}>
                <div className="font-bold">{meta.label}</div>
                <div className="text-[8px] mt-1 opacity-60">{branchUnlocked}/{branchTotal}</div>
              </button>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Skill Nodes */}
          <div className="space-y-3">
            {branchNodes.map((node, i) => {
              const unlocked = isUnlocked(node.id);
              const { ok, reason } = canUnlock(node);
              const meta = BRANCH_META[node.branch];
              return (
                <motion.button key={node.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedNode(node)}
                  className={`w-full text-left border p-4 transition-all relative ${
                    unlocked ? `${meta.color} ${meta.bg} shadow-lg ${meta.glow}` :
                    ok ? 'border-gray-700 hover:border-gray-500 hover:bg-white/5' :
                    'border-gray-900 opacity-50 cursor-not-allowed'
                  } ${selectedNode?.id === node.id ? 'ring-1 ring-white/20' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] border px-1 uppercase ${meta.color} ${meta.text}`}>T{node.tier}</span>
                      <span className={`font-bold text-sm ${unlocked ? meta.text : 'text-white'}`}>{node.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {unlocked && <span className="text-[9px] text-green-400">✓ UNLOCKED</span>}
                      {!unlocked && !ok && <span className="text-[9px] text-gray-600">🔒</span>}
                      <span className={`text-[10px] font-bold ${unlocked ? 'text-gray-600' : 'text-aethrix-gold'}`}>
                        {node.aethCost} AETH
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{node.description}</p>
                  {!ok && reason && !unlocked && (
                    <div className="text-[9px] text-gray-700 mt-1">{reason}</div>
                  )}
                  {node.abilityUnlock && (
                    <div className={`text-[9px] mt-1 ${unlocked ? meta.text : 'text-gray-600'}`}>
                      Unlocks: {node.abilityUnlock}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Node Detail Panel */}
          <div className="sticky top-6">
            {selectedNode ? (() => {
              const node = selectedNode;
              const unlocked = isUnlocked(node.id);
              const { ok, reason } = canUnlock(node);
              const meta = BRANCH_META[node.branch];
              const affordWallet = canAffordWallet(node);
              const affordIngame = canAffordIngame(node);

              return (
                <motion.div key={node.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`border p-6 ${unlocked ? `${meta.color} ${meta.bg}` : 'border-gray-700'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[8px] border px-1 uppercase ${meta.color} ${meta.text}`}>
                      {meta.label} · Tier {node.tier}
                    </span>
                  </div>
                  <h2 className={`text-xl font-black uppercase mb-3 ${unlocked ? meta.text : 'text-white'}`}>{node.name}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{node.description}</p>

                  {/* Stat Bonuses */}
                  {node.statBonus && (
                    <div className="mb-4">
                      <div className={`text-[10px] uppercase tracking-widest mb-2 ${meta.text}`}>Stat Bonuses</div>
                      <div className="grid grid-cols-4 gap-1">
                        {Object.entries(node.statBonus).map(([s, v]) => (
                          <div key={s} className="border border-gray-800 px-2 py-1 text-center">
                            <div className="text-[8px] text-gray-500">{s}</div>
                            <div className="text-green-400 text-xs font-bold">+{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(node.hpBonus || node.mpBonus) && (
                    <div className="flex gap-4 mb-4">
                      {node.hpBonus && <div className="text-xs"><span className="text-red-400">HP</span> <span className="text-green-400 font-bold">+{node.hpBonus}</span></div>}
                      {node.mpBonus && <div className="text-xs"><span className="text-cyan-400">MP</span> <span className="text-green-400 font-bold">+{node.mpBonus}</span></div>}
                    </div>
                  )}
                  {node.abilityUnlock && (
                    <div className={`border ${meta.color} p-2 mb-4 text-xs ${meta.text}`}>
                      ★ Unlocks Ability: <span className="font-bold">{node.abilityUnlock}</span>
                    </div>
                  )}

                  {/* Dependencies */}
                  {node.dependencies.length > 0 && (
                    <div className="mb-4">
                      <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Requires</div>
                      {node.dependencies.map(dep => {
                        const depNode = SKILL_TREE.find(n => n.id === dep);
                        return (
                          <div key={dep} className={`text-[10px] flex items-center gap-1 ${isUnlocked(dep) ? 'text-green-400' : 'text-red-400'}`}>
                            <span>{isUnlocked(dep) ? '✓' : '✗'}</span>
                            <span>{depNode?.name ?? dep}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Cost */}
                  <div className="border border-gray-800 p-3 mb-4">
                    <div className="text-[10px] text-gray-500 uppercase mb-2">Cost</div>
                    <div className="text-aethrix-gold font-bold text-lg">{node.aethCost} AETH</div>
                  </div>

                  {/* Unlock Buttons */}
                  {unlocked ? (
                    <div className={`border ${meta.color} py-3 text-center text-sm ${meta.text} font-bold uppercase`}>
                      ✓ Skill Unlocked
                    </div>
                  ) : !ok ? (
                    <div className="border border-gray-800 py-3 text-center text-xs text-gray-600 uppercase">{reason}</div>
                  ) : (
                    <div className="space-y-2">
                      {/* Wallet unlock */}
                      <button
                        onClick={() => setConfirmNode({ node, source: 'wallet' })}
                        disabled={!affordWallet}
                        className="w-full border border-aethrix-gold py-3 text-[10px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                        {wallet.connected
                          ? `Unlock with Wallet AETH (${wallet.aethBalance ?? 0} available)`
                          : 'Connect Phantom to use wallet AETH'}
                      </button>
                      {/* In-game unlock */}
                      <button
                        onClick={() => setConfirmNode({ node, source: 'ingame' })}
                        disabled={!affordIngame}
                        className="w-full border border-gray-600 py-3 text-[10px] uppercase tracking-widest hover:border-aethrix-gold hover:text-aethrix-gold transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                        Unlock with In-Game AETH ({player.aethBalance} available)
                      </button>
                      {!affordWallet && !affordIngame && (
                        <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
                          className="block text-center border border-aethrix-gold/30 py-2 text-[9px] text-aethrix-gold uppercase hover:bg-aethrix-gold hover:text-black transition-all">
                          Get AETH on pump.fun ↗
                        </a>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })() : (
              <div className="border border-gray-800 p-6 text-gray-600 text-sm text-center h-48 flex items-center justify-center">
                Select a skill node to view details
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmNode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
              className="bg-black border border-aethrix-gold p-8 max-w-md w-full">
              <div className="text-aethrix-gold text-[10px] uppercase tracking-widest mb-2">Confirm Unlock</div>
              <h2 className="text-xl font-black uppercase mb-4">{confirmNode.node.name}</h2>
              <p className="text-gray-400 text-sm mb-6">
                Spend <span className="text-aethrix-gold font-bold">{confirmNode.node.aethCost} AETH</span> from your{' '}
                <span className="text-white font-bold">{confirmNode.source === 'wallet' ? 'Phantom wallet' : 'in-game balance'}</span> to unlock this skill?
              </p>
              {confirmNode.source === 'wallet' && (
                <div className="border border-yellow-900 bg-yellow-950/20 p-3 mb-4 text-[10px] text-yellow-400">
                  ⚠ Wallet AETH deduction is tracked in-game. Real on-chain transactions are not processed — your wallet balance is read-only for verification.
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={handleConfirm}
                  className="flex-1 bg-aethrix-gold text-black font-black uppercase py-3 text-sm hover:bg-white transition-all">
                  Confirm
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
