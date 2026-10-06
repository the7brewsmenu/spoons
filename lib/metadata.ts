import { Metadata } from 'next';
import { SITE_URL, getCategoryUrl, getProductUrl, getCityUrl } from '@/lib/routes';
import type { Category, MenuItem, CityRecord } from '@/lib/types';

export function homeMetadata(): Metadata {
  return {
    title: { absolute: 'Wetherspoons Menu With Prices UK | Latest Prices 2026' },
    description: 'Explore the latest Wetherspoons menu with prices, food, drinks, breakfast, burgers, pub classics and more. Find your favourite Wetherspoons meals and prices.',
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title: 'Wetherspoons Menu With Prices UK | Latest Prices 2026',
      description: 'Explore the latest Wetherspoons menu with prices, food, drinks, breakfast, burgers, pub classics and more. Find your favourite Wetherspoons meals and prices.',
      url: SITE_URL,
      siteName: 'SpoonsMenu',
      type: 'website',
      images: [
        {
          url: '/images/pages/home.webp',
          width: 1200,
          height: 630,
          alt: 'Wetherspoons Menu Prices and Info',
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/images/pages/home.webp'],
    },
  };
}

export function categoryMetadata(category: Category): Metadata {
  const path = getCategoryUrl(category.slug);
  const url = `${SITE_URL}${path}`;
  const title = `Wetherspoons ${category.name} Menu With Prices 2026`;
  const description = `Browse the Wetherspoons ${category.name.toLowerCase()} menu. See typical prices and calories for all items in this section at your local pub.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'SpoonsMenu',
      type: 'website',
      images: [
        {
          url: `/images/pages/${category.slug}.webp`,
          width: 1200,
          height: 630,
          alt: `${category.name} at Wetherspoons`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/images/pages/${category.slug}.webp`],
    },
  };
}

export function productMetadata(item: MenuItem, categoryName: string): Metadata {
  const title = `Wetherspoons ${item.name} Price and Calories 2026`;
  const description = `Find out the price and calories for ${item.name} from the Wetherspoons ${categoryName.toLowerCase()} menu. Typical price: £${item.typicalPriceGbp?.toFixed(2) ?? 'N/A'}.`;
  const path = getProductUrl(item.category, item.slug);
  const url = `${SITE_URL}${path}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'SpoonsMenu',
      type: 'website',
      images: [
        {
          url: `/images/pages/${item.category}.webp`,
          width: 1200,
          height: 630,
          alt: `${item.name} from the Wetherspoons ${categoryName} menu`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [`/images/pages/${item.category}.webp`],
    },
  };
}

export function cityMetadata(city: CityRecord): Metadata {
  const path = getCityUrl(city.slug);
  const url = `${SITE_URL}${path}`;
  const title = `Wetherspoons in ${city.name}: Pubs and Menu Guide`;
  const description = `Find Wetherspoon pubs in ${city.name}. See menus, typical prices, and locations for JD Wetherspoon pubs in the ${city.name} area.`;
  
  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'SpoonsMenu',
      type: 'website',
      images: [
        {
          url: '/images/pages/locations.webp',
          width: 1200,
          height: 630,
          alt: `Wetherspoons pubs in ${city.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: ['/images/pages/locations.webp'],
    },
  };
}

export function infoMetadata(title: string, description: string, path: string = '', slug: string = ''): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = `${title}`;
  
  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'SpoonsMenu',
      type: 'website',
      ...(slug ? {
        images: [
          {
            url: `/images/pages/${slug}.webp`,
            width: 1200,
            height: 630,
            alt: fullTitle,
          },
        ],
      } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      ...(slug ? { images: [`/images/pages/${slug}.webp`] } : {}),
    },
  };
}
