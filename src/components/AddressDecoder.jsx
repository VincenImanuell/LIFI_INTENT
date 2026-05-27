import { useMemo, useState } from 'react'
import Section from './Section'
import { decodeInterop, SAMPLE_ADDRESS } from '../lib/interopAddress'
import { chainLookup } from '../lib/chains'

const SEGMENT_STYLES = {
  version: 'bg-violet-500/15 text-violet-200 ring-violet-500/30',
  chainType: 'bg-sky-500/15 text-sky-200 ring-sky-500/30',
  chainRefLen: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30',
  chainRef: 'bg-amber-500/15 text-amber-200 ring-amber-500/30',
  addressLen: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30',
  address: 'bg-fuchsia-500/15 text-fuchsia-200 ring-fuchsia-500/30',
}

const SEGMENT_HELP = {
  version: 'Wire format version (currently 0x0001). Future-proofs the encoding.',
  chainType:
    'Identifies which chain family this address belongs to. 0x0000 = EVM. Other values exist for Solana, Bitcoin, etc.',
  chainRefLen: 'How many bytes the next chainRef field uses. Variable-length so small chain IDs stay compact.',
  chainRef: 'The chain identifier itself. For EVM, this is the EIP-155 chainId encoded as big-endian bytes.',
  addressLen: 'How many bytes the address field uses (0x14 = 20 for EVM addresses).',
  address: 'The native address on that chain. No checksum — case is not significant inside this wrapper.',
}

export default function AddressDecoder() {
  const [input, setInput] = useState(SAMPLE_ADDRESS)
  const decoded = useMemo(() => {
    try {
      return { ok: true, value: decodeInterop(input) }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }, [input])

  return (
    <Section
      id="address"
      eyebrow="Foundation"
      title="Interoperable addresses (EIP-7930)"
      lede="Before we can talk about cross-chain intents, we need a single way to refer to an asset or account across any chain. LI.FI Intents encode every address using EIP-7930, the chain-agnostic interoperable address standard. Decode any address below to see its structure."
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 sm:p-7">
        <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
          Interoperable address
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value.trim())}
          rows={2}
          spellCheck={false}
          className="w-full font-mono text-xs sm:text-sm bg-zinc-900/70 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-600 break-all"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { label: 'USDC · Base', value: '0x0001000002210514833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' },
            { label: 'USDC · Arbitrum', value: '0x0001000002A4B114af88d065e77c8cC2239327C5EDb3A432268e5831' },
            { label: 'Vitalik · Base', value: SAMPLE_ADDRESS },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setInput(s.value)}
              className="text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-800 hover:border-zinc-600 rounded-md px-2.5 py-1 transition"
            >
              {s.label}
            </button>
          ))}
        </div>

        {!decoded.ok && (
          <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {decoded.error}
          </div>
        )}

        {decoded.ok && <DecodedView v={decoded.value} />}
      </div>
    </Section>
  )
}

function DecodedView({ v }) {
  const chain = v.chainId ? chainLookup(v.chainId) : null
  return (
    <div className="mt-7 space-y-6">
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {v.segments.map((s) => (
            <div key={s.label} className="flex flex-col">
              <div
                className={`px-2.5 py-2 font-mono text-[11px] sm:text-xs rounded-md ring-1 ${SEGMENT_STYLES[s.label]}`}
                title={SEGMENT_HELP[s.label]}
              >
                {s.hex}
              </div>
              <div className="text-[10px] mt-1 text-zinc-500 px-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <Detail label="Version" value={`v${v.version}`} />
        <Detail label="Chain type" value={`${v.chainTypeName} (0x${v.chainType})`} />
        <Detail
          label="Chain"
          value={
            chain
              ? `${chain.name} (chainId ${v.chainId} = 0x${chain.hex})`
              : `Raw ref 0x${v.chainRef}`
          }
        />
        <Detail label="Address" value={v.address} mono />
        <Detail label="Total bytes" value={v.rawLength} />
      </dl>

      <div className="text-xs text-zinc-500 leading-relaxed">
        Hover any colored byte group above for an explanation. The variable-length{' '}
        <span className="text-zinc-300">chainRef</span> is what lets the same wire format work for
        a 1-byte Ethereum mainnet (
        <span className="font-mono">0x01</span>) and a 32-byte Solana program ID.
      </div>
    </div>
  )
}

function Detail({ label, value, mono = false }) {
  return (
    <div className="rounded-md bg-zinc-900/50 border border-zinc-800 px-4 py-3">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 text-zinc-100 ${mono ? 'font-mono text-xs break-all' : ''}`}>
        {value}
      </div>
    </div>
  )
}
