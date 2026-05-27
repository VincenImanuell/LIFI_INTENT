import { useState } from 'react'
import Section from './Section'

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
    </Section>
  )
}
