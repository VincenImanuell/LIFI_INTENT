export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-zinc-950/70 border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-fuchsia-500 to-orange-400 ring-1 ring-white/10" />
          <span className="font-semibold tracking-tight">
            Intent <span className="text-zinc-500">Explorer</span>
          </span>
        </a>
        <nav className="hidden sm:flex items-center gap-5 text-sm text-zinc-400">
          <a href="#compare" className="hover:text-zinc-100 transition">Compare</a>
          <a href="#quote" className="hover:text-zinc-100 transition">Quote</a>
          <a href="#lifecycle" className="hover:text-zinc-100 transition">Lifecycle</a>
          <a href="#anatomy" className="hover:text-zinc-100 transition">Anatomy</a>
          <a href="#solver" className="hover:text-zinc-100 transition">Solver</a>
          <a
            href="https://docs.li.fi/lifi-intents/introduction"
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-zinc-700 px-3 py-1 hover:border-zinc-500 hover:text-zinc-100 transition"
          >
            LI.FI Docs ↗
          </a>
        </nav>
      </div>
    </header>
  )
}
