import { AccusationForm } from './AccusationForm';

interface AccusationOverlayProps {
  slug: string;
  onClose: () => void;
}

export function AccusationOverlay({ slug, onClose }: AccusationOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md border border-white/30 bg-black p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 text-xl text-white"
        >
          ×
        </button>
        <AccusationForm slug={slug} />
      </div>
    </div>
  );
}
