import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCaseContent } from './useCaseContent';
import { useDiscoverElement } from './useDiscoverElement';
import { useResetProgress } from './useResetProgress';
import { getStartingLocationId } from './startingLocation';
import { getElementState } from './elementState';
import { GameScene } from './GameScene';
import { MapOverlay } from './MapOverlay';
import { ItemModal } from './ItemModal';
import { AccusationOverlay } from './AccusationOverlay';
import type { GameElement } from './game.schemas';

function belongsToLocation(element: GameElement, locationId: string) {
  return element.data?.locationId === locationId;
}

export function CaseGamePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useCaseContent(slug ?? '');
  const { mutate: discover, isPending } = useDiscoverElement(slug ?? '');
  const { mutate: reset, isPending: isResetting } = useResetProgress(
    slug ?? '',
  );

  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null,
  );
  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(
    null,
  );
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);

  // `data` arrive de façon asynchrone : on ne peut pas calculer la zone de
  // départ dans le useState initial (les lieux ne sont pas encore connus au
  // premier rendu). `currentLocationId` reste `null` tant que le joueur n'a
  // pas explicitement voyagé via la carte ; on retombe alors sur la zone de
  // départ calculée à partir du contenu chargé. Ce calcul doit rester
  // accessible avant les `return` anticipés ci-dessous pour respecter les
  // règles des hooks (le `useEffect` de découverte ne peut pas être
  // conditionnel).
  const locationId = data
    ? (currentLocationId ?? getStartingLocationId(data.content.locations))
    : null;
  const isLocationDiscovered =
    !!locationId && !!data?.discoveredElementIds.includes(locationId);

  // Arriver sur un lieu (au chargement initial ou via un voyage sur la
  // carte) doit le faire découvrir côté serveur : sans ça, `hall` (le point
  // de départ) ne serait jamais dans `discoveredIds`, et aucun personnage
  // de la zone de départ ne deviendrait jamais visible.
  useEffect(() => {
    if (locationId && !isLocationDiscovered) {
      discover(locationId);
    }
  }, [locationId, isLocationDiscovered, discover]);

  if (isLoading || isError || !data) {
    return (
      <p className="flex h-screen items-center justify-center bg-black text-white">
        Chargement…
      </p>
    );
  }

  const discoveredIds = new Set(data.discoveredElementIds);
  const location = data.content.locations.find((loc) => loc.id === locationId);

  if (!location) {
    return (
      <p className="flex h-screen items-center justify-center bg-black text-white">
        Lieu introuvable.
      </p>
    );
  }

  const zoneCharacters = data.content.characters.filter(
    (character) =>
      belongsToLocation(character, location.id) &&
      getElementState(character, discoveredIds) !== 'hidden',
  );
  const zoneItems = data.content.items.filter(
    (item) =>
      belongsToLocation(item, location.id) &&
      getElementState(item, discoveredIds) !== 'hidden',
  );
  const zoneDocuments = data.content.documents.filter(
    (document) =>
      belongsToLocation(document, location.id) &&
      getElementState(document, discoveredIds) !== 'hidden',
  );

  const activeItem = [...zoneItems, ...zoneDocuments].find(
    (element) => element.id === activeItemId,
  );

  function handleSelectCharacter(characterId: string) {
    discover(characterId);
    setActiveCharacterId(characterId);
  }

  function handleSelectItem(elementId: string) {
    discover(elementId);
    setActiveItemId(elementId);
  }

  function handleSelectLocation(nextLocationId: string) {
    setCurrentLocationId(nextLocationId);
    setIsMapOpen(false);
    setActiveCharacterId(null);
    setActiveItemId(null);
  }

  return (
    <>
      <GameScene
        location={location}
        characters={zoneCharacters}
        items={zoneItems}
        documents={zoneDocuments}
        questions={data.content.questions}
        discoveredIds={discoveredIds}
        activeCharacterId={activeCharacterId}
        onSelectCharacter={handleSelectCharacter}
        onSelectItem={handleSelectItem}
        onDiscoverQuestion={discover}
        isDiscovering={isPending}
        onBackFromConversation={() => setActiveCharacterId(null)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenAccusation={() => setIsAccusationOpen(true)}
        isResetVisible={import.meta.env.DEV}
        onResetProgress={() => reset()}
        isResetting={isResetting}
      />

      {isMapOpen && (
        <MapOverlay
          locations={data.content.locations}
          discoveredIds={discoveredIds}
          onSelect={handleSelectLocation}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {activeItem && (
        <ItemModal
          element={activeItem}
          onClose={() => setActiveItemId(null)}
        />
      )}

      {isAccusationOpen && (
        <AccusationOverlay
          slug={slug ?? ''}
          onClose={() => setIsAccusationOpen(false)}
        />
      )}
    </>
  );
}
