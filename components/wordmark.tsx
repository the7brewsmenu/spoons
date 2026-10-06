export function Wordmark({
  variant = 'light',
  className = '',
}: {
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const base = variant === 'light' ? 'text-white' : 'text-navy';
  const accent = variant === 'light' ? 'text-mint' : 'text-primary';

  return (
    <span className={`inline-flex select-none items-baseline gap-[3px] leading-none ${base} ${className}`}>
      <span className="sr-only">SpoonsMenu, independent Wetherspoons menu guide</span>
      <span aria-hidden="true" className="font-display text-[1.45rem] font-semibold tracking-[-0.02em]">
        Spoons
      </span>
      <span aria-hidden="true" className={`font-body text-[1.05rem] font-medium tracking-[0.01em] ${accent}`}>
        Menu
      </span>
    </span>
  );
}
