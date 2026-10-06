interface PriceNoticeProps {
  variant?: 'full' | 'compact';
}

export function PriceNotice({ variant = 'full' }: PriceNoticeProps) {
  if (variant === 'compact') {
    return (
      <span className="inline-block rounded-full border border-line bg-cloud px-3 py-1 text-xs font-medium text-muted">
        Prices are typical and variable by pub.
      </span>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-primary/15 bg-mist px-5 py-4 text-sm text-ink/80">
      <p>
        <strong className="font-semibold text-primary">Typical prices.</strong>{' '}
        All prices shown are typical only and vary by pub location. Check your chosen pub before ordering.
      </p>
    </div>
  );
}
