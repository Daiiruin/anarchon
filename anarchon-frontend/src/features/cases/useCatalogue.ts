import { useQuery } from '@tanstack/react-query';
import { fetchCatalogue } from './cases.api';

export function useCatalogue() {
  return useQuery({
    queryKey: ['cases', 'catalogue'],
    queryFn: fetchCatalogue,
  });
}
