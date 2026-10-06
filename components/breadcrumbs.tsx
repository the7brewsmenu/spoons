import Link from 'next/link';
import { breadcrumbSchema, JsonLd } from '@/lib/schema';
import { SITE_URL } from '@/lib/routes';

interface BreadcrumbsProps {
  items: { label: string; href: string }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schemaItems = items.map((item) => ({
    name: item.label,
    url: `${SITE_URL}${item.href}`,
  }));

  return (
    <>
      <JsonLd json={breadcrumbSchema(schemaItems)} />
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="font-medium text-ink" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="rounded transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-line">
                    /
                  </span>
                </>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
