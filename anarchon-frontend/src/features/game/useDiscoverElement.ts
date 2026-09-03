import { useMutation, useQueryClient } from '@tanstack/react-query';
import { discoverElement } from './game.api';

export function useDiscoverElement(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (elementId: string) => discoverElement(slug, elementId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['cases', 'content', slug],
      });
    },
  });
}
