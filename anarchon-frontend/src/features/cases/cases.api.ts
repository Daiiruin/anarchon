import { http } from '@/shared/api/http';
import type { CaseDetail, CaseSummary } from './cases.schemas';

export function fetchCatalogue(): Promise<CaseSummary[]> {
  return http.get<CaseSummary[]>('/cases');
}

export function fetchCaseDetail(slug: string): Promise<CaseDetail> {
  return http.get<CaseDetail>(`/cases/${slug}`);
}
