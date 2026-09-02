import { Link } from 'react-router-dom';
import type { CaseStatus, CaseSummary } from './cases.schemas';

// README « Catalogue des affaires » : jamais de pourcentage ni de compteur,
// seulement ces trois statuts dérivés côté backend.
const STATUS_LABELS: Record<CaseStatus, string> = {
  NOT_STARTED: 'Jamais commencé',
  IN_PROGRESS: 'En cours',
  COMPLETED: 'Affaire résolue',
};

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
      className="flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary"
    >
      <div className="aspect-video w-full bg-muted">
        {caseSummary.coverUrl ? (
          <img
            src={caseSummary.coverUrl}
            alt={caseSummary.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            Aucune image
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <h2 className="text-sm font-semibold">{caseSummary.title}</h2>
        <p className="text-xs text-muted-foreground">{caseSummary.eraLabel}</p>
        <p className="line-clamp-2 text-xs text-foreground">
          {caseSummary.synopsisExcerpt}
        </p>
        <div className="flex items-center justify-between pt-1">
          <DifficultyDots difficulty={caseSummary.difficulty} />
          <span className="text-[0.65rem] tracking-wide text-muted-foreground uppercase">
            {STATUS_LABELS[caseSummary.status]}
          </span>
        </div>
      </div>
    </Link>
  );
}
