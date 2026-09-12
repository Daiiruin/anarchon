import { Link } from 'react-router-dom';
import type { CaseSummary } from '../lib/interfaces/cases';
import { STATUS_LABELS, STATUS_BADGE_CLASSES } from '../lib/consts/cases';

function DifficultyDots({ difficulty }: { difficulty: number }) {
  return (
    <span
      aria-label={`Difficulté ${difficulty} sur 5`}
      className="text-xs tracking-widest"
    >
      <span className="text-primary">{'●'.repeat(difficulty)}</span>
      <span className="text-muted-foreground">
        {'○'.repeat(5 - difficulty)}
      </span>
    </span>
  );
}

export function CaseCard({ caseSummary }: { caseSummary: CaseSummary }) {
  return (
    <Link
      to={`/cases/${caseSummary.slug}`}
      className="flex flex-col overflow-hidden rounded-none border border-border bg-card transition-colors hover:border-primary hover:shadow-[0_0_16px_rgba(0,229,255,0.35)]"
    >
      <div className="aspect-video w-full bg-muted">
        <img
          src={`/cases/${caseSummary.slug}/cover.webp`}
          alt={caseSummary.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <h2 className="font-mono text-sm font-semibold">{caseSummary.title}</h2>
        <p className="font-mono text-xs text-muted-foreground">
          {caseSummary.eraLabel}
        </p>
        <p className="line-clamp-2 text-xs text-foreground">
          {caseSummary.synopsisExcerpt}
        </p>
        <div className="flex items-center justify-between pt-1">
          <DifficultyDots difficulty={caseSummary.difficulty} />
          <span
            className={`rounded-sm px-1.5 py-0.5 font-mono text-[0.65rem] tracking-wide uppercase ${STATUS_BADGE_CLASSES[caseSummary.status]}`}
          >
            {STATUS_LABELS[caseSummary.status]}
          </span>
        </div>
      </div>
    </Link>
  );
}
