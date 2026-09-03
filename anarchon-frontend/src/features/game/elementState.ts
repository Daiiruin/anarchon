import type { GameElement } from './game.schemas';

export type ElementState = 'hidden' | 'available' | 'discovered';

export function getElementState(
  element: GameElement,
  discoveredIds: Set<string>,
): ElementState {
  if (discoveredIds.has(element.id)) {
    return 'discovered';
  }

  const requirements = element.requiredDiscoveries ?? [];
  const isAvailable = requirements.every((id) => discoveredIds.has(id));

  return isAvailable ? 'available' : 'hidden';
}
