import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { categories } from '@/content/categories';
import { CATEGORY_SLUGS, CATEGORY_NAMES, type CategorySlug, type MenuItem } from '@/lib/types';
import { categoryMetadata } from '@/lib/metadata';
import { getCategoryUrl, getProductUrl } from '@/lib/routes';
import { JsonLd, faqSchema } from '@/lib/schema';
import { loadCategoryContent } from '@/lib/generated-content';
import { categoryHighlights, categoryVars, fillDeep, gbp, itemsInCategory, priceRange } from '@/lib/content-facts';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PriceNotice } from '@/components/price-notice';
import { MenuItemCard } from '@/components/menu-item-card';
import { FAQList } from '@/components/faq-list';
import { SourceNote } from '@/components/source-note';
import {
  BandSection,
  CardGrid,
  HighlightsQuad,
  Prose,
  QuickAnswer,
  StatTiles,
  TableOfContents,
} from '@/components/content/sections';

export const dynamicParams = false;

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ category: slug }));
}

type Params = Promise<{ category: string }>;

function getContent(slug: CategorySlug) {
  const raw = loadCategoryContent(slug);
  return raw ? fillDeep(raw, categoryVars(slug)) : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return {};
  const base = categoryMetadata(cat);
  const content = getContent(cat.slug);
  if (!content) return base;
  const { title, description } = content.meta;
  return { ...base, title, description, openGraph: { ...base.openGraph, title, description } };
}

function headingName(name: string) {
  return name.toLowerCase().replace(/ menu$/, '');
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const content = getContent(cat.slug);
  const items = itemsInCategory(cat.slug);
  const range = priceRange(items);
  const vegCount = items.filter((i) => i.dietaryTags.length > 0).length;
  const short = headingName(cat.name);
  const faqs = content?.faqs.length ? content.faqs : cat.faqs;

  const picks = categoryHighlights(cat.slug);
  const highlightDefs: { key: keyof typeof picks; label: string; stat: (i: MenuItem) => string }[] = [
    { key: 'bestValue', label: 'Best value', stat: (i) => (i.typicalPriceGbp !== null ? gbp(i.typicalPriceGbp) : '') },
    { key: 'lightest', label: 'Lightest', stat: (i) => `${i.caloriesKcal} kcal` },
    { key: 'mostFilling', label: 'Most filling', stat: (i) => `${i.caloriesKcal} kcal` },
    { key: 'vegetarian', label: 'Vegetarian pick', stat: (i) => i.dietaryTags.join(', ') },
  ];
  const highlights = content
    ? highlightDefs
        .map((d) => {
          const item = picks[d.key];
          const text = content.highlights[d.key];
          return item && text ? { label: d.label, item, text, stat: d.stat(item) } : null;
        })
        .filter((h): h is NonNullable<typeof h> => h !== null)
    : [];

  const sorted = [...items].sort((a, b) => (a.typicalPriceGbp ?? 999) - (b.typicalPriceGbp ?? 999));

  const catIndex = CATEGORY_SLUGS.indexOf(cat.slug);
  const relatedCats = [1, 2, 3].map((n) => CATEGORY_SLUGS[(catIndex + n) % CATEGORY_SLUGS.length]);

  const toc = [
    { id: 'items', label: 'All items' },
    { id: 'prices', label: 'Prices' },
    content && { id: 'guide', label: 'Guide' },
    highlights.length > 0 && { id: 'highlights', label: 'Best picks' },
    content && { id: 'deals', label: 'Deals' },
    content && { id: 'times', label: 'Times' },
    content && { id: 'calories', label: 'Calories' },
    content && { id: 'allergens', label: 'Allergens' },
    content && { id: 'dietary', label: 'Dietary' },
    content && { id: 'ordering', label: 'Ordering' },
    content && { id: 'best-choices', label: 'Best choices' },
    content && { id: 'choose', label: 'How to choose' },
    content && { id: 'compare', label: 'Compare' },
    { id: 'faqs', label: 'Questions' },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <main className="pt-24">
      <JsonLd json={faqSchema(faqs)} />

      {/* ── Hero band ──────────────────────────────────────────── */}
      <header className="bg-mist pb-14">
        <div className="shell">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: cat.name, href: getCategoryUrl(cat.slug) }]} />
          <p className="eyebrow mt-2 text-teal">Menu section</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-[3.2rem]">
            Wetherspoons {short} menu and prices
          </h1>
          <div className="mt-5 max-w-[var(--measure)]">
            <Prose text={content?.intro ?? cat.description} />
          </div>
          {cat.serviceNotes && <p className="mt-4 text-sm font-medium text-ink/70">{cat.serviceNotes}</p>}
          <div className="mt-8">
            <StatTiles
              stats={[
                { value: String(items.length), label: 'Items' },
                { value: range ? gbp(range.min) : 'n/a', label: 'From' },
                { value: range ? gbp(range.avg) : 'n/a', label: 'Average' },
                { value: String(vegCount), label: 'Veg or vegan' },
              ]}
            />
          </div>
          <div className="mt-12 overflow-hidden rounded-[24px] border border-line bg-white shadow-sm">
            <Image
              src={`/images/pages/${cat.slug}.webp`}
              alt={`Wetherspoons ${cat.name} menu`}
              width={1200}
              height={630}
              className="aspect-video w-full object-cover sm:aspect-[21/9]"
              priority
            />
          </div>
        </div>
      </header>

      <div className="sticky top-16 z-10 border-b border-line bg-white/85 py-3 backdrop-blur">
        <div className="shell">
          <TableOfContents items={toc} variant="pills" />
        </div>
      </div>

      {content && (
        <div className="shell pt-12">
          <QuickAnswer text={content.quickAnswer} />
        </div>
      )}

      {/* ── Items ──────────────────────────────────────────────── */}
      <BandSection id="items" eyebrow="Full list" title={`Every ${short} item`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard key={item.slug} item={item} href={getProductUrl(cat.slug, item.slug)} />
          ))}
        </div>
      </BandSection>

      {/* ── Price table ────────────────────────────────────────── */}
      <BandSection
        id="prices"
        tone="cloud"
        eyebrow="Typical prices"
        title={`Wetherspoons ${short} prices`}
        intro="Sorted from lowest to highest typical price. Prices vary by pub."
      >
        <div className="reveal overflow-x-auto rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">Typical prices for the Wetherspoons {short} menu</caption>
            <thead>
              <tr className="border-b border-line bg-cloud">
                {['Item', 'Typical price', 'Calories', 'Diet'].map((h) => (
                  <th key={h} scope="col" className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((i) => (
                <tr key={i.slug} className="border-b border-line last:border-0 hover:bg-mist/60">
                  <th scope="row" className="px-6 py-4 font-medium">
                    <Link href={getProductUrl(cat.slug, i.slug)} className="text-ink hover:text-primary">
                      {i.name}
                    </Link>
                  </th>
                  <td className="px-6 py-4 font-semibold tabular-nums text-teal">
                    {i.typicalPriceGbp !== null ? gbp(i.typicalPriceGbp) : 'Not verified'}
                  </td>
                  <td className="px-6 py-4 tabular-nums text-ink/70">
                    {i.caloriesKcal !== null ? `${i.caloriesKcal} kcal` : 'n/a'}
                  </td>
                  <td className="px-6 py-4 capitalize text-ink/70">{i.dietaryTags.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5">
          <PriceNotice variant="compact" />
        </div>
      </BandSection>

      {/* ── Editorial guide ────────────────────────────────────── */}
      {content && (
        <BandSection id="guide" eyebrow="Guide" title={`What is on the Wetherspoons ${short} menu`}>
          <div className="max-w-[var(--measure)] space-y-10">
            {content.overview.map((s) => (
              <div key={s.heading} className="reveal">
                <h3 className="font-display text-xl font-semibold text-ink">{s.heading}</h3>
                <Prose text={s.body} className="mt-3" />
              </div>
            ))}
          </div>
        </BandSection>
      )}

      {highlights.length > 0 && (
        <BandSection id="highlights" tone="mist" eyebrow="Best picks" title={`Best ${short} picks`}>
          <HighlightsQuad highlights={highlights} />
        </BandSection>
      )}

      {content && (
        <>
          {/* ── Deals and offers ───────────────────────────────── */}
          <BandSection id="deals" eyebrow="Deals" title={`Wetherspoons ${short} deals and offers`}>
            <div className="max-w-[var(--measure)]">
              <Prose text={content.deals} />
            </div>
          </BandSection>

          {/* ── When served ────────────────────────────────────── */}
          <BandSection id="times" tone="cloud" eyebrow="Serving times" title={`When is the ${short} menu served at Wetherspoons`}>
            <div className="max-w-[var(--measure)]">
              <Prose text={content.timing} />
            </div>
          </BandSection>

          {/* ── Calorie guide ──────────────────────────────────── */}
          <BandSection id="calories" eyebrow="Calories" title={`How many calories in the Wetherspoons ${short}`}>
            <div className="max-w-[var(--measure)]">
              <Prose text={content.calorieGuide} />
            </div>
          </BandSection>

          {/* ── Allergen summary ───────────────────────────────── */}
          <BandSection id="allergens" tone="cloud" eyebrow="Allergens" title={`Allergens in the Wetherspoons ${short}`}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Prose text={content.allergenSummary} />
              <div className="space-y-3">
                <Link href="/allergen-information" className="lift block rounded-[var(--radius-lg)] border border-line bg-white p-5 font-semibold text-ink hover:text-primary">
                  Allergen information
                </Link>
                <Link href="/nutrition-information" className="lift block rounded-[var(--radius-lg)] border border-line bg-white p-5 font-semibold text-ink hover:text-primary">
                  Nutrition guide
                </Link>
              </div>
            </div>
          </BandSection>

          {/* ── Dietary ────────────────────────────────────────── */}
          <BandSection id="dietary" eyebrow="Dietary" title={`Vegetarian and vegan options on the ${short} menu`}>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <Prose text={content.dietary} />
              <div className="space-y-3">
                <Link href="/vegan-and-vegetarian-options" className="lift block rounded-[var(--radius-lg)] border border-line bg-white p-5 font-semibold text-ink hover:text-primary">
                  Vegan and vegetarian guide
                </Link>
              </div>
            </div>
          </BandSection>

          {/* ── How to order ───────────────────────────────────── */}
          <BandSection id="ordering" tone="cloud" eyebrow="Ordering" title={`How to order from the Wetherspoons ${short} menu`}>
            <div className="max-w-[var(--measure)]">
              <Prose text={content.ordering} />
            </div>
          </BandSection>

          {/* ── Best choices ───────────────────────────────────── */}
          <BandSection id="best-choices" eyebrow="Best choices" title={`Best Wetherspoons ${short} choices`}>
            <CardGrid items={content.bestChoices} columns={3} />
          </BandSection>

          {/* ── How to choose ──────────────────────────────────── */}
          <BandSection id="choose" tone="cloud" eyebrow="Step by step" title={`How to choose from the ${short} menu`}>
            <CardGrid items={content.howToChoose} numbered columns={3} />
          </BandSection>

          {/* ── Comparison ─────────────────────────────────────── */}
          <BandSection id="compare" eyebrow="Compare" title={`How the ${short} menu compares to other Wetherspoons sections`}>
            <div className="max-w-[var(--measure)]">
              <Prose text={content.comparison} />
            </div>
          </BandSection>
        </>
      )}

      {/* ── FAQs ───────────────────────────────────────────────── */}
      <BandSection id="faqs" tone="mist" eyebrow="Questions" title={`${cat.name} questions`}>
        <FAQList faqs={faqs} />
      </BandSection>

      {/* ── Related ────────────────────────────────────────────── */}
      <BandSection id="related" eyebrow="Keep exploring" title="Explore more of the menu">
        <div className="grid gap-4 sm:grid-cols-3">
          {relatedCats.map((slug) => (
            <Link
              key={slug}
              href={getCategoryUrl(slug)}
              className="lift rounded-[var(--radius-xl)] border border-line bg-cloud p-6 font-display text-lg font-semibold text-ink hover:border-primary/30 hover:text-primary"
            >
              {CATEGORY_NAMES[slug]}
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
