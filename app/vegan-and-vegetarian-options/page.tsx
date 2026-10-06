import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { menuItems } from '@/content/menu';
import { CATEGORY_SLUGS, CATEGORY_NAMES, type MenuItem } from '@/lib/types';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import { PriceNotice } from '@/components/price-notice';
import { MenuItemCard } from '@/components/menu-item-card';
import { JsonLd, faqSchema } from '@/lib/schema';
import { getCategoryUrl, getProductUrl } from '@/lib/routes';
import { BandSection, CardGrid, Prose, QuickAnswer, StatTiles, TableOfContents } from '@/components/content/sections';

const TITLE = 'Wetherspoons Vegan Menu and Vegetarian Options 2026';
const DESC =
  'Every vegan and vegetarian dish on the Wetherspoons menu with typical prices and calories. Find plant based breakfasts, burgers, curries and sides at Spoons.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/vegan-and-vegetarian-options' },
  openGraph: { title: TITLE, description: DESC, url: '/vegan-and-vegetarian-options' , images: [{ url: '/images/pages/vegan-and-vegetarian-options.webp', width: 1200, height: 630 }] },
twitter: { card: 'summary_large_image', images: ['/images/pages/vegan-and-vegetarian-options.webp'] }};

const isVegan = (i: MenuItem) => i.dietaryTags.includes('vegan');
const isVeggie = (i: MenuItem) => i.dietaryTags.includes('vegetarian') || isVegan(i);

const vegan = menuItems.filter(isVegan);
const veggieOnly = menuItems.filter((i) => isVeggie(i) && !isVegan(i));
const allVeg = menuItems.filter(isVeggie);
const gbp = (v: number) => `£${v.toFixed(2)}`;
const priced = allVeg.filter((i) => i.typicalPriceGbp !== null).sort((a, b) => a.typicalPriceGbp! - b.typicalPriceGbp!);
const cheapest = priced[0];
const lightest = [...allVeg].filter((i) => i.caloriesKcal !== null).sort((a, b) => a.caloriesKcal! - b.caloriesKcal!)[0];

const byCat = CATEGORY_SLUGS.map((slug) => {
  const items = allVeg.filter((i) => i.category === slug);
  return { slug, name: CATEGORY_NAMES[slug], items, vegan: items.filter(isVegan).length };
}).filter((c) => c.items.length > 0);

const veganBreakfast = vegan.filter((i) => i.category === 'breakfast-menu');
const veganBurgers = vegan.filter((i) => i.category === 'burgers');

const faqs = [
  {
    question: 'Does Wetherspoons have vegan options?',
    answer: `Yes. SpoonsMenu tracks ${vegan.length} vegan items on the [Wetherspoons menu](/), spread across ${new Set(vegan.map((i) => i.category)).size} menu sections. They include breakfasts, burgers, mains, sides and drinks. Availability can vary by pub, so check the Wetherspoon app for your local menu.`,
  },
  {
    question: 'How many vegetarian options does Wetherspoons have?',
    answer: `There are ${allVeg.length} vegetarian or vegan items tracked on SpoonsMenu, out of ${menuItems.length} menu items in total. That is roughly ${Math.round((allVeg.length / menuItems.length) * 100)}% of the menu, covering every main section from [breakfast](/breakfast-menu) to [desserts](/desserts).`,
  },
  {
    question: 'Does Wetherspoons do a vegan breakfast?',
    answer: veganBreakfast.length
      ? `Yes. ${veganBreakfast.map((i) => i.name).join(', ')} ${veganBreakfast.length > 1 ? 'are' : 'is'} tagged vegan on SpoonsMenu. Breakfast is typically served from opening until midday. Check our [breakfast times](/breakfast-times) page and the product page for components, calories and typical prices.`
      : 'Vegan breakfast availability varies. Check the [breakfast menu](/breakfast-menu) page and the Wetherspoon app for the current options at your pub.',
  },
  {
    question: 'Does Wetherspoons have a vegan burger?',
    answer: veganBurgers.length
      ? `Yes. ${veganBurgers.map((i) => i.name).join(', ')} ${veganBurgers.length > 1 ? 'are' : 'is'} tagged vegan on SpoonsMenu. [Burgers](/burgers) are often available as a meal with a drink. Check the bun, sauces and sides, as some toppings can change whether the full order is vegan.`
      : 'Check the [burgers](/burgers) section and the Wetherspoon app for current plant based burger options.',
  },
  {
    question: 'What is the cheapest vegetarian meal at Wetherspoons?',
    answer: cheapest
      ? `Among the items tracked on SpoonsMenu, ${cheapest.name} has the lowest typical price of the vegetarian and vegan options at ${gbp(cheapest.typicalPriceGbp!)}. Prices are set by each pub and vary by location, so treat this as a guide.`
      : 'Prices vary by pub. Check the category pages on SpoonsMenu for typical prices.',
  },
  {
    question: 'Are Wetherspoons chips vegan?',
    answer:
      'Chips are made from potatoes and cooked in vegetable oil, so they contain no animal ingredients as standard. However, they may be cooked in fryers shared with meat, fish or battered products. If that matters to you, ask staff at your pub before ordering.',
  },
  {
    question: 'Is vegetarian the same as vegan at Wetherspoons?',
    answer:
      'No. Vegetarian dishes contain no meat or fish but can include eggs, milk, cheese, butter or honey. Vegan dishes contain no animal products at all. On SpoonsMenu, items are tagged separately so you can tell them apart. Always check the ingredients if you follow a strict diet.',
  },
  {
    question: 'Can I make a Wetherspoons dish vegan?',
    answer:
      'Some dishes can be adjusted, for example by removing cheese or swapping a sauce, but changes are at the discretion of each pub and may affect allergen information. It is usually simpler to choose a dish already tagged vegan. Tell staff about your requirements when ordering.',
  },
  {
    question: 'Are Wetherspoons vegan options gluten free?',
    answer:
      'Not necessarily. Many plant based dishes use wheat buns, wraps, batter or breadcrumbs, and some meat alternatives contain gluten or soya. Check the [allergen information](/allergen-information) page and the official data in the Wetherspoon app if you need to avoid gluten as well.',
  },
  {
    question: 'Are vegan options available on Curry Club and Steak Club?',
    answer:
      '[Curry Club](/curry-club) usually includes at least one vegetarian or vegan curry. [Steak Club](/steak-club) focuses on steaks, but some pubs offer a meat free alternative. Check the Curry Club and Steak Club pages on SpoonsMenu and the app for the options at your pub.',
  },
];

export default function VeganVegetarianPage() {
  const toc = [
    { id: 'vegan', label: 'Vegan dishes' },
    { id: 'vegetarian', label: 'Vegetarian dishes' },
    { id: 'by-section', label: 'By section' },
    { id: 'compare', label: 'Price and calories' },
    { id: 'difference', label: 'Vegan vs vegetarian' },
    { id: 'tips', label: 'Tips' },
    { id: 'faqs', label: 'Questions' },
  ];

  return (
    <main className="pt-24">
      <JsonLd json={faqSchema(faqs)} />

      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Vegan and vegetarian options', href: '/vegan-and-vegetarian-options' }]} />
          <p className="eyebrow mt-2 text-teal">Dietary guide</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons vegan and vegetarian menu
          </h1>
        <div className="mt-8 mb-10 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm max-w-[1200px]">
          <Image
            src="/images/pages/vegan-and-vegetarian-options.webp"
            alt="Vegan and vegetarian options available on the Wetherspoons pub menu"
            width={1200}
            height={630}
            className="aspect-video w-full object-cover sm:aspect-[21/9]"
            priority
          />
        </div>
      
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose
              text={`Eating meat free at Spoons is straightforward. SpoonsMenu tracks ${vegan.length} vegan and ${veggieOnly.length} further vegetarian dishes across the Wetherspoons menu, from cooked breakfasts and burgers to curries, sides and desserts. Each dish below links to its own page with typical prices, calories, allergens and what comes on the plate.`}
            />
          </div>
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: String(vegan.length), label: 'Vegan dishes' },
                { value: String(allVeg.length), label: 'Veg or vegan' },
                { value: cheapest ? gbp(cheapest.typicalPriceGbp!) : 'n/a', label: 'From' },
                { value: String(byCat.length), label: 'Menu sections' },
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
          text={`Wetherspoons has ${vegan.length} vegan and ${allVeg.length} vegetarian or vegan dishes tracked on SpoonsMenu, roughly ${Math.round((allVeg.length / menuItems.length) * 100)}% of the menu. Options cover breakfast, burgers, mains, sides and desserts.${cheapest ? ` The lowest typical price is ${cheapest.name} at ${gbp(cheapest.typicalPriceGbp!)}.` : ''} Shared kitchens mean dishes may contact animal products, so check with staff if that matters.`}
        />
        <div className="mt-6">
          <PriceNotice variant="compact" />
        </div>
      </div>

      <BandSection id="vegan" eyebrow="Vegan" title="Wetherspoons vegan menu items">
        <p className="mb-6 max-w-[var(--measure)] text-ink/70">
          These {vegan.length} dishes are tagged vegan, meaning no meat, fish, dairy, eggs or honey in the standard recipe.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vegan.map((i) => (
            <MenuItemCard key={`${i.category}-${i.slug}`} item={i} href={getProductUrl(i.category, i.slug)} />
          ))}
        </div>
      </BandSection>

      <BandSection id="vegetarian" tone="cloud" eyebrow="Vegetarian" title="Wetherspoons vegetarian options">
        <p className="mb-6 max-w-[var(--measure)] text-ink/70">
          These {veggieOnly.length} dishes are vegetarian but not vegan. They contain no meat or fish but may include eggs, milk, cheese or honey.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {veggieOnly.map((i) => (
            <MenuItemCard key={`${i.category}-${i.slug}`} item={i} href={getProductUrl(i.category, i.slug)} />
          ))}
        </div>
      </BandSection>

      <BandSection id="by-section" eyebrow="By section" title="Meat free options in each Wetherspoons menu section">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {byCat.map((c) => (
            <Link key={c.slug} href={getCategoryUrl(c.slug)} className="lift group rounded-[var(--radius-xl)] border border-line bg-white p-6 hover:border-primary/30">
              <h3 className="font-display text-lg font-semibold text-ink group-hover:text-primary">{c.name}</h3>
              <p className="mt-1 text-xs text-muted">
                {c.items.length} meat free · {c.vegan} vegan
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink/80">
                {c.items.slice(0, 5).map((i) => (
                  <li key={i.slug} className="flex justify-between gap-3">
                    <span>{i.name}</span>
                    <span className="text-xs font-semibold uppercase text-teal">{isVegan(i) ? 'VG' : 'V'}</span>
                  </li>
                ))}
                {c.items.length > 5 && <li className="text-xs text-muted">+{c.items.length - 5} more</li>}
              </ul>
            </Link>
          ))}
        </div>
      </BandSection>

      <BandSection id="compare" tone="cloud" eyebrow="Compare" title="Vegan and vegetarian prices and calories">
        <p className="mb-4 text-sm text-muted">Sorted by typical price, lowest first. Prices vary by pub.</p>
        <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[620px] text-left text-sm">
            <caption className="sr-only">Typical prices and calories for Wetherspoons vegan and vegetarian dishes</caption>
            <thead>
              <tr className="border-b border-line bg-cloud">
                {['Item', 'Section', 'Diet', 'Typical price', 'Calories'].map((h) => (
                  <th key={h} scope="col" className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...priced, ...allVeg.filter((i) => i.typicalPriceGbp === null)].map((i) => (
                <tr key={`${i.category}-${i.slug}`} className="border-b border-line last:border-0 hover:bg-mist/60">
                  <th scope="row" className="px-5 py-3 font-medium">
                    <Link href={getProductUrl(i.category, i.slug)} className="text-ink hover:text-primary">
                      {i.name}
                    </Link>
                  </th>
                  <td className="px-5 py-3 text-xs text-muted">{CATEGORY_NAMES[i.category]}</td>
                  <td className="px-5 py-3 capitalize text-ink/70">{isVegan(i) ? 'vegan' : 'vegetarian'}</td>
                  <td className="px-5 py-3 font-semibold tabular-nums text-teal">{i.typicalPriceGbp !== null ? gbp(i.typicalPriceGbp) : 'n/a'}</td>
                  <td className="px-5 py-3 tabular-nums text-ink/70">{i.caloriesKcal !== null ? `${i.caloriesKcal} kcal` : 'n/a'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {lightest && (
          <p className="mt-4 text-sm text-ink/70">
            Lightest meat free option: <strong>{lightest.name}</strong> at {lightest.caloriesKcal} kcal.
          </p>
        )}
      </BandSection>

      <BandSection id="difference" eyebrow="Know the difference" title="Vegan vs vegetarian at Wetherspoons">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--radius-xl)] border border-line bg-white p-6">
            <p className="eyebrow text-teal">Vegan (VG)</p>
            <Prose
              className="mt-3"
              text="No animal products of any kind. That rules out meat, fish, milk, butter, cheese, cream, eggs and honey. Plant based burgers, vegan sausages and dairy free sauces make up most of these dishes. Check sides and sauces too, because a vegan main can be paired with a non vegan side."
            />
          </div>
          <div className="rounded-[var(--radius-xl)] border border-line bg-white p-6">
            <p className="eyebrow text-teal">Vegetarian (V)</p>
            <Prose
              className="mt-3"
              text="No meat or fish, but dairy, eggs and honey can be included. Cheese, fried eggs, hollandaise and butter appear in many vegetarian breakfasts, pizzas and desserts. If you avoid one of these, check the product page for components and allergens before ordering."
            />
          </div>
        </div>
      </BandSection>

      <BandSection id="tips" tone="cloud" eyebrow="Tips" title="Tips for ordering vegan or vegetarian at Spoons">
        <CardGrid
          columns={3}
          items={[
            { title: 'Use the app filter', text: 'The Wetherspoon app lets you filter by dietary preference for your chosen pub, which hides dishes that do not fit.' },
            { title: 'Check the sides', text: 'Some sides contain butter or are cooked alongside meat. Confirm the side that comes with your main.' },
            { title: 'Watch the sauces', text: 'Mayonnaise, hollandaise and some dressings contain egg or dairy, even on otherwise vegan dishes.' },
            { title: 'Ask about fryers', text: 'Chips and onion rings may share fryers with meat or fish. Ask staff if cross contact is a concern.' },
            { title: 'Look at club days', text: 'Curry Club usually includes a vegetarian or vegan curry, often with a drink, which can be good value.' },
            { title: 'Check allergens too', text: 'Plant based dishes can contain gluten, soya, mustard or sesame. See the allergen guide if that applies to you.' },
          ]}
        />
      </BandSection>

      <BandSection id="faqs" tone="mist" eyebrow="Questions" title="Wetherspoons vegan and vegetarian questions">
        <FAQList faqs={faqs} />
      </BandSection>

      <BandSection id="related" eyebrow="Related guides" title="More Wetherspoons guides">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['/allergen-information', 'Allergen information'],
            ['/nutrition-information', 'Calories and nutrition'],
            ['/food-clubs', 'Curry Club and Steak Club'],
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
