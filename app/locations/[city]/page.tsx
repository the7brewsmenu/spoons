import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { cities } from '@/content/cities';
import { menuItems } from '@/content/menu';
import type { CityRecord, PubListing } from '@/lib/types';
import { cityMetadata } from '@/lib/metadata';
import { JsonLd, faqSchema } from '@/lib/schema';
import { getCityUrl } from '@/lib/routes';
import { CITY_REGIONS } from '@/lib/regions';
import { loadCityContent } from '@/lib/generated-content';
import { loadCityDetails, mergePubDetails } from '@/lib/pub-details';
import { cityAreas, cityVars, fillDeep, nearbyCities } from '@/lib/content-facts';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import { PriceNotice } from '@/components/price-notice';
import { CompareTable } from '@/components/compare-table';
import { BandSection, CardGrid, Prose, QuickAnswer, StatTiles } from '@/components/content/sections';

export async function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export const dynamicParams = false;

type Params = Promise<{ city: string }>;

function getContent(city: CityRecord) {
  const raw = loadCityContent(city.slug);
  return raw ? fillDeep(raw, cityVars(city)) : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) return {};
  const base = cityMetadata(cityData);
  const content = getContent(cityData);
  if (!content) return base;
  const { title, description } = content.meta;
  return { ...base, title, description, openGraph: { ...base.openGraph, title, description } };
}

const POPULAR_SLUGS = ['traditional-breakfast', 'classic-beef-burger', 'chicken-tikka-masala', 'fish-and-chips', 'margherita-pizza'];

function directionsUrl(pub: PubListing) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pub.name}, ${pub.address}`)}`;
}

export default async function CityPage({ params }: { params: Params }) {
  const { city } = await params;
  const cityData = cities.find((c) => c.slug === city);
  if (!cityData) notFound();

  const content = getContent(cityData);
  const areas = cityAreas(cityData);
  const details = loadCityDetails(cityData.slug);
  const pubs = mergePubDetails(cityData.pubs, details);
  const openPubs = pubs.filter((p) => p.status === 'open');
  const region = CITY_REGIONS[cityData.slug];
  const nearby = nearbyCities(cityData);
  const faqs = content?.faqs.length ? content.faqs : cityData.faqs;
  const areaText = new Map((content?.areas ?? []).map((a) => [a.area, a.text]));

  // Popular dishes: preferred slugs if present, otherwise the first item of key sections.
  let popular = POPULAR_SLUGS.map((s) => menuItems.find((m) => m.slug === s)).filter(Boolean) as typeof menuItems;
  if (popular.length < 4) {
    popular = (['breakfast-menu', 'burgers', 'curry-club', 'fish-dishes', 'pizza'] as const)
      .map((c) => menuItems.find((m) => m.category === c))
      .filter(Boolean) as typeof menuItems;
  }

  return (
    <main className="pt-24">
      {faqs.length > 0 && <JsonLd json={faqSchema(faqs)} />}

      {/* ── Hero ───────────────────────────────────────────────── */}
      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Locations', href: '/locations' },
              { label: cityData.name, href: getCityUrl(cityData.slug) },
            ]}
          />
          <p className="eyebrow mt-2 text-teal">{region ?? 'City guide'}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons in {cityData.name}: pubs, menu and prices
          </h1>
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose text={content?.intro ?? cityData.summary} />
          </div>
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: String(openPubs.length), label: 'Pubs listed' },
                { value: String(areas.length), label: 'Areas' },
                { value: '8am', label: 'Typical breakfast start' },
                { value: cityData.checkedOn, label: 'Data checked' },
              ]}
            />
          </div>
        </div>
      </header>

      {content && (
        <div className="shell pt-12">
          <QuickAnswer text={content.quickAnswer} />
        </div>
      )}

      {/* ── Pub directory, grouped by area ─────────────────────── */}
      <BandSection
        id="pubs"
        eyebrow="Directory"
        title={`Wetherspoon pubs in ${cityData.name}`}
        intro={details?.localNote ?? 'Grouped by area. Check opening times with the pub before you travel.'}
      >
        <div className="space-y-12">
          {areas.map((area) => (
            <div key={area} className="reveal">
              <div className="mb-5 grid gap-3 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
                <h3 className="font-display text-xl font-semibold text-ink">{area}</h3>
                {areaText.get(area) && <p className="text-[0.98rem] leading-relaxed text-ink/70">{areaText.get(area)}</p>}
              </div>
              <ul className="grid gap-4 md:grid-cols-2">
                {pubs
                  .filter((p) => p.area === area)
                  .map((pub) => (
                    <li key={pub.name} className="lift flex flex-col rounded-[var(--radius-xl)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-lg font-semibold text-ink">{pub.name}</h4>
                        {pub.status !== 'open' && (
                          <span className="rounded-full bg-foam px-2.5 py-0.5 text-xs font-semibold text-teal-dark">
                            {pub.status.replace('-', ' ')}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted">{pub.address}</p>
                      {pub.history && <p className="mt-3 text-[0.95rem] leading-relaxed text-ink/75">{pub.history}</p>}
                      {pub.nearestStation && (
                        <p className="mt-3 text-sm text-ink/70">
                          <span className="font-semibold text-ink">Nearest station:</span> {pub.nearestStation}
                        </p>
                      )}
                      {pub.features && pub.features.length > 0 && (
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {pub.features.map((f) => (
                            <li key={f} className="rounded-full bg-foam px-3 py-1 text-xs font-medium text-teal-dark">{f}</li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-auto flex gap-5 pt-5 text-sm font-semibold">
                        <a href={directionsUrl(pub)} target="_blank" rel="noopener noreferrer" className="link-underline text-primary">
                          Get directions
                        </a>
                        <a href={pub.sourceUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-ink/60">
                          Official pub page
                        </a>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </BandSection>

      {/* ── Menu and prices ────────────────────────────────────── */}
      <BandSection id="prices" tone="cloud" eyebrow="Menu" title={`Wetherspoons menu prices in ${cityData.name}`}>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Prose text={content?.pricing ?? 'The menu is the same nationally, but each pub sets its own prices. City centre and station pubs can charge more than suburban pubs.'} />
            <div className="mt-6">
              <PriceNotice variant="compact" />
            </div>
            <Link href="/" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white hover:bg-primary-hover">
              View the full menu
            </Link>
          </div>
          <CompareTable
            title="Popular dishes at typical prices"
            items={popular.map((i) => ({ name: i.name, price: i.typicalPriceGbp, calories: i.caloriesKcal, slug: i.slug, category: i.category }))}
            compareBy="price"
          />
        </div>
      </BandSection>

      {content && (
        <>
          <BandSection id="clubs" eyebrow="Times and deals" title={`Breakfast and food club days in ${cityData.name}`}>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Prose text={content.breakfastAndClubs} />
              <div className="space-y-3">
                <Link href="/breakfast-times" className="lift block rounded-[var(--radius-lg)] border border-line bg-cloud p-5 font-semibold text-ink hover:text-primary">
                  Breakfast times
                </Link>
                <Link href="/food-clubs" className="lift block rounded-[var(--radius-lg)] border border-line bg-cloud p-5 font-semibold text-ink hover:text-primary">
                  Food club days
                </Link>
              </div>
            </div>
          </BandSection>

          <BandSection id="tips" tone="mist" eyebrow="Visiting" title={`Tips for visiting a Wetherspoons in ${cityData.name}`}>
            <CardGrid items={content.tips} numbered columns={content.tips.length >= 4 ? 4 : 3} />
          </BandSection>
        </>
      )}

      {/* ── FAQs ───────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <BandSection id="faqs" eyebrow="Questions" title={`Wetherspoons ${cityData.name} questions`}>
          <FAQList faqs={faqs} />
        </BandSection>
      )}

      {/* ── Nearby ─────────────────────────────────────────────── */}
      <BandSection id="nearby" tone="cloud" eyebrow="Nearby" title={`Wetherspoons near ${cityData.name}`}>
        <div className="flex flex-wrap gap-3">
          {nearby.map((n) => (
            <Link
              key={n.slug}
              href={getCityUrl(n.slug)}
              className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/70 hover:border-primary/40 hover:text-primary"
            >
              Wetherspoons in {n.name}
            </Link>
          ))}
          <Link href="/locations" className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-medium text-ink/70 hover:border-primary/40 hover:text-primary">
            All locations
          </Link>
        </div>
        <div className="mt-12">
          <SourceNote checkedDate={cityData.checkedOn} correctionHref="/contact" />
        </div>
      </BandSection>
    </main>
  );
}
