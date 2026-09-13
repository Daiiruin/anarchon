import type { GameElement } from './game.schemas';
import { getElementState } from './elementState';

interface DialoguePanelProps {
  character: GameElement;
  questions: GameElement[];
  discoveredIds: Set<string>;
  onDiscoverQuestion: (elementId: string) => void;
  isDiscovering: boolean;
  onBack: () => void;
}

export function DialoguePanel({
  character,
  questions,
  discoveredIds,
  onDiscoverQuestion,
  isDiscovering,
  onBack,
}: DialoguePanelProps) {
  const characterQuestions = questions.filter(
    (question) =>
      question.data?.characterId === character.id &&
      getElementState(question, discoveredIds) !== 'hidden',
  );

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">{character.title}</p>
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-white/30 px-3 py-1.5 text-sm text-white"
        >
          Retour
        </button>
      </div>

      <ul className="flex flex-col gap-2 overflow-y-auto">
        {characterQuestions.map((question) => {
          const questionState = getElementState(question, discoveredIds);
          return (
            <li key={question.id}>
              <button
                type="button"
                disabled={isDiscovering}
                onClick={() => onDiscoverQuestion(question.id)}
                className={
                  questionState === 'discovered'
                    ? 'w-full rounded-md border border-white/20 px-3 py-1.5 text-left text-sm text-white/50'
                    : 'w-full rounded-md border border-white/20 px-3 py-1.5 text-left text-sm text-white'
                }
              >
                {question.title}
              </button>
              {questionState === 'discovered' && question.description && (
                <p className="mt-1 pl-3 text-sm text-white/70">
                  {question.description}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
