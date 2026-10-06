import Link from 'next/link';
import { Wordmark } from '@/components/wordmark';
import { getNavData, GUIDE_LINKS, COMPANY_LINKS, LEGAL_LINKS } from '@/lib/nav';

export function SiteFooter() {
  const { categories, regions, totalPubs, cityCount } = getNavData();
  const half = Math.ceil(categories.length / 2);
  const cities = regions.flatMap((r) => r.cities).sort((a, b) => a.name.localeCompare(b.name));

  const heading = 'font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-mint';
  const link = 'link-underline text-sm text-white/65 transition-colors hover:text-white';

  return (
    <footer className="relative overflow-hidden bg-navy-deep text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

      {/* ── CTA band ─────────────────────────────────────── */}
      <div className="shell pt-16 sm:pt-20">
        <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-white/10 bg-white/[0.04] p-8 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-2xl font-semibold">Find your nearest Spoons</p>
            <p className="mt-2 text-sm text-white/60">
              {totalPubs} pubs across {cityCount} UK cities, with directions and local prices.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/locations" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-navy hover:bg-mist">
              Browse locations
            </Link>
            <Link href="/" className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              View full menu
            </Link>
          </div>
        </div>
      </div>

      {/* ── Link columns ─────────────────────────────────── */}
      <div className="shell pb-10 pt-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
          <div className="max-w-xs">
            <Wordmark variant="light" />
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              An independent guide to the Wetherspoons menu, with typical UK prices, calories, allergens and food club details in one place.
            </p>
            <ul className="mt-6 space-y-3">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={heading}>Menu</p>
            <ul className="mt-5 space-y-3">
              {categories.slice(0, half).map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className={link}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={heading}>More menu</p>
            <ul className="mt-5 space-y-3">
              {categories.slice(half).map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className={link}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={heading}>Guides</p>
            <ul className="mt-5 space-y-3">
              {GUIDE_LINKS.map((g) => (
                <li key={g.href}>
                  <Link href={g.href} className={link}>
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={heading}>
              <Link href="/locations" className="hover:text-white">
                Locations
              </Link>
            </p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {cities.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className={link}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-relaxed text-white/60">
          <p>
            <strong className="font-semibold text-white">SpoonsMenu is an independent menu guide.</strong> Not affiliated with J D Wetherspoon plc. All
            prices shown are typical only and vary by pub. Check your chosen pub before ordering.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>Content reviewed October 2026. © 2026 SpoonsMenu</p>
          <ul className="flex flex-wrap gap-6">
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
