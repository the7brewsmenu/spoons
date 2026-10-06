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
import { BandSection, CardGrid, Prose, QuickAnswer, StatTiles, TableOfContents } from '@/components/content/sections';

const TITLE = 'Wetherspoons Allergen Menu: 14 Allergens Guide 2026';
const DESC =
  'Check which Wetherspoons dishes contain gluten, milk, eggs and the other 14 UK allergens. Compare menu sections and learn how to order safely at Spoons.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/allergen-information' },
  openGraph: { title: TITLE, description: DESC, url: '/allergen-information' , images: [{ url: '/images/pages/allergen-information.webp', width: 1200, height: 630 }] },
twitter: { card: 'summary_large_image', images: ['/images/pages/allergen-information.webp'] }};

const UK_ALLERGENS = [
  { name: 'Celery', key: 'celery', text: 'Includes stalks, leaves, seeds and celeriac. Often found in soups, stocks, sauces and some meat products.' },
  { name: 'Cereals containing gluten', key: 'cereals containing gluten', text: 'Wheat, rye, barley, oats and spelt. Found in bread, batter, breadcrumbs, pasta, pastry, wraps and many sauces.' },
  { name: 'Crustaceans', key: 'crustaceans', text: 'Prawns, crab, lobster and scampi. Also present in some pastes and seafood sauces.' },
  { name: 'Eggs', key: 'eggs', text: 'Found in mayonnaise, hollandaise, batter, pasta, cakes, glazes and some breaded coatings.' },
  { name: 'Fish', key: 'fish', text: 'Found in fish dishes, some dressings, relishes and Worcestershire sauce.' },
  { name: 'Lupin', key: 'lupin', text: 'Lupin seeds and flour. Occasionally used in breads, pastries and pasta.' },
  { name: 'Milk', key: 'milk', text: 'Butter, cheese, cream and yoghurt. Common in breakfasts, desserts, sauces and coatings.' },
  { name: 'Molluscs', key: 'molluscs', text: 'Mussels, oysters, squid and snails. Also found in oyster sauce.' },
  { name: 'Mustard', key: 'mustard', text: 'Seeds, powder, oil and leaves. Used in dressings, marinades, sauces, curries and burger relishes.' },
  { name: 'Peanuts', key: 'peanuts', text: 'Found in satay sauces, groundnut oil and some desserts. Separate from tree nuts.' },
  { name: 'Sesame', key: 'sesame', text: 'Seeds, oil and tahini. Common on burger buns, breads and Asian style dishes.' },
  { name: 'Soybeans', key: 'soybeans', text: 'Soya sauce, tofu and soya flour. Used in some plant based products, breads and sauces.' },
  { name: 'Sulphur dioxide', key: 'sulphur dioxide', text: 'Sulphites (E220 to E228). Found in wine, beer, dried fruit, some soft drinks and processed meats.' },
  { name: 'Tree nuts', key: 'tree nuts', text: 'Almonds, hazelnuts, walnuts, cashews, pecans and pistachios. Found in desserts, pesto and some sauces.' },
];

const has = (allergens: string[], key: string) => allergens.some((a) => a.toLowerCase() === key);

const counts = UK_ALLERGENS.map((a) => ({ ...a, count: menuItems.filter((i) => has(i.allergens, a.key)).length })).sort(
  (a, b) => b.count - a.count
);
const listed = counts.filter((a) => a.count > 0);
const noGluten = menuItems.filter((i) => !has(i.allergens, 'cereals containing gluten'));
const noMilk = menuItems.filter((i) => !has(i.allergens, 'milk'));
const noneListed = menuItems.filter((i) => i.allergens.length === 0);
const MATRIX = ['cereals containing gluten', 'milk', 'eggs', 'mustard', 'sesame', 'soybeans', 'fish', 'sulphur dioxide'];
const MATRIX_LABEL: Record<string, string> = {
  'cereals containing gluten': 'Gluten',
  milk: 'Milk',
  eggs: 'Eggs',
  mustard: 'Mustard',
  sesame: 'Sesame',
  soybeans: 'Soya',
  fish: 'Fish',
  'sulphur dioxide': 'Sulphites',
};

const pct = (n: number) => Math.round((n / menuItems.length) * 100);

const faqs = [
  {
    question: 'Does Wetherspoons have an allergen menu?',
    answer:
      'Yes. Wetherspoons publishes allergen information for its standard menu through the Wetherspoon app, in-pub information screens and staff at the bar. You can filter dishes by allergen in the app. This page summarises the allergen data tracked on SpoonsMenu so you can compare menu sections before you visit.',
  },
  {
    question: 'What is the most common allergen on the Wetherspoons menu?',
    answer: `Cereals containing gluten is the most common allergen in the data tracked on SpoonsMenu, listed for ${counts.find((c) => c.key === 'cereals containing gluten')?.count} of ${menuItems.length} items. Milk and eggs follow. This reflects the amount of bread, batter, breadcrumbs, cheese and sauces used across [burgers](/burgers), [breakfasts](/breakfast-menu), [pizzas](/pizza) and [desserts](/desserts).`,
  },
  {
    question: 'Does Wetherspoons do gluten free food?',
    answer: `${noGluten.length} items tracked on SpoonsMenu do not list cereals containing gluten as an ingredient allergen. However, Wetherspoons kitchens use shared fryers and preparation areas, so no dish can be guaranteed gluten free. If you have coeliac disease, speak to staff and check the official allergen information before ordering.`,
  },
  {
    question: 'Is Wetherspoons safe for coeliacs?',
    answer:
      'Wetherspoons does not claim that any dish is safe for people with coeliac disease, because of cross contamination risks from shared equipment and an open kitchen. Some dishes do not contain gluten as an ingredient. Check the app, tell staff about your condition and make your own informed decision.',
  },
  {
    question: 'Are Wetherspoons chips gluten free?',
    answer:
      'Chips themselves are made from potatoes, but they are typically cooked in shared fryers that may also be used for battered or breaded items. That creates a cross contamination risk. Check the current allergen information in the app or ask staff at your pub before ordering chips if you avoid gluten.',
  },
  {
    question: 'How do I check allergens at Wetherspoons before ordering?',
    answer:
      'Open the Wetherspoon app, choose your pub and use the allergen filter to hide dishes containing your allergen. You can also use the in-pub information screens or ask a member of staff, who can access the full allergen data and involve a manager if needed. Check every visit because recipes can change.',
  },
  {
    question: 'Does Wetherspoons have nut free options?',
    answer:
      'No tree nuts or peanuts are listed for the items tracked on SpoonsMenu, but that does not mean the kitchen is nut free. Some [desserts](/desserts), sauces and seasonal specials may contain nuts, and suppliers can change ingredients. Always tell staff about a nut allergy and check the current information before ordering.',
  },
  {
    question: 'Is there a risk of cross contamination at Wetherspoons?',
    answer:
      'Yes. Wetherspoon kitchens handle all 14 major allergens and use shared equipment such as fryers, grills and preparation surfaces. Wetherspoons cannot guarantee that any dish is free from a particular allergen. If you have a severe allergy, inform staff before ordering and consider whether the risk is acceptable for you.',
  },
  {
    question: 'What happens if I customise my Wetherspoons order?',
    answer:
      'Removing a sauce, swapping a side or adding an extra changes the dish from its published recipe, so the allergen information may no longer match. Tell staff about your allergy whenever you customise an order so they can check the ingredients of every component you are getting. Changes may also affect [nutrition information](/nutrition-information).',
  },
  {
    question: 'Do Wetherspoons drinks contain allergens?',
    answer:
      'Some drinks do. Beer and lager usually contain cereals containing gluten, wine and cider often contain sulphur dioxide, and coffees and milkshakes contain milk unless you choose a plant based alternative. Check the [drinks menu](/drinks-menu) section of the app or ask staff for the allergen details of a specific drink.',
  },
];

export default function AllergenInformationPage() {
  const toc = [
    { id: 'safety', label: 'Safety first' },
    { id: 'how-to-check', label: 'How to check' },
    { id: 'fourteen', label: '14 allergens' },
    { id: 'by-category', label: 'By section' },
    { id: 'matrix', label: 'Allergen table' },
    { id: 'gluten', label: 'Gluten' },
    { id: 'milk', label: 'Milk' },
    { id: 'tips', label: 'Tips' },
    { id: 'faqs', label: 'Questions' },
  ];

  const catRows = CATEGORY_SLUGS.map((slug) => {
    const items = menuItems.filter((i) => i.category === slug);
    if (!items.length) return null;
    const top = UK_ALLERGENS.map((a) => ({ name: a.name, n: items.filter((i) => has(i.allergens, a.key)).length }))
      .filter((a) => a.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 3);
    return { slug, name: CATEGORY_NAMES[slug], total: items.length, top };
  }).filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <main className="pt-24">
      <JsonLd json={faqSchema(faqs)} />

      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Allergen information', href: '/allergen-information' }]} />
          <p className="eyebrow mt-2 text-teal">Allergen guide</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons allergen menu and information
          </h1>
        <div className="mt-8 mb-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm max-w-[1200px]">
          <Image
            src="/images/pages/allergen-information.webp"
            alt="Chart showing the 14 major food allergens tracked across the Wetherspoons menu"
            width={1200}
            height={630}
            className="aspect-video w-full object-cover sm:aspect-[21/9]"
            priority
          />
        </div>
      
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose
              text={`UK food law requires pubs and restaurants to declare 14 major allergens. This guide shows which allergens appear across ${menuItems.length} Wetherspoons menu items tracked on SpoonsMenu, which sections they are most common in, and how to check and order safely. It is a planning aid, not a substitute for the official allergen information at your pub.`}
            />
          </div>
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: '14', label: 'UK allergens' },
                { value: String(menuItems.length), label: 'Items checked' },
                { value: `${pct(counts[0].count)}%`, label: 'Contain gluten' },
                { value: String(noGluten.length), label: 'No gluten listed' },
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
          text={`Wetherspoons provides allergen information for its menu through the Wetherspoon app, in-pub screens and staff. The most common allergens on SpoonsMenu are gluten, milk and eggs. ${noGluten.length} items do not list gluten as an ingredient, but shared fryers and kitchens mean no dish can be guaranteed allergen free. Always tell staff about an allergy before ordering.`}
        />
      </div>

      {/* Safety */}
      <BandSection id="safety" eyebrow="Safety first" title="Important allergy safety notice">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ['Always tell staff', 'Mention your allergy every time you order, even for a dish you have had before.'],
            ['Shared kitchens', 'Wetherspoon kitchens handle all 14 allergens and use shared fryers, grills and surfaces.'],
            ['Recipes change', 'Suppliers can change ingredients, so check the current information on every visit.'],
            ['Changes alter allergens', 'Swapping sides or removing sauces changes the dish from its published allergen data.'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-[var(--radius-lg)] border-2 border-red-300/40 bg-red-50/60 p-5">
              <p className="font-display text-lg font-semibold text-ink">{t}</p>
              <p className="mt-2 text-sm text-ink/75">{d}</p>
            </div>
          ))}
        </div>
      </BandSection>

      {/* How to check */}
      <BandSection id="how-to-check" tone="cloud" eyebrow="How to check" title="How to check allergens at Wetherspoons">
        <CardGrid
          numbered
          columns={4}
          items={[
            { title: 'Use the app', text: 'Choose your pub in the Wetherspoon app and switch on the allergen filter to hide dishes containing your allergen.' },
            { title: 'Check in-pub screens', text: 'Customer information screens in many pubs show allergen details for each dish on the current menu.' },
            { title: 'Ask the staff', text: 'Bar staff can look up full allergen data and ask a manager or the kitchen if you need more detail.' },
            { title: 'Confirm when ordering', text: 'State your allergy again when you order at the bar or add a note so the kitchen is aware.' },
          ]}
        />
      </BandSection>

      {/* 14 allergens */}
      <BandSection id="fourteen" eyebrow="The 14 allergens" title="The 14 major allergens and where they appear">
        <p className="mb-6 max-w-[var(--measure)] text-ink/70">
          The count shows how many of the {menuItems.length} items tracked on SpoonsMenu list each allergen. A count of zero means it is not listed in our data, not that the kitchen is free from it.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {counts.map((a) => (
            <div key={a.name} className="rounded-[var(--radius-lg)] border border-line bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold text-ink">{a.name}</h3>
                <span className="whitespace-nowrap rounded-full bg-mist px-2.5 py-1 text-xs font-semibold tabular-nums text-teal">
                  {a.count} items
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-teal/60" style={{ width: `${pct(a.count)}%` }} />
              </div>
              <p className="mt-3 text-sm text-ink/70">{a.text}</p>
            </div>
          ))}
        </div>
      </BandSection>

      {/* By category */}
      <BandSection id="by-category" tone="cloud" eyebrow="By section" title="Common allergens in each Wetherspoons menu section">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catRows.map((r) => (
            <Link
              key={r.slug}
              href={getCategoryUrl(r.slug)}
              className="lift group rounded-[var(--radius-xl)] border border-line bg-white p-6 hover:border-primary/30"
            >
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-primary">{r.name}</h3>
              <p className="mt-1 text-xs text-muted">{r.total} items</p>
              <ul className="mt-4 space-y-2">
                {r.top.length === 0 && <li className="text-sm text-ink/60">No major allergens listed in our data</li>}
                {r.top.map((t) => (
                  <li key={t.name} className="flex justify-between text-sm">
                    <span className="text-ink/80">{t.name}</span>
                    <span className="tabular-nums font-semibold text-teal">
                      {t.n}/{r.total}
                    </span>
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>
      </BandSection>

      {/* Matrix */}
      <BandSection id="matrix" eyebrow="Allergen table" title="Wetherspoons allergen table for every item">
        <p className="mb-4 text-sm text-muted">A dot means the allergen is listed for that item in our data. Columns cover the allergens that appear on the tracked menu.</p>
        <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">Allergens listed for each Wetherspoons menu item</caption>
            <thead>
              <tr className="border-b border-line bg-cloud">
                <th scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Item</th>
                {MATRIX.map((k) => (
                  <th key={k} scope="col" className="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                    {MATRIX_LABEL[k]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {menuItems.map((i) => (
                <tr key={`${i.category}-${i.slug}`} className="border-b border-line last:border-0 hover:bg-mist/60">
                  <th scope="row" className="px-5 py-2.5 font-medium">
                    <Link href={getProductUrl(i.category, i.slug)} className="text-ink hover:text-primary">
                      {i.name}
                    </Link>
                  </th>
                  {MATRIX.map((k) => (
                    <td key={k} className="px-3 py-2.5 text-center">
                      {has(i.allergens, k) ? (
                        <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" aria-label="Contains" />
                      ) : (
                        <span className="sr-only">Not listed</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BandSection>

      {/* Gluten */}
      <BandSection id="gluten" tone="cloud" eyebrow="Gluten" title="Wetherspoons dishes without gluten listed">
        <div className="max-w-[var(--measure)]">
          <Prose
            text={`${noGluten.length} items tracked on SpoonsMenu do not list cereals containing gluten as an allergen. This is not the same as gluten free. Shared fryers and preparation areas mean cross contamination is possible, so people with coeliac disease should speak to staff and check the official information first.`}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {noGluten.map((i) => (
            <Link
              key={`${i.category}-${i.slug}`}
              href={getProductUrl(i.category, i.slug)}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink/80 hover:border-primary/30 hover:text-primary"
            >
              {i.name}
            </Link>
          ))}
        </div>
      </BandSection>

      {/* Milk */}
      <BandSection id="milk" eyebrow="Milk" title="Wetherspoons dishes without milk listed">
        <div className="max-w-[var(--measure)]">
          <Prose
            text={`${noMilk.length} items tracked on SpoonsMenu do not list milk as an allergen. Butter, cheese, cream and milk based sauces are common across breakfasts, burgers and desserts, so check each component of your order if you avoid dairy. See the vegan guide for plant based choices.`}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {noMilk.map((i) => (
            <Link
              key={`${i.category}-${i.slug}`}
              href={getProductUrl(i.category, i.slug)}
              className="rounded-full border border-line bg-cloud px-3 py-1.5 text-sm text-ink/80 hover:border-primary/30 hover:text-primary"
            >
              {i.name}
            </Link>
          ))}
        </div>
        {noneListed.length > 0 && (
          <p className="mt-6 text-sm text-muted">
            {noneListed.length} items have no major allergens listed in our data. This usually applies to simple sides and drinks, but always confirm at the pub.
          </p>
        )}
      </BandSection>

      {/* Tips */}
      <BandSection id="tips" tone="cloud" eyebrow="Tips" title="How to order safely with a food allergy at Wetherspoons">
        <CardGrid
          columns={3}
          items={[
            { title: 'Plan before you go', text: 'Check the app for your chosen pub so you arrive with a shortlist of suitable dishes.' },
            { title: 'Keep it simple', text: 'Dishes with fewer components and no sauces are easier to check and have fewer hidden allergens.' },
            { title: 'Ask about fryers', text: 'If you avoid gluten, fish or crustaceans, ask whether chips and sides share a fryer with battered items.' },
            { title: 'Check every component', text: 'Sides, sauces, toppings and drinks each carry their own allergens. Check them all, not just the main.' },
            { title: 'Avoid assumptions', text: 'A vegetarian or vegan label does not mean allergen free. Plant based dishes can contain gluten, soya or mustard.' },
            { title: 'Carry your medication', text: 'If you have a severe allergy, keep your prescribed medication with you whenever you eat out.' },
          ]}
        />
      </BandSection>

      <BandSection id="faqs" tone="mist" eyebrow="Questions" title="Wetherspoons allergen questions">
        <FAQList faqs={faqs} />
      </BandSection>

      <BandSection id="related" eyebrow="Related guides" title="More Wetherspoons guides">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['/nutrition-information', 'Calories and nutrition'],
            ['/vegan-and-vegetarian-options', 'Vegan and vegetarian options'],
            ['/', 'Full Wetherspoons menu'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="lift rounded-[var(--radius-xl)] border border-line bg-cloud p-6 font-display text-lg font-semibold text-ink hover:border-primary/30 hover:text-primary"
            >
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
