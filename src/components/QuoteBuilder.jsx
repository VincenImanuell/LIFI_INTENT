import { useState } from 'react'
import Section from './Section'
import { ROUTE_PRESETS, SAMPLE_USER, TOKEN_META } from '../lib/tokens'
import { chainLookup } from '../lib/chains'
import { encodeInteropEvm } from '../lib/interopAddress'

export default function QuoteBuilder() {
  const [preset, setPreset] = useState(ROUTE_PRESETS[0])
  const [amount, setAmount] = useState(ROUTE_PRESETS[0].amount)
  const [user, setUser] = useState(SAMPLE_USER)

  const fromChain = chainLookup(preset.fromChainId)
  const toChain = chainLookup(preset.toChainId)
  const fromMeta = TOKEN_META[preset.fromTokenSymbol]
  const toMeta = TOKEN_META[preset.toTokenSymbol]

  const requestBody = buildRequestBody({ preset, amount, user, fromMeta })

  return (
    <Section
      id="quote"
      eyebrow="Hands on"
      title="Fetch a live quote"
      lede="Pick a preset route, tweak the amount, and we'll POST to https://order.li.fi/quote/request — the same endpoint LI.FI's own Widget uses. No wallet, no signature, no funds at risk: this is a read-only price discovery call."
    >
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <div className="text-xs uppercase tracking-wider text-zinc-500 mb-3">Route preset</div>
          <div className="space-y-2">
            {ROUTE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPreset(p)
                  setAmount(p.amount)
                }}
                className={`w-full text-left rounded-md border px-4 py-3 transition ${
                  preset.id === p.id
                    ? 'border-fuchsia-500/50 bg-fuchsia-500/5'
                    : 'border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div className="text-sm font-medium text-zinc-100">{p.label}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{p.sub}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 sm:p-7">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="From chain">
              <Pill color={fromChain.color}>{fromChain.name}</Pill>
              <span className="text-xs text-zinc-500 ml-2">id {preset.fromChainId}</span>
            </Field>
            <Field label="To chain">
              <Pill color={toChain.color}>{toChain.name}</Pill>
              <span className="text-xs text-zinc-500 ml-2">id {preset.toChainId}</span>
            </Field>
            <Field label="From token">
              <span className="font-mono text-sm text-zinc-200">{fromMeta.symbol}</span>
              <span className="text-xs text-zinc-500 ml-2">{fromMeta.decimals} decimals</span>
            </Field>
            <Field label="To token">
              <span className="font-mono text-sm text-zinc-200">{toMeta.symbol}</span>
              <span className="text-xs text-zinc-500 ml-2">{toMeta.decimals} decimals</span>
            </Field>
          </div>

          <div className="mt-5">
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
              Amount ({fromMeta.symbol})
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              className="w-full bg-zinc-900/70 border border-zinc-800 rounded-md px-4 py-3 text-lg text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="mt-5">
            <label className="block text-xs uppercase tracking-wider text-zinc-500 mb-2">
              User / refund recipient
            </label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              spellCheck={false}
              className="w-full font-mono text-xs sm:text-sm bg-zinc-900/70 border border-zinc-800 rounded-md px-3 py-2 text-zinc-100 focus:outline-none focus:border-zinc-600"
            />
            <p className="text-xs text-zinc-500 mt-2">
              Used to identify who can claim a refund if the intent expires unfilled. We default to
              a well-known address since we're only reading a quote.
            </p>
          </div>

          <button
            disabled
            className="mt-7 w-full rounded-md bg-zinc-100 text-zinc-900 px-4 py-3 text-sm font-medium opacity-60 cursor-not-allowed"
          >
            Fetch quote — wiring up next…
          </button>

          <details className="mt-6 group">
            <summary className="cursor-pointer text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-300">
              Preview request body
            </summary>
            <pre className="mt-3 text-[11px] font-mono bg-zinc-900/70 border border-zinc-800 rounded-md p-3 overflow-x-auto text-zinc-300 leading-relaxed">
{JSON.stringify(requestBody, null, 2)}
            </pre>
          </details>
        </div>
      </div>
    </Section>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">{label}</div>
      <div className="flex items-center">{children}</div>
    </div>
  )
}

function Pill({ color, children }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-sm text-zinc-100"
    >
      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {children}
    </span>
  )
}

function buildRequestBody({ preset, amount, user, fromMeta }) {
  const safeAmount = (() => {
    try {
      const [whole, frac = ''] = String(amount).split('.')
      const padded = (frac + '0'.repeat(fromMeta.decimals)).slice(0, fromMeta.decimals)
      const combined = (whole.replace(/^0+/, '') || '0') + padded
      return combined.replace(/^0+/, '') || '0'
    } catch {
      return '0'
    }
  })()

  let userInterop, fromAssetInterop, toAssetInterop, receiverInterop
  try {
    userInterop = encodeInteropEvm(preset.fromChainId, user)
    fromAssetInterop = encodeInteropEvm(preset.fromChainId, preset.fromTokenAddress)
    toAssetInterop = encodeInteropEvm(preset.toChainId, preset.toTokenAddress)
    receiverInterop = encodeInteropEvm(preset.toChainId, user)
  } catch {
    return { error: 'Invalid address — check the user input' }
  }

  return {
    user: userInterop,
    intent: {
      intentType: 'oif-swap',
      inputs: [
        {
          user: userInterop,
          asset: fromAssetInterop,
          amount: safeAmount,
        },
      ],
      outputs: [
        {
          receiver: receiverInterop,
          asset: toAssetInterop,
          amount: null,
        },
      ],
      swapType: 'exact-input',
    },
    supportedTypes: ['oif-escrow-v0'],
  }
}
