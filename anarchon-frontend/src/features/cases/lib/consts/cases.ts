import { CasesStatusEnum } from "../enums/cases.enum";

export const ACTION_LABELS: Record<CasesStatusEnum, string> = {
  [CasesStatusEnum.NOT_STARTED]: "COMMENCER L'AFFAIRE",
  [CasesStatusEnum.IN_PROGRESS]: "REPRENDRE L'AFFAIRE",
  [CasesStatusEnum.COMPLETED]: 'CONSULTER L’AFFAIRE',
};

export const STATUS_LABELS: Record<CasesStatusEnum, string> = {
  [CasesStatusEnum.NOT_STARTED]: 'Jamais commencé',
  [CasesStatusEnum.IN_PROGRESS]: 'En cours',
  [CasesStatusEnum.COMPLETED]: 'Affaire résolue',
};

export const STATUS_BADGE_CLASSES: Record<CasesStatusEnum, string> = {
  [CasesStatusEnum.NOT_STARTED]:
    'bg-status-not-started-subtle text-status-not-started',
  [CasesStatusEnum.IN_PROGRESS]:
    'bg-status-in-progress-subtle text-status-in-progress',
  [CasesStatusEnum.COMPLETED]:
    'bg-status-completed-subtle text-status-completed',
};
