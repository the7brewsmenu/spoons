import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/routes';

const isProduction =
  process.env.NODE_ENV === 'production' &&
  process.env.VERCEL_ENV !== 'preview';

export default function robots(): MetadataRoute.Robots {
  if (isProduction) {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  };
}
