'use client';

import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wordmark } from '@/components/wordmark';
import { FOCUS_SEARCH_EVENT } from '@/lib/search-index';
import type { NavData } from '@/lib/nav';

type Simple = { name: string; href: string; blurb?: string };
type PanelKey = 'menu' | 'guides' | 'locations' | null;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function HeaderClient({ data, guides, company }: { data: NavData; guides: Simple[]; company: Simple[] }) {
  const [open, setOpen] = useState<PanelKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<PanelKey>(null);
  const [elevated, setElevated] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setOpen(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const enter = (k: PanelKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(k);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  };

  const handleSearchClick = (e: MouseEvent<HTMLAnchorElement>) => {
    setMobileOpen(false);
    if (pathname === '/') {
      e.preventDefault();
      window.dispatchEvent(new Event(FOCUS_SEARCH_EVENT));
    }
  };

  const catSlugs = data.categories.map((c) => `/${c.slug}`);
  const activeMenu = pathname === '/' || catSlugs.some((s) => pathname.startsWith(s));
  const activeGuides = guides.some((g) => pathname.startsWith(g.href));
  const activeLocations = pathname.startsWith('/locations');

  const triggerCls = (active: boolean, isOpen: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
      active || isOpen ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-16 bg-navy transition-shadow duration-300 sm:h-[72px] ${
        elevated || open ? 'shadow-[0_10px_30px_-12px_rgba(7,31,63,0.6)]' : ''
      }`}
      onMouseLeave={leave}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
      <div className="shell flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label="SpoonsMenu home" className="shrink-0 rounded-md">
          <Wordmark variant="light" />
        </Link>

        {/* ── Desktop nav ─────────────────────────────────── */}
        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {([
              ['menu', 'Menu', activeMenu],
              ['guides', 'Guides', activeGuides],
              ['locations', 'Locations', activeLocations],
            ] as const).map(([key, label, active]) => (
              <li key={key} onMouseEnter={() => enter(key)}>
                <button
                  type="button"
                  aria-expanded={open === key}
                  aria-controls={`mega-${key}`}
                  onClick={() => setOpen((o) => (o === key ? null : key))}
                  className={triggerCls(active, open === key)}
                >
                  {label}
                  <Chevron open={open === key} />
                </button>
              </li>
            ))}
            {company.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <li key={l.href} onMouseEnter={() => enter(null)}>
                  <Link href={l.href} aria-current={active ? 'page' : undefined} className={triggerCls(active, false)}>
                    {l.name.replace('SpoonsMenu', '').replace(' us', '').trim()}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/#hero-search"
            onClick={handleSearchClick}
            className="inline-flex items-center gap-3 rounded-full bg-white px-4 py-2 text-[13.5px] font-semibold text-navy transition-colors hover:bg-mist"
          >
            Search menu
            <kbd className="rounded-md bg-mist px-1.5 py-0.5 font-body text-[10px] font-semibold text-primary">/</kbd>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          {mobileOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* ── Mega panels ─────────────────────────────────── */}
      {open && (
        <div
          id={`mega-${open}`}
          className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-white shadow-[0_30px_60px_-20px_rgba(7,31,63,0.45)] lg:block"
          onMouseEnter={() => enter(open)}
        >
          <div className="shell py-8">
            {open === 'menu' && (
              <div className="grid grid-cols-[1fr_260px] gap-8">
                <div>
                  <div className="mb-5 flex items-baseline justify-between">
                    <p className="eyebrow text-teal">Wetherspoons menu</p>
                    <Link href="/" className="text-sm font-semibold text-primary hover:underline">
                      View full menu
                    </Link>
                  </div>
                  <ul className="grid grid-cols-3 gap-2">
                    {data.categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/${c.slug}`}
                          className={`group block rounded-[var(--radius-lg)] border p-4 transition-colors ${
                            pathname.startsWith(`/${c.slug}`) ? 'border-primary/30 bg-mist' : 'border-transparent hover:border-line hover:bg-cloud'
                          }`}
                        >
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-display text-[15px] font-semibold text-ink group-hover:text-primary">{c.name}</span>
                            {c.from && <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-teal">from {c.from}</span>}
                          </div>
                          <p className="mt-1 line-clamp-1 text-xs text-muted">{c.blurb}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--radius-xl)] bg-navy p-6 text-white">
                  <p className="eyebrow text-mint">Popular right now</p>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {data.categories
                      .filter((c) => ['breakfast-menu', 'burgers', 'curry-club', 'steak-club', 'fish-dishes'].includes(c.slug))
                      .map((c) => c.popular[0] && (
                        <li key={c.slug}>
                          <Link href={c.popular[0].href} className="text-white/80 hover:text-white">
                            {c.popular[0].name}
                          </Link>
                        </li>
                      ))}
                  </ul>
                  <Link href="/food-clubs" className="mt-6 inline-block rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy hover:bg-mist">
                    See weekly food clubs
                  </Link>
                </div>
              </div>
            )}

            {open === 'guides' && (
              <div className="grid grid-cols-[1fr_300px] gap-8">
                <div>
                  <p className="eyebrow mb-5 text-teal">Wetherspoons guides</p>
                  <ul className="grid grid-cols-3 gap-2">
                    {guides.map((g) => (
                      <li key={g.href}>
                        <Link
                          href={g.href}
                          className={`group block rounded-[var(--radius-lg)] border p-4 transition-colors ${
                            pathname.startsWith(g.href) ? 'border-primary/30 bg-mist' : 'border-transparent hover:border-line hover:bg-cloud'
                          }`}
                        >
                          <span className="font-display text-[15px] font-semibold text-ink group-hover:text-primary">{g.name}</span>
                          <p className="mt-1 text-xs text-muted">{g.blurb}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[var(--radius-xl)] bg-mist p-6">
                  <p className="eyebrow text-teal">This week</p>
                  <ul className="mt-4 space-y-3 text-sm">
                    {[
                      ['Tuesday', 'Steak Club', '/steak-club'],
                      ['Thursday', 'Curry Club', '/curry-club'],
                      ['Friday', 'Fish and chips', '/fish-dishes'],
                      ['Sunday', 'Sunday roasts', '/sunday-roasts'],
                    ].map(([d, n, h]) => (
                      <li key={d} className="flex justify-between gap-3">
                        <span className="text-muted">{d}</span>
                        <Link href={h} className="font-semibold text-ink hover:text-primary">
                          {n}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {open === 'locations' && (
              <div>
                <div className="mb-5 flex items-baseline justify-between">
                  <p className="eyebrow text-teal">
                    {data.totalPubs} pubs in {data.cityCount} UK cities
                  </p>
                  <Link href="/locations" className="text-sm font-semibold text-primary hover:underline">
                    Find a Wetherspoons near me
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                  {data.regions.map((r) => (
                    <div key={r.name}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{r.name}</p>
                      <ul className="mt-2 space-y-1.5">
                        {r.cities.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className={`text-sm hover:text-primary ${pathname === c.href ? 'font-semibold text-primary' : 'text-ink'}`}
                            >
                              {c.name} <span className="text-xs text-muted">({c.pubs})</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Mobile nav ──────────────────────────────────── */}
      {mobileOpen && (
        <div id="mobile-nav" className="absolute inset-x-0 top-full max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-white/10 bg-navy lg:hidden">
          <nav aria-label="Mobile navigation" className="shell flex flex-col py-4">
            {([
              ['menu', 'Menu'],
              ['guides', 'Guides'],
              ['locations', 'Locations'],
            ] as const).map(([key, label]) => (
              <div key={key} className="border-b border-white/5">
                <button
                  type="button"
                  aria-expanded={mobileSection === key}
                  onClick={() => setMobileSection((s) => (s === key ? null : key))}
                  className="flex w-full items-center justify-between py-3.5 text-base font-medium text-white/90"
                >
                  {label}
                  <Chevron open={mobileSection === key} />
                </button>
                {mobileSection === key && (
                  <ul className="grid grid-cols-2 gap-x-4 gap-y-2 pb-4">
                    {key === 'menu' && (
                      <>
                        <li className="col-span-2">
                          <Link href="/" className="text-sm font-semibold text-mint">
                            Full menu
                          </Link>
                        </li>
                        {data.categories.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/${c.slug}`} className="text-sm text-white/75 hover:text-white">
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                    {key === 'guides' &&
                      guides.map((g) => (
                        <li key={g.href} className="col-span-2">
                          <Link href={g.href} className="text-sm text-white/75 hover:text-white">
                            {g.name}
                          </Link>
                        </li>
                      ))}
                    {key === 'locations' && (
                      <>
                        <li className="col-span-2">
                          <Link href="/locations" className="text-sm font-semibold text-mint">
                            All locations and near me
                          </Link>
                        </li>
                        {data.regions.flatMap((r) => r.cities).sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} className="text-sm text-white/75 hover:text-white">
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </>
                    )}
                  </ul>
                )}
              </div>
            ))}
            {company.map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-white/5 py-3.5 text-base font-medium text-white/90 hover:text-mint">
                {l.name}
              </Link>
            ))}
            <Link href="/#hero-search" onClick={handleSearchClick} className="mt-4 rounded-full bg-white py-3 text-center text-sm font-semibold text-navy">
              Search menu
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
