import { useParams } from 'react-router-dom';
import { useCaseContent } from './useCaseContent';
import { useDiscoverElement } from './useDiscoverElement';
import { useResetProgress } from './useResetProgress';
import { ElementList } from './ElementList';
import { CharacterList } from './CharacterList';
import { AccusationForm } from './AccusationForm';
import { Button } from '@/shared/ui/button';

export function CaseGamePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useCaseContent(slug ?? '');
  const { mutate: discover, isPending } = useDiscoverElement(slug ?? '');
  const { mutate: reset, isPending: isResetting } = useResetProgress(
    slug ?? '',
  );

  if (isLoading || isError || !data) {
    return <p className="p-6 text-muted-foreground">Chargement…</p>;
  }

  const discoveredIds = new Set(data.discoveredElementIds);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-2xl font-semibold tracking-wide uppercase">
          {data.case.title}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Version fonctionnelle — sans mise en scène ni thème visuel (voir
          docs/05-frontend-jeu-fonctionnel.md).
        </p>
        {import.meta.env.DEV && (
          <Button
            size="sm"
            variant="destructive"
            className="mt-2"
            disabled={isResetting}
            onClick={() => reset()}
          >
            Réinitialiser la progression (dev)
          </Button>
        )}
      </div>

      <ElementList
        title="Lieux"
        elements={data.content.locations}
        discoveredIds={discoveredIds}
        onDiscover={discover}
        isDiscovering={isPending}
      />
      <CharacterList
        characters={data.content.characters}
        questions={data.content.questions}
        discoveredIds={discoveredIds}
        onDiscover={discover}
        isDiscovering={isPending}
      />
      <ElementList
        title="Indices"
        elements={data.content.items}
        discoveredIds={discoveredIds}
        onDiscover={discover}
        isDiscovering={isPending}
      />
      <ElementList
        title="Documents"
        elements={data.content.documents}
        discoveredIds={discoveredIds}
        onDiscover={discover}
        isDiscovering={isPending}
      />

      <AccusationForm slug={slug ?? ''} />
    </div>
  );
}
