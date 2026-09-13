import type { GameElement } from './game.schemas';
import { CharacterRow } from './CharacterRow';
import { BottomBar } from './BottomBar';

interface GameSceneProps {
  location: GameElement;
  characters: GameElement[];
  items: GameElement[];
  documents: GameElement[];
  questions: GameElement[];
  discoveredIds: Set<string>;
  activeCharacterId: string | null;
  onSelectCharacter: (characterId: string) => void;
  onSelectItem: (elementId: string) => void;
  onDiscoverQuestion: (elementId: string) => void;
  isDiscovering: boolean;
  onBackFromConversation: () => void;
  onOpenMap: () => void;
  onOpenAccusation: () => void;
  isResetVisible: boolean;
  onResetProgress: () => void;
  isResetting: boolean;
}

export function GameScene({
  location,
  characters,
  items,
  documents,
  questions,
  discoveredIds,
  activeCharacterId,
  onSelectCharacter,
  onSelectItem,
  onDiscoverQuestion,
  isDiscovering,
  onBackFromConversation,
  onOpenMap,
  onOpenAccusation,
  isResetVisible,
  onResetProgress,
  isResetting,
}: GameSceneProps) {
  const activeCharacter =
    characters.find((character) => character.id === activeCharacterId) ??
    null;
  const isInConversation = activeCharacter !== null;

  return (
    <div
      style={{ backgroundImage: `url(${location.imageUrl})` }}
      className="relative flex h-screen flex-col bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/30" />

      {!isInConversation && (
        <div className="relative z-10 flex justify-end gap-3 p-4">
          {isResetVisible && (
            <button
              type="button"
              disabled={isResetting}
              onClick={onResetProgress}
              className="rounded-md border border-red-400/60 px-3 py-1.5 text-sm text-red-300"
            >
              Réinitialiser la progression (dev)
            </button>
          )}
          <button
            type="button"
            onClick={onOpenAccusation}
            className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white"
          >
            Accuser
          </button>
          <button
            type="button"
            onClick={onOpenMap}
            className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white"
          >
            Carte
          </button>
        </div>
      )}

      {isInConversation && activeCharacter ? (
        <div className="relative z-10 flex flex-1 items-end p-6">
          <span
            style={{ backgroundImage: `url(${activeCharacter.imageUrl})` }}
            className="h-64 w-44 border border-white/30 bg-cover bg-top"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="relative z-10 flex flex-1">
          <CharacterRow characters={characters} onSelect={onSelectCharacter} />
        </div>
      )}

      <div className="relative z-10">
        <BottomBar
          activeCharacter={activeCharacter}
          items={items}
          documents={documents}
          questions={questions}
          discoveredIds={discoveredIds}
          onSelectItem={onSelectItem}
          onDiscoverQuestion={onDiscoverQuestion}
          isDiscovering={isDiscovering}
          onBackFromConversation={onBackFromConversation}
        />
      </div>
    </div>
  );
}
