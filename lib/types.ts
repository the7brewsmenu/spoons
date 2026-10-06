export type CategorySlug = 
  | 'breakfast-menu' 
  | 'burgers' 
  | 'pizza' 
  | 'chicken-dishes' 
  | 'curry-club' 
  | 'steak-club' 
  | 'fish-dishes' 
  | 'sunday-roasts' 
  | 'desserts' 
  | 'drinks-menu' 
  | 'sides' 
  | 'kids-menu';

export type Allergen = 
  | 'celery' | 'cereals containing gluten' | 'crustaceans' | 'eggs' 
  | 'fish' | 'lupin' | 'milk' | 'molluscs' | 'mustard' 
  | 'peanuts' | 'sesame' | 'soybeans' | 'sulphur dioxide' | 'tree nuts';

export type DietaryTag = 'vegan' | 'vegetarian';

export interface FAQ {
  question: string;
  answer: string;
}

export interface MenuItem {
  name: string;
  slug: string;
  category: CategorySlug;
  description: string;
  typicalPriceGbp: number | null;
  priceCheckedOn: string;
  caloriesKcal: number | null;
  allergens: Allergen[];
  dietaryTags: DietaryTag[];
  availabilityNote?: string;
  sourceLabel: string;
  sourceUrl?: string;
  lastReviewedOn: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  primaryKeyword: string;
  description: string;
  serviceNotes?: string;
  faqs: FAQ[];
}

export interface PubListing {
  name: string;
  area: string;
  address: string;
  status: 'open' | 'temporarily-closed' | 'closed';
  sourceUrl: string;
  checkedOn: string;
  /** Researched local details (content/pub-details/{city}.json). */
  history?: string;
  nearestStation?: string;
  features?: string[];
  pubUrl?: string;
}

export interface CityRecord {
  slug: string;
  name: string;
  pubs: PubListing[];
  checkedOn: string;
  summary: string;
  faqs: FAQ[];
}

export const CATEGORY_SLUGS: CategorySlug[] = [
  'breakfast-menu', 'burgers', 'pizza', 'chicken-dishes', 
  'curry-club', 'steak-club', 'fish-dishes', 'sunday-roasts', 
  'desserts', 'drinks-menu', 'sides', 'kids-menu'
];

export const CATEGORY_NAMES: Record<CategorySlug, string> = {
  'breakfast-menu': 'Breakfast Menu',
  'burgers': 'Burgers',
  'pizza': 'Pizza',
  'chicken-dishes': 'Chicken Dishes',
  'curry-club': 'Curry Club',
  'steak-club': 'Steak Club',
  'fish-dishes': 'Fish Dishes',
  'sunday-roasts': 'Sunday Roasts',
  'desserts': 'Desserts',
  'drinks-menu': 'Drinks Menu',
  'sides': 'Sides',
  'kids-menu': 'Kids Menu'
};
