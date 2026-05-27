export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-10 text-sm text-zinc-500 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <p>
          Open-source educational demo. Not affiliated with LI.FI. All quotes are fetched live from{' '}
          <a
            className="text-zinc-300 hover:text-white underline underline-offset-4 decoration-zinc-700"
            href="https://order.li.fi/docs"
            target="_blank"
            rel="noreferrer"
          >
            order.li.fi
          </a>
          .
        </p>
        <div className="flex items-center gap-4">
          <a
            className="hover:text-zinc-200 transition"
            href="https://docs.li.fi/lifi-intents/introduction"
            target="_blank"
            rel="noreferrer"
          >
            Read the docs
          </a>
          <a
            className="hover:text-zinc-200 transition"
            href="https://github.com/VincenImanuell/LIFI_INTENT"
            target="_blank"
            rel="noreferrer"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
