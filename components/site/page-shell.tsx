export function PageShell({
  eyebrow,
  title,
  lede,
  meta,
  children,
}: {
  eyebrow: string
  title: string
  lede: React.ReactNode
  meta?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <article className="mx-auto w-full max-w-5xl">
      <header className="border-b border-hairline pb-8">
        <p className="text-micro font-bold uppercase tracking-[0.15em] text-ink-subtle">{eyebrow}</p>
        <h1 className="mt-3 font-display text-figure-lg font-extrabold leading-none tracking-[-0.04em] lg:text-hero text-ink-bright">
          {title}
        </h1>
        <div className="mt-4 max-w-[68ch] text-tier leading-relaxed text-ink-label">{lede}</div>
        {meta ? <div className="mt-5">{meta}</div> : null}
      </header>
      <div className="pt-8">{children}</div>
    </article>
  )
}

export function Section({
  id,
  title,
  children,
  intro,
}: {
  id?: string
  title: string
  children: React.ReactNode
  intro?: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-hairline py-10 first:border-t-0 first:pt-0">
      <h2 className="font-display text-figure-lg font-extrabold tracking-[-0.02em] text-ink-bright">{title}</h2>
      {intro ? <div className="mt-3 max-w-[70ch] text-body leading-relaxed text-ink-label">{intro}</div> : null}
      <div className="mt-6">{children}</div>
    </section>
  )
}
