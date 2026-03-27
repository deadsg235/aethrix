"use client";
import { useState, useEffect, useCallback } from 'react';
import { AETH_TOKEN } from '@/lib/game/token';

export interface PhantomWallet {
  connected: boolean;
  publicKey: string | null;
  aethBalance: number | null;
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
}

const RPC = 'https://api.mainnet-beta.solana.com';

async function getAethBalance(walletAddress: string): Promise<number> {
  try {
    const res = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          { mint: AETH_TOKEN.contract },
          { encoding: 'jsonParsed' },
        ],
      }),
    });
    const json = await res.json();
    const accounts: unknown[] = json?.result?.value ?? [];
    if (accounts.length === 0) return 0;
    const first = accounts[0] as { account: { data: { parsed: { info: { tokenAmount: { uiAmount: number } } } } } };
    return Math.floor(first?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0);
  } catch {
    return 0;
  }
}

type SolanaProvider = {
  isPhantom?: boolean;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, cb: () => void) => void;
  off: (event: string, cb: () => void) => void;
};

function getProvider(): SolanaProvider | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { phantom?: { solana?: SolanaProvider } };
  return w?.phantom?.solana ?? null;
}

export function usePhantom(): PhantomWallet {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [aethBalance, setAethBalance] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    const bal = await getAethBalance(publicKey);
    setAethBalance(bal);
  }, [publicKey]);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setError('Phantom not found. Install at phantom.app');
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const resp = await provider.connect({ onlyIfTrusted: false });
      const key = resp.publicKey.toString();
      setPublicKey(key);
      setConnected(true);
      setAethBalance(await getAethBalance(key));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Connection failed');
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    const provider = getProvider();
    if (provider) await provider.disconnect();
    setConnected(false);
    setPublicKey(null);
    setAethBalance(null);
  }, []);

  // Auto-reconnect if previously trusted
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;
    provider.connect({ onlyIfTrusted: true })
      .then(async (resp) => {
        const key = resp.publicKey.toString();
        setPublicKey(key);
        setConnected(true);
        setAethBalance(await getAethBalance(key));
      })
      .catch(() => {});

    const onDisconnect = () => { setConnected(false); setPublicKey(null); setAethBalance(null); };
    provider.on('disconnect', onDisconnect);
    return () => provider.off('disconnect', onDisconnect);
  }, []);

  return { connected, publicKey, aethBalance, connecting, error, connect, disconnect, refreshBalance };
}
