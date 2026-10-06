import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cities } from '@/content/cities';
import { CITY_REGIONS } from '@/lib/regions';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import { LocationFinder } from '@/components/location-finder';
import { JsonLd, faqSchema } from '@/lib/schema';
import { BandSection, CardGrid, Prose, QuickAnswer, StatTiles, TableOfContents } from '@/components/content/sections';

const TITLE = 'Wetherspoons Near Me: UK Pub Locations and City Guides';
const DESC =
  'Find a Wetherspoons near you. Browse pubs in 20 UK cities by region, with addresses, directions, local menu prices, breakfast times and food club days.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/locations' },
  openGraph: { title: TITLE, description: DESC, url: '/locations' },
};

const totalPubs = cities.reduce((n, c) => n + c.pubs.length, 0);
const REGION_ORDER = [
  'London',
  'South East',
  'South West',
  'East Midlands',
  'West Midlands',
  'North West',
  'North East',
  'Yorkshire and the Humber',
  'Scotland',
  'Wales',
  'Northern Ireland',
];
const regions = REGION_ORDER.map((r) => ({
  name: r,
  cities: cities.filter((c) => CITY_REGIONS[c.slug] === r),
})).filter((r) => r.cities.length > 0);
const biggest = [...cities].sort((a, b) => b.pubs.length - a.pubs.length)[0];

const faqs = [
  {
    question: 'How do I find a Wetherspoons near me?',
    answer:
      'Use the location finder on this page to jump to the closest city guide, or browse the regions below. Each city guide lists Wetherspoons pubs with addresses and Google Maps directions. For any town not covered, use the official pub search on the Wetherspoon website or app.',
  },
  {
    question: 'How many Wetherspoons pubs are there in the UK?',
    answer:
      'J D Wetherspoon operates around 800 pubs across England, Scotland, Wales and Northern Ireland, plus a small number in the Republic of Ireland. SpoonsMenu currently covers ' +
      `${totalPubs} pubs across ${cities.length} major UK cities, with more being added.`,
  },
  {
    question: 'Which city has the most Wetherspoons?',
    answer: `London has by far the most Wetherspoons pubs of any UK city. Among the city guides on SpoonsMenu, ${biggest.name} has the most pubs listed, with ${biggest.pubs.length}.`,
  },
  {
    question: 'Are Wetherspoons prices the same in every pub?',
    answer:
      'No. Each pub sets its own prices, so the same dish can cost more in central London or at an airport than in a smaller town. The city guides on SpoonsMenu show typical prices as a guide. Check the Wetherspoon app for exact prices at a specific pub.',
  },
  {
    question: 'What time do Wetherspoons pubs open?',
    answer:
      'Most Wetherspoons pubs open at 8am and serve breakfast until 12 noon, with the main menu running until the kitchen closes, usually around 11pm. Opening and closing times vary by pub, so check the app before visiting.',
  },
  {
    question: 'Do all Wetherspoons pubs serve food?',
    answer:
      'The vast majority of Wetherspoons pubs serve the full food menu, including breakfast, mains and food clubs. A few locations, such as some airport or station sites, may have a reduced menu. The app shows the menu for each pub.',
  },
  {
    question: 'Can I order from a Wetherspoons pub on the app?',
    answer:
      'Yes. When you are in a Wetherspoons pub, you can choose that pub in the Wetherspoon app and order food and drinks to your table. The app also shows local prices and allergen information.',
  },
  {
    question: 'Is SpoonsMenu the official Wetherspoon website?',
    answer:
      'No. SpoonsMenu is an independent guide and is not affiliated with J D Wetherspoon. Pub details are checked regularly, but always confirm opening times and prices with the official Wetherspoon app or website before travelling.',
  },
];

export default function LocationsHubPage() {
  const toc = [
    { id: 'finder', label: 'Near me' },
    { id: 'regions', label: 'By region' },
    { id: 'all-cities', label: 'All cities' },
    { id: 'what-to-expect', label: 'What to expect' },
    { id: 'tips', label: 'Tips' },
    { id: 'faqs', label: 'Questions' },
  ];

  return (
    <main className="pt-24">
      <JsonLd json={faqSchema(faqs)} />

      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Locations', href: '/locations' }]} />
          <p className="eyebrow mt-2 text-teal">Pub finder</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Find a Wetherspoons near me
          </h1>
        <div className="mt-8 mb-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm max-w-[1200px]">
          <Image
            src="/images/pages/locations.webp"
            alt="Map showing Wetherspoons pub locations across the UK"
            width={1200}
            height={630}
            className="aspect-video w-full object-cover sm:aspect-[21/9]"
            priority
          />
        </div>
      
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose
              text={`Looking for your nearest Spoons? Browse ${totalPubs} Wetherspoons pubs across ${cities.length} UK cities, grouped by region. Each city guide lists pubs by area with addresses, Google Maps directions, typical local menu prices, breakfast times and food club days.`}
            />
          </div>
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: String(cities.length), label: 'City guides' },
                { value: String(totalPubs), label: 'Pubs listed' },
                { value: String(regions.length), label: 'UK regions' },
                { value: '8am', label: 'Typical opening' },
              ]}
            />
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-10 border-b border-line bg-white/85 py-3 backdrop-blur">
        <div className="shell">
          <TableOfContents items={toc} variant="pills" />
        </div>
      </div>

      <div className="shell pt-12">
        <QuickAnswer
          text={`To find a Wetherspoons near you, use the location finder below or pick your city. SpoonsMenu lists ${totalPubs} pubs across ${cities.length} UK cities with addresses and directions. Most Wetherspoons open at 8am, serve breakfast until 12 noon and set their own prices, so check the official app for exact times and prices at each pub.`}
        />
      </div>

      <BandSection id="finder" eyebrow="Near me" title="Find your nearest Wetherspoons">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <Prose text="Allow location access and the finder will suggest the closest city guide to you. SpoonsMenu does not store your location. If your town is not listed yet, the official Wetherspoon pub search covers every pub." />
            <div className="mt-6">
              <LocationFinder />
            </div>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-line bg-cloud p-6">
            <p className="font-display text-lg font-semibold text-ink">Official pub search</p>
            <p className="mt-2 text-sm text-ink/70">For opening hours and details of every pub in the UK and Ireland, use the official Wetherspoon pub finder.</p>
            <a
              href="https://www.jdwetherspoon.com/pub-search"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
            >
              Open official pub finder
            </a>
          </div>
        </div>
      </BandSection>

      <BandSection id="regions" tone="cloud" eyebrow="By region" title="Wetherspoons pubs by UK region">
        <div className="space-y-10">
          {regions.map((r) => (
            <div key={r.name}>
              <h3 className="font-display text-xl font-semibold text-ink">
                Wetherspoons in {r.name}
                <span className="ml-2 text-sm font-normal text-muted">
                  {r.cities.reduce((n, c) => n + c.pubs.length, 0)} pubs
                </span>
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {r.cities.map((c) => (
                  <Link key={c.slug} href={`/locations/${c.slug}`} className="lift group rounded-[var(--radius-xl)] border border-line bg-white p-6 hover:border-primary/30">
                    <div className="flex items-baseline justify-between gap-3">
                      <h4 className="font-display text-lg font-semibold text-ink group-hover:text-primary">Wetherspoons {c.name}</h4>
                      <span className="whitespace-nowrap rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-teal">
                        {c.pubs.length} {c.pubs.length === 1 ? 'pub' : 'pubs'}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-3 text-sm text-ink/70">{c.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </BandSection>

      <BandSection id="all-cities" eyebrow="A to Z" title="All Wetherspoons city guides">
        <div className="flex flex-wrap gap-2">
          {[...cities]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => (
              <Link
                key={c.slug}
                href={`/locations/${c.slug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/80 hover:border-primary/30 hover:text-primary"
              >
                {c.name} <span className="text-muted">({c.pubs.length})</span>
              </Link>
            ))}
        </div>
      </BandSection>

      <BandSection id="what-to-expect" tone="cloud" eyebrow="What to expect" title="What to expect at a Wetherspoons pub">
        <CardGrid
          columns={3}
          items={[
            { title: 'Breakfast from 8am', text: 'Most pubs open at 8am and serve breakfast until 12 noon, with free refills on many hot drinks.' },
            { title: 'Food until late', text: 'The main menu typically runs from midday until the kitchen closes, usually around 11pm.' },
            { title: 'Weekly food clubs', text: 'Steak Club on Tuesday and Curry Club on Thursday at participating pubs, usually with a drink.' },
            { title: 'Local prices', text: 'Each pub sets its own prices. City centre, airport and station pubs often cost more.' },
            { title: 'Order on the app', text: 'Choose your pub in the Wetherspoon app to order to your table and see exact prices.' },
            { title: 'Historic buildings', text: 'Many pubs are in converted cinemas, banks and theatres, each with its own local history.' },
          ]}
        />
      </BandSection>

      <BandSection id="tips" eyebrow="Tips" title="Tips for choosing your local Spoons">
        <CardGrid
          numbered
          columns={4}
          items={[
            { title: 'Check opening hours', text: 'Hours vary, especially on bank holidays. Confirm in the app before you travel.' },
            { title: 'Compare nearby pubs', text: 'In big cities, a pub a few streets away may be quieter or cheaper.' },
            { title: 'Look at the menu', text: 'Use the city guide to see typical prices and popular dishes before you go.' },
            { title: 'Plan for club days', text: 'Thursday curry and Friday evenings are busy. Arrive earlier for a table.' },
          ]}
        />
      </BandSection>

      <BandSection id="faqs" tone="mist" eyebrow="Questions" title="Wetherspoons location questions">
        <FAQList faqs={faqs} />
      </BandSection>

      <BandSection id="related" eyebrow="Related guides" title="More Wetherspoons guides">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['/', 'Full Wetherspoons menu'],
            ['/breakfast-times', 'Breakfast times'],
            ['/food-clubs', 'Food clubs and deals'],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="lift rounded-[var(--radius-xl)] border border-line bg-cloud p-6 font-display text-lg font-semibold text-ink hover:border-primary/30 hover:text-primary">
              {label}
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <SourceNote checkedDate="October 2026" correctionHref="/contact" />
        </div>
      </BandSection>
    </main>
  );
}
