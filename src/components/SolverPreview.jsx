import { useState } from 'react'
import Section from './Section'
import AnnotatedJson from './AnnotatedJson'

const STANDING_QUOTE = {
  quotes: [
    {
      expiry: 1779912000,
      fromChainId: '10',
      toChainId: '42161',
      fromAsset: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      toAsset: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      fromDecimals: 6,
      toDecimals: 6,
      ranges: [
        { minAmount: '10', maxAmount: '100', quote: '0.97' },
        { minAmount: '100', maxAmount: '10000', quote: '0.995' },
        { minAmount: '10000', maxAmount: '500000', quote: '0.999' },
      ],
      exclusiveFor: '0x7bb2b9b2cf209b88850cb744d9e38297905549c9',
    },
  ],
}

const QUOTE_ANNOTATIONS = {
  expiry: 'User-side quote expiry. Quotes with shorter expiry than the user request are filtered out.',
  fromChainId: 'Origin chain you can source tokens on.',
  toChainId: 'Destination chain you will deliver to.',
  fromAsset: 'Token you accept as input (native EVM address — no EIP-7930 wrapping at this layer).',
  toAsset: 'Token you deliver as output.',
  fromDecimals: 'Used by the order server only as an exchange-rate normalizer.',
  toDecimals: 'Used by the order server only as an exchange-rate normalizer.',
  ranges: 'Tiered pricing curve. Lower volume = worse rate; higher volume = better rate.',
  minAmount: 'Lowest input amount (human units) this range covers.',
  maxAmount: 'Highest input amount this range covers.',
  quote: 'Output/input rate inside this range. 0.995 means user gets 0.5% slippage.',
  exclusiveFor: 'Your solver address. Establishes which solver gets first dibs during the exclusivity window.',
}

const VALIDATION_CHECKLIST = [
  { num: '01', title: 'fillDeadline budget', text: 'Enough time to fill on destination + handle source-chain finality.' },
  { num: '02', title: 'expires budget', text: 'Enough time to fill + relay proof + call finalise on origin.' },
  { num: '03', title: 'Oracle pairing', text: 'inputOracle and output.oracle belong to the same validation layer you support.' },
  { num: '04', title: 'Input tokens whitelisted', text: 'Every input token is one you trust. Recipient not on a USDC-style blacklist.' },
  { num: '05', title: 'output.chainId whitelisted', text: 'You actually want to operate on that destination chain.' },
  { num: '06', title: 'output.settler whitelisted', text: 'The destination OutputSettler is a contract you trust.' },
  { num: '07', title: 'context decodes', text: 'output.context parses cleanly and the order type is one your bot handles.' },
  { num: '08', title: 'Inventory check', text: 'You hold ≥ output.amount of output.token on the destination chain right now.' },
  { num: '09', title: 'Calldata safety', text: 'If output.call is non-empty, it executes safely. Length ≤ 65,535 bytes.' },
  { num: '10', title: 'Multi-output ordering', text: 'You can fill every output, and output[0] proposedSolver == your identifier.' },
]

const FLOW = [
  {
    key: 'Register',
    short: '01',
    actor: 'intents.li.fi dashboard',
    detail:
      'Sign up at intents.li.fi, set a permanent Solver Name, generate an API key, then prove ownership of each fill address by signing a message and POST /solver-api/account/register. One key can cover many addresses; one address belongs to one key.',
  },
  {
    key: 'Quote',
    short: '02',
    actor: 'POST /quotes/submit',
    detail:
      'Push standing quotes — up to 200K per call. Each quote is a (fromChain, toChain, fromAsset, toAsset) tuple with tiered ranges. The order server overwrites old quotes when you push new ones, so just keep them fresh as inventory shifts.',
  },
  {
    key: 'Listen',
    short: '03',
    actor: 'WebSocket or on-chain',
    detail:
      'Subscribe to wss://order.li.fi to receive user:vm-order-submit events in real time, or watch the Open event on InputSettlerEscrow / InputSettlerCompact directly. The WebSocket path is lower-friction; the on-chain path has the lowest latency.',
  },
  {
    key: 'Validate',
    short: '04',
    actor: 'Your bot',
    detail:
      'Run the validation checklist before touching the destination chain. The Order Server pre-filters, but on-chain anyone can emit Open with bad data — so you must verify deadlines, oracle pairing, settler whitelist, token blacklist status, context decode, and more.',
  },
  {
    key: 'Fill',
    short: '05',
    actor: 'OutputSettler on destination',
    detail:
      'Call fillOrderOutputs(fillDeadline, orderId, outputs, proposedSolver) on the destination chain. The OutputSettler transfers your tokens to the recipient and records your solver id. If you lose the race (someone else fills first), the tx reverts cheaply.',
  },
  {
    key: 'Attest',
    short: '06',
    actor: 'Oracle layer',
    detail:
      'A validation layer carries proof of your fill back to the origin chain. Self-serve (Polymer / Wormhole) requires you to submit the proof. Automatic (Hyperlane / CCIP / Axelar / LayerZero) relays for you. Same-chain orders skip this entirely.',
  },
  {
    key: 'Finalise',
    short: '07',
    actor: 'InputSettler on origin',
    detail:
      'Once the oracle has attested, call finalise(order, solveParams, destination, call). The InputSettler verifies the attestation and releases the user\'s locked input tokens to you. Order state moves to Settled. You\'ve been paid.',
  },
]

export default function SolverPreview() {
  const [active, setActive] = useState(0)
  const current = FLOW[active]

  return (
    <Section
      id="solver"
      eyebrow="The other side"
      title="How solvers fulfill intents"
      lede="Everything above is from the integrator's perspective — the dApp or user issuing an intent. Solvers are the market makers on the other side: they push standing quotes, watch for orders that match, and race to fill them with their own inventory. Here's what their lifecycle looks like end-to-end."
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 sm:p-7">
        <div className="text-xs uppercase tracking-wider text-zinc-500 mb-6">
          Solver flow · register → quote → listen → validate → fill → attest → finalise
        </div>

        <div className="relative overflow-x-auto">
          <div className="grid grid-cols-7 gap-1.5 min-w-[760px]">
            {FLOW.map((s, i) => {
              const isActive = i === active
              const isPast = i < active
              return (
                <button
                  key={s.key}
                  onClick={() => setActive(i)}
                  className="group text-left"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-[11px] font-mono transition ${
                        isActive
                          ? 'bg-orange-400 text-zinc-950 ring-4 ring-orange-400/20'
                          : isPast
                            ? 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/30'
                            : 'bg-zinc-900 text-zinc-500 ring-1 ring-zinc-800 group-hover:ring-zinc-600'
                      }`}
                    >
                      {s.short}
                    </div>
                    {i !== FLOW.length - 1 && (
                      <div
                        className={`flex-1 h-px transition ${
                          isPast || isActive ? 'bg-orange-500/30' : 'bg-zinc-800'
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`mt-2 text-xs font-medium transition ${
                      isActive
                        ? 'text-zinc-100'
                        : isPast
                          ? 'text-zinc-400'
                          : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  >
                    {s.key}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-7 rounded-md border border-zinc-800 bg-zinc-900/30 p-5 sm:p-6">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Step</span>
            <span className="text-xl font-semibold text-zinc-100">{current.key}</span>
            <span className="text-xs text-orange-300">{current.actor}</span>
          </div>
          <p className="mt-3 text-zinc-300 leading-relaxed">{current.detail}</p>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <h3 className="text-lg font-semibold text-zinc-100">Standing quote payload</h3>
          <p className="text-sm text-zinc-500 mt-2 mb-4 leading-relaxed">
            Solvers don't respond to individual quote requests — they push tiered price curves
            ahead of time. A new submission to{' '}
            <code className="font-mono text-zinc-300">/quotes/submit</code> overwrites the prior
            entry for the same route, so quotes can be long-lived and refreshed lazily.
          </p>
          <AnnotatedJson value={STANDING_QUOTE} annotations={QUOTE_ANNOTATIONS} />
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-zinc-100">Pre-fill validation</h3>
          <p className="text-sm text-zinc-500 mt-2 mb-4 leading-relaxed">
            The order server pre-filters, but on-chain anyone can emit <code className="font-mono text-zinc-300">Open</code> events.
            Solvers must independently validate every order before committing inventory.
          </p>
          <ol className="space-y-2">
            {VALIDATION_CHECKLIST.map((c) => (
              <li
                key={c.num}
                className="rounded-md border border-zinc-800 bg-zinc-900/30 px-3 py-2.5 flex gap-3"
              >
                <span className="font-mono text-[10px] text-orange-300/80 mt-0.5 flex-shrink-0">
                  {c.num}
                </span>
                <div>
                  <div className="text-sm text-zinc-200 font-medium leading-snug">{c.title}</div>
                  <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{c.text}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
