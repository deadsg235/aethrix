export const AETH_TOKEN = {
  symbol: 'AETH',
  name: 'Aethrix Token',
  contract: '6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
  network: 'Solana',
  decimals: 6,
  buyUrl: 'https://pump.fun/coin/6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
  dexUrl: 'https://dexscreener.com/solana/6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
  jupiterUrl: 'https://jup.ag/swap/SOL-6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
  solscanUrl: 'https://solscan.io/token/6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
};

export const STARTING_AETH = 50;
export const STARTING_GOLD = 500;

export function formatAeth(amount: number): string {
  return `${amount.toLocaleString()} AETH`;
}

export function canAffordAeth(balance: number, cost: number): boolean {
  return balance >= cost;
}

export function canAffordGold(gold: number, cost: number): boolean {
  return gold >= cost;
}
