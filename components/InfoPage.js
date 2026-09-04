import Breadcrumbs from "./Breadcrumbs";

export default function InfoPage({ eyebrow, title, updated, breadcrumbItems, children }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
      {breadcrumbItems && <Breadcrumbs items={breadcrumbItems} />}
      {eyebrow && <p className="mb-2 text-xs uppercase tracking-[0.25em] text-gold">{eyebrow}</p>}
      <h1 className="font-display text-4xl text-cream md:text-5xl">{title}</h1>
      {updated && <p className="mt-3 text-xs text-cream/40">Last updated: {updated}</p>}
      <div className="glass mt-10 space-y-6 rounded-[1.75rem] p-6 text-sm leading-relaxed text-cream/75 md:p-10">
        {children}
      </div>
    </main>
  );
}
