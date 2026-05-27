// EIP-7930 Interoperable Address encoding / decoding.
//
// Wire format (all hex, no separators):
//   [version 2B][chainType 2B][chainRefLen 1B][chainRef Nb][addressLen 1B][address Mb]
//
// LI.FI Intents currently uses:
//   - version 0x0001
//   - chainType 0x0000 for EVM chains
//   - chainRef = chainId as big-endian bytes (min length, 1 byte if chainId < 256)
//   - address = 20-byte EVM address

const CHAIN_TYPES = {
  '0000': { name: 'EVM', addressBytes: 20 },
  '8000': { name: 'Solana (SVM)', addressBytes: 32 },
  '8001': { name: 'Bitcoin (UTXO)', addressBytes: null },
}

const stripHex = (v) => (v.startsWith('0x') || v.startsWith('0X') ? v.slice(2) : v)
const padEven = (h) => (h.length % 2 === 0 ? h : '0' + h)

export function encodeInteropEvm(chainId, address) {
  const chainRef = padEven(BigInt(chainId).toString(16))
  const chainRefLen = (chainRef.length / 2).toString(16).padStart(2, '0')
  const addr = stripHex(address).toLowerCase()
  if (addr.length !== 40) throw new Error('EVM address must be 20 bytes')
  const addrLen = '14' // 0x14 = 20
  return '0x0001' + '0000' + chainRefLen + chainRef + addrLen + addr
}

export function decodeInterop(hex) {
  const h = stripHex(hex).toLowerCase()
  if (h.length < 10) throw new Error('Too short for an interoperable address')

  const segments = []
  let cursor = 0

  const take = (bytes, label, meta = {}) => {
    const slice = h.slice(cursor, cursor + bytes * 2)
    segments.push({ label, hex: slice, bytes, offset: cursor / 2, ...meta })
    cursor += bytes * 2
    return slice
  }

  const version = take(2, 'version')
  const chainType = take(2, 'chainType')
  const chainRefLenHex = take(1, 'chainRefLen')
  const chainRefLen = parseInt(chainRefLenHex, 16)
  if (Number.isNaN(chainRefLen)) throw new Error('Invalid chainRefLen byte')
  const chainRef = take(chainRefLen, 'chainRef')
  const addrLenHex = take(1, 'addressLen')
  const addrLen = parseInt(addrLenHex, 16)
  if (Number.isNaN(addrLen)) throw new Error('Invalid addressLen byte')
  const address = take(addrLen, 'address')

  const chainTypeInfo = CHAIN_TYPES[chainType] || { name: `Unknown (0x${chainType})`, addressBytes: null }
  const chainId = chainType === '0000' ? parseInt(chainRef || '0', 16) : null

  return {
    version: parseInt(version, 16),
    chainType,
    chainTypeName: chainTypeInfo.name,
    chainRef,
    chainId,
    address: chainType === '0000' ? '0x' + address : address,
    rawLength: h.length / 2,
    segments,
  }
}

// Sample showcase addresses (Vitalik's address on each chain) used for the decoder's default input
export const SAMPLE_ADDRESS = '0x0001000002210514d8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
