import Link from 'next/link';
import type { ReactNode } from 'react';

function renderInlineLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)]*)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <Link key={key++} href={match[2]} className="font-medium text-teal underline underline-offset-4 hover:text-ink">
        {match[1]}
      </Link>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

interface FAQ {
  question: string;
  answer: string;
}

interface FAQListProps {
  faqs: FAQ[];
  title?: string;
  /** Set false to let the parent control width (e.g. two-column layouts). */
  constrained?: boolean;
}

export function FAQList({ faqs, title, constrained = true }: FAQListProps) {
  if (faqs.length === 0) return null;

  return (
    <section className={constrained ? 'mx-auto my-12 max-w-[var(--measure)]' : ''}>
      {title && <h2 className="mb-6 font-display text-2xl font-semibold text-ink">{title}</h2>}
      <div className="divide-y divide-line border-y border-line">
        {faqs.map((faq, index) => (
          <details key={index} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-medium text-ink transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
              {faq.question}
              {/* Plus that turns into a minus: two thin bars, no icon font */}
              <span aria-hidden="true" className="relative h-3.5 w-3.5 shrink-0">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-transform duration-[var(--duration-normal)] group-open:scale-y-0" />
              </span>
            </summary>
            <div className="pb-6 pr-10 leading-relaxed text-ink/75">{renderInlineLinks(faq.answer)}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
