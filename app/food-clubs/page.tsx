import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { menuItems } from '@/content/menu';
import { type CategorySlug } from '@/lib/types';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import { PriceNotice } from '@/components/price-notice';
import { JsonLd, faqSchema } from '@/lib/schema';
import { getCategoryUrl, getProductUrl } from '@/lib/routes';
import { BandSection, CardGrid, Prose, QuickAnswer, StatTiles, TableOfContents } from '@/components/content/sections';

const TITLE = 'Wetherspoons Weekly Food Club Deals and Schedule 2026';
const DESC =
  'Wetherspoons food clubs explained: Steak Club Tuesday, Curry Club Thursday, Fish Friday and Sunday roasts. See days, typical prices and what is included.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/food-clubs' },
  openGraph: { title: TITLE, description: DESC, url: '/food-clubs' , images: [{ url: '/images/pages/food-clubs.webp', width: 1200, height: 630 }] },
twitter: { card: 'summary_large_image', images: ['/images/pages/food-clubs.webp'] }};

const gbp = (v: number) => `£${v.toFixed(2)}`;

function stats(slug: CategorySlug) {
  const items = menuItems.filter((i) => i.category === slug);
  const prices = items.map((i) => i.typicalPriceGbp).filter((p): p is number => p !== null);
  return {
    items,
    count: items.length,
    min: prices.length ? Math.min(...prices) : null,
    max: prices.length ? Math.max(...prices) : null,
  };
}

const CLUBS = [
  {
    id: 'steak-club',
    day: 'Tuesday',
    name: 'Steak Club',
    slug: 'steak-club' as CategorySlug,
    text: 'Steak Club runs on Tuesdays at participating pubs. Steaks are typically served with chips, peas, a grilled tomato and a flat mushroom, and the deal usually includes a drink. Upgrades such as sauces or larger cuts may cost extra.',
  },
  {
    id: 'curry-club',
    day: 'Thursday',
    name: 'Curry Club',
    slug: 'curry-club' as CategorySlug,
    text: 'Curry Club is the Thursday tradition. Curries usually come with rice, naan bread and poppadoms, and the deal typically includes a drink. There is normally at least one vegetarian or vegan curry alongside chicken and other options.',
  },
  {
    id: 'fish',
    day: 'Friday',
    name: 'Fish Friday',
    slug: 'fish-dishes' as CategorySlug,
    text: 'Fish and chips is a popular Friday choice. Battered cod, scampi and other fish dishes are on the menu every day, but Friday is when many pubs see the most demand. Check your pub for any Friday offer.',
  },
  {
    id: 'sunday',
    day: 'Sunday',
    name: 'Sunday roasts',
    slug: 'sunday-roasts' as CategorySlug,
    text: 'Roast dinners with meat, roast potatoes, vegetables, Yorkshire pudding and gravy are a Sunday favourite. Availability and serving times vary by pub, so check the app before visiting.',
  },
].map((c) => ({ ...c, ...stats(c.slug) }));

const faqs = [
  {
    question: 'What day is Curry Club at Wetherspoons?',
    answer: 'Curry Club is held on Thursdays at participating Wetherspoons pubs. It typically runs from midday, after breakfast, until the kitchen closes. Check the app to confirm your pub takes part.',
  },
  {
    question: 'What day is Steak Club at Wetherspoons?',
    answer: 'Steak Club is on Tuesdays at participating pubs. It usually runs from midday until the kitchen closes. Steaks are typically served with chips and sides, and the deal usually includes a drink.',
  },
  {
    question: 'Does Curry Club include a drink?',
    answer: 'Curry Club meals are usually priced to include a drink, with different price levels depending on whether you choose a soft drink or an alcoholic drink. Premium drinks may cost extra. Check your pub for exact pricing.',
  },
  {
    question: 'How much is Curry Club at Wetherspoons?',
    answer: (() => {
      const c = CLUBS.find((x) => x.id === 'curry-club')!;
      return c.min !== null
        ? `Typical Curry Club prices tracked on SpoonsMenu range from ${gbp(c.min)} to ${gbp(c.max!)}. Prices vary by pub and by the drink you choose, so check the app for local prices.`
        : 'Prices vary by pub and by the drink you choose. Check the app for local prices.';
    })(),
  },
  {
    question: 'How much is Steak Club at Wetherspoons?',
    answer: (() => {
      const c = CLUBS.find((x) => x.id === 'steak-club')!;
      return c.min !== null
        ? `Typical Steak Club prices tracked on SpoonsMenu range from ${gbp(c.min)} to ${gbp(c.max!)}. The price depends on the cut, any upgrades and your pub's location.`
        : 'Prices depend on the cut, upgrades and location. Check the app for local prices.';
    })(),
  },
  {
    question: 'Do Wetherspoons food clubs run all day?',
    answer: 'Club deals usually start once breakfast finishes at 12 noon and run until the kitchen closes, which is typically around 11pm. Times can vary, so check your pub.',
  },
  {
    question: 'Are food clubs available at every Wetherspoons?',
    answer: 'Most Wetherspoons pubs take part, but not every pub runs every club. Airport pubs and some special locations may differ. The Wetherspoon app shows what is available at each pub.',
  },
  {
    question: 'Can I order Curry Club or Steak Club on the app?',
    answer: 'Yes. When you are in the pub, you can order club meals for table delivery through the Wetherspoon app on the relevant day, as well as at the bar.',
  },
  {
    question: 'Is there a vegetarian option on Curry Club?',
    answer: 'Curry Club usually includes at least one vegetarian or vegan curry. See the Curry Club section and the vegan and vegetarian guide on SpoonsMenu for current options.',
  },
];

export default function FoodClubsPage() {
  const toc = [
    { id: 'week', label: 'Weekly guide' },
    ...CLUBS.map((c) => ({ id: c.id, label: c.name })),
    { id: 'tips', label: 'Tips' },
    { id: 'faqs', label: 'Questions' },
  ];

  return (
    <main className="pt-24">
      <JsonLd json={faqSchema(faqs)} />

      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Food clubs', href: '/food-clubs' }]} />
          <p className="eyebrow mt-2 text-teal">Deals guide</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons food clubs and weekly deals
          </h1>
        <div className="mt-8 mb-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm max-w-[1200px]">
          <Image
            src="/images/pages/food-clubs.webp"
            alt="Wetherspoons weekly food club deals including curry and steak nights"
            width={1200}
            height={630}
            className="aspect-video w-full object-cover sm:aspect-[21/9]"
            priority
          />
        </div>
      
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose text="Wetherspoons food clubs pair a meal with a drink on set days of the week. Steak Club runs on Tuesday and Curry Club on Thursday, with fish and chips popular on Friday and roasts on Sunday. This guide covers which day is which, what is included, typical prices and how to get the best value." />
          </div>
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: 'Tue', label: 'Steak Club' },
                { value: 'Thu', label: 'Curry Club' },
                { value: 'Fri', label: 'Fish' },
                { value: 'Sun', label: 'Roasts' },
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
        <QuickAnswer text="Wetherspoons Steak Club is on Tuesday and Curry Club is on Thursday at participating pubs. Club meals usually include a drink and run from 12 noon until the kitchen closes. Fish and chips is a Friday favourite and roasts are popular on Sunday. Prices vary by pub, so check the Wetherspoon app for your local deal." />
      </div>

      <BandSection id="week" eyebrow="Weekly guide" title="Wetherspoons food club days at a glance">
        <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Wetherspoons food club days</caption>
            <thead>
              <tr className="border-b border-line bg-cloud">
                {['Day', 'Club', 'Dishes', 'Typical price range'].map((h) => (
                  <th key={h} scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLUBS.map((c) => (
                <tr key={c.id} className="border-b border-line last:border-0 hover:bg-mist/60">
                  <th scope="row" className="px-5 py-3 font-semibold text-ink">{c.day}</th>
                  <td className="px-5 py-3">
                    <a href={`#${c.id}`} className="text-ink hover:text-primary">{c.name}</a>
                  </td>
                  <td className="px-5 py-3 tabular-nums text-ink/70">{c.count}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums text-teal">
                    {c.min !== null ? `${gbp(c.min)} to ${gbp(c.max!)}` : 'Varies'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <PriceNotice variant="compact" />
        </div>
      </BandSection>

      {CLUBS.map((c, idx) => (
        <BandSection key={c.id} id={c.id} tone={idx % 2 === 0 ? 'cloud' : undefined} eyebrow={c.day} title={`Wetherspoons ${c.name}`}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div>
              <Prose text={c.text} />
              <Link href={getCategoryUrl(c.slug)} className="mt-5 inline-block font-semibold text-primary hover:underline">
                See the full {c.name} menu and prices
              </Link>
            </div>
            <ul className="space-y-2">
              {c.items.slice(0, 6).map((i) => (
                <li key={i.slug}>
                  <Link
                    href={getProductUrl(i.category, i.slug)}
                    className="lift flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-line bg-white px-4 py-3 text-sm hover:border-primary/30"
                  >
                    <span className="font-medium text-ink">{i.name}</span>
                    <span className="font-semibold tabular-nums text-teal">{i.typicalPriceGbp !== null ? gbp(i.typicalPriceGbp) : ''}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </BandSection>
      ))}

      <BandSection id="tips" eyebrow="Tips" title="How to get the best value from Wetherspoons food clubs">
        <CardGrid
          columns={3}
          items={[
            { title: 'Pick the right drink', text: 'Club prices change with the drink. A soft drink option is usually cheapest; premium drinks can cost more.' },
            { title: 'Check your pub takes part', text: 'Most pubs run the clubs, but not all. The app shows which deals your pub offers.' },
            { title: 'Go early on busy nights', text: 'Thursday curry and Friday evenings get busy. Arriving earlier means shorter waits.' },
            { title: 'Watch the upgrades', text: 'Sauces, larger steaks and extra sides add to the price. Decide what you want before ordering.' },
            { title: 'Order on the app', text: 'Ordering to your table avoids queues and shows the exact club price at your pub.' },
            { title: 'Look for meat free options', text: 'Curry Club usually includes a vegetarian or vegan curry at the same club price.' },
          ]}
        />
      </BandSection>

      <BandSection id="faqs" tone="mist" eyebrow="Questions" title="Wetherspoons food club questions">
        <FAQList faqs={faqs} />
      </BandSection>

      <BandSection id="related" eyebrow="Related guides" title="More Wetherspoons guides">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['/breakfast-times', 'Breakfast times'],
            ['/vegan-and-vegetarian-options', 'Vegan and vegetarian options'],
            ['/locations', 'Find a Wetherspoons near you'],
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
