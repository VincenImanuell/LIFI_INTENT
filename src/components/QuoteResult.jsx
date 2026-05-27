import { fromBaseUnits } from '../lib/tokens'

export default function QuoteResult({ data, elapsedMs, preset, fromMeta, toMeta }) {
  const quote = data?.quotes?.[0]
  if (!quote) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-amber-200">
        No quotes returned. The route may be unsupported or solvers may not be quoting it right now.
      </div>
    )
  }

  const inputAmount = quote.preview?.inputs?.[0]?.amount
  const outputAmount = quote.preview?.outputs?.[0]?.amount
  const expiresIn = quote.validUntil ? Math.max(0, quote.validUntil - Math.floor(Date.now() / 1000)) : null

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <div className="text-xs uppercase tracking-wider text-emerald-300/90">Quote returned</div>
        <div className="text-xs text-zinc-500">{elapsedMs} ms · HTTP 200</div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-4">
        <Card label="You send">
          <Amount value={inputAmount} meta={fromMeta} />
          <Sub>{preset.label.split(' → ')[0]} · {fromMeta.symbol}</Sub>
        </Card>
        <Card label="You receive">
          <Amount value={outputAmount} meta={toMeta} highlight />
          <Sub>{preset.label.split(' → ')[1]} · {toMeta.symbol}</Sub>
        </Card>
      </div>

      <dl className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <Row label="quoteId" value={<code className="font-mono text-xs text-zinc-300 break-all">{quote.quoteId}</code>} />
        <Row label="Valid for" value={expiresIn !== null ? `${expiresIn}s` : '—'} />
        <Row label="Exclusive solver" value={
          quote.metadata?.exclusiveFor
            ? <code className="font-mono text-xs text-zinc-300 break-all">{quote.metadata.exclusiveFor}</code>
            : <span className="text-zinc-500">none — open to any solver</span>
        } />
        <Row label="Partial fill" value={quote.partialFill ? 'yes' : 'no'} />
        <Row label="Failure handling" value={<code className="font-mono text-xs text-zinc-300">{quote.failureHandling || '—'}</code>} />
      </dl>

      <details className="mt-5">
        <summary className="cursor-pointer text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-300">
          Raw response
        </summary>
        <pre className="mt-3 text-[11px] font-mono bg-zinc-900/70 border border-zinc-800 rounded-md p-3 overflow-x-auto text-zinc-300 leading-relaxed">
{JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  )
}

function Card({ label, children }) {
  return (
    <div className="rounded-md bg-zinc-900/40 border border-zinc-800 px-5 py-4">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  )
}

function Amount({ value, meta, highlight }) {
  if (value == null) return <span className="text-zinc-500">—</span>
  const human = fromBaseUnits(value, meta.decimals)
  return (
    <div className={`text-2xl sm:text-3xl font-semibold ${highlight ? 'text-emerald-300' : 'text-zinc-100'}`}>
      {human} <span className="text-base text-zinc-500 font-normal">{meta.symbol}</span>
    </div>
  )
}

function Sub({ children }) {
  return <div className="text-xs text-zinc-500 mt-1">{children}</div>
}

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</dt>
      <dd className="text-zinc-200">{value}</dd>
    </div>
  )
}
