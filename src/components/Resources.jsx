import Section from './Section'

const GROUPS = [
  {
    title: 'Official docs',
    items: [
      { label: 'LI.FI Intents introduction', href: 'https://docs.li.fi/lifi-intents/introduction' },
      { label: 'Order server Swagger', href: 'https://order.li.fi/docs' },
      { label: 'Authentication & rate limits', href: 'https://docs.li.fi/lifi-intents/authentication' },
    ],
  },
  {
    title: 'Solver tools',
    items: [
      { label: 'Solver UI · mainnet', href: 'https://intents.li.fi' },
      { label: 'Solver UI · testnet', href: 'https://devintents.li.fi' },
      { label: 'Become a solver guide', href: 'https://docs.li.fi/lifi-intents/for-solvers/getting-started' },
    ],
  },
  {
    title: 'Open Intents Framework',
    items: [
      { label: 'OIF contracts (GitHub)', href: 'https://github.com/openintentsframework/oif-contracts' },
      { label: 'Catalyst (LI.FI extensions)', href: 'https://github.com/catalystsystem/catalyst-intent' },
      { label: 'EIP-7930 interoperable addresses', href: 'https://eips.ethereum.org/EIPS/eip-7930' },
    ],
  },
]

export default function Resources() {
  return (
    <Section
      eyebrow="Go deeper"
      title="Build the next one yourself"
      lede="Everything on this page is open and addressable. Hit any of the resources below to keep learning or to start integrating LI.FI Intents into your own product."
    >
      <div className="grid sm:grid-cols-3 gap-5">
        {GROUPS.map((g) => (
          <div key={g.title} className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
            <div className="text-xs uppercase tracking-wider text-fuchsia-300/80 mb-3">
              {g.title}
            </div>
            <ul className="space-y-2">
              {g.items.map((i) => (
                <li key={i.href}>
                  <a
                    href={i.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-zinc-300 hover:text-white underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 transition"
                  >
                    {i.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
