import { MetadataRoute } from 'next';
import { SITE_URL, getCategoryUrl, getProductUrl, getCityUrl, INFO_ROUTES } from '@/lib/routes';
import { menuItems } from '@/content/menu';
import { categories } from '@/content/categories';
import { cities } from '@/content/cities';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const siteLastModified = new Date('2026-10-06');

  // Homepage
  entries.push({
    url: SITE_URL,
    lastModified: siteLastModified,
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  // Categories
  for (const category of categories) {
    entries.push({
      url: `${SITE_URL}${getCategoryUrl(category.slug)}`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Products
  for (const item of menuItems) {
    entries.push({
      url: `${SITE_URL}${getProductUrl(item.category, item.slug)}`,
      lastModified: new Date(item.lastReviewedOn),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  // Location hub
  entries.push({
    url: `${SITE_URL}/locations`,
    lastModified: siteLastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  });


  // Info pages
  for (const route of INFO_ROUTES) {
    entries.push({
      url: `${SITE_URL}${route.path}`,
      lastModified: siteLastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    });
  }

  // Author profile
  entries.push({
    url: `${SITE_URL}/author/editorial-team`,
    lastModified: siteLastModified,
    changeFrequency: 'monthly',
    priority: 0.4,
  });

  // City pages
  for (const city of cities) {
    entries.push({
      url: `${SITE_URL}${getCityUrl(city.slug)}`,
      lastModified: new Date(city.checkedOn),
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
