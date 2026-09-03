import { http } from '@/shared/api/http';
import type {
  AccusationResult,
  CaseContent,
  DiscoveredElements,
  SubmitAccusation,
} from './game.schemas';

export function fetchCaseContent(slug: string): Promise<CaseContent> {
  return http.get<CaseContent>(`/cases/${slug}/content`);
}

export function discoverElement(
  slug: string,
  elementId: string,
): Promise<DiscoveredElements> {
  return http.post<DiscoveredElements>(
    `/cases/${slug}/discoveries/${elementId}`,
  );
}

// Outil de dev : réinitialise la progression pour rejouer l'affaire (refusé
// par le backend en production).
export function resetProgress(slug: string): Promise<void> {
  return http.delete<void>(`/cases/${slug}/progress`);
}

export function submitAccusation(
  slug: string,
  dto: SubmitAccusation,
): Promise<AccusationResult> {
  return http.post<AccusationResult>(`/cases/${slug}/accusations`, dto);
}
