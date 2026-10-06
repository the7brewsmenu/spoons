import { menuItems } from '@/content/menu';
import { cities } from '@/content/cities';
import { CATEGORY_SLUGS, CATEGORY_NAMES } from '@/lib/types';
import { CITY_REGIONS } from '@/lib/regions';

/** Short blurbs for each menu section, used in the mega menu and footer. */
const CATEGORY_BLURBS: Record<string, string> = {
  'breakfast-menu': 'Cooked plates, wraps and porridge until noon',
  burgers: 'Beef, chicken and plant based burgers',
  pizza: 'Stone baked pizzas and garlic bread',
  'chicken-dishes': 'Wings, strips, grills and bowls',
  'curry-club': 'Thursday curries with rice and naan',
  'steak-club': 'Tuesday steaks with chips and sides',
  'fish-dishes': 'Battered cod, scampi and more',
  'sunday-roasts': 'Roast dinners with all the trimmings',
  desserts: 'Puddings, sundaes and cakes',
  'drinks-menu': 'Coffee, soft drinks, beer and wine',
  sides: 'Chips, onion rings and extras',
  'kids-menu': 'Smaller meals for children',
};

export type NavCategory = {
  slug: string;
  name: string;
  blurb: string;
  count: number;
  from: string | null;
  popular: { name: string; href: string }[];
};

export type NavRegion = { name: string; cities: { name: string; href: string; pubs: number }[] };

export const GUIDE_LINKS = [
  { name: 'Breakfast times', href: '/breakfast-times', blurb: 'When breakfast starts and ends' },
  { name: 'Food clubs and deals', href: '/food-clubs', blurb: 'Steak Club, Curry Club and more' },
  { name: 'Calories and nutrition', href: '/nutrition-information', blurb: 'Calories for every dish' },
  { name: 'Allergen information', href: '/allergen-information', blurb: 'The 14 allergens explained' },
  { name: 'Vegan and vegetarian', href: '/vegan-and-vegetarian-options', blurb: 'Every meat free dish' },
];

export const COMPANY_LINKS = [
  { name: 'About SpoonsMenu', href: '/about' },
  { name: 'Editorial team', href: '/author/editorial-team' },
  { name: 'Contact us', href: '/contact' },
];

export const LEGAL_LINKS = [
  { name: 'Privacy policy', href: '/privacy-policy' },
  { name: 'Terms and conditions', href: '/terms-and-conditions' },
  { name: 'Disclaimer', href: '/disclaimer' },
];

export function getNavData() {
  const categories: NavCategory[] = CATEGORY_SLUGS.map((slug) => {
    const items = menuItems.filter((i) => i.category === slug);
    const prices = items.map((i) => i.typicalPriceGbp).filter((p): p is number => p !== null);
    return {
      slug,
      name: CATEGORY_NAMES[slug],
      blurb: CATEGORY_BLURBS[slug] ?? '',
      count: items.length,
      from: prices.length ? `£${Math.min(...prices).toFixed(2)}` : null,
      popular: items.slice(0, 3).map((i) => ({ name: i.name, href: `/${slug}/${i.slug}` })),
    };
  });

  const order = [...new Set(Object.values(CITY_REGIONS))];
  const regions: NavRegion[] = order
    .map((r) => ({
      name: r,
      cities: cities
        .filter((c) => CITY_REGIONS[c.slug] === r)
        .map((c) => ({ name: c.name, href: `/locations/${c.slug}`, pubs: c.pubs.length })),
    }))
    .filter((r) => r.cities.length > 0);

  return { categories, regions, totalPubs: cities.reduce((n, c) => n + c.pubs.length, 0), cityCount: cities.length };
}

export type NavData = ReturnType<typeof getNavData>;
