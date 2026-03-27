export const AETH_TOKEN = {
  symbol: 'AETH',
  name: 'Aethrix Token',
  contract: '6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
  network: 'Solana',
  buyUrl: 'https://pump.fun/coin/6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
  dexUrl: 'https://dexscreener.com/solana/6MevaibDFB4qgLvdhrPSkmrSjGadaJeSWDQZW8tQpump',
};

/** Starting AETH balance for new players */
export const STARTING_AETH = 50;

/** Starting gold for new players */
export const STARTING_GOLD = 500;

export function formatAeth(amount: number): string {
  return `${amount} AETH`;
}

export function canAffordAeth(balance: number, cost: number): boolean {
  return balance >= cost;
}

export function canAffordGold(gold: number, cost: number): boolean {
  return gold >= cost;
}
