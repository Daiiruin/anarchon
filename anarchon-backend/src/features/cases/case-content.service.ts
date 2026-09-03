import { Injectable, NotFoundException } from '@nestjs/common';
import { GameElement } from './interfaces/game-element.interface';

import hotelBeaumontManifest from '../../content/cases/le-meurtre-de-l-hotel-beaumont/manifest.json';
import hotelBeaumontLocations from '../../content/cases/le-meurtre-de-l-hotel-beaumont/locations.json';
import hotelBeaumontItems from '../../content/cases/le-meurtre-de-l-hotel-beaumont/items.json';
import hotelBeaumontCharacters from '../../content/cases/le-meurtre-de-l-hotel-beaumont/characters.json';
import hotelBeaumontDocuments from '../../content/cases/le-meurtre-de-l-hotel-beaumont/documents.json';
import hotelBeaumontSolution from '../../content/cases/le-meurtre-de-l-hotel-beaumont/solution.json';

export interface CaseElements {
  locations: GameElement[];
  items: GameElement[];
  characters: GameElement[];
  documents: GameElement[];
}

export interface CaseSolution {
  suspectId: string;
  motiveId: string;
  weaponId: string;
}

const CASE_CONTENT: Record<string, CaseElements> = {
  [hotelBeaumontManifest.caseId]: {
    locations: hotelBeaumontLocations as GameElement[],
    items: hotelBeaumontItems as GameElement[],
    characters: hotelBeaumontCharacters,
    documents: hotelBeaumontDocuments,
  },
};

const CASE_SOLUTIONS: Record<string, CaseSolution> = {
  [hotelBeaumontManifest.caseId]: hotelBeaumontSolution,
};

@Injectable()
export class CaseContentService {
  getContent(caseId: string): CaseElements {
    const content = CASE_CONTENT[caseId];
    if (!content) throw new NotFoundException();
    return content;
  }

  findElement(caseId: string, elementId: string): GameElement | undefined {
    const content = this.getContent(caseId);
    return [
      ...content.locations,
      ...content.items,
      ...content.characters,
      ...content.documents,
    ].find((element) => element.id === elementId);
  }

  getSolution(caseId: string): CaseSolution {
    const solution = CASE_SOLUTIONS[caseId];
    if (!solution) throw new NotFoundException();
    return solution;
  }
}
