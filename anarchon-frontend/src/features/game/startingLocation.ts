import type { GameElement } from './game.schemas';

export function getStartingLocationId(
  locations: GameElement[],
): string | null {
  const entryPoint = locations.find(
    (location) => (location.requiredDiscoveries ?? []).length === 0,
  );
  return (entryPoint ?? locations[0])?.id ?? null;
}
