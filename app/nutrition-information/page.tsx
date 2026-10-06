import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { menuItems } from '@/content/menu';
import { CATEGORY_SLUGS, CATEGORY_NAMES } from '@/lib/types';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import { JsonLd, faqSchema } from '@/lib/schema';
import { getCategoryUrl, getProductUrl } from '@/lib/routes';
import {
  BandSection,
  CardGrid,
  Prose,
  QuickAnswer,
  StatTiles,
  TableOfContents,
} from '@/components/content/sections';

export const metadata: Metadata = {
  title: 'Wetherspoons Calories: Full Nutrition Guide 2026',
  description:
    'Check calories for every Wetherspoons menu item. Compare lighter options, category averages and daily intake shares to make informed choices at Spoons.',
  alternates: { canonical: '/nutrition-information' },
  openGraph: {
    title: 'Wetherspoons Calories: Full Nutrition Guide 2026',
    description:
      'Check calories for every Wetherspoons menu item. Compare lighter options, category averages and daily intake shares to make informed choices at Spoons.',
    url: '/nutrition-information', images: [{ url: '/images/pages/nutrition-information.webp', width: 1200, height: 630 }] },
twitter: { card: 'summary_large_image', images: ['/images/pages/nutrition-information.webp'] }};

/* ── Data helpers ──────────────────────────────────────────────── */

const withCals = menuItems.filter((i) => i.caloriesKcal !== null).sort((a, b) => (a.caloriesKcal ?? 0) - (b.caloriesKcal ?? 0));
const allCals = withCals.map((i) => i.caloriesKcal!);
const siteAvg = Math.round(allCals.reduce((s, c) => s + c, 0) / allCals.length);
const siteMin = allCals[0];
const siteMax = allCals[allCals.length - 1];
const under600 = withCals.filter((i) => i.caloriesKcal! < 600);
const over1000 = withCals.filter((i) => i.caloriesKcal! >= 1000);

function gbp(v: number) {
  return `£${v.toFixed(2)}`;
}

function catStats(slug: string) {
  const items = withCals.filter((i) => i.category === slug);
  if (items.length === 0) return null;
  const cals = items.map((i) => i.caloriesKcal!);
  return {
    name: CATEGORY_NAMES[slug as keyof typeof CATEGORY_NAMES] ?? slug,
    slug,
    count: items.length,
    avg: Math.round(cals.reduce((s, c) => s + c, 0) / cals.length),
    min: Math.min(...cals),
    max: Math.max(...cals),
    lightest: items[0],
    heaviest: items[items.length - 1],
  };
}

const categoryStats = CATEGORY_SLUGS.map(catStats).filter((s): s is NonNullable<typeof s> => s !== null).sort((a, b) => a.avg - b.avg);

const faqs = [
  {
    question: 'How many calories are in a Wetherspoons meal?',
    answer: `The average [Wetherspoons menu](/) item contains around ${siteAvg} kcal, but the range is wide. The lightest tracked item is ${withCals[0].name} at ${siteMin} kcal, while the highest is ${withCals[withCals.length - 1].name} at ${siteMax} kcal. The actual calorie count depends on the dish, any modifications and whether you add drinks or sides.`,
  },
  {
    question: 'Are Wetherspoons calorie counts accurate?',
    answer:
      'Calorie values are calculated from standard recipes and ingredients. Actual values may differ slightly due to portion variation, seasonal ingredients and preparation methods. All values on this site should be treated as a guide. Check the official Wetherspoon app or ask staff for the most current information.',
  },
  {
    question: 'What is the lowest calorie meal at Wetherspoons?',
    answer: `Among the items tracked on SpoonsMenu, ${withCals[0].name} has the fewest calories at ${siteMin} kcal. Other lighter choices include ${withCals[1]?.name ?? 'various sides'} and ${withCals[2]?.name ?? 'smaller plates'}. Keep in mind that adding [sides](/sides), sauces or drinks increases the total calorie count of your order.`,
  },
  {
    question: 'What is the highest calorie item at Wetherspoons?',
    answer: `${withCals[withCals.length - 1].name} has the most calories tracked on SpoonsMenu at ${siteMax} kcal. That represents ${Math.round((siteMax / 2000) * 100)}% of the 2,000 kcal daily reference intake for adults. If you are watching your calorie intake, compare it with lighter options in the same category before ordering.`,
  },
  {
    question: 'Does Wetherspoons show calories on the menu?',
    answer:
      'Wetherspoons provides nutritional information through the official Wetherspoon app, in-pub customer information screens and staff at the bar. Calorie counts appear on many menu listings in the app. This site collects and organises that data for easier comparison across the full menu.',
  },
  {
    question: 'How can I eat under 600 calories at Wetherspoons?',
    answer: `There are ${under600.length} items tracked on SpoonsMenu with fewer than 600 kcal. These include [kids meals](/kids-menu), lighter [breakfasts](/breakfast-menu), sides and some main dishes. Choose a lower calorie main, skip heavy sauces and pick water or a sugar free drink to keep the total down. Check the calorie table on this page for the full list.`,
  },
  {
    question: 'Where does Wetherspoons nutrition data come from?',
    answer:
      'Nutrition data is compiled from official Wetherspoon communications, in-pub customer information screens and the Wetherspoon app. Wetherspoons provides nutritional breakdowns including energy, fat, saturates, carbohydrates, sugars, fibre, protein and salt. SpoonsMenu tracks calorie data and presents it for comparison.',
  },
  {
    question: 'Do Wetherspoons drinks have calorie information?',
    answer:
      'Some Wetherspoons drinks have calorie information available through the official app. Soft drinks, coffees and alcoholic drinks may vary. On SpoonsMenu, drinks with verified calorie data are included in the nutrition table. Check the [drinks menu](/drinks-menu) section for individual drink details.',
  },
  {
    question: 'Can I customise a Wetherspoons meal to reduce calories?',
    answer:
      'Some modifications can change the calorie count. Swapping chips for a side salad, removing sauces or choosing a smaller portion where available are common approaches. However, any change may also affect [allergen information](/allergen-information). Always inform staff about your requirements when ordering.',
  },
  {
    question: 'How do Wetherspoons calories compare to other restaurants?',
    answer: `The average Wetherspoons item is around ${siteAvg} kcal. That is broadly comparable to other casual dining chains in the UK, although direct comparisons depend on the specific dishes. The wide range from ${siteMin} to ${siteMax} kcal means that Wetherspoons offers both lighter and more substantial options within the same menu.`,
  },
];

/* ── Component ─────────────────────────────────────────────────── */

export default function NutritionInformationPage() {
  const toc = [
    { id: 'overview', label: 'Overview' },
    { id: 'by-category', label: 'By category' },
    { id: 'lighter', label: 'Lighter options' },
    { id: 'full-table', label: 'Full table' },
    { id: 'daily-intake', label: 'Daily intake' },
    { id: 'tips', label: 'Tips' },
    { id: 'faqs', label: 'Questions' },
  ];

  return (
    <main className="pt-24">
      <JsonLd json={faqSchema(faqs)} />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Nutrition information', href: '/nutrition-information' },
            ]}
          />
          <p className="eyebrow mt-2 text-teal">Nutrition guide</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons calories and nutrition information
          </h1>
        <div className="mt-8 mb-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm max-w-[1200px]">
          <Image
            src="/images/pages/nutrition-information.webp"
            alt="Calorie and nutrition data comparison for the full Wetherspoons menu"
            width={1200}
            height={630}
            className="aspect-video w-full object-cover sm:aspect-[21/9]"
            priority
          />
        </div>
      
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose
              text={`This guide covers calorie information for ${withCals.length} Wetherspoons menu items tracked on SpoonsMenu. Compare lighter meals, check category averages and see how each dish fits into a 2,000 kcal daily reference intake. Every figure is a guide rather than a guarantee, so check the official Wetherspoon app or ask staff for the most current nutritional data at your pub.`}
            />
          </div>
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: String(withCals.length), label: 'Items tracked' },
                { value: `${siteMin}`, label: 'Lowest kcal' },
                { value: `${siteAvg}`, label: 'Average kcal' },
                { value: `${siteMax}`, label: 'Highest kcal' },
              ]}
            />
          </div>
        </div>
      </header>

      {/* ── Sticky TOC ────────────────────────────────────────── */}
      <div className="sticky top-16 z-10 border-b border-line bg-white/85 py-3 backdrop-blur">
        <div className="shell">
          <TableOfContents items={toc} variant="pills" />
        </div>
      </div>

      <div className="shell pt-12">
        <QuickAnswer
          text={`The average Wetherspoons menu item contains around ${siteAvg} kcal. The lightest tracked item is ${withCals[0].name} at ${siteMin} kcal and the highest is ${withCals[withCals.length - 1].name} at ${siteMax} kcal. There are ${under600.length} items under 600 kcal for lighter dining, including kids meals, sides and selected mains.`}
        />
      </div>

      {/* ── Overview ──────────────────────────────────────────── */}
      <BandSection id="overview" eyebrow="Overview" title="How many calories are in the Wetherspoons menu">
        <div className="max-w-[var(--measure)] space-y-5">
          <Prose
            text={`Wetherspoons offers a wide calorie range across its menu, from ${siteMin} kcal for the lightest item to ${siteMax} kcal for the most substantial. The average sits around ${siteAvg} kcal per item, which represents roughly ${Math.round((siteAvg / 2000) * 100)}% of the 2,000 kcal daily reference intake used as a general guide for adults in the UK.`}
          />
          <Prose text="Calorie counts on this page come from the data tracked by SpoonsMenu and should be treated as typical values rather than exact figures for every pub. Portion sizes, ingredient variation and any modifications you make to a dish can change the actual calorie content. The official Wetherspoon app and in-pub screens are the best source for current nutritional data at your chosen pub." />
          <Prose text="Sides, sauces and drinks are not included in the calorie count for a main dish. If you order chips, onion rings or an alcoholic drink alongside your meal, add those calories separately. The table further down this page lists every tracked item so you can build up a realistic picture of your full order." />
        </div>
      </BandSection>

      {/* ── By category ───────────────────────────────────────── */}
      <BandSection id="by-category" tone="cloud" eyebrow="By category" title="Wetherspoons calories by menu section">
        <p className="mb-8 max-w-[var(--measure)] text-ink/70">
          Average calories per item in each menu section. Use this to compare sections before browsing individual dishes.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryStats.map((cat) => (
            <Link
              key={cat.slug}
              href={getCategoryUrl(cat.slug as any)}
              className="lift group rounded-[var(--radius-xl)] border border-line bg-white p-6 transition-colors hover:border-primary/30"
            >
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-primary">{cat.name}</h3>
              <div className="mt-3 flex items-end gap-3">
                <span className="font-display text-3xl font-bold tabular-nums text-teal">{cat.avg}</span>
                <span className="mb-1 text-sm text-muted">avg kcal</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-teal/60"
                  style={{ width: `${Math.min(100, (cat.avg / siteMax) * 100)}%` }}
                />
              </div>
              <p className="mt-3 text-xs text-muted">
                {cat.count} items · {cat.min} to {cat.max} kcal
              </p>
            </Link>
          ))}
        </div>
      </BandSection>

      {/* ── Lighter options ───────────────────────────────────── */}
      <BandSection id="lighter" eyebrow="Lighter options" title="Wetherspoons meals under 600 calories">
        <p className="mb-6 max-w-[var(--measure)] text-ink/70">
          {under600.length} items on SpoonsMenu have fewer than 600 kcal, making them suitable for a lighter meal. These include kids meals, smaller portions, sides, some breakfasts and selected mains.
        </p>
        <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[500px] text-left text-sm">
            <caption className="sr-only">Wetherspoons menu items under 600 calories</caption>
            <thead>
              <tr className="border-b border-line bg-cloud">
                <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Item</th>
                <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Category</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">Calories</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">% of 2,000</th>
              </tr>
            </thead>
            <tbody>
              {under600.map((item) => (
                <tr key={`${item.category}-${item.slug}`} className="border-b border-line last:border-0 hover:bg-mist/60">
                  <th scope="row" className="px-6 py-3 font-medium">
                    <Link href={getProductUrl(item.category as any, item.slug)} className="text-ink hover:text-primary">
                      {item.name}
                    </Link>
                  </th>
                  <td className="px-6 py-3 text-xs capitalize text-muted">{item.category.replace(/-/g, ' ')}</td>
                  <td className="px-6 py-3 text-right font-semibold tabular-nums text-teal">{item.caloriesKcal}</td>
                  <td className="px-6 py-3 text-right tabular-nums text-ink/60">{Math.round((item.caloriesKcal! / 2000) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BandSection>

      {/* ── Full table ────────────────────────────────────────── */}
      <BandSection id="full-table" tone="cloud" eyebrow="Full table" title="Complete Wetherspoons calorie table">
        <p className="mb-2 text-sm text-muted">
          {withCals.length} items with verified calorie data, sorted lowest to highest. Items without verified values are excluded.
        </p>
        <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Complete Wetherspoons calorie data for all tracked menu items</caption>
            <thead>
              <tr className="border-b border-line bg-cloud">
                <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Item</th>
                <th scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Category</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">Calories</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">% of 2,000</th>
              </tr>
            </thead>
            <tbody>
              {withCals.map((item) => (
                <tr key={`${item.category}-${item.slug}`} className="border-b border-line last:border-0 hover:bg-mist/60">
                  <th scope="row" className="px-6 py-3 font-medium">
                    <Link href={getProductUrl(item.category as any, item.slug)} className="text-ink hover:text-primary">
                      {item.name}
                    </Link>
                  </th>
                  <td className="px-6 py-3 text-xs capitalize text-muted">{item.category.replace(/-/g, ' ')}</td>
                  <td className="px-6 py-3 text-right font-semibold tabular-nums text-teal">{item.caloriesKcal}</td>
                  <td className="px-6 py-3 text-right tabular-nums text-ink/60">{Math.round((item.caloriesKcal! / 2000) * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BandSection>

      {/* ── Daily intake ──────────────────────────────────────── */}
      <BandSection id="daily-intake" eyebrow="Context" title="How Wetherspoons calories fit into your daily intake">
        <div className="max-w-[var(--measure)] space-y-5">
          <Prose text="The UK reference intake for an average adult is 2,000 kcal per day. This figure is a general guide, not a personal target. Individual needs vary based on age, sex, weight, height and physical activity level. The NHS recommends checking with a healthcare professional if you need personalised advice." />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Light meal', range: 'Under 500 kcal', share: '25%', desc: 'Leaves room for two other meals and snacks throughout the day.' },
              { label: 'Standard meal', range: '500 to 800 kcal', share: '25 to 40%', desc: 'A typical main course. Factor in any sides and drinks separately.' },
              { label: 'Larger meal', range: 'Over 800 kcal', share: '40%+', desc: 'Consider balancing with lighter meals earlier or later in the day.' },
            ].map((tier) => (
              <div key={tier.label} className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-teal">{tier.label}</p>
                <p className="mt-2 font-display text-xl font-bold text-ink">{tier.range}</p>
                <p className="mt-1 text-sm font-medium text-muted">{tier.share} of daily intake</p>
                <p className="mt-3 text-sm text-ink/70">{tier.desc}</p>
              </div>
            ))}
          </div>
          <Prose text="Remember that drinks add to the total. A pint of lager can add 180 to 240 kcal, a glass of wine around 130 kcal, and a large coffee with milk around 100 kcal. Soft drinks and juices vary widely. Factor these in when planning your visit." />
        </div>
      </BandSection>

      {/* ── Tips ──────────────────────────────────────────────── */}
      <BandSection id="tips" tone="cloud" eyebrow="Tips" title="How to manage calories when eating at Wetherspoons">
        <CardGrid
          items={[
            { title: 'Check before you go', text: 'Use this page or the Wetherspoon app to compare calorie counts before visiting. Deciding in advance avoids impulse choices at the bar.' },
            { title: 'Swap sides wisely', text: 'Choosing a side salad instead of chips can save 200 to 300 kcal. Swapping onion rings for peas is another straightforward reduction.' },
            { title: 'Watch the sauces', text: 'Sauces, dressings and extra cheese can add 100 to 250 kcal. Ask for sauce on the side if you want to control the amount.' },
            { title: 'Choose water or sugar-free drinks', text: 'A sugar-free soft drink or tap water adds no calories. Switching from a sugary drink saves 100 to 200 kcal per glass.' },
            { title: 'Compare within the section', text: 'Every category page on SpoonsMenu shows items sorted by calories. Use that to find the lighter option in the section you want.' },
            { title: 'Count the full order', text: 'A main, a side, a drink and a dessert together may total 1,500 kcal or more. Check each item individually and add them up.' },
          ]}
          columns={3}
        />
      </BandSection>

      {/* ── FAQs ──────────────────────────────────────────────── */}
      <BandSection id="faqs" tone="mist" eyebrow="Questions" title="Wetherspoons nutrition questions">
        <FAQList faqs={faqs} />
      </BandSection>

      {/* ── Related ───────────────────────────────────────────── */}
      <BandSection id="related" eyebrow="Related guides" title="More Wetherspoons guides">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            href="/allergen-information"
            className="lift rounded-[var(--radius-xl)] border border-line bg-cloud p-6 font-display text-lg font-semibold text-ink hover:border-primary/30 hover:text-primary"
          >
            Allergen information
          </Link>
          <Link
            href="/vegan-and-vegetarian-options"
            className="lift rounded-[var(--radius-xl)] border border-line bg-cloud p-6 font-display text-lg font-semibold text-ink hover:border-primary/30 hover:text-primary"
          >
            Vegan and vegetarian options
          </Link>
          <Link
            href="/"
            className="lift rounded-[var(--radius-xl)] border border-line bg-cloud p-6 font-display text-lg font-semibold text-ink hover:border-primary/30 hover:text-primary"
          >
            Full Wetherspoons menu
          </Link>
        </div>
        <div className="mt-12">
          <SourceNote checkedDate="October 2026" correctionHref="/contact" />
        </div>
      </BandSection>
    </main>
  );
}
