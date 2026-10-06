import Link from 'next/link';
import type { ReactNode } from 'react';
import { getProductUrl } from '@/lib/routes';
import type { MenuItem } from '@/lib/types';
import { ALL_ALLERGENS, REFERENCE_INTAKE_KCAL, gbp } from '@/lib/content-facts';

/* Premium content sections for product, category and city pages.
   No icons: hierarchy comes from type, spacing, rules and tints. */

/* ── Building blocks ─────────────────────────────────────────────── */

/**
 * Render inline markdown links `[text](/path)` inside a plain text string
 * as Next.js `<Link>` elements. Only internal paths (starting with `/`) are
 * converted; everything else stays as plain text.
 */
function renderInlineLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)]*)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <Link key={key++} href={match[2]} className="font-medium text-teal underline underline-offset-4 hover:text-ink">
        {match[1]}
      </Link>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Prose({ text, className = '' }: { text: string; className?: string }) {
  return (
    <div className={`space-y-4 text-[1.04rem] leading-[1.75] text-ink/75 ${className}`}>
      {text
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p, i) => (
          <p key={i}>{renderInlineLinks(p)}</p>
        ))}
    </div>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="reveal scroll-mt-28 border-t border-line pt-12">
      {eyebrow && <span className="eyebrow text-teal">{eyebrow}</span>}
      <h2 id={`${id}-h`} className="mt-2 font-display text-2xl font-semibold leading-snug text-ink sm:text-[1.9rem]">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function BandSection({
  id,
  eyebrow,
  title,
  intro,
  tone = 'white',
  children,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  tone?: 'white' | 'cloud' | 'mist' | 'navy';
  children: ReactNode;
}) {
  const bg = { white: 'bg-white', cloud: 'bg-cloud', mist: 'bg-mist', navy: 'bg-navy-deep text-white' }[tone];
  const dark = tone === 'navy';
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`${bg} scroll-mt-20 py-20`}>
      <div className="shell">
        <div className="reveal mb-10 max-w-2xl">
          {eyebrow && <span className={`eyebrow ${dark ? 'text-mint' : 'text-teal'}`}>{eyebrow}</span>}
          <h2
            id={`${id}-h`}
            className={`mt-2 font-display text-3xl font-semibold leading-tight sm:text-[2.3rem] ${dark ? 'text-white' : 'text-ink'}`}
          >
            {title}
          </h2>
          {intro && <p className={`mt-4 leading-relaxed ${dark ? 'text-white/65' : 'text-ink/70'}`}>{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ── Answer engine box ───────────────────────────────────────────── */

export function QuickAnswer({ text }: { text: string }) {
  return (
    <aside
      aria-label="Quick answer"
      className="reveal relative overflow-hidden rounded-[var(--radius-xl)] border border-primary/15 bg-white p-7 shadow-[var(--shadow-card)] sm:p-8"
    >
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-teal" />
      <p className="eyebrow text-primary">Quick answer</p>
      <p className="mt-3 text-[1.1rem] leading-relaxed text-ink">{renderInlineLinks(text)}</p>
    </aside>
  );
}

/* ── Facts and meters ────────────────────────────────────────────── */

export function FactGrid({ facts }: { facts: { label: string; value: string; note?: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line sm:grid-cols-3">
      {facts.map((f) => (
        <div key={f.label} className="flex flex-col-reverse bg-white p-5">
          {f.note && <p className="mt-1 text-xs text-muted">{f.note}</p>}
          <dt className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{f.label}</dt>
          <dd className="font-display text-2xl font-semibold tabular-nums text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function StatTiles({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-light flex flex-col-reverse rounded-[var(--radius-lg)] px-5 py-4">
          <dt className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{s.label}</dt>
          <dd className="font-display text-2xl font-semibold tabular-nums text-primary">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Meter({ percent, tone }: { percent: number; tone: 'teal' | 'primary' }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div className="relative h-2 rounded-full bg-cloud" role="presentation">
      <div
        className={`absolute inset-y-0 left-0 rounded-full ${tone === 'teal' ? 'bg-gradient-to-r from-mint to-teal' : 'bg-gradient-to-r from-royal to-primary'}`}
        style={{ width: `${p}%` }}
      />
      <span
        className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow ${tone === 'teal' ? 'bg-teal' : 'bg-primary'}`}
        style={{ left: `${p}%` }}
      />
    </div>
  );
}

export function ValueMeter({ price, min, max }: { price: number; min: number; max: number }) {
  const percent = max === min ? 50 : ((price - min) / (max - min)) * 100;
  return (
    <div className="rounded-[var(--radius-xl)] border border-line bg-cloud p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Price within this section</span>
        <span className="font-display text-xl font-semibold tabular-nums text-teal">{gbp(price)}</span>
      </div>
      <Meter percent={percent} tone="teal" />
      <div className="mt-3 flex justify-between text-xs tabular-nums text-muted">
        <span>Lowest {gbp(min)}</span>
        <span>Highest {gbp(max)}</span>
      </div>
    </div>
  );
}

export function CalorieBar({ kcal }: { kcal: number }) {
  const percent = Math.round((kcal / REFERENCE_INTAKE_KCAL) * 100);
  return (
    <div className="rounded-[var(--radius-xl)] border border-line bg-cloud p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Share of a 2,000 kcal day
        </span>
        <span className="font-display text-xl font-semibold tabular-nums text-primary">
          {kcal} kcal <span className="text-sm text-muted">({percent}%)</span>
        </span>
      </div>
      <Meter percent={percent} tone="primary" />
      <p className="mt-3 text-xs text-muted">As listed, before any extra sides, sauces or drinks.</p>
    </div>
  );
}

/* ── Allergens ───────────────────────────────────────────────────── */

export function AllergenPanel({ contains }: { contains: string[] }) {
  const notListed = ALL_ALLERGENS.filter((a) => !contains.includes(a));
  return (
    <div className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line sm:grid-cols-2">
      <div className="bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8E1616]">Contains</p>
        {contains.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {contains.map((a) => (
              <li key={a} className="rounded-full border border-[#B71C1C]/20 bg-[#FDF1F1] px-3 py-1 text-sm font-medium capitalize text-[#8E1616]">
                {a}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink/70">No allergens are listed in our data. Treat this as unverified.</p>
        )}
      </div>
      <div className="bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Not listed</p>
        {contains.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {notListed.map((a) => (
              <li key={a} className="rounded-full border border-line px-3 py-1 text-sm capitalize text-muted">
                {a}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-ink/70">Ask staff for the current allergen record.</p>
        )}
      </div>
      <p className="bg-cloud px-6 py-4 text-sm leading-relaxed text-ink/70 sm:col-span-2">
        Recipes and suppliers change, and kitchens handle all 14 major allergens. Always tell staff about an allergy
        and check the official allergen information before ordering. No dish can be guaranteed allergen free.
      </p>
    </div>
  );
}

/* ── Lists and cards ─────────────────────────────────────────────── */

export function PlateList({ items }: { items: { name: string; note: string }[] }) {
  return (
    <ol className="divide-y divide-line rounded-[var(--radius-xl)] border border-line bg-white">
      {items.map((c, i) => (
        <li key={c.name} className="flex gap-5 px-6 py-5">
          <span className="font-display text-2xl font-semibold tabular-nums text-primary/25">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <p className="font-semibold text-ink">{c.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/70">{c.note}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function CardGrid({
  items,
  numbered,
  columns = 2,
}: {
  items: { title: string; text: string }[];
  numbered?: boolean;
  columns?: 2 | 3 | 4;
}) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
  return (
    <ul className={`grid gap-4 ${cols}`}>
      {items.map((b, i) => (
        <li key={b.title} className="lift rounded-[var(--radius-xl)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
          {numbered && (
            <span className="font-display text-3xl font-semibold text-primary/25">{String(i + 1).padStart(2, '0')}</span>
          )}
          <h3 className={`font-display text-lg font-semibold text-ink ${numbered ? 'mt-3' : ''}`}>{b.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">{b.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function TipsList({ tips }: { tips: string[] }) {
  return (
    <ul className="space-y-3">
      {tips.map((t) => (
        <li key={t} className="flex gap-4 rounded-[var(--radius-lg)] border border-line bg-white px-5 py-4">
          <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
          <p className="text-[0.98rem] leading-relaxed text-ink/75">{t}</p>
        </li>
      ))}
    </ul>
  );
}

export function PairingCards({ pairings }: { pairings: { item: MenuItem; reason: string }[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {pairings.map(({ item, reason }) => (
        <li key={item.slug}>
          <Link
            href={getProductUrl(item.category, item.slug)}
            className="lift group flex h-full flex-col rounded-[var(--radius-xl)] border border-line bg-mist/60 p-6 hover:border-primary/30"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-primary">{item.name}</h3>
              {item.typicalPriceGbp !== null && (
                <span className="text-sm font-semibold tabular-nums text-teal">{gbp(item.typicalPriceGbp)}</span>
              )}
            </div>
            <p className="mt-2 flex-grow text-sm leading-relaxed text-ink/70">{reason}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function HighlightsQuad({
  highlights,
}: {
  highlights: { label: string; item: MenuItem; text: string; stat: string }[];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {highlights.map((h) => (
        <li key={h.label}>
          <Link
            href={getProductUrl(h.item.category, h.item.slug)}
            className="lift group flex h-full flex-col rounded-[var(--radius-xl)] border border-line bg-white p-6 shadow-[var(--shadow-card)] hover:border-primary/30"
          >
            <span className="eyebrow text-teal">{h.label}</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink group-hover:text-primary">{h.item.name}</h3>
            <p className="mt-1 text-sm font-semibold tabular-nums text-primary">{h.stat}</p>
            <p className="mt-3 flex-grow text-sm leading-relaxed text-ink/70">{h.text}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ── Navigation ──────────────────────────────────────────────────── */

export function TableOfContents({ items, variant }: { items: { id: string; label: string }[]; variant: 'pills' | 'list' }) {
  if (variant === 'pills') {
    return (
      <nav aria-label="On this page" className="overflow-x-auto">
        <ul className="flex gap-2 whitespace-nowrap">
          {items.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="inline-block rounded-full border border-line bg-white px-4 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:border-primary/40 hover:text-primary"
              >
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
  return (
    <nav aria-label="On this page">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">On this page</p>
      <ul className="mt-3 space-y-1 border-l border-line">
        {items.map((t) => (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              className="-ml-px block border-l border-transparent py-1 pl-4 text-sm text-ink/70 transition-colors hover:border-primary hover:text-primary"
            >
              {t.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
