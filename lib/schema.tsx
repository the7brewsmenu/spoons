import React from 'react';
import type { Thing, WithContext, Organization, WebSite, Menu, MenuItem as SchemaMenuItem, BreadcrumbList, FAQPage } from 'schema-dts';
import type { MenuItem, FAQ } from '@/lib/types';
import { SITE_URL } from '@/lib/routes';

export function JsonLd<T extends Thing>({ json }: { json: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, '\\u003c') }}
    />
  );
}

/** Render raw JSON-LD when schema-dts types are too strict. */
export function JsonLdRaw({ json }: { json: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, '\\u003c') }}
    />
  );
}

export function organizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SpoonsMenu',
    url: SITE_URL,
    description: 'An independent guide to Wetherspoons menus, prices, and locations in the UK.',
    logo: `${SITE_URL}/icon.svg`,
  };
}

export function websiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SpoonsMenu',
    url: SITE_URL,
  };
}

export function menuSchema(items: MenuItem[]): WithContext<Menu> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Wetherspoons Menu',
    description: 'Typical prices and items available at Wetherspoons pubs.',
    hasMenuSection: [
      {
        '@type': 'MenuSection',
        name: 'All Items',
        hasMenuItem: items.slice(0, 20).map(item => ({
          '@type': 'MenuItem',
          name: item.name,
          description: item.description || undefined,
          offers: item.typicalPriceGbp ? {
            '@type': 'Offer',
            price: item.typicalPriceGbp,
            priceCurrency: 'GBP',
            availability: 'https://schema.org/InStock'
          } : undefined,
        } as SchemaMenuItem))
      }
    ]
  };
}

export function menuItemSchema(item: MenuItem): WithContext<SchemaMenuItem> {
  return {
    '@context': 'https://schema.org',
    '@type': 'MenuItem',
    name: item.name,
    description: item.description || undefined,
    offers: item.typicalPriceGbp ? {
      '@type': 'Offer',
      price: item.typicalPriceGbp,
      priceCurrency: 'GBP',
      availability: 'https://schema.org/InStock'
    } : undefined,
    nutrition: item.caloriesKcal ? {
      '@type': 'NutritionInformation',
      calories: `${item.caloriesKcal} kcal`
    } : undefined
  };
}

/** Google-supported Product schema for rich results (price badges etc). */
export function productSchema(item: MenuItem, categoryName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description || `${item.name} from the Wetherspoons ${categoryName} menu.`,
    brand: { '@type': 'Brand', name: 'JD Wetherspoon' },
    category: categoryName,
    ...(item.typicalPriceGbp ? {
      offers: {
        '@type': 'Offer',
        price: item.typicalPriceGbp,
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
        priceValidUntil: '2027-01-01',
        url: `${SITE_URL}/${item.category}/${item.slug}`,
      }
    } : {}),
    ...(item.caloriesKcal ? {
      nutrition: {
        '@type': 'NutritionInformation',
        calories: `${item.caloriesKcal} kcal`,
      }
    } : {}),
  };
}

/** WebPage schema with dateModified for freshness signals. */
export function webPageSchema(opts: {
  url: string;
  name: string;
  description: string;
  dateModified: string;
  datePublished?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: opts.url,
    name: opts.name,
    description: opts.description,
    dateModified: opts.dateModified,
    datePublished: opts.datePublished ?? '2026-10-01',
    isPartOf: { '@type': 'WebSite', name: 'SpoonsMenu', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'SpoonsMenu', url: SITE_URL },
  };
}

export function breadcrumbSchema(crumbs: {name: string, url: string}[]): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  };
}

export function faqSchema(faqs: FAQ[]): WithContext<FAQPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

