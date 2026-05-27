import { useEffect, useRef, useState } from 'react'
import Section from './Section'

const STATES = [
  {
    key: 'Submitted',
    short: '01',
    actor: 'Order server',
    actorColor: 'text-sky-300',
    detail:
      'Your dApp POSTed the intent payload to order.li.fi. The server is validating the schema, the EIP-7930 addresses, and any signatures. Solvers cannot see the order yet.',
    transition: 'transient',
  },
  {
    key: 'Open',
    short: '02',
    actor: 'Input Settler (on-chain)',
    actorColor: 'text-violet-300',
    detail:
      'For escrow flows, the user (or their wallet) called open() on the InputSettlerEscrow — funds are locked, an Open event is emitted, and the solver network sees it. For Compact flows, the order is registered off-chain against the user\'s existing lock.',
    transition: 'transient',
  },
  {
    key: 'Signed',
    short: '03',
    actor: 'Solver picks up',
    actorColor: 'text-fuchsia-300',
    detail:
      'All signatures the solver needs to claim the funds are present (sponsor + allocator for Compact, none extra for escrow). Solvers race: the first solver to fill the output on the destination chain wins the auction.',
    transition: 'active',
  },
  {
    key: 'Delivered',
    short: '04',
    actor: 'Solver',
    actorColor: 'text-orange-300',
    detail:
      'A solver called fill() on the destination chain\'s OutputSettler. The recipient now has the requested output amount in their wallet. The solver has NOT yet been paid.',
    transition: 'active',
  },
  {
    key: 'Settled',
    short: '05',
    actor: 'Oracle + Input Settler',
    actorColor: 'text-emerald-300',
    detail:
      'The oracle (Polymer, Wormhole, Hyperlane, …) attested delivery to the origin chain. The solver called finalise() and the InputSettler released the locked input tokens to them. The order is now FINAL.',
    transition: 'terminal',
  },
]

export default function LifecycleStepper() {
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (!playing) return
    timer.current = setInterval(() => {
      setActive((a) => {
        if (a >= STATES.length - 1) {
          setPlaying(false)
          return a
        }
        return a + 1
      })
    }, 1400)
    return () => clearInterval(timer.current)
  }, [playing])

  function play() {
    setActive(0)
    setPlaying(true)
  }

  const current = STATES[active]

  return (
    <Section
      id="lifecycle"
      eyebrow="Order lifecycle"
      title="From Submitted to Settled"
      lede="Every LI.FI intent walks through five states. You can query the current state any time via GET /orders/status?orderId=…. Each transition has a clear on-chain or off-chain trigger and a clear actor responsible."
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs uppercase tracking-wider text-zinc-500">State machine</div>
          <button
            onClick={play}
            disabled={playing}
            className="text-xs rounded-md border border-zinc-700 px-3 py-1.5 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100 transition disabled:opacity-50 disabled:cursor-wait"
          >
            {playing ? 'Playing…' : '▶ Replay simulation'}
          </button>
        </div>

        <div className="relative overflow-x-auto">
          <div className="grid grid-cols-5 gap-2 min-w-[640px]">
            {STATES.map((s, i) => {
              const isActive = i === active
              const isPast = i < active
              return (
                <button
                  key={s.key}
                  onClick={() => {
                    setPlaying(false)
                    setActive(i)
                  }}
                  className="group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full grid place-items-center text-xs font-mono transition ${
                        isActive
                          ? 'bg-fuchsia-500 text-zinc-950 ring-4 ring-fuchsia-500/20'
                          : isPast
                            ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40'
                            : 'bg-zinc-900 text-zinc-500 ring-1 ring-zinc-800 group-hover:ring-zinc-600'
                      }`}
                    >
                      {isPast ? '✓' : s.short}
                    </div>
                    {i !== STATES.length - 1 && (
                      <div
                        className={`flex-1 h-px transition ${
                          isPast ? 'bg-emerald-500/40' : 'bg-zinc-800'
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`mt-3 text-sm font-medium transition ${
                      isActive
                        ? 'text-zinc-100'
                        : isPast
                          ? 'text-zinc-400'
                          : 'text-zinc-500 group-hover:text-zinc-300'
                    }`}
                  >
                    {s.key}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-600">
                    {s.transition}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8 rounded-md border border-zinc-800 bg-zinc-900/30 p-5 sm:p-6">
          <div className="flex items-baseline gap-3">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Current</span>
            <span className="text-xl font-semibold text-zinc-100">{current.key}</span>
            <span className={`text-xs ${current.actorColor}`}>actor · {current.actor}</span>
          </div>
          <p className="mt-3 text-zinc-300 leading-relaxed">{current.detail}</p>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
          <Callout title="Refund path">
            If <code className="font-mono text-xs text-zinc-300">fillDeadline</code> passes before
            a solver fills, the order is no longer fillable. After{' '}
            <code className="font-mono text-xs text-zinc-300">expires</code>, the user can refund
            their locked input via the InputSettler.
          </Callout>
          <Callout title="Same-chain shortcut">
            For same-chain intents, the OutputSettler can act as its own oracle{' '}
            (<code className="font-mono text-xs text-zinc-300">setAttestation</code>), letting
            solvers collapse fill + settle into one atomic transaction via the optional callback.
          </Callout>
        </div>
      </div>
    </Section>
  )
}

function Callout({ title, children }) {
  return (
    <div className="rounded-md border border-zinc-800 bg-zinc-900/30 p-4">
      <div className="text-[10px] uppercase tracking-wider text-fuchsia-300/80 mb-2">{title}</div>
      <div className="text-zinc-400 leading-relaxed">{children}</div>
    </div>
  )
}
