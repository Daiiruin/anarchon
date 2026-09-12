import { useQuery } from '@tanstack/react-query';
import { http } from '@/shared/api/http';
import type { CaseDetail } from '../lib/interfaces/cases';

export function useCaseDetail(slug: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cases', 'detail', slug],
    queryFn: () => http.get<CaseDetail>(`/cases/${slug}`),
    retry: false,
  });

  return { data, loading: isLoading, error };
}
