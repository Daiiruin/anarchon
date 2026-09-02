// Miroir exact de CaseSummaryDto / CaseDetailDto
// (anarchon-backend/src/features/cases/dto/*.ts). Toute divergence de champ
// entre ce fichier et le backend est un bug.

export type CaseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface CaseSummary {
  id: string;
  slug: string;
  title: string;
  eraLabel: string;
  synopsisExcerpt: string;
  difficulty: number;
  themeKey: string;
  coverUrl: string | null;
  status: CaseStatus;
}

export interface CaseDetail extends CaseSummary {
  synopsis: string;
  detailBackgroundUrl: string | null;
}
