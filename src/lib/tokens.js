// Token metadata for the Quote Builder presets.
// Limited to a small set of well-known stablecoins on EVM chains LI.FI Intents covers.

export const TOKEN_META = {
  USDC: { symbol: 'USDC', decimals: 6, label: 'USDC' },
  USDT: { symbol: 'USDT', decimals: 6, label: 'USDT' },
  WETH: { symbol: 'WETH', decimals: 18, label: 'WETH' },
  ETH: { symbol: 'ETH', decimals: 18, label: 'ETH' },
}

// Pair = { fromChainId, fromToken, toChainId, toToken, defaultAmount }
export const ROUTE_PRESETS = [
  {
    id: 'base-arb-usdc',
    label: 'Base → Arbitrum',
    sub: '10 USDC',
    fromChainId: 8453,
    fromTokenSymbol: 'USDC',
    fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    toChainId: 42161,
    toTokenSymbol: 'USDC',
    toTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    amount: '10',
  },
  {
    id: 'op-base-usdc',
    label: 'Optimism → Base',
    sub: '25 USDC',
    fromChainId: 10,
    fromTokenSymbol: 'USDC',
    fromTokenAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    toChainId: 8453,
    toTokenSymbol: 'USDC',
    toTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    amount: '25',
  },
  {
    id: 'arb-eth-usdc',
    label: 'Arbitrum → Ethereum',
    sub: '50 USDC',
    fromChainId: 42161,
    fromTokenSymbol: 'USDC',
    fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    toChainId: 1,
    toTokenSymbol: 'USDC',
    toTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    amount: '50',
  },
  {
    id: 'base-op-usdc',
    label: 'Base → Optimism',
    sub: '100 USDC',
    fromChainId: 8453,
    fromTokenSymbol: 'USDC',
    fromTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    toChainId: 10,
    toTokenSymbol: 'USDC',
    toTokenAddress: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    amount: '100',
  },
]

// Default sample user address — Vitalik's well-known address.
// We're requesting a quote, not signing a tx, so the recipient is purely advisory.
export const SAMPLE_USER = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

export function toBaseUnits(humanAmount, decimals) {
  const [whole, frac = ''] = String(humanAmount).split('.')
  const fracPadded = (frac + '0'.repeat(decimals)).slice(0, decimals)
  const combined = (whole.replace(/^0+/, '') || '0') + fracPadded
  return (combined.replace(/^0+/, '') || '0')
}

export function fromBaseUnits(baseAmount, decimals) {
  const s = String(baseAmount).padStart(decimals + 1, '0')
  const whole = s.slice(0, s.length - decimals).replace(/^0+/, '') || '0'
  const frac = s.slice(s.length - decimals).replace(/0+$/, '')
  return frac ? `${whole}.${frac}` : whole
}
