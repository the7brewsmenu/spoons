import type { CategorySlug, DietaryTag, MenuItem } from '@/lib/types';
import { CATEGORY_NAMES } from '@/lib/types';

/**
 * Lightweight record sent to the client for hero search.
 * Built on the server so the browser never receives full descriptions.
 */
export interface SearchItem {
  name: string;
  slug: string;
  category: CategorySlug;
  categoryName: string;
  price: number | null;
  kcal: number | null;
  tags: DietaryTag[];
  allergenCount: number;
  /** Lower-cased extra text used for matching (description snippet + category). */
  keywords: string;
}

export interface ApplySearchDetail {
  query: string;
  category: CategorySlug | 'all';
  dietary: DietaryTag | null;
}

export const APPLY_SEARCH_EVENT = 'spoons:apply-search';
export const FOCUS_SEARCH_EVENT = 'spoons:focus-search';

export function buildSearchIndex(items: MenuItem[]): SearchItem[] {
  return items.map((item) => ({
    name: item.name,
    slug: item.slug,
    category: item.category,
    categoryName: CATEGORY_NAMES[item.category],
    price: item.typicalPriceGbp,
    kcal: item.caloriesKcal,
    tags: item.dietaryTags,
    allergenCount: item.allergens.length,
    keywords: `${CATEGORY_NAMES[item.category]} ${item.description.slice(0, 220)}`.toLowerCase(),
  }));
}
