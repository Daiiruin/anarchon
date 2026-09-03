// Miroir exact de GameElementDto / CaseContentDto / DiscoveredElementsDto /
// SubmitAccusationDto / AccusationResultDto
// (anarchon-backend/src/features/{cases,accusations}/dto/*.ts). Toute
// divergence de champ entre ce fichier et le backend est un bug.

export type ElementType =
  | 'location'
  | 'item'
  | 'character'
  | 'document'
  | 'testimony'
  | 'question';

export interface GameElement {
  id: string;
  type: ElementType;
  title: string;
  description?: string;
  imageUrl?: string;
  requiredDiscoveries?: string[];
  data?: Record<string, unknown>;
}

export interface CaseElements {
  locations: GameElement[];
  items: GameElement[];
  characters: GameElement[];
  documents: GameElement[];
  questions: GameElement[];
}

export interface CaseContent {
  case: { id: string; slug: string; title: string };
  content: CaseElements;
  discoveredElementIds: string[];
}

export interface DiscoveredElements {
  discoveredElementIds: string[];
}

export interface SubmitAccusation {
  suspectId: string;
  motiveId: string;
  weaponId: string;
}

export interface AccusationResult {
  isCorrect: boolean;
  submittedAt: string;
}
