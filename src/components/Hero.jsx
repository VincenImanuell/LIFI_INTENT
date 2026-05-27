export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            'radial-gradient(800px 400px at 20% 0%, rgba(217,70,239,0.18), transparent 60%), radial-gradient(700px 400px at 90% 10%, rgba(251,146,60,0.15), transparent 60%)',
        }}
      />
      <div className="max-w-6xl mx-auto px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Built for the LI.FI Intents Mini Builder Challenge
        </div>
        <h1 className="mt-5 text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          Cross-chain transfers,{' '}
          <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-orange-300 bg-clip-text text-transparent">
            as an outcome.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-zinc-400 text-lg leading-relaxed">
          A live, interactive tour of <span className="text-zinc-200">LI.FI Intents</span> — the
          intent-based solver marketplace where users declare a desired outcome and a competitive
          solver network races to fulfill it. Fetch a real quote, decode an interoperable address,
          and watch the full order lifecycle, all without leaving the page.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#quote"
            className="rounded-md bg-zinc-100 text-zinc-900 px-4 py-2 text-sm font-medium hover:bg-white transition"
          >
            Fetch a live quote →
          </a>
          <a
            href="#compare"
            className="rounded-md border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:border-zinc-600 hover:text-zinc-100 transition"
          >
            How is this different from a bridge?
          </a>
        </div>
        <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl">
          <Stat label="Solver fulfillment" value="< 2 min" />
          <Stat label="Order types" value="4" />
          <Stat label="Settler contracts" value="OIF" />
          <Stat label="API auth" value="None" />
        </dl>
      </div>
    </section>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-zinc-100">{value}</div>
      <div className="text-xs uppercase tracking-wider text-zinc-500 mt-1">{label}</div>
    </div>
  )
}
