import Link from 'next/link';

interface CompareItem {
  name: string;
  price: number | null;
  calories: number | null;
  slug: string;
  category: string;
}

interface CompareTableProps {
  title: string;
  items: CompareItem[];
  compareBy: 'price' | 'calories';
  caption?: string;
}

export function CompareTable({ title, items, compareBy, caption }: CompareTableProps) {
  const sortedItems = [...items].sort((a, b) => {
    const valA = a[compareBy];
    const valB = b[compareBy];
    if (valA === null && valB === null) return 0;
    if (valA === null) return 1;
    if (valB === null) return -1;
    return valA - valB;
  });

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-white shadow-[var(--shadow-card)]">
      <div className="border-b border-line px-6 pb-4 pt-6">
        <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
        {caption && <p className="mt-1 text-sm text-muted">{caption}</p>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left text-sm text-ink">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-muted">
            <tr>
              <th scope="col" className="w-1/2 px-6 py-3 font-semibold">Item</th>
              <th scope="col" className="w-1/4 px-3 py-3 text-right font-semibold">Price</th>
              <th scope="col" className="w-1/4 px-6 py-3 text-right font-semibold">Kcal</th>
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr key={`${item.category}/${item.slug}`} className="border-t border-line/70 transition-colors hover:bg-cloud">
                <td className="px-6 py-3.5 font-medium">
                  <Link href={`/${item.category}/${item.slug}`} className="block truncate transition-colors hover:text-primary">
                    {item.name}
                  </Link>
                </td>
                <td
                  className={`whitespace-nowrap px-3 py-3.5 text-right tabular-nums ${
                    compareBy === 'price' ? 'font-semibold text-teal' : 'text-ink/80'
                  }`}
                >
                  {item.price !== null ? `£${item.price.toFixed(2)}` : <span className="text-muted">n/a</span>}
                </td>
                <td
                  className={`whitespace-nowrap px-6 py-3.5 text-right tabular-nums ${
                    compareBy === 'calories' ? 'font-semibold text-teal' : 'text-ink/80'
                  }`}
                >
                  {item.calories !== null ? item.calories : <span className="text-muted">n/a</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
