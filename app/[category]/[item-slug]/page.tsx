import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { menuItems } from '@/content/menu';
import { CATEGORY_NAMES, type CategorySlug, type MenuItem } from '@/lib/types';
import { productMetadata } from '@/lib/metadata';
import { getProductUrl, getCategoryUrl } from '@/lib/routes';
import { JsonLd, JsonLdRaw, menuItemSchema, productSchema, webPageSchema, faqSchema } from '@/lib/schema';
import { loadProductContent } from '@/lib/generated-content';
import { fillDeep, gbp, itemsInCategory, priceRange, productVars, REFERENCE_INTAKE_KCAL } from '@/lib/content-facts';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PriceNotice } from '@/components/price-notice';
import { CompareTable } from '@/components/compare-table';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import {
  AllergenPanel,
  CalorieBar,
  CardGrid,
  FactGrid,
  PairingCards,
  PlateList,
  Prose,
  QuickAnswer,
  Section,
  TableOfContents,
  TipsList,
  ValueMeter,
} from '@/components/content/sections';

export async function generateStaticParams() {
  return menuItems.map((item) => ({
    category: item.category,
    'item-slug': item.slug,
  }));
}

export const dynamicParams = false;

type Params = Promise<{ category: string; 'item-slug': string }>;

function findItem(category: string, slug: string) {
  return menuItems.find((i) => i.category === category && i.slug === slug);
}

function getContent(item: MenuItem) {
  const raw = loadProductContent(item.category, item.slug);
  return raw ? fillDeep(raw, productVars(item)) : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, 'item-slug': itemSlug } = await params;
  const item = findItem(category, itemSlug);
  if (!item) return {};
  const base = productMetadata(item, CATEGORY_NAMES[item.category as CategorySlug]);
  const content = getContent(item);
  if (!content) return base;
  const { title, description } = content.meta;
  return { ...base, title, description, openGraph: { ...base.openGraph, title, description } };
}

/** Data-only FAQs used until generated content exists. */
function fallbackFaqs(item: MenuItem, categoryName: string) {
  const faqs: { question: string; answer: string }[] = [];
  if (item.typicalPriceGbp !== null) {
    faqs.push({
      question: `How much is the ${item.name} at Wetherspoons?`,
      answer: `The ${item.name} has a typical price of ${gbp(item.typicalPriceGbp)}. Prices are set by each pub, so it can cost more in city centres, stations and airports.`,
    });
  }
  if (item.caloriesKcal !== null) {
    faqs.push({
      question: `How many calories are in the Wetherspoons ${item.name}?`,
      answer: `The ${item.name} contains ${item.caloriesKcal} kcal as listed. Extra sides, sauces and drinks add to the total.`,
    });
  }
  if (item.allergens.length > 0) {
    faqs.push({
      question: `What allergens are in the ${item.name}?`,
      answer: `Our data lists: ${item.allergens.join(', ')}. Always confirm current allergen information with your pub before ordering.`,
    });
  }
  faqs.push({
    question: `Is the ${item.name} available at every Wetherspoons?`,
    answer: `The ${item.name} is part of the ${categoryName.toLowerCase()} section and is served at most pubs, but availability can vary by location.`,
  });
  return faqs;
}

export default async function ProductPage({ params }: { params: Params }) {
  const { category, 'item-slug': itemSlug } = await params;
  const item = findItem(category, itemSlug);
  if (!item) notFound();

  const cat = item.category as CategorySlug;
  const categoryName = CATEGORY_NAMES[cat];
  const content = getContent(item);
  const siblings = itemsInCategory(cat);
  const range = priceRange(siblings);
  const related = siblings.filter((i) => i.slug !== item.slug).slice(0, 4);

  const faqs = content?.faqs.length ? content.faqs : fallbackFaqs(item, categoryName);
  const pairings = (content?.pairings ?? [])
    .map((p) => ({ item: menuItems.find((m) => m.slug === p.slug), reason: p.reason }))
    .filter((p): p is { item: MenuItem; reason: string } => Boolean(p.item));

  const quickAnswer =
    content?.quickAnswer ??
    [
      item.typicalPriceGbp !== null && `The Wetherspoons ${item.name} has a typical price of ${gbp(item.typicalPriceGbp)}`,
      item.caloriesKcal !== null && `and contains ${item.caloriesKcal} kcal`,
    ]
      .filter(Boolean)
      .join(' ') + '. Prices vary by pub, so check your local menu before ordering.';

  const checkedDate = item.priceCheckedOn
    ? new Date(item.priceCheckedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Not verified';

  const facts = [
    { label: 'Typical price', value: item.typicalPriceGbp !== null ? gbp(item.typicalPriceGbp) : 'Not verified', note: 'Varies by pub' },
    { label: 'Calories', value: item.caloriesKcal !== null ? `${item.caloriesKcal} kcal` : 'Not verified', note: 'As listed' },
    {
      label: 'Daily intake',
      value: item.caloriesKcal !== null ? `${Math.round((item.caloriesKcal / REFERENCE_INTAKE_KCAL) * 100)}%` : 'n/a',
      note: 'Of 2,000 kcal',
    },
    { label: 'Diet', value: item.dietaryTags.length ? item.dietaryTags.join(', ') : 'None tagged' },
    { label: 'Allergens listed', value: String(item.allergens.length) },
    { label: 'Section', value: categoryName },
  ];

  const toc = [
    { id: 'at-a-glance', label: 'At a glance' },
    content && { id: 'whats-included', label: 'What comes with it' },
    { id: 'about', label: 'About the dish' },
    content && item.typicalPriceGbp !== null && { id: 'value', label: 'Value' },
    { id: 'nutrition', label: 'Calories' },
    { id: 'allergens', label: 'Allergens and diet' },
    content && { id: 'best-for', label: 'When to order' },
    pairings.length > 0 && { id: 'pairings', label: 'What to pair' },
    content && { id: 'tips', label: 'Ordering tips' },
    related.length > 0 && { id: 'compare', label: 'Compare' },
    { id: 'faqs', label: 'Questions' },
  ].filter(Boolean) as { id: string; label: string }[];

  const compareItems = [item, ...related].map((i) => ({
    name: i.name,
    price: i.typicalPriceGbp,
    calories: i.caloriesKcal,
    slug: i.slug,
    category: i.category,
  }));

  return (
    <main className="pb-20 pt-24">
      <JsonLd json={menuItemSchema(item)} />
      <JsonLdRaw json={productSchema(item, categoryName)} />
      <JsonLdRaw json={webPageSchema({
        url: `https://spoonsmenu.co.uk/${item.category}/${item.slug}`,
        name: `${item.name} at Wetherspoons`,
        description: `Price, calories and allergen info for ${item.name} from the Wetherspoons ${categoryName.toLowerCase()} menu.`,
        dateModified: item.lastReviewedOn ?? '2026-10-01',
      })} />
      <JsonLd json={faqSchema(faqs)} />

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: categoryName, href: getCategoryUrl(cat) },
              { label: item.name, href: getProductUrl(cat, item.slug) },
            ]}
          />
          <p className="eyebrow mt-2 text-teal">{categoryName}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons {item.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/70">
            {content?.subtitle ?? 'Typical price, calories, allergens and what to know before you order.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-semibold tabular-nums text-teal">
              {item.typicalPriceGbp !== null ? gbp(item.typicalPriceGbp) : 'Price not verified'}
            </span>
            {item.caloriesKcal !== null && (
              <span className="rounded-full border border-line bg-white px-3 py-1 text-sm font-medium tabular-nums text-ink/70">
                {item.caloriesKcal} kcal
              </span>
            )}
            {item.dietaryTags.map((t) => (
              <span key={t} className="rounded-full bg-foam px-3 py-1 text-sm font-semibold capitalize text-teal-dark">
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="shell mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* ── Main column ─────────────────────────────────────── */}
        <article className="min-w-0 space-y-12">
          <QuickAnswer text={quickAnswer} />

          <Section id="at-a-glance" eyebrow="Key facts" title={`${item.name} at a glance`}>
            <FactGrid facts={facts} />
            <div className="mt-5">
              <PriceNotice variant="compact" />
            </div>
          </Section>

          {content && content.components.length > 0 && (
            <Section id="whats-included" eyebrow="On the plate" title={`What comes with the ${item.name}`}>
              <PlateList items={content.components} />
            </Section>
          )}

          <Section id="about" eyebrow="The dish" title={`What the ${item.name} is like`}>
            <Prose text={content?.taste ?? item.description} />
            {item.availabilityNote && (
              <p className="mt-5 rounded-[var(--radius-lg)] border border-primary/15 bg-mist px-5 py-4 text-sm font-medium text-ink/80">
                {item.availabilityNote}
              </p>
            )}
          </Section>

          {content && item.typicalPriceGbp !== null && (
            <Section id="value" eyebrow="Value" title={`Is the ${item.name} good value?`}>
              {range && <ValueMeter price={item.typicalPriceGbp} min={range.min} max={range.max} />}
              <Prose text={content.value} className="mt-6" />
            </Section>
          )}

          <Section id="nutrition" eyebrow="Nutrition" title={`${item.name} calories and nutrition`}>
            {item.caloriesKcal !== null ? (
              <CalorieBar kcal={item.caloriesKcal} />
            ) : (
              <p className="text-ink/70">Calories for this item are not yet verified.</p>
            )}
            {content && <Prose text={content.nutrition} className="mt-6" />}
          </Section>

          <Section id="allergens" eyebrow="Dietary information" title={`${item.name} allergens and dietary information`}>
            <AllergenPanel contains={item.allergens} />
            {content && <Prose text={content.dietaryGuidance} className="mt-6" />}
          </Section>

          {content && content.bestFor.length > 0 && (
            <Section id="best-for" eyebrow="Occasions" title={`When to order the ${item.name}`}>
              <CardGrid items={content.bestFor} />
            </Section>
          )}

          {pairings.length > 0 && (
            <Section id="pairings" eyebrow="Pairings" title={`What to order with the ${item.name}`}>
              <PairingCards pairings={pairings} />
            </Section>
          )}

          {content && content.tips.length > 0 && (
            <Section id="tips" eyebrow="Ordering tips" title={`Tips for ordering the ${item.name}`}>
              <TipsList tips={content.tips} />
            </Section>
          )}

          {related.length > 0 && (
            <Section id="compare" eyebrow="Side by side" title={`${item.name} compared with similar dishes`}>
              <CompareTable title={`Compare ${categoryName.toLowerCase()}`} items={compareItems} compareBy="price" />
            </Section>
          )}

          <Section id="faqs" eyebrow="Questions" title={`${item.name} questions`}>
            <FAQList faqs={faqs} />
          </Section>

          <SourceNote checkedDate={checkedDate} correctionHref="/contact" />
        </article>

        {/* ── Sticky sidebar ──────────────────────────────────── */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="rounded-[var(--radius-xl)] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Typical price</p>
              <p className="mt-1 font-display text-3xl font-semibold tabular-nums text-teal">
                {item.typicalPriceGbp !== null ? gbp(item.typicalPriceGbp) : 'Not verified'}
              </p>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Calories</dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {item.caloriesKcal !== null ? `${item.caloriesKcal} kcal` : 'n/a'}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Diet</dt>
                  <dd className="font-medium capitalize text-ink">{item.dietaryTags.join(', ') || 'None tagged'}</dd>
                </div>
              </dl>
              <Link
                href={getCategoryUrl(cat)}
                className="mt-5 block rounded-full bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
              >
                See all {categoryName.toLowerCase()}
              </Link>
            </div>
            <TableOfContents items={toc} variant="list" />
          </div>
        </aside>
      </div>
    </main>
  );
}
