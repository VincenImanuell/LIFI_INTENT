import Section from './Section'

const TYPES = [
  {
    name: 'Limit Order',
    sub: 'First come, first served',
    tag: '0x00',
    accent: 'sky',
    context: [
      { bytes: '0x', label: 'order type', tone: 'sky' },
    ],
    body: 'Single price, single execution. The amount field is final. The first solver to call fill() wins.',
    when: 'Simplest possible auction. Use when you have plenty of solver competition and pricing is already tight.',
  },
  {
    name: 'Exclusive Limit Order',
    sub: 'LI.FI default',
    tag: '0xe0',
    accent: 'fuchsia',
    context: [
      { bytes: '0xe0', label: 'order type', tone: 'fuchsia' },
      { bytes: 'exclusiveFor', label: 'solver (32B)', tone: 'amber' },
      { bytes: 'startTime', label: '4B', tone: 'emerald' },
    ],
    body: 'Reserves the first ~30–60 s for a specific solver chosen by the Order Server (using reputation). After startTime, any solver can fill.',
    when: 'The default mode for the LI.FI Widget and most integrators — minimises failed fills by routing to a trusted solver first.',
  },
  {
    name: 'Dutch Auction',
    sub: 'Price decays over time',
    tag: '0x01',
    accent: 'orange',
    context: [
      { bytes: '0x01', label: 'order type', tone: 'orange' },
      { bytes: 'startTime', label: '4B', tone: 'emerald' },
      { bytes: 'stopTime', label: '4B', tone: 'emerald' },
      { bytes: 'slope', label: '32B', tone: 'amber' },
    ],
    body: 'Final amount = baseAmount + slope · (stopTime − now). Earlier fills cost the solver more; price decays linearly to the floor.',
    when: 'Use when price discovery matters and you can wait. Solvers self-select based on their margin tolerance.',
  },
  {
    name: 'Exclusive Dutch',
    sub: 'Exclusivity then auction',
    tag: '0xe1',
    accent: 'rose',
    context: [
      { bytes: '0xe1', label: 'order type', tone: 'rose' },
      { bytes: 'exclusiveFor', label: 'solver (32B)', tone: 'amber' },
      { bytes: 'startTime', label: '4B', tone: 'emerald' },
      { bytes: 'stopTime', label: '4B', tone: 'emerald' },
      { bytes: 'slope', label: '32B', tone: 'amber' },
    ],
    body: 'Combines the two: a chosen solver gets first dibs at the maximum (least-favourable-to-them) price before the Dutch slope opens up to everyone.',
    when: 'When you trust a specific market maker AND want the safety net of competitive pricing if they no-show.',
  },
]

const ACCENT_BORDER = {
  sky: 'border-sky-500/30 bg-sky-500/[0.04]',
  fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/[0.04]',
  orange: 'border-orange-500/30 bg-orange-500/[0.04]',
  rose: 'border-rose-500/30 bg-rose-500/[0.04]',
}

const TONE = {
  sky: 'bg-sky-500/15 text-sky-200 ring-sky-500/30',
  fuchsia: 'bg-fuchsia-500/15 text-fuchsia-200 ring-fuchsia-500/30',
  orange: 'bg-orange-500/15 text-orange-200 ring-orange-500/30',
  rose: 'bg-rose-500/15 text-rose-200 ring-rose-500/30',
  amber: 'bg-amber-500/15 text-amber-200 ring-amber-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-200 ring-emerald-500/30',
}

export default function OrderTypes() {
  return (
    <Section
      id="types"
      eyebrow="Auction design"
      title="Four order types, encoded in one byte"
      lede="The output.context field tells the chain which auction the solver is bidding in. Every type uses the same on-chain settlement — only the rules of who wins and at what price change."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        {TYPES.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl border ${ACCENT_BORDER[t.accent]} p-5 sm:p-6`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">{t.name}</h3>
                <div className="text-xs text-zinc-400">{t.sub}</div>
              </div>
              <span
                className={`font-mono text-xs px-2 py-1 rounded-md ring-1 ${TONE[t.accent]}`}
              >
                {t.tag}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              {t.context.map((c) => (
                <div key={c.label} className="flex flex-col">
                  <div
                    className={`font-mono text-[10px] sm:text-xs px-2 py-1.5 rounded-md ring-1 ${TONE[c.tone]}`}
                  >
                    {c.bytes}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-zinc-500 mt-1 px-1">
                    {c.label}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 text-sm text-zinc-300 leading-relaxed">{t.body}</p>
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
              <span className="text-zinc-400">When:</span> {t.when}
            </p>

            {t.name === 'Dutch Auction' && <DutchChart />}
          </div>
        ))}
      </div>
    </Section>
  )
}

function DutchChart() {
  // Synthetic curve from baseAmount → baseAmount + slope*window
  const w = 280
  const h = 80
  const padX = 10
  const padY = 8
  const pts = []
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const x = padX + t * (w - padX * 2)
    // y goes from high to low (price the solver pays decreases as time advances)
    const y = padY + (1 - (1 - t)) * (h - padY * 2)
    pts.push([x, y])
  }
  // Reverse: price actually starts high (early fill = more pay), goes to base
  const path = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${(h - y).toFixed(1)}`)
    .join(' ')
  return (
    <div className="mt-5 rounded-md border border-zinc-800 bg-zinc-900/40 p-3">
      <div className="flex justify-between text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
        <span>solver pays</span>
        <span>time →</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <path d={path} fill="none" stroke="#fb923c" strokeWidth="1.5" />
        <line
          x1={padX}
          y1={h - padY}
          x2={w - padX}
          y2={h - padY}
          stroke="#3f3f46"
          strokeDasharray="2 3"
        />
        <text x={padX} y={padY + 8} className="fill-zinc-400 text-[8px]">
          baseAmount + slope·window
        </text>
        <text x={w - padX - 60} y={h - padY - 4} className="fill-zinc-500 text-[8px]">
          baseAmount
        </text>
      </svg>
    </div>
  )
}
