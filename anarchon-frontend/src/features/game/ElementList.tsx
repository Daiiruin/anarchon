import type { GameElement } from './game.schemas';
import { getElementState } from './elementState';
import { Button } from '@/shared/ui/button';

interface ElementListProps {
  title: string;
  elements: GameElement[];
  discoveredIds: Set<string>;
  onDiscover: (elementId: string) => void;
  isDiscovering: boolean;
}

export function ElementList({
  title,
  elements,
  discoveredIds,
  onDiscover,
  isDiscovering,
}: ElementListProps) {
  const visible = elements.filter(
    (element) => getElementState(element, discoveredIds) !== 'hidden',
  );

  if (visible.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2 text-sm tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {visible.map((element) => {
          const state = getElementState(element, discoveredIds);
          return (
            <li key={element.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{element.title}</p>
              {state === 'discovered' && element.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {element.description}
                </p>
              )}
              {state === 'available' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2"
                  disabled={isDiscovering}
                  onClick={() => onDiscover(element.id)}
                >
                  Découvrir
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
