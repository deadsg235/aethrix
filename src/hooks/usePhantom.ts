"use client";
import { useState, useEffect, useCallback } from 'react';

// ── Token constants hardcoded here to avoid circular deps ────────────────────
const AETH_MINT = '6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump';

// Multiple RPCs — tries each in order until one works
const RPCS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-mainnet.g.alchemy.com/v2/demo',
  'https://rpc.ankr.com/solana',
];

export interface PhantomWallet {
  connected: boolean;
  publicKey: string | null;
  aethBalance: number | null;       // raw token units (no decimals applied)
  aethBalanceRaw: string | null;    // exact string from chain
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
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

async function fetchAethBalance(walletAddress: string): Promise<{ display: number; raw: string }> {
  for (const rpc of RPCS) {
    try {
      const res = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountsByOwner',
          params: [
            walletAddress,
            { mint: AETH_MINT },
            { encoding: 'jsonParsed', commitment: 'confirmed' },
          ],
        }),
      });

      if (!res.ok) continue;
      const json = await res.json();

      if (json.error) continue;

      const accounts: unknown[] = json?.result?.value ?? [];
      if (accounts.length === 0) return { display: 0, raw: '0' };

      // pump.fun tokens use 6 decimals
      const first = accounts[0] as {
        account: {
          data: {
            parsed: {
              info: {
                tokenAmount: {
                  amount: string;       // raw integer string
                  decimals: number;
                  uiAmount: number;     // already divided by decimals
                  uiAmountString: string;
                };
              };
            };
          };
        };
      };

      const info = first?.account?.data?.parsed?.info?.tokenAmount;
      if (!info) return { display: 0, raw: '0' };

      const raw = info.amount ?? '0';
      // uiAmount already accounts for decimals — use it directly
      const display = Math.floor(info.uiAmount ?? 0);

      return { display, raw };
    } catch {
      continue;
    }
  }
  return { display: 0, raw: '0' };
}

export function usePhantom(): PhantomWallet {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [aethBalance, setAethBalance] = useState<number | null>(null);
  const [aethBalanceRaw, setAethBalanceRaw] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyBalance = useCallback((b: { display: number; raw: string }) => {
    setAethBalance(b.display);
    setAethBalanceRaw(b.raw);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;
    applyBalance(await fetchAethBalance(publicKey));
  }, [publicKey, applyBalance]);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setError('Phantom not found — install at phantom.app');
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const resp = await provider.connect({ onlyIfTrusted: false });
      const key = resp.publicKey.toString();
      setPublicKey(key);
      setConnected(true);
      applyBalance(await fetchAethBalance(key));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Connection failed');
    } finally {
      setConnecting(false);
    }
  }, [applyBalance]);

  const disconnect = useCallback(async () => {
    const provider = getProvider();
    if (provider) await provider.disconnect().catch(() => {});
    setConnected(false);
    setPublicKey(null);
    setAethBalance(null);
    setAethBalanceRaw(null);
  }, []);

  // Auto-reconnect on mount if previously trusted
  useEffect(() => {
    const provider = getProvider();
    if (!provider) return;

    provider.connect({ onlyIfTrusted: true })
      .then(async (resp) => {
        const key = resp.publicKey.toString();
        setPublicKey(key);
        setConnected(true);
        applyBalance(await fetchAethBalance(key));
      })
      .catch(() => {});

    const onDisconnect = () => {
      setConnected(false);
      setPublicKey(null);
      setAethBalance(null);
      setAethBalanceRaw(null);
    };
    provider.on('disconnect', onDisconnect);
    return () => provider.off('disconnect', onDisconnect);
  }, [applyBalance]);

  return {
    connected,
    publicKey,
    aethBalance,
    aethBalanceRaw,
    connecting,
    error,
    connect,
    disconnect,
    refreshBalance,
  };
}
