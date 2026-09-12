import { CasesStatusEnum } from '../enums/cases.enum';

export interface CaseSummary {
  id: string;
  slug: string;
  title: string;
  eraLabel: string;
  synopsisExcerpt: string;
  difficulty: number;
  themeKey: string;
  status: CasesStatusEnum;
}

export interface CaseDetail extends CaseSummary {
  synopsis: string;
}
