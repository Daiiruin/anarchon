import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import type { CaseSummary } from '../lib/interfaces/cases';

export function useCatalogue() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cases', 'catalogue'],
    queryFn: () => http.get<CaseSummary[]>('/cases'),
  });

  return { data, loading: isLoading, error };
}
