"use client";
import { useState, useEffect, useCallback } from 'react';

const AETH_MINT = '6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump';
const DECIMALS  = 6;

// Public RPCs that reliably support getTokenAccountsByOwner
const RPCS = [
  'https://api.mainnet-beta.solana.com',
  'https://rpc.ankr.com/solana',
  'https://solana-rpc.publicnode.com',
];

export interface PhantomWallet {
  connected: boolean;
  publicKey: string | null;
  aethBalance: number | null;    // human-readable (decimals applied)
  aethRaw: string | null;        // raw integer string from chain
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

// Fetch with a hard timeout so a slow RPC doesn't block
async function fetchWithTimeout(url: string, body: string, ms = 6000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchAethBalance(wallet: string): Promise<{ display: number; raw: string }> {
  const body = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'getTokenAccountsByOwner',
    params: [
      wallet,
      { mint: AETH_MINT },
      { encoding: 'jsonParsed', commitment: 'confirmed' },
    ],
  });

  for (const rpc of RPCS) {
    try {
      const res = await fetchWithTimeout(rpc, body);
      if (!res.ok) continue;

      const json = await res.json();
      if (json.error) continue;

      const accounts: unknown[] = json?.result?.value ?? [];

      // No token account = wallet holds 0 of this token
      if (accounts.length === 0) return { display: 0, raw: '0' };

      const first = accounts[0] as {
        account: {
          data: {
            parsed: {
              info: {
                tokenAmount: {
                  amount: string;
                  decimals: number;
                  uiAmount: number | null;
                  uiAmountString: string;
                };
              };
            };
          };
        };
      };

      const ta = first?.account?.data?.parsed?.info?.tokenAmount;
      if (!ta) continue;

      const raw = ta.amount ?? '0';

      // Prefer uiAmountString (always accurate string) over uiAmount (can be null or float-imprecise)
      let display: number;
      if (ta.uiAmountString && ta.uiAmountString !== '0') {
        display = parseFloat(ta.uiAmountString);
      } else if (ta.uiAmount !== null && ta.uiAmount !== undefined) {
        display = ta.uiAmount;
      } else {
        // Manually apply decimals from raw integer string
        const rawNum = parseInt(raw, 10);
        display = rawNum / Math.pow(10, ta.decimals ?? DECIMALS);
      }

      return { display: Math.round(display * 100) / 100, raw };
    } catch {
      // Timeout or network error — try next RPC
      continue;
    }
  }

  return { display: 0, raw: '0' };
}

export function usePhantom(): PhantomWallet {
  const [connected,   setConnected]   = useState(false);
  const [publicKey,   setPublicKey]   = useState<string | null>(null);
  const [aethBalance, setAethBalance] = useState<number | null>(null);
  const [aethRaw,     setAethRaw]     = useState<string | null>(null);
  const [connecting,  setConnecting]  = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  const applyBalance = useCallback((b: { display: number; raw: string }) => {
    setAethBalance(b.display);
    setAethRaw(b.raw);
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
      const key  = resp.publicKey.toString();
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
    setAethRaw(null);
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
      setAethRaw(null);
    };
    provider.on('disconnect', onDisconnect);
    return () => provider.off('disconnect', onDisconnect);
  }, [applyBalance]);

  return { connected, publicKey, aethBalance, aethRaw, connecting, error, connect, disconnect, refreshBalance };
}
