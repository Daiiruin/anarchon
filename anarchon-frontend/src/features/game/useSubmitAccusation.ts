import { useMutation } from '@tanstack/react-query';
import { submitAccusation } from './game.api';
import type { SubmitAccusation } from './game.schemas';

export function useSubmitAccusation(slug: string) {
  return useMutation({
    mutationFn: (dto: SubmitAccusation) => submitAccusation(slug, dto),
  });
}
