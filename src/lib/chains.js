// Curated registry of EVM chains LI.FI Intents commonly supports.
// chainId is decimal, hex is the same value in hex (used in EIP-7930 chain ref bytes).

export const CHAINS = {
  1: { name: 'Ethereum', short: 'ETH', hex: '01', color: '#627eea' },
  10: { name: 'Optimism', short: 'OP', hex: '0a', color: '#ff0420' },
  56: { name: 'BNB Chain', short: 'BSC', hex: '38', color: '#f3ba2f' },
  130: { name: 'Unichain', short: 'UNI', hex: '82', color: '#ff007a' },
  137: { name: 'Polygon', short: 'POL', hex: '89', color: '#8247e5' },
  8453: { name: 'Base', short: 'BASE', hex: '2105', color: '#0052ff' },
  42161: { name: 'Arbitrum', short: 'ARB', hex: 'a4b1', color: '#28a0f0' },
  43114: { name: 'Avalanche', short: 'AVAX', hex: 'a86a', color: '#e84142' },
  59144: { name: 'Linea', short: 'LINEA', hex: 'e708', color: '#61dfff' },
  534352: { name: 'Scroll', short: 'SCROLL', hex: '82750', color: '#ffeeda' },
}

// Common token addresses per chain — used to seed the Quote Builder presets.
export const TOKENS = {
  1: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  10: {
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
  },
  8453: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
  42161: {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  },
  137: {
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  },
}

export function chainLookup(chainId) {
  return CHAINS[chainId] || { name: `Chain ${chainId}`, short: `#${chainId}`, hex: chainId.toString(16), color: '#888' }
}
