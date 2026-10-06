import Link from 'next/link';

interface SourceNoteProps {
  checkedDate: string;
  methodology?: string;
  correctionHref?: string;
}

export function SourceNote({
  checkedDate,
  methodology = 'Prices are collected from publicly available Wetherspoon menu boards.',
  correctionHref,
}: SourceNoteProps) {
  return (
    <div className="mx-auto mt-16 max-w-[var(--measure)] border-t border-line pt-8 text-xs leading-relaxed text-muted">
      <p className="mb-2">
        <strong className="font-semibold text-ink/70">Data source:</strong> {methodology} Data last
        verified {checkedDate}.
      </p>
      <p className="mb-2">
        <strong className="font-semibold text-ink/70">Disclaimer:</strong> Prices and availability are
        typical and variable by pub. We are an independent guide and not affiliated with J D Wetherspoon
        plc.
      </p>
      {correctionHref && (
        <p>
          Spot an error?{' '}
          <Link
            href={correctionHref}
            className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary-hover"
          >
            Submit a correction
          </Link>
          .
        </p>
      )}
    </div>
  );
}
