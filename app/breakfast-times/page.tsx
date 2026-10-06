import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { menuItems } from '@/content/menu';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import { PriceNotice } from '@/components/price-notice';
import { MenuItemCard } from '@/components/menu-item-card';
import { JsonLd, faqSchema } from '@/lib/schema';
import { getProductUrl } from '@/lib/routes';
import { BandSection, CardGrid, Prose, QuickAnswer, StatTiles, TableOfContents } from '@/components/content/sections';

const TITLE = 'Wetherspoons Breakfast Times 2026: What Time It Ends';
const DESC =
  'Wetherspoons breakfast is typically served from 8am until 12 noon, seven days a week. Check daily times, the breakfast menu, typical prices and tips.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/breakfast-times' },
  openGraph: { title: TITLE, description: DESC, url: '/breakfast-times' , images: [{ url: '/images/pages/breakfast-times.webp', width: 1200, height: 630 }] },
twitter: { card: 'summary_large_image', images: ['/images/pages/breakfast-times.webp'] }};

const items = menuItems.filter((i) => i.category === 'breakfast-menu');
const priced = items.filter((i) => i.typicalPriceGbp !== null).sort((a, b) => a.typicalPriceGbp! - b.typicalPriceGbp!);
const gbp = (v: number) => `£${v.toFixed(2)}`;
const minP = priced[0]?.typicalPriceGbp ?? null;
const maxP = priced[priced.length - 1]?.typicalPriceGbp ?? null;
const vegCount = items.filter((i) => i.dietaryTags.length > 0).length;
const veganItems = items.filter((i) => i.dietaryTags.includes('vegan'));

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const faqs = [
  {
    question: 'What time does Wetherspoons breakfast finish?',
    answer:
      'Wetherspoons breakfast typically finishes at 12 noon. After that, most pubs switch to the main menu. If you arrive close to midday, order promptly, and check with your local pub because individual times can vary.',
  },
  {
    question: 'What time does Wetherspoons start serving breakfast?',
    answer:
      'Most Wetherspoons pubs start serving breakfast at 8am, which is usually when they open. Some pubs, such as those at airports or railway stations, may open earlier. Check the opening times for your chosen pub in the Wetherspoon app.',
  },
  {
    question: 'Does Wetherspoons serve breakfast on Sundays?',
    answer:
      'Yes. Breakfast is typically served seven days a week, including Saturdays and Sundays, from 8am until 12 noon. Weekend mornings can be busier, so allow a little extra time.',
  },
  {
    question: 'Does Wetherspoons serve breakfast all day?',
    answer:
      'No. Breakfast is normally served only in the morning until 12 noon. Some individual items may remain available later at certain pubs, but the full breakfast menu is a morning service. Check the app for what is available at your pub.',
  },
  {
    question: 'How much is a Wetherspoons breakfast?',
    answer:
      minP !== null && maxP !== null
        ? `Typical Wetherspoons breakfast prices tracked on SpoonsMenu range from ${gbp(minP)} to ${gbp(maxP)}. Prices are set by each pub and vary by location, so check the app for exact prices at your pub.`
        : 'Prices vary by pub. Check the breakfast menu page for typical prices.',
  },
  {
    question: 'Does Wetherspoons breakfast come with unlimited coffee?',
    answer:
      'Wetherspoons has traditionally offered free refills on many hot drinks such as filter coffee and tea when you buy one. Refill arrangements can vary by pub and drink, so ask at the bar.',
  },
  {
    question: 'Is there a vegan breakfast at Wetherspoons?',
    answer: veganItems.length
      ? `Yes. ${veganItems.map((i) => i.name).join(', ')} ${veganItems.length > 1 ? 'are' : 'is'} tagged vegan on SpoonsMenu. There are ${vegCount} vegetarian or vegan breakfast options in total.`
      : `There are ${vegCount} vegetarian or vegan breakfast options tracked on SpoonsMenu. Check the app for current vegan choices.`,
  },
  {
    question: 'Are Wetherspoons breakfast times the same on bank holidays?',
    answer:
      'Breakfast usually follows the normal 8am to 12 noon pattern on bank holidays, but opening times can change on Christmas Day, New Year and other special dates. Check your pub in the app before travelling.',
  },
  {
    question: 'Can I order Wetherspoons breakfast on the app?',
    answer:
      'Yes. You can order breakfast for table delivery through the Wetherspoon app while you are in the pub, during breakfast hours. You can also order at the bar.',
  },
];

export default function BreakfastTimesPage() {
  const toc = [
    { id: 'times', label: 'Times' },
    { id: 'menu', label: 'Breakfast menu' },
    { id: 'prices', label: 'Prices' },
    { id: 'drinks', label: 'Hot drinks' },
    { id: 'tips', label: 'Tips' },
    { id: 'faqs', label: 'Questions' },
  ];

  return (
    <main className="pt-24">
      <JsonLd json={faqSchema(faqs)} />

      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Breakfast times', href: '/breakfast-times' }]} />
          <p className="eyebrow mt-2 text-teal">Breakfast guide</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons breakfast times
          </h1>
        <div className="mt-8 mb-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm max-w-[1200px]">
          <Image
            src="/images/pages/breakfast-times.webp"
            alt="Wetherspoons breakfast serving times and opening hours guide for UK pubs"
            width={1200}
            height={630}
            className="aspect-video w-full object-cover sm:aspect-[21/9]"
            priority
          />
        </div>
      
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose text="Wetherspoons breakfast is typically served from 8am until 12 noon, seven days a week. This guide covers daily serving times, what is on the breakfast menu, typical prices and practical tips for getting your order in before the switch to the main menu." />
          </div>
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: '8am', label: 'Starts' },
                { value: '12pm', label: 'Ends' },
                { value: '7', label: 'Days a week' },
                { value: minP !== null ? gbp(minP) : 'n/a', label: 'From' },
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
          text={`Wetherspoons breakfast runs from 8am until 12 noon every day, including weekends. The menu has ${items.length} options${minP !== null && maxP !== null ? ` with typical prices from ${gbp(minP)} to ${gbp(maxP)}` : ''}, including ${vegCount} vegetarian or vegan choices. Some pubs at airports and stations open earlier, so check your local pub in the Wetherspoon app.`}
        />
      </div>

      <BandSection id="times" eyebrow="Serving times" title="Wetherspoons breakfast times by day">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <Prose text="Breakfast follows the same pattern every day of the week at most pubs. Service begins when the pub opens, usually 8am, and runs until 12 noon, when the kitchen moves over to the main menu." />
            <Prose text="Pubs in airports, railway stations and some city centres can open earlier to serve travellers. A small number of pubs may have different hours, so the Wetherspoon app is the most reliable place to check times for a specific location." />
            <Prose text="On Christmas Day, New Year's Day and some bank holidays, opening and breakfast times can change. Check before you travel on those dates." />
          </div>
          <div className="reveal overflow-hidden rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Typical Wetherspoons breakfast times by day</caption>
              <thead>
                <tr className="border-b border-line bg-cloud">
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Day</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted">Typical times</th>
                </tr>
              </thead>
              <tbody>
                {DAYS.map((d) => (
                  <tr key={d} className="border-b border-line last:border-0">
                    <th scope="row" className="px-5 py-3 font-medium text-ink">{d}</th>
                    <td className="px-5 py-3 tabular-nums text-teal">8am to 12pm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </BandSection>

      <BandSection id="menu" tone="cloud" eyebrow="Breakfast menu" title="What is on the Wetherspoons breakfast menu">
        <p className="mb-6 max-w-[var(--measure)] text-ink/70">
          From full cooked plates to porridge and wraps. Every dish links to its own page with components, calories and allergens.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <MenuItemCard key={i.slug} item={i} href={getProductUrl(i.category, i.slug)} />
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link href="/breakfast-menu" className="font-semibold text-primary hover:underline">
            See the full Wetherspoons breakfast menu guide
          </Link>
        </p>
      </BandSection>

      <BandSection id="prices" eyebrow="Prices" title="Wetherspoons breakfast prices">
        <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[520px] text-left text-sm">
            <caption className="sr-only">Typical Wetherspoons breakfast prices</caption>
            <thead>
              <tr className="border-b border-line bg-cloud">
                {['Item', 'Typical price', 'Calories', 'Diet'].map((h) => (
                  <th key={h} scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {priced.map((i) => (
                <tr key={i.slug} className="border-b border-line last:border-0 hover:bg-mist/60">
                  <th scope="row" className="px-5 py-3 font-medium">
                    <Link href={getProductUrl(i.category, i.slug)} className="text-ink hover:text-primary">
                      {i.name}
                    </Link>
                  </th>
                  <td className="px-5 py-3 font-semibold tabular-nums text-teal">{gbp(i.typicalPriceGbp!)}</td>
                  <td className="px-5 py-3 tabular-nums text-ink/70">{i.caloriesKcal !== null ? `${i.caloriesKcal} kcal` : 'n/a'}</td>
                  <td className="px-5 py-3 capitalize text-ink/70">{i.dietaryTags.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <PriceNotice variant="compact" />
        </div>
      </BandSection>

      <BandSection id="drinks" tone="cloud" eyebrow="Hot drinks" title="Coffee and tea with your breakfast">
        <div className="max-w-[var(--measure)]">
          <Prose text="Wetherspoons has long been known for offering free refills on many hot drinks, such as filter coffee and tea, when you buy one. That makes a cooked breakfast with a coffee a popular low cost start to the day. Refill rules can differ by pub and by drink, so ask at the bar or check the app. Breakfast dishes can also often be ordered with a hot or soft drink." />
        </div>
      </BandSection>

      <BandSection id="tips" eyebrow="Tips" title="Tips for getting breakfast at Wetherspoons">
        <CardGrid
          columns={3}
          items={[
            { title: 'Arrive before 11:45', text: 'Kitchens change over at noon. Ordering a little before gives you a comfortable margin.' },
            { title: 'Order on the app', text: 'Use the Wetherspoon app to order to your table and skip the queue at busy times.' },
            { title: 'Check early openers', text: 'Airport and station pubs often open earlier, which is handy for early travel.' },
            { title: 'Expect weekend crowds', text: 'Saturday and Sunday mornings are busiest. Weekdays are quieter if you can go then.' },
            { title: 'Pick by appetite', text: 'Choose a large cooked breakfast for a big morning or porridge and toast for something lighter.' },
            { title: 'Check allergens', text: 'Breakfasts often contain eggs, milk and gluten. Ask staff or check the allergen guide first.' },
          ]}
        />
      </BandSection>

      <BandSection id="faqs" tone="mist" eyebrow="Questions" title="Wetherspoons breakfast time questions">
        <FAQList faqs={faqs} />
      </BandSection>

      <BandSection id="related" eyebrow="Related guides" title="More Wetherspoons guides">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['/breakfast-menu', 'Breakfast menu and prices'],
            ['/food-clubs', 'Food clubs and deals'],
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
