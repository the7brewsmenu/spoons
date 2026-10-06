import { CATEGORY_SLUGS, CategorySlug } from '@/lib/types';

export const SITE_URL = 'https://spoonsmenu.co.uk';

export function getProductUrl(category: CategorySlug, slug: string): string {
  return `/${category}/${slug}`;
}

export function getCategoryUrl(slug: CategorySlug): string {
  return `/${slug}`;
}

export function getCityUrl(slug: string): string {
  return `/locations/${slug}`;
}

export const REDIRECT_MAP: Record<string, string> = {
  // Map retired slugs to current ones if necessary
};

export const INFO_ROUTES = [
  { path: '/nutrition-information', title: 'Wetherspoons Nutrition Information Guide' },
  { path: '/allergen-information', title: 'Wetherspoons Allergen Information Guide' },
  { path: '/vegan-and-vegetarian-options', title: 'Wetherspoons Vegan and Vegetarian Options' },
  { path: '/breakfast-times', title: 'Wetherspoons Breakfast Times' },
  { path: '/food-clubs', title: 'Wetherspoons Food Clubs' },
  { path: '/about', title: 'About SpoonsMenu' },
  { path: '/contact', title: 'Contact SpoonsMenu' },
  { path: '/privacy-policy', title: 'SpoonsMenu Privacy Policy' },
  { path: '/terms-and-conditions', title: 'SpoonsMenu Terms and Conditions' },
  { path: '/disclaimer', title: 'SpoonsMenu Disclaimer' },
];

export const ALL_CATEGORY_ROUTES = CATEGORY_SLUGS.map(slug => ({
  path: `/${slug}`,
  slug,
}));
