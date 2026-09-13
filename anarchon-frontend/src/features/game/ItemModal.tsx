import type { GameElement } from './game.schemas';

interface ItemModalProps {
  element: GameElement;
  onClose: () => void;
}

export function ItemModal({ element, onClose }: ItemModalProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-w-lg flex-col gap-3 border border-white/30 bg-black p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-white">{element.title}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-xl text-white"
          >
            ×
          </button>
        </div>
        {element.imageUrl && (
          <img
            src={element.imageUrl}
            alt={element.title}
            className="max-h-80 w-full object-contain"
          />
        )}
        {element.description && (
          <p className="text-sm text-white/80">{element.description}</p>
        )}
      </div>
    </div>
  );
}
