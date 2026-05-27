// Renders pretty-printed JSON with inline `// explainer` comments
// attached to any key listed in the annotations map.

const KEY_LINE = /^(\s*)"([^"]+)":\s*(.*?)(,?)$/

export default function AnnotatedJson({ value, annotations = {}, className = '' }) {
  const text = JSON.stringify(value, null, 2)
  const lines = text.split('\n')

  return (
    <pre
      className={`text-[11px] sm:text-xs font-mono bg-zinc-900/70 border border-zinc-800 rounded-md p-4 overflow-x-auto text-zinc-300 leading-relaxed ${className}`}
    >
      {lines.map((line, i) => {
        const m = line.match(KEY_LINE)
        if (!m) return <div key={i}>{line || ' '}</div>
        const [, indent, key, val, comma] = m
        const note = annotations[key]
        return (
          <div key={i}>
            <span>{indent}</span>
            <span className="text-sky-300">"{key}"</span>
            <span className="text-zinc-500">: </span>
            <ValueSpan value={val} />
            <span>{comma}</span>
            {note && (
              <span className="text-zinc-500">
                {'  '}
                <span className="text-emerald-400/80">// {note}</span>
              </span>
            )}
          </div>
        )
      })}
    </pre>
  )
}

function ValueSpan({ value }) {
  if (value === 'null') return <span className="text-zinc-500">null</span>
  if (value === 'true' || value === 'false') return <span className="text-amber-300">{value}</span>
  if (value.startsWith('"')) return <span className="text-emerald-200">{value}</span>
  if (/^-?\d/.test(value)) return <span className="text-violet-300">{value}</span>
  return <span>{value}</span>
}
