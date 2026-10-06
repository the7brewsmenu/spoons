import { menuItems } from '@/content/menu';
import { cities } from '@/content/cities';
import { CATEGORY_NAMES, type Allergen, type CategorySlug, type CityRecord, type MenuItem } from '@/lib/types';
import { CITY_REGIONS } from '@/lib/regions';

/**
 * Live data used to fill placeholders in generated content, shared by the
 * page templates and the generator script so both see identical values.
 */

export type Vars = Record<string, string>;

export const REFERENCE_INTAKE_KCAL = 2000;

export const ALL_ALLERGENS: Allergen[] = [
  'celery', 'cereals containing gluten', 'crustaceans', 'eggs', 'fish', 'lupin', 'milk',
  'molluscs', 'mustard', 'peanuts', 'sesame', 'soybeans', 'sulphur dioxide', 'tree nuts',
];

export const gbp = (n: number) => `\u00A3${n.toFixed(2)}`;

function ordinal(n: number) {
  const words = ['', '', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
  if (words[n]) return words[n];
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function itemsInCategory(slug: CategorySlug) {
  return menuItems.filter((i) => i.category === slug);
}

const byPrice = (a: MenuItem, b: MenuItem) => (a.typicalPriceGbp ?? 0) - (b.typicalPriceGbp ?? 0);
const byKcal = (a: MenuItem, b: MenuItem) => (a.caloriesKcal ?? 0) - (b.caloriesKcal ?? 0);
const isVeg = (i: MenuItem) => i.dietaryTags.includes('vegetarian') || i.dietaryTags.includes('vegan');

export function priceRange(items: MenuItem[]) {
  const p = items.map((i) => i.typicalPriceGbp).filter((x): x is number => x !== null);
  if (p.length === 0) return null;
  return { min: Math.min(...p), max: Math.max(...p), avg: p.reduce((a, b) => a + b, 0) / p.length };
}

function position(list: MenuItem[], slug: string, low: string, high: string) {
  const rank = list.findIndex((s) => s.slug === slug) + 1;
  if (rank === 0 || list.length < 2) return undefined;
  const of = `of the ${list.length} items we track in this section`;
  if (rank === 1) return `the ${low} ${of}`;
  if (rank === list.length) return `the ${high} ${of}`;
  return `the ${ordinal(rank)} ${low} ${of}`;
}

/* ── Product ─────────────────────────────────────────────────────── */

export function productVars(item: MenuItem): Vars {
  const siblings = itemsInCategory(item.category);
  const vars: Vars = {
    name: item.name,
    category: CATEGORY_NAMES[item.category].toLowerCase(),
  };
  if (item.typicalPriceGbp !== null) {
    vars.price = gbp(item.typicalPriceGbp);
    const priced = siblings.filter((s) => s.typicalPriceGbp !== null).sort(byPrice);
    const p = position(priced, item.slug, 'lowest priced', 'highest priced');
    if (p) vars.pricePosition = p;
  }
  if (item.caloriesKcal !== null) {
    vars.calories = String(item.caloriesKcal);
    vars.calorieShare = `about ${Math.round((item.caloriesKcal / REFERENCE_INTAKE_KCAL) * 100)}% of the 2,000 kcal daily reference intake`;
    const counted = siblings.filter((s) => s.caloriesKcal !== null).sort(byKcal);
    const c = position(counted, item.slug, 'lowest calorie', 'highest calorie');
    if (c) vars.caloriePosition = c;
  }
  return vars;
}

/** Items from other sections that the model may suggest as pairings. */
export function pairingCandidates(item: MenuItem) {
  const pool: CategorySlug[] = ['drinks-menu', 'sides', 'desserts'];
  return menuItems.filter(
    (m) => m.slug !== item.slug && pool.includes(m.category) && m.category !== item.category
  );
}

/* ── Category ────────────────────────────────────────────────────── */

export function categoryHighlights(slug: CategorySlug) {
  const items = itemsInCategory(slug);
  const priced = items.filter((i) => i.typicalPriceGbp !== null).sort(byPrice);
  const counted = items.filter((i) => i.caloriesKcal !== null && i.caloriesKcal > 0).sort(byKcal);
  const veg = items.filter(isVeg).sort(byPrice);
  return {
    bestValue: priced[0] ?? null,
    lightest: counted[0] ?? null,
    mostFilling: counted[counted.length - 1] ?? null,
    vegetarian: veg[0] ?? null,
  };
}

export function categoryVars(slug: CategorySlug): Vars {
  const items = itemsInCategory(slug);
  const range = priceRange(items);
  const vars: Vars = {
    categoryName: CATEGORY_NAMES[slug].toLowerCase(),
    itemCount: String(items.length),
    vegCount: String(items.filter(isVeg).length),
  };
  if (range) {
    vars.minPrice = gbp(range.min);
    vars.maxPrice = gbp(range.max);
    vars.avgPrice = gbp(range.avg);
  }
  return vars;
}

/* ── City ────────────────────────────────────────────────────────── */

export function cityAreas(city: CityRecord) {
  return [...new Set(city.pubs.map((p) => p.area))];
}

export function nearbyCities(city: CityRecord) {
  const region = CITY_REGIONS[city.slug];
  return cities.filter((c) => c.slug !== city.slug && CITY_REGIONS[c.slug] === region);
}

export function cityVars(city: CityRecord): Vars {
  const open = city.pubs.filter((p) => p.status === 'open');
  return {
    city: city.name,
    region: CITY_REGIONS[city.slug] ?? 'the UK',
    pubCount: String(open.length),
    areaCount: String(cityAreas(city).length),
  };
}

/* ── Placeholder filling ─────────────────────────────────────────── */

export function fill(text: string, vars: Vars) {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));
}

export function fillDeep<T>(value: T, vars: Vars): T {
  if (typeof value === 'string') return fill(value, vars) as T;
  if (Array.isArray(value)) return value.map((v) => fillDeep(v, vars)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fillDeep(v, vars)])) as T;
  }
  return value;
}
