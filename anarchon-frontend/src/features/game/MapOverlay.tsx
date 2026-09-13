import type { GameElement } from './game.schemas';
import { getElementState } from './elementState';

interface MapOverlayProps {
  locations: GameElement[];
  discoveredIds: Set<string>;
  onSelect: (locationId: string) => void;
  onClose: () => void;
}

export function MapOverlay({
  locations,
  discoveredIds,
  onSelect,
  onClose,
}: MapOverlayProps) {
  return (
    <div className="fixed inset-0 z-30 flex flex-col gap-6 bg-black/90 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Carte</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white"
        >
          Fermer
        </button>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3">
        {locations.map((location) => {
          const state = getElementState(location, discoveredIds);

          if (state === 'hidden') {
            return (
              <div
                key={location.id}
                className="flex aspect-square flex-col items-center justify-center gap-2 border border-white/20 bg-white/5 text-white/40"
              >
                <span aria-hidden="true" className="text-3xl">
                  🔒
                </span>
                <span className="text-sm tracking-wide uppercase">???</span>
              </div>
            );
          }

          return (
            <button
              key={location.id}
              type="button"
              onClick={() => onSelect(location.id)}
              style={{ backgroundImage: `url(${location.imageUrl})` }}
              className="relative flex aspect-square items-center justify-center bg-cover bg-center"
            >
              <span className="absolute inset-0 bg-black/40" />
              <span className="relative text-lg font-semibold text-white uppercase">
                {location.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
