import { useMutation, useQueryClient } from '@tanstack/react-query';
import { resetProgress } from './game.api';

export function useResetProgress(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resetProgress(slug),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['cases', 'content', slug],
      });
    },
  });
}
