export default function Section({ id, eyebrow, title, lede, children, className = '' }) {
  return (
    <section id={id} className={`max-w-6xl mx-auto px-5 py-16 sm:py-24 ${className}`}>
      {eyebrow && (
        <div className="text-xs uppercase tracking-[0.18em] text-fuchsia-300/80 mb-3">
          {eyebrow}
        </div>
      )}
      {title && (
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
      )}
      {lede && (
        <p className="mt-4 max-w-3xl text-zinc-400 text-lg leading-relaxed">{lede}</p>
      )}
      <div className={title || lede ? 'mt-10' : ''}>{children}</div>
    </section>
  )
}
