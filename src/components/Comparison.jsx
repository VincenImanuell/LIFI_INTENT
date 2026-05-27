import Section from './Section'

const rows = [
  {
    aspect: 'User mental model',
    traditional: '"Use bridge X, then swap on DEX Y to get token Z"',
    intent: '"I want 10 USDC on Arbitrum. Make it happen."',
  },
  {
    aspect: 'Execution',
    traditional: 'User submits to a Diamond contract that calls bridge + DEX in sequence',
    intent: 'User locks funds in an Input Settler; a solver delivers on the destination chain',
  },
  {
    aspect: 'Capital flow',
    traditional: "User's own funds traverse every hop",
    intent: 'Solver pre-funds destination using their inventory, then claims your locked input',
  },
  {
    aspect: 'Typical speed',
    traditional: 'Minutes to hours, bounded by the slowest bridge',
    intent: 'Often < 2 minutes — solvers compete on speed and price',
  },
  {
    aspect: 'Pricing model',
    traditional: 'Best route the aggregator finds at quote time',
    intent: 'Best price among competing solver standing quotes',
  },
  {
    aspect: 'Trust assumption',
    traditional: 'Each bridge protocol in the route',
    intent: 'Resource lock + oracle — solver never controls funds without proof of delivery',
  },
  {
    aspect: 'Settlement',
    traditional: 'Synchronous: success or revert in one transaction',
    intent: 'Two-phase: solver fills → oracle attests → input is released',
  },
]

export default function Comparison() {
  return (
    <Section
      id="compare"
      eyebrow="Why intents"
      title="Bridge aggregation vs. LI.FI Intents"
      lede="Traditional bridge aggregators route your funds through a chain of contracts. Intents flip the model: you declare the outcome, and a marketplace of solvers — backed by an on-chain settlement layer — competes to deliver it."
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 overflow-hidden">
        <div className="grid grid-cols-12 text-xs uppercase tracking-wider text-zinc-500 border-b border-zinc-800 bg-zinc-900/40">
          <div className="col-span-12 sm:col-span-3 px-5 py-3">Aspect</div>
          <div className="hidden sm:block sm:col-span-4 px-5 py-3">Traditional aggregator</div>
          <div className="hidden sm:block sm:col-span-5 px-5 py-3 text-fuchsia-300/80">
            LI.FI Intents
          </div>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.aspect}
            className={`grid grid-cols-12 ${i !== rows.length - 1 ? 'border-b border-zinc-900' : ''}`}
          >
            <div className="col-span-12 sm:col-span-3 px-5 py-4 text-sm font-medium text-zinc-200 bg-zinc-900/20">
              {row.aspect}
            </div>
            <div className="col-span-12 sm:col-span-4 px-5 py-4 text-sm text-zinc-400 sm:border-l sm:border-zinc-900">
              <div className="sm:hidden text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                Traditional
              </div>
              {row.traditional}
            </div>
            <div className="col-span-12 sm:col-span-5 px-5 py-4 text-sm text-zinc-200 sm:border-l sm:border-zinc-900 bg-fuchsia-500/[0.03]">
              <div className="sm:hidden text-[10px] uppercase tracking-wider text-fuchsia-300/80 mb-1">
                LI.FI Intents
              </div>
              {row.intent}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        Intents are the foundation of the{' '}
        <a
          href="https://github.com/openintentsframework/oif-contracts"
          target="_blank"
          rel="noreferrer"
          className="text-zinc-300 underline underline-offset-4 decoration-zinc-700 hover:text-zinc-100"
        >
          Open Intents Framework
        </a>{' '}
        — an Ethereum Foundation initiative LI.FI helped seed.
      </p>
    </Section>
  )
}
