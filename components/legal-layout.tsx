import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { AUTHOR, LAST_REVIEWED, LAST_REVIEWED_ISO, CONTACT_EMAIL } from '@/lib/site-identity';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

interface LegalLayoutProps {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  imageAlt: string;
  sections: LegalSection[];
  summary?: { label: string; value: string }[];
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
}

export function AuthorByline() {
  return (
    <div className="flex items-center gap-3">
      {AUTHOR.photo ? (
        <Image src={AUTHOR.photo} alt={AUTHOR.name} width={44} height={44} className="h-11 w-11 rounded-full object-cover" />
      ) : (
        <span className="grid h-11 w-11 place-items-center rounded-full bg-navy-deep font-display text-sm font-semibold text-mint">
          {initials(AUTHOR.name)}
        </span>
      )}
      <div className="text-sm leading-tight">
        <p className="text-ink/60">
          Written and reviewed by{' '}
          <Link href={`/author/${AUTHOR.slug}`} className="font-semibold text-ink underline-offset-4 hover:underline">
            {AUTHOR.name}
          </Link>
        </p>
        <p className="mt-1 text-ink/50">
          Last reviewed <time dateTime={LAST_REVIEWED_ISO}>{LAST_REVIEWED}</time>
        </p>
      </div>
    </div>
  );
}

export function LegalLayout({ slug, eyebrow, title, intro, imageAlt, sections, summary }: LegalLayoutProps) {
  return (
    <main className="pt-24">
      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: title, href: `/${slug}` }]} />
          <p className="eyebrow mt-2 text-teal">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">{title}</h1>
          <p className="mt-5 max-w-[var(--measure)] text-lg leading-relaxed text-ink/75">{intro}</p>
          <div className="mt-7">
            <AuthorByline />
          </div>
          {summary && (
            <dl className="mt-8 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
              {summary.map((s) => (
                <div key={s.label} className="rounded-2xl border border-line bg-white px-4 py-4 shadow-sm">
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-ink/50">{s.label}</dt>
                  <dd className="mt-1 font-display text-lg font-semibold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm">
            <Image
              src={`/images/pages/${slug}.webp`}
              alt={imageAlt}
              width={1200}
              height={630}
              className="aspect-video w-full object-cover sm:aspect-[21/9]"
              priority
            />
          </div>
        </div>
      </header>

      <div className="shell grid gap-12 py-16 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-28">
            <p className="eyebrow text-teal">On this page</p>
            <ol className="mt-4 space-y-2 border-l border-line text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-ink/65 transition hover:border-teal hover:text-ink">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-[var(--measure)]">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 border-b border-line py-9 first:pt-0 last:border-0">
              <h2 className="font-display text-2xl font-semibold text-ink sm:text-[1.75rem]">
                <span className="mr-2 text-teal">{String(i + 1).padStart(2, '0')}</span>
                {s.title}
              </h2>
              <div className="legal-body mt-4 space-y-4 text-[1.04rem] leading-relaxed text-ink/80">{s.body}</div>
            </section>
          ))}

          <div className="mt-10 rounded-[24px] bg-navy-deep p-8 text-white">
            <p className="eyebrow text-mint">Questions about this page?</p>
            <p className="mt-3 text-white/80">
              Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-white underline underline-offset-4">
                {CONTACT_EMAIL}
              </a>{' '}
              or use our{' '}
              <Link href="/contact" className="font-semibold text-white underline underline-offset-4">
                contact page
              </Link>
              . We aim to reply within two working days.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

/** Small helpers for consistent legal body typography. */
export function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-teal/30 bg-foam px-5 py-4 text-ink/85">{children}</div>;
}

export function DataTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-cloud text-ink">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line align-top">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-3 text-ink/80">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
