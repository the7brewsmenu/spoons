import Link from 'next/link';
import { homeMetadata } from '@/lib/metadata';
import { menuItems } from '@/content/menu';
import { categories } from '@/content/categories';
import { cities } from '@/content/cities';
import { CATEGORY_NAMES, CATEGORY_SLUGS } from '@/lib/types';
import type { MenuItem } from '@/lib/types';
import { buildSearchIndex } from '@/lib/search-index';
import { getCategoryUrl } from '@/lib/routes';
import { HeroPanel } from '@/components/hero-panel';
import { CompareTable } from '@/components/compare-table';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import {
  CATEGORY_GUIDES,
  CLUB_GUIDES,
  SERVICE_TIMES,
  ORDER_STEPS,
  PRICE_FACTORS,
  METHOD_POINTS,
  UK_ALLERGENS,
  buildHomeFaqs,
} from '@/content/home';
import {
  JsonLd,
  JsonLdRaw,
  organizationSchema,
  websiteSchema,
  webPageSchema,
  menuSchema,
  faqSchema,
} from '@/lib/schema';

export const metadata = homeMetadata();

/* ------------------------------------------------------------------ */
/* Data helpers                                                        */
/* ------------------------------------------------------------------ */

const gbp = (n: number) => `\u00A3${n.toFixed(2)}`;

function toRow(i: MenuItem) {
  return {
    name: i.name,
    price: i.typicalPriceGbp,
    calories: i.caloriesKcal,
    slug: i.slug,
    category: i.category,
  };
}

function priceStats(items: MenuItem[]) {
  const prices = items
    .map((i) => i.typicalPriceGbp)
    .filter((p): p is number => p !== null);
  if (prices.length === 0) return null;
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((a, b) => a + b, 0) / prices.length,
  };
}

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

function Heading({
  eyebrow,
  title,
  intro,
  center,
  dark,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={`reveal mb-12 ${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      <span className={`eyebrow ${dark ? 'text-mint' : 'text-teal'}`}>{eyebrow}</span>
      <h2
        className={`mt-3 font-display text-3xl font-semibold leading-tight sm:text-[2.6rem] ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-4 text-[1.05rem] leading-relaxed ${dark ? 'text-white/65' : 'text-ink/70'}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const overall = priceStats(menuItems);
  const cheapest = menuItems
    .filter((i) => i.typicalPriceGbp !== null)
    .sort((a, b) => (a.typicalPriceGbp ?? 0) - (b.typicalPriceGbp ?? 0))[0];
  const under500 = menuItems.filter(
    (i) => i.caloriesKcal !== null && i.caloriesKcal <= 500
  ).length;
  const vegItems = menuItems.filter(
    (i) => i.dietaryTags.includes('vegetarian') || i.dietaryTags.includes('vegan')
  );

  const lowestPriceItems = menuItems
    .filter((i) => i.typicalPriceGbp !== null)
    .sort((a, b) => (a.typicalPriceGbp ?? 0) - (b.typicalPriceGbp ?? 0))
    .slice(0, 8)
    .map(toRow);
  const lighterChoices = menuItems
    .filter((i) => i.caloriesKcal !== null && i.caloriesKcal > 0)
    .sort((a, b) => (a.caloriesKcal ?? 0) - (b.caloriesKcal ?? 0))
    .slice(0, 8)
    .map(toRow);

  const sectionRows = CATEGORY_SLUGS.map((slug) => {
    const items = menuItems.filter((i) => i.category === slug);
    return { slug, name: CATEGORY_NAMES[slug], count: items.length, stats: priceStats(items) };
  });

  const faqs = buildHomeFaqs({
    minPrice: overall ? gbp(overall.min) : 'a few pounds',
    maxPrice: overall ? gbp(overall.max) : 'the high teens',
    vegCount: vegItems.length,
    itemCount: menuItems.length,
  });

  const keyStats = [
    {
      value: cheapest?.typicalPriceGbp != null ? gbp(cheapest.typicalPriceGbp) : 'n/a',
      label: 'Lowest typical price',
      note: cheapest?.name ?? '',
    },
    {
      value: overall ? gbp(overall.avg) : 'n/a',
      label: 'Average typical price',
      note: `Across ${menuItems.length} items`,
    },
    { value: String(under500), label: 'Items under 500 kcal', note: 'As listed, before extras' },
    { value: String(vegItems.length), label: 'Vegetarian and vegan', note: 'Tagged dishes' },
  ];

  return (
    <>
      <JsonLd json={organizationSchema()} />
      <JsonLd json={websiteSchema()} />
      <JsonLd json={menuSchema(menuItems)} />
      <JsonLd json={faqSchema(faqs)} />
      <JsonLdRaw json={webPageSchema({
        url: 'https://spoonsmenu.co.uk',
        name: 'Wetherspoons Menu With Prices UK | Latest Prices 2026',
        description: 'Explore the latest Wetherspoons menu with prices, food, drinks, breakfast, burgers, pub classics and more. Find your favourite Wetherspoons meals and prices.',
        dateModified: '2026-10-06',
      })} />

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <HeroPanel
        searchItems={buildSearchIndex(menuItems)}
        itemCount={menuItems.length}
        categoryCount={categories.length}
        cityCount={cities.length}
        lastUpdated="October 2026"
      />

      {/* â”€â”€ Intro: split layout with live stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-white py-24">
        <div className="shell grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="reveal">
            <span className="eyebrow text-teal">About this guide</span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-[2.6rem]">
              An independent guide to the Wetherspoons menu
            </h2>
            <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-ink/75">
              <p>
                The Wetherspoons menu is one of the largest pub menus in the UK. From the first breakfast of
                the day to a Thursday curry or a pint of guest ale, the JD Wetherspoon menu covers food and
                drink for almost every occasion. That range is exactly why it helps to see the whole
                Wetherspoons pub menu in one place before you visit.
              </p>
              <p>
                SpoonsMenu tracks the Wetherspoons menu 2026 dish by dish, with a typical price, calories,
                dietary tags and allergens for each one. Search the full Spoons menu, compare similar dishes
                side by side, or jump straight to the section you want, from breakfast and burgers to the kids
                menu.
              </p>
              <p>
                Wetherspoons prices are set pub by pub, so the same dish can cost a little more in a city
                centre or at an airport than in a market town. Every price here is labelled as typical for
                that reason. Use it to plan and compare, then confirm at your chosen pub.
              </p>
            </div>
          </div>

          <dl className="reveal grid grid-cols-2 gap-4">
            {keyStats.map((s) => (
              <div
                key={s.label}
                className="lift rounded-[var(--radius-xl)] border border-line bg-cloud p-6 shadow-[var(--shadow-card)]"
              >
                <dd className="font-display text-3xl font-semibold tabular-nums text-primary sm:text-4xl">
                  {s.value}
                </dd>
                <dt className="mt-2 text-sm font-semibold text-ink">{s.label}</dt>
                <p className="mt-1 line-clamp-1 text-xs text-muted">{s.note}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* â”€â”€ Full menu â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="main-menu" className="scroll-mt-20 bg-cloud py-24">
        <div className="shell">
          <Heading
            eyebrow="Full menu"
            title={`The full Wetherspoons menu: ${menuItems.length} dishes and drinks`}
            intro="Every dish and drink on the Wetherspoons food menu, grouped by section with typical prices and calories. Open any item for its full description, allergens and dietary tags."
          />

          {/* Category-grouped item listing for SEO heading structure */}
          <div className="mt-20 space-y-16">
            {CATEGORY_SLUGS.map((slug) => {
              const items = menuItems.filter((i) => i.category === slug);
              if (items.length === 0) return null;
              const catTitle = `Wetherspoons ${CATEGORY_NAMES[slug]}`;
              return (
                <div key={slug} className="reveal">
                  {/* Category header */}
                  <div className="mb-6 border-l-4 border-primary pl-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl font-semibold text-ink">
                        {catTitle}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-medium text-muted">{items.length} items</span>
                        <Link
                          href={getCategoryUrl(slug)}
                          className="font-semibold uppercase tracking-wider text-primary hover:text-primary-hover"
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                    {CATEGORY_GUIDES[slug] && (
                      <p className="mt-3 max-w-3xl text-[0.95rem] leading-relaxed text-ink/65">
                        {CATEGORY_GUIDES[slug].split('.').slice(0, 2).join('.') + '.'}
                      </p>
                    )}
                  </div>

                  {/* Product cards */}
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/${item.category}/${item.slug}`}
                          className="lift group flex flex-col rounded-[var(--radius-xl)] border border-line bg-white p-5 shadow-[var(--shadow-card)] transition-all hover:border-primary/30"
                        >
                          {/* Price + calories badges */}
                          <div className="flex items-center justify-between text-sm">
                            {item.typicalPriceGbp !== null ? (
                              <span className="font-display text-lg font-semibold tabular-nums text-primary">
                                {`\u00A3${item.typicalPriceGbp.toFixed(2)}`}
                              </span>
                            ) : (
                              <span className="text-xs text-muted">Price varies</span>
                            )}
                            {item.caloriesKcal !== null && (
                              <span className="rounded-full bg-foam px-2.5 py-0.5 text-xs font-semibold uppercase text-teal-dark">
                                {item.caloriesKcal} cal
                              </span>
                            )}
                          </div>

                          {/* Item name */}
                          <p className="mt-3 font-display text-[0.95rem] font-semibold leading-snug text-ink group-hover:text-primary">
                            {item.name}
                          </p>

                          {/* View details */}
                          <span className="mt-auto pt-4 text-xs font-semibold uppercase tracking-wider text-primary">
                            View details ›
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* â”€â”€ Menu sections explained â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-white py-24">
        <div className="shell">
          <Heading
            eyebrow="Section by section"
            title="Every part of the Wetherspoons menu explained"
            intro="What to expect from each part of the Wetherspoons menu UK pubs serve, how many dishes we track and the typical price range, so you can head straight for the food you fancy."
          />
          <div className="grid gap-5 md:grid-cols-2">
            {sectionRows.map((row) => (
              <Link
                key={row.slug}
                href={getCategoryUrl(row.slug)}
                className="lift reveal group flex flex-col rounded-[var(--radius-xl)] border border-line bg-white p-7 shadow-[var(--shadow-card)] hover:border-primary/30"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-ink transition-colors group-hover:text-primary">
                    {row.name}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {row.count} items
                    {row.stats && ` \u00B7 ${gbp(row.stats.min)} to ${gbp(row.stats.max)}`}
                  </span>
                </div>
                <p className="mt-4 flex-grow text-[0.95rem] leading-relaxed text-ink/70">
                  {CATEGORY_GUIDES[row.slug]}
                </p>
                <span className="link-underline mt-5 self-start text-sm font-semibold text-primary">
                  See the {row.name.toLowerCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Prices â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="prices" className="bg-mist py-24">
        <div className="shell">
          <Heading
            eyebrow="Typical prices"
            title="Wetherspoon menu prices by section"
            intro="Built from our own data, this table compares JD Wetherspoon menu prices across every section, with the number of items we track and the lowest, highest and average typical price. It is the quickest way to see where the best value sits."
          />

          <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Typical Wetherspoon menu prices by section</caption>
              <thead>
                <tr className="border-b border-line bg-cloud">
                  {['Section', 'Items', 'Lowest', 'Highest', 'Average'].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sectionRows.map((row) => (
                  <tr key={row.slug} className="border-b border-line transition-colors last:border-0 hover:bg-mist/60">
                    <th scope="row" className="px-6 py-4 font-medium">
                      <Link href={getCategoryUrl(row.slug)} className="text-ink transition-colors hover:text-primary">
                        {row.name}
                      </Link>
                    </th>
                    <td className="px-6 py-4 tabular-nums text-ink/70">{row.count}</td>
                    <td className="px-6 py-4 tabular-nums text-ink/70">{row.stats ? gbp(row.stats.min) : 'n/a'}</td>
                    <td className="px-6 py-4 tabular-nums text-ink/70">{row.stats ? gbp(row.stats.max) : 'n/a'}</td>
                    <td className="px-6 py-4 font-semibold tabular-nums text-teal">
                      {row.stats ? gbp(row.stats.avg) : 'n/a'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">
            All prices are typical and vary by pub. Data last checked October 2026.
          </p>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {PRICE_FACTORS.map((f) => (
              <div key={f.title} className="reveal glass-light rounded-[var(--radius-xl)] p-7">
                <h3 className="font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Comparisons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-white py-24">
        <div className="shell">
          <Heading
            eyebrow="Side by side"
            title="Best value and lighter picks on the Spoons menu"
            intro="The lowest typical prices and the lightest dishes by calories, pulled straight from our data."
            center
          />
          <div className="reveal grid gap-8 lg:grid-cols-2">
            <CompareTable title="Lowest typical prices" items={lowestPriceItems} compareBy="price" />
            <CompareTable title="Lighter choices by calories" items={lighterChoices} compareBy="calories" />
          </div>
        </div>
      </section>

      {/* â”€â”€ Food clubs (dark glass) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="food-clubs" className="bg-navy-deep py-24 text-white">
        <div className="shell">
          <Heading
            eyebrow="Weekly deals"
            title="Wetherspoons food club days"
            intro="Food clubs are the best known deals on the Wetherspoons menu. Each runs on a set day and bundles a main with a drink at one price. Participating pubs and dishes can vary, so check locally before you go."
            dark
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {CLUB_GUIDES.map((club) => (
              <Link
                key={club.href}
                href={club.href}
                className="reveal glass-dark group flex flex-col rounded-[var(--radius-xl)] p-8 transition-all duration-[var(--duration-normal)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-mint">{club.day}</span>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white">{club.name}</h3>
                <p className="mt-3 flex-grow text-[0.95rem] leading-relaxed text-white/65">{club.desc}</p>
                <span className="mt-6 text-sm font-semibold text-white/80 transition-colors group-hover:text-mint">
                  View {club.name.toLowerCase()} dishes
                </span>
              </Link>
            ))}
          </div>
          <div className="reveal mt-12">
            <Link
              href="/food-clubs"
              className="inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-navy-deep transition-all hover:-translate-y-0.5 hover:bg-mint"
            >
              Read the full food clubs guide
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ Service times (timeline) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="times" className="bg-white py-24">
        <div className="shell grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <span className="eyebrow text-teal">Opening and food times</span>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-[2.6rem]">
              Wetherspoons menu times
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/70">
              The Wetherspoons pub menu changes through the day, from breakfast in the morning to the main menu
              and food clubs from late morning onwards. These are typical times. Airport, station and some
              city pubs keep their own hours.
            </p>
            <Link
              href="/breakfast-times"
              className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
            >
              Breakfast times in detail
            </Link>
          </div>

          <ol className="relative space-y-6 border-l border-line pl-8">
            {SERVICE_TIMES.map((s) => (
              <li key={s.label} className="reveal relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[39px] top-2 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-primary shadow-[0_0_0_1px_var(--color-line)]"
                />
                <div className="rounded-[var(--radius-xl)] border border-line bg-cloud p-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">{s.time}</p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink">{s.label}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* â”€â”€ How to choose (numbered steps) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-cloud py-24">
        <div className="shell">
          <Heading
            eyebrow="Ordering tips"
            title="How to get the best from the Wetherspoons menu"
            intro="Four simple habits that help you order well, spend less and avoid surprises at the till."
          />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ORDER_STEPS.map((step, i) => (
              <li
                key={step.title}
                className="lift reveal rounded-[var(--radius-xl)] border border-line bg-white p-7 shadow-[var(--shadow-card)]"
              >
                <span className="font-display text-4xl font-semibold text-primary/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* â”€â”€ Dietary, calories, allergens â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="dietary" className="bg-white py-24">
        <div className="shell">
          <Heading
            eyebrow="Dietary information"
            title="Vegan, calories and allergens on the Wetherspoons menu"
            intro="Use these guides to narrow the menu down to what suits you. They help you plan, but your pub has the final, current information."
          />
          <div className="grid gap-5 lg:grid-cols-3">
            <Link
              href="/vegan-and-vegetarian-options"
              className="lift reveal group flex flex-col rounded-[var(--radius-xl)] border border-line bg-foam p-8"
            >
              <span className="font-display text-5xl font-semibold text-teal">{vegItems.length}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink group-hover:text-primary">
                Vegetarian and vegan dishes
              </h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-ink/70">
                Tagged dishes span breakfast, burgers, curries, pizza and sides. Vegetarian is not the same as
                vegan: cheese, egg, butter and some sauces rule a dish out for vegans, so check the tags.
              </p>
              <span className="mt-6 text-sm font-semibold text-primary">Vegan and vegetarian guide</span>
            </Link>

            <Link
              href="/nutrition-information"
              className="lift reveal group flex flex-col rounded-[var(--radius-xl)] border border-line bg-mist p-8"
            >
              <span className="font-display text-5xl font-semibold text-primary">{under500}</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink group-hover:text-primary">
                Items under 500 kcal
              </h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-ink/70">
                Calories are shown on every dish page. Figures apply to the dish as served, so added sides,
                sauces and drinks will raise the total for your meal.
              </p>
              <span className="mt-6 text-sm font-semibold text-primary">Nutrition guide</span>
            </Link>

            <Link
              href="/allergen-information"
              className="lift reveal group flex flex-col rounded-[var(--radius-xl)] border border-line bg-cloud p-8"
            >
              <span className="font-display text-5xl font-semibold text-ink">14</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-ink group-hover:text-primary">
                Major allergens to check
              </h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {UK_ALLERGENS.map((a) => (
                  <li key={a} className="rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink/70">
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex-grow text-sm leading-relaxed text-ink/70">
                Always tell staff about an allergy. Shared kitchens mean no dish can be guaranteed allergen free.
              </p>
              <span className="mt-6 text-sm font-semibold text-primary">Allergen guide</span>
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ Ordering â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-mist py-24">
        <div className="shell">
          <Heading
            eyebrow="How to order"
            title="Ordering from the Wetherspoons menu"
            intro="There are two ways to order from the Wetherspoon pub menu. Both use the same menu, but the app always shows the live prices for the pub you choose."
            center
          />
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="reveal glass-light rounded-[var(--radius-xl)] p-8">
              <h3 className="font-display text-xl font-semibold text-ink">Order at the table</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
                Use the Wetherspoon app or scan the QR code on your table. Choose your pub, enter your table
                number and your order is brought to you. It is the easiest way to see the exact local price
                before you pay.
              </p>
            </div>
            <div className="reveal glass-light rounded-[var(--radius-xl)] p-8">
              <h3 className="font-display text-xl font-semibold text-ink">Order at the bar</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/70">
                Prefer to order in person? Every pub takes orders at the bar, and staff can answer questions
                about allergens, swaps and what is available that day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Methodology â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-white py-24">
        <div className="shell">
          <Heading
            eyebrow="Our method"
            title="How we build this Wetherspoons menu guide"
            intro="A menu guide is only useful if you can trust it. Here is how our data is collected and labelled."
          />
          <div className="grid gap-px overflow-hidden rounded-[var(--radius-xl)] border border-line bg-line md:grid-cols-3">
            {METHOD_POINTS.map((m, i) => (
              <div key={m.title} className="reveal bg-white p-8">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
                  Step {i + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{m.text}</p>
              </div>
            ))}
          </div>
          <p className="reveal mt-6 text-sm text-muted">
            Spotted something out of date?{' '}
            <Link href="/contact" className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover">
              Send us a correction
            </Link>
            .
          </p>
        </div>
      </section>

      {/* â”€â”€ FAQs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-cloud py-24">
        <div className="shell">
          <div className="reveal">
            <FAQList faqs={faqs} title="Wetherspoons menu questions" />
          </div>
        </div>
      </section>

      {/* â”€â”€ Source â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section className="bg-white pb-20 pt-2">
        <div className="shell">
          <SourceNote checkedDate="October 2026" correctionHref="/contact" />
        </div>
      </section>
    </>
  );
}
