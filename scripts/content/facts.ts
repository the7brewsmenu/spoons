import { categories } from '@/content/categories';
import { CATEGORY_NAMES, type CategorySlug, type CityRecord, type MenuItem } from '@/lib/types';
import { CITY_REGIONS } from '@/lib/regions';
import {
  categoryHighlights,
  categoryVars,
  cityAreas,
  cityVars,
  itemsInCategory,
  nearbyCities,
  pairingCandidates,
  productVars,
  type Vars,
} from '@/lib/content-facts';

/**
 * A fact pack is everything the model is allowed to know about a page.
 * Numbers are never given as raw values: only as placeholder names, so the
 * model cannot copy a price or calorie figure into prose.
 */
export interface FactPack {
  type: 'product' | 'category' | 'city';
  slug: string;
  primaryKeyword: string;
  facts: Record<string, unknown>;
  placeholders: Record<string, string>;
  vars: Vars;
  /** Proper nouns the city validator accepts. */
  allowedNouns?: string[];
  validPairingSlugs?: string[];
  requiredAreas?: string[];
  highlightAvailability?: Record<string, boolean>;
}

const PLACEHOLDER_HELP: Record<string, string> = {
  name: 'the dish name',
  category: 'the menu section name in lower case',
  price: 'the typical price, for example "£9.99"',
  pricePosition: 'a phrase such as "the third lowest priced of the 8 items we track in this section"',
  calories: 'the calorie number only, write "{calories} kcal"',
  calorieShare: 'a phrase such as "about 40% of the 2,000 kcal daily reference intake"',
  caloriePosition: 'a phrase such as "the lowest calorie of the 8 items we track in this section"',
  categoryName: 'the section name in lower case',
  itemCount: 'number of items in the section',
  vegCount: 'number of vegetarian or vegan items',
  minPrice: 'lowest typical price in the section',
  maxPrice: 'highest typical price in the section',
  avgPrice: 'average typical price in the section',
  city: 'the city name',
  region: 'the UK region',
  pubCount: 'number of open pubs we list',
  areaCount: 'number of areas we list',
};

function describePlaceholders(vars: Vars) {
  return Object.fromEntries(Object.keys(vars).map((k) => [`{${k}}`, PLACEHOLDER_HELP[k] ?? k]));
}

const brief = (i: MenuItem) => ({
  name: i.name,
  slug: i.slug,
  dietaryTags: i.dietaryTags,
  hasPrice: i.typicalPriceGbp !== null,
});

/* ── Product ─────────────────────────────────────────────────────── */

export function productFacts(item: MenuItem): FactPack {
  const vars = productVars(item);
  const siblings = itemsInCategory(item.category).filter((s) => s.slug !== item.slug);
  const candidates = pairingCandidates(item);
  return {
    type: 'product',
    slug: item.slug,
    primaryKeyword: `wetherspoons ${item.name.toLowerCase()}`,
    vars,
    placeholders: describePlaceholders(vars),
    validPairingSlugs: candidates.map((c) => c.slug),
    facts: {
      dishName: item.name,
      section: CATEGORY_NAMES[item.category],
      sourceDescription: item.description,
      allergensInOurData: item.allergens,
      dietaryTags: item.dietaryTags,
      availabilityNote: item.availabilityNote ?? null,
      priceVerified: item.typicalPriceGbp !== null,
      caloriesVerified: item.caloriesKcal !== null,
      otherItemsInSameSection: siblings.map(brief),
      pairingCandidates: candidates.map((c) => ({ slug: c.slug, name: c.name, section: CATEGORY_NAMES[c.category] })),
      generalContext: [
        'Breakfast is typically served from 8am until 12pm.',
        'The main menu typically runs from late morning until the kitchen closes, usually around 11pm.',
        'Curry Club is traditionally on Thursday and Steak Club on Tuesday at participating pubs, often with a drink included.',
        'Many mains can be ordered as a meal with an eligible soft or alcoholic drink.',
        'Customers can order at the bar or at the table with the Wetherspoon app.',
        'Prices are set by each pub and vary by location.',
      ],
    },
  };
}

/* ── Category ────────────────────────────────────────────────────── */

export function categoryFacts(slug: CategorySlug): FactPack {
  const cat = categories.find((c) => c.slug === slug)!;
  const items = itemsInCategory(slug);
  const picks = categoryHighlights(slug);
  const vars = categoryVars(slug);
  return {
    type: 'category',
    slug,
    primaryKeyword: cat.primaryKeyword,
    vars,
    placeholders: describePlaceholders(vars),
    highlightAvailability: Object.fromEntries(Object.entries(picks).map(([k, v]) => [k, v !== null])),
    facts: {
      sectionName: cat.name,
      existingDescription: cat.description,
      serviceNotes: cat.serviceNotes ?? null,
      items: items.map((i) => ({ ...brief(i), description: i.description.slice(0, 260) })),
      highlightItems: Object.fromEntries(
        Object.entries(picks).map(([k, v]) => [k, v ? { name: v.name, description: v.description.slice(0, 260) } : null])
      ),
      otherSections: Object.values(CATEGORY_NAMES).filter((n) => n !== cat.name),
      generalContext: [
        'Breakfast is typically served from 8am until 12pm.',
        'The main menu typically runs from late morning until the kitchen closes, usually around 11pm.',
        'Curry Club is traditionally on Thursday and Steak Club on Tuesday at participating pubs, often with a drink included.',
        'Prices are set by each pub and vary by location.',
      ],
    },
  };
}

/* ── City ────────────────────────────────────────────────────────── */

export function cityFacts(city: CityRecord): FactPack {
  const vars = cityVars(city);
  const areas = cityAreas(city);
  const nearby = nearbyCities(city);
  const nouns = [
    city.name,
    CITY_REGIONS[city.slug] ?? '',
    ...areas,
    ...city.pubs.flatMap((p) => [p.name, p.address]),
    ...nearby.map((n) => n.name),
  ];
  return {
    type: 'city',
    slug: city.slug,
    primaryKeyword: `wetherspoons ${city.name.toLowerCase()}`,
    vars,
    placeholders: describePlaceholders(vars),
    requiredAreas: areas,
    allowedNouns: nouns,
    facts: {
      city: city.name,
      region: CITY_REGIONS[city.slug] ?? null,
      areas,
      pubs: city.pubs.map((p) => ({ name: p.name, area: p.area, address: p.address, status: p.status })),
      nearbyCitiesInRegion: nearby.map((n) => n.name),
      popularDishesOnTheNationalMenu: ['traditional breakfast', 'burgers', 'curries', 'fish and chips', 'pizza'],
      generalContext: [
        'The menu is broadly the same nationally, but each pub sets its own prices.',
        'City centre, station and airport pubs often charge more than suburban pubs.',
        'Breakfast is typically served from 8am until 12pm.',
        'Curry Club is traditionally on Thursday and Steak Club on Tuesday at participating pubs.',
        'Customers can order at the bar or at the table with the Wetherspoon app.',
      ],
    },
  };
}
