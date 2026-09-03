import type { GameElement } from './game.schemas';
import { getElementState } from './elementState';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

interface CharacterListProps {
  characters: GameElement[];
  questions: GameElement[];
  discoveredIds: Set<string>;
  onDiscover: (elementId: string) => void;
  isDiscovering: boolean;
}

export function CharacterList({
  characters,
  questions,
  discoveredIds,
  onDiscover,
  isDiscovering,
}: CharacterListProps) {
  const visibleCharacters = characters.filter(
    (character) => getElementState(character, discoveredIds) !== 'hidden',
  );

  if (visibleCharacters.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2 text-sm tracking-wide text-muted-foreground uppercase">
        Personnages
      </h2>
      <ul className="flex flex-col gap-3">
        {visibleCharacters.map((character) => {
          const state = getElementState(character, discoveredIds);

          if (state === 'available') {
            return (
              <li
                key={character.id}
                className="rounded-lg border border-border p-3"
              >
                <p className="font-medium">{character.title}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  disabled={isDiscovering}
                  onClick={() => onDiscover(character.id)}
                >
                  Parler à {character.title}
                </Button>
              </li>
            );
          }

          const characterQuestions = questions.filter(
            (question) =>
              question.data?.characterId === character.id &&
              getElementState(question, discoveredIds) !== 'hidden',
          );

          return (
            <li
              key={character.id}
              className="rounded-lg border border-border p-3"
            >
              <p className="font-medium">{character.title}</p>
              {character.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {character.description}
                </p>
              )}

              {characterQuestions.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {characterQuestions.map((question) => {
                    const questionState = getElementState(
                      question,
                      discoveredIds,
                    );
                    return (
                      <li key={question.id}>
                        <button
                          type="button"
                          disabled={isDiscovering}
                          onClick={() => onDiscover(question.id)}
                          className={cn(
                            'w-full rounded-md border border-border px-3 py-1.5 text-left text-sm transition-opacity hover:opacity-100',
                            questionState === 'discovered' && 'opacity-50',
                          )}
                        >
                          {question.title}
                        </button>
                        {questionState === 'discovered' &&
                          question.description && (
                            <p className="mt-1 pl-3 text-sm text-muted-foreground">
                              {question.description}
                            </p>
                          )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
