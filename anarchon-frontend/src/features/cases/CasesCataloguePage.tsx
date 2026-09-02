import { useCatalogue } from './useCatalogue';
import { CaseCard } from './CaseCard';

export function CasesCataloguePage() {
  const { data, isLoading, isError } = useCatalogue();

  if (isLoading) {
    return (
      <p className="p-6 text-muted-foreground">Chargement du catalogue…</p>
    );
  }

  if (isError) {
    return (
      <p className="p-6 text-destructive">
        Impossible de charger le catalogue.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((caseSummary) => (
        <CaseCard key={caseSummary.id} caseSummary={caseSummary} />
      ))}
    </div>
  );
}
