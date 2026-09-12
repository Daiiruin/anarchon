import { useCatalogue } from '../hooks/useCatalogue';
import { CaseCard } from '../components/CaseCard';
import { Loading } from '@/shared/ui/loading';

export function CasesCataloguePage() {
  const { data, loading, error } = useCatalogue();

  if (loading) return <Loading />;


  if (error) {
    return (
      <p className="p-6 text-destructive">
        Impossible de charger le catalogue.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {data?.map((caseSummary) => (
        <CaseCard key={caseSummary.id} caseSummary={caseSummary} />
      ))}
    </div>
  );
}
