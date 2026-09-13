import type { GameElement } from './game.schemas';

interface CharacterRowProps {
  characters: GameElement[];
  onSelect: (characterId: string) => void;
}

export function CharacterRow({ characters, onSelect }: CharacterRowProps) {
  if (characters.length === 0) return null;

  return (
    <div className="flex flex-1 items-end justify-center gap-8 pb-4">
      {characters.map((character) => (
        <button
          key={character.id}
          type="button"
          onClick={() => onSelect(character.id)}
          className="flex flex-col items-center gap-1"
        >
          <span
            style={{ backgroundImage: `url(${character.imageUrl})` }}
            className="h-48 w-32 border border-white/30 bg-cover bg-top"
            aria-hidden="true"
          />
          <span className="text-sm text-white">{character.title}</span>
        </button>
      ))}
    </div>
  );
}
