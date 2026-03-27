"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Character } from '@/lib/game/types';
import { usePhantom } from '@/hooks/usePhantom';
import { AETH_TOKEN } from '@/lib/game/token';

interface Props {
  player: Character | undefined;
  onWalletConnect: (publicKey: string, balance: number) => void;
  onWalletDisconnect: () => void;
  onWalletBalanceUpdate: (balance: number) => void;
  onOpenSaveLoad: () => void;
  onOpenSkillTree: () => void;
}

export default function WalletBar({
  player,
  onWalletConnect,
  onWalletDisconnect,
  onWalletBalanceUpdate,
  onOpenSaveLoad,
  onOpenSkillTree,
}: Props) {
  const wallet = usePhantom();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync wallet state up to game engine
  React.useEffect(() => {
    if (wallet.connected && wallet.publicKey && wallet.aethBalance !== null) {
      onWalletConnect(wallet.publicKey, wallet.aethBalance);
    }
  }, [wallet.connected, wallet.publicKey, wallet.aethBalance]);

  React.useEffect(() => {
    if (!wallet.connected) onWalletDisconnect();
  }, [wallet.connected]);

  React.useEffect(() => {
    if (wallet.aethBalance !== null) onWalletBalanceUpdate(wallet.aethBalance);
  }, [wallet.aethBalance]);

  const copyCA = () => {
    navigator.clipboard.writeText(AETH_TOKEN.contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 border-b border-gray-800 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2 gap-4">

        {/* Left: AETH token identity */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-aethrix-gold font-black text-sm tracking-widest flex-shrink-0">AETH</div>
          <button onClick={copyCA}
            className="hidden md:flex items-center gap-1 border border-gray-800 px-2 py-0.5 hover:border-aethrix-gold/50 transition-all group">
            <span className="text-[8px] text-gray-600 uppercase">CA</span>
            <span className="text-[9px] text-aethrix-gold/60 font-mono group-hover:text-aethrix-gold transition-colors">
              {AETH_TOKEN.contract.slice(0, 8)}...{AETH_TOKEN.contract.slice(-6)}
            </span>
            <span className="text-[8px] text-gray-700 group-hover:text-aethrix-gold transition-colors">
              {copied ? '✓' : '⎘'}
            </span>
          </button>
        </div>

        {/* Center: balances */}
        <div className="flex items-center gap-4">
          {/* Wallet AETH */}
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${wallet.connected ? 'bg-green-400' : 'bg-gray-700'}`} />
            <div className="text-center">
              <div className="text-[8px] text-gray-600 uppercase leading-none">Wallet</div>
              <div className="text-[11px] font-bold text-aethrix-gold leading-none mt-0.5">
                {wallet.connected
                  ? wallet.aethBalance === null
                    ? <span className="text-gray-600 animate-pulse">...</span>
                    : wallet.aethBalance.toLocaleString()
                  : '—'
                }
              </div>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-800" />

          {/* In-game AETH */}
          <div className="text-center">
            <div className="text-[8px] text-gray-600 uppercase leading-none">In-Game</div>
            <div className="text-[11px] font-bold text-aethrix-gold leading-none mt-0.5">
              {player?.aethBalance ?? 0}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-800" />

          {/* Gold */}
          <div className="text-center">
            <div className="text-[8px] text-gray-600 uppercase leading-none">Gold</div>
            <div className="text-[11px] font-bold text-yellow-600 leading-none mt-0.5">
              {player?.gold ?? 0}
            </div>
          </div>

          {/* Level / HP */}
          {player && (
            <>
              <div className="w-px h-6 bg-gray-800" />
              <div className="text-center">
                <div className="text-[8px] text-gray-600 uppercase leading-none">Lv</div>
                <div className="text-[11px] font-bold text-white leading-none mt-0.5">{player.level}</div>
              </div>
              <div className="hidden sm:block">
                <div className="text-[8px] text-gray-600 uppercase leading-none mb-0.5">HP</div>
                <div className="w-20 h-1.5 bg-gray-800 rounded-none overflow-hidden">
                  <div className="h-full bg-red-600 transition-all"
                    style={{ width: `${Math.max(0, (player.hp.current / player.hp.max) * 100)}%` }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {/* Wallet connect/disconnect */}
          {!wallet.connected ? (
            <button onClick={wallet.connect} disabled={wallet.connecting}
              className="border border-aethrix-gold px-3 py-1 text-[9px] uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all disabled:opacity-40 flex-shrink-0">
              {wallet.connecting ? '...' : 'Connect'}
            </button>
          ) : (
            <button onClick={() => setExpanded(!expanded)}
              className="border border-green-800 px-3 py-1 text-[9px] uppercase text-green-400 hover:border-green-600 transition-all flex-shrink-0">
              {wallet.publicKey?.slice(0, 4)}...{wallet.publicKey?.slice(-3)} ▾
            </button>
          )}

          <button onClick={onOpenSkillTree}
            className="border border-purple-800 px-3 py-1 text-[9px] uppercase hover:border-purple-500 hover:text-purple-400 transition-all hidden sm:block">
            Skills
          </button>

          <button onClick={onOpenSaveLoad}
            className="border border-gray-700 px-3 py-1 text-[9px] uppercase hover:border-aethrix-gold hover:text-aethrix-gold transition-all">
            Save
          </button>

          <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
            className="border border-aethrix-gold/30 px-3 py-1 text-[9px] uppercase text-aethrix-gold/70 hover:bg-aethrix-gold hover:text-black transition-all hidden md:block">
            Buy AETH
          </a>
        </div>
      </div>

      {/* Expanded wallet dropdown */}
      <AnimatePresence>
        {expanded && wallet.connected && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800 bg-black overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="text-[9px] text-gray-600 uppercase">Connected Wallet</div>
                <div className="text-xs text-white font-mono">{wallet.publicKey}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-gray-600 uppercase">AETH Token</span>
                  <span className="text-[9px] text-aethrix-gold/60 font-mono">{AETH_TOKEN.contract}</span>
                  <button onClick={copyCA} className="text-[8px] text-gray-700 hover:text-aethrix-gold transition-colors">
                    {copied ? '✓ Copied' : 'Copy CA'}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-center border border-gray-800 px-4 py-2">
                  <div className="text-[9px] text-gray-600 uppercase">On-Chain AETH</div>
                  <div className="text-aethrix-gold font-bold text-lg">{wallet.aethBalance?.toLocaleString() ?? '—'}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button onClick={wallet.refreshBalance}
                    className="border border-gray-700 px-3 py-1 text-[9px] uppercase hover:border-aethrix-cyan hover:text-aethrix-cyan transition-all">
                    ↻ Refresh Balance
                  </button>
                  <button onClick={() => { wallet.disconnect(); setExpanded(false); }}
                    className="border border-gray-700 px-3 py-1 text-[9px] uppercase hover:border-red-600 hover:text-red-400 transition-all">
                    Disconnect
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <a href={AETH_TOKEN.buyUrl} target="_blank" rel="noopener noreferrer"
                    className="border border-aethrix-gold px-3 py-1 text-[9px] uppercase text-aethrix-gold hover:bg-aethrix-gold hover:text-black transition-all text-center">
                    Buy on pump.fun ↗
                  </a>
                  <a href={AETH_TOKEN.dexUrl} target="_blank" rel="noopener noreferrer"
                    className="border border-gray-700 px-3 py-1 text-[9px] uppercase text-gray-500 hover:border-aethrix-cyan hover:text-aethrix-cyan transition-all text-center">
                    DexScreener ↗
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet error */}
      {wallet.error && (
        <div className="border-t border-red-900 bg-red-950/30 px-4 py-1 text-[9px] text-red-400">
          {wallet.error} —{' '}
          <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="underline">
            Install Phantom
          </a>
        </div>
      )}
    </div>
  );
}
