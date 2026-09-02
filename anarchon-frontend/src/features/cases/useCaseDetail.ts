import { useQuery } from '@tanstack/react-query';
import { fetchCaseDetail } from './cases.api';

export function useCaseDetail(slug: string) {
  return useQuery({
    queryKey: ['cases', 'detail', slug],
    queryFn: () => fetchCaseDetail(slug),
    // Un 404 (DRAFT ou slug inexistant, indistinguables côté backend) n'est
    // pas transitoire — inutile de le retenter.
    retry: false,
  });
}
