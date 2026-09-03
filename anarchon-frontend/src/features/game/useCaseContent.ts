import { useQuery } from '@tanstack/react-query';
import { fetchCaseContent } from './game.api';

export function useCaseContent(slug: string) {
  return useQuery({
    queryKey: ['cases', 'content', slug],
    queryFn: () => fetchCaseContent(slug),
  });
}
