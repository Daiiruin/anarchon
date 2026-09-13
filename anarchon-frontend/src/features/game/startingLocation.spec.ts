import { describe, it, expect } from 'vitest';
import { getStartingLocationId } from './startingLocation';
import type { GameElement } from './game.schemas';

function buildLocation(overrides: Partial<GameElement> = {}): GameElement {
  return {
    id: 'loc-1',
    type: 'location',
    title: 'Lieu 1',
    ...overrides,
  };
}

describe('getStartingLocationId', () => {
  it('returns the first location with no required discoveries', () => {
    const locations = [
      buildLocation({
        id: 'room-417',
        requiredDiscoveries: ['antoine-q-what-happened'],
      }),
      buildLocation({ id: 'hall', requiredDiscoveries: [] }),
      buildLocation({
        id: 'conciergerie',
        requiredDiscoveries: ['marcel-q-badge'],
      }),
    ];
    expect(getStartingLocationId(locations)).toBe('hall');
  });

  it('treats a missing requiredDiscoveries field as an entry point', () => {
    const locations = [
      buildLocation({ id: 'room-417', requiredDiscoveries: ['x'] }),
      buildLocation({ id: 'hall' }),
    ];
    expect(getStartingLocationId(locations)).toBe('hall');
  });

  it('falls back to the first location when none has an empty requiredDiscoveries', () => {
    const locations = [
      buildLocation({ id: 'room-417', requiredDiscoveries: ['a'] }),
      buildLocation({ id: 'conciergerie', requiredDiscoveries: ['b'] }),
    ];
    expect(getStartingLocationId(locations)).toBe('room-417');
  });

  it('returns null when there are no locations', () => {
    expect(getStartingLocationId([])).toBeNull();
  });
});
