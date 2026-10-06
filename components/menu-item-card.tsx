import Link from 'next/link';
import { MenuItem } from '@/lib/types';

interface MenuItemCardProps {
  item: MenuItem;
  href: string;
}

export function MenuItemCard({ item, href }: MenuItemCardProps) {
  return (
    <Link
      href={href}
      className="lift group flex flex-col rounded-[var(--radius-lg)] border border-line bg-white p-6 shadow-[var(--shadow-card)]"
    >
      <div className="mb-3 flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
          {item.name}
        </h3>
        <div className="shrink-0 text-right">
          <span className="font-display text-lg font-semibold tabular-nums text-teal">
            {item.typicalPriceGbp !== null ? `£${item.typicalPriceGbp.toFixed(2)}` : 'n/a'}
          </span>
          {item.typicalPriceGbp !== null && (
            <span className="block text-[10px] font-medium uppercase tracking-wider text-muted">typical</span>
          )}
        </div>
      </div>

      {item.description && (
        <p className="mb-4 flex-grow text-sm leading-relaxed text-ink/70 line-clamp-2">
          {item.description}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-line pt-4">
        {item.caloriesKcal !== null && (
          <span className="rounded-full bg-cloud px-2.5 py-1 text-xs font-medium text-muted">
            {item.caloriesKcal} kcal
          </span>
        )}
        {item.dietaryTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-foam px-2.5 py-1 text-xs font-semibold capitalize text-teal-dark"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
