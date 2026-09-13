import type { GameElement } from './game.schemas';
import { IndicesStrip } from './IndicesStrip';
import { DialoguePanel } from './DialoguePanel';

interface BottomBarProps {
  activeCharacter: GameElement | null;
  items: GameElement[];
  documents: GameElement[];
  questions: GameElement[];
  discoveredIds: Set<string>;
  onSelectItem: (elementId: string) => void;
  onDiscoverQuestion: (elementId: string) => void;
  isDiscovering: boolean;
  onBackFromConversation: () => void;
}

export function BottomBar({
  activeCharacter,
  items,
  documents,
  questions,
  discoveredIds,
  onSelectItem,
  onDiscoverQuestion,
  isDiscovering,
  onBackFromConversation,
}: BottomBarProps) {
  return (
    <div className="h-40 border-t border-white/20 bg-black/80">
      {activeCharacter ? (
        <DialoguePanel
          character={activeCharacter}
          questions={questions}
          discoveredIds={discoveredIds}
          onDiscoverQuestion={onDiscoverQuestion}
          isDiscovering={isDiscovering}
          onBack={onBackFromConversation}
        />
      ) : (
        <IndicesStrip
          items={items}
          documents={documents}
          onSelect={onSelectItem}
        />
      )}
    </div>
  );
}
