import Link from 'next/link';
import { HeroSearch } from '@/components/hero-search';
import type { SearchItem } from '@/lib/search-index';

interface HeroPanelProps {
  searchItems: SearchItem[];
  itemCount: number;
  categoryCount: number;
  cityCount: number;
  lastUpdated?: string;
}

const QUICK_LINKS = [
  { label: 'Breakfast', href: '/breakfast-menu' },
  { label: 'Steak Club', href: '/steak-club' },
  { label: 'Curry Club', href: '/curry-club' },
  { label: 'Sunday roasts', href: '/sunday-roasts' },
  { label: 'Kids menu', href: '/kids-menu' },
  { label: 'Drinks', href: '/drinks-menu' },
];

export function HeroPanel({
  searchItems,
  itemCount,
  categoryCount,
  cityCount,
  lastUpdated = 'October 2026',
}: HeroPanelProps) {
  const stats = [
    { value: String(itemCount), label: 'Dishes and drinks' },
    { value: String(categoryCount), label: 'Menu sections' },
    { value: String(cityCount), label: 'City guides' },
    { value: lastUpdated, label: 'Last checked' },
  ];

  return (
    // The section itself is not clipped, so the search dropdown can extend
    // below it. Background decoration is clipped in its own layer.
    <section aria-labelledby="hero-title" className="relative z-20 bg-navy-deep text-white">
      <div className="shell relative pb-20 pt-32 sm:pb-24 sm:pt-40">
        <div className="mx-auto max-w-[920px] text-center">
          <h1
            id="hero-title"
            className="enter enter-2 mt-7 font-display font-medium text-white"
            style={{
              fontSize: 'clamp(2.5rem, 5vw + 1rem, 5rem)',
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              fontVariationSettings: '"opsz" 144, "SOFT" 50',
            }}
          >
            Wetherspoons Menu With Prices{' '}
            <span
              className="bg-clip-text italic text-transparent"
              style={{ backgroundImage: 'linear-gradient(110deg, #b9e3e2 0%, #7CC7C5 45%, #d6e8fb 100%)' }}
            >
              2026
            </span>
          </h1>

          <p
            className="enter enter-3 mx-auto mt-7 max-w-[640px] text-white/70"
            style={{ fontSize: 'clamp(1.02rem, 0.5vw + 0.95rem, 1.2rem)', lineHeight: 1.65 }}
          >
            Browse the full Wetherspoons food menu and drinks list with typical prices, calories and
            allergens. Compare Spoons menu prices and club deals before you visit your local pub.
          </p>
        </div>

        <div className="enter enter-4 mx-auto mt-11 max-w-[900px]">
          <div className="glass-dark rounded-[28px] p-2 sm:p-2.5">
            <HeroSearch items={searchItems} />
          </div>
        </div>

        <nav aria-label="Popular menu sections" className="enter enter-5 mx-auto mt-7 max-w-[900px]">
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-full border border-white/15 px-4 py-1.5 text-[13px] font-medium text-white/75 transition-all duration-[var(--duration-normal)] hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <dl className="enter enter-5 glass-dark mx-auto mt-16 grid max-w-[960px] grid-cols-2 overflow-hidden rounded-[22px] sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col-reverse px-6 py-6 text-center ${i % 2 === 1 ? 'border-l border-white/10' : ''} ${
                i > 1 ? 'border-t border-white/10 sm:border-t-0' : ''
              } ${i === 2 ? 'sm:border-l' : ''}`}
            >
              <dt className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white/50">{stat.label}</dt>
              <dd
                className={`font-display font-medium ${i === 3 ? 'text-xl text-mint sm:text-2xl' : 'text-4xl text-white'}`}
                style={{ letterSpacing: '-0.02em' }}
              >
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-center text-xs text-white/45">
          Prices are typical and variable by pub. Check your chosen pub before ordering.
        </p>
      </div>
    </section>
  );
}
