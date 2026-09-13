import type { GameElement } from './game.schemas';

interface IndicesStripProps {
  items: GameElement[];
  documents: GameElement[];
  onSelect: (elementId: string) => void;
}

export function IndicesStrip({
  items,
  documents,
  onSelect,
}: IndicesStripProps) {
  const elements = [...items, ...documents];

  if (elements.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/50">
        Rien à examiner ici pour l'instant.
      </div>
    );
  }

  return (
    <div className="flex h-full items-center gap-3 overflow-x-auto p-4">
      {elements.map((element) => (
        <button
          key={element.id}
          type="button"
          onClick={() => onSelect(element.id)}
          className="flex shrink-0 flex-col items-center gap-1"
        >
          <span
            style={{ backgroundImage: `url(${element.imageUrl})` }}
            className="size-16 border border-white/30 bg-cover bg-center"
            aria-hidden="true"
          />
          <span className="max-w-16 truncate text-xs text-white">
            {element.title}
          </span>
        </button>
      ))}
    </div>
  );
}
