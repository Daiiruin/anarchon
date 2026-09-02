import { DataSource } from 'typeorm';
import { MediaAsset } from '../../features/media/entities/media-asset.entity';
import { MediaAssetType } from '../../features/media/enums/media-asset-type.enum';
import { Case } from '../../features/cases/entities/case.entity';
import { CasePublicationStatus } from '../../features/cases/enums/case-publication-status.enum';

interface SeedMediaAsset {
  key: string;
  storagePath: string;
  mimeType: string;
}

// Un seul visuel pour l'Hôtel Beaumont : la carte catalogue et le fond de
// la page détail utilisent tous les deux `cover` (coverAssetId ===
// detailBackgroundId). Rien n'empêche une future affaire d'avoir un asset
// de détail distinct — c'est un choix de contenu pour celle-ci, pas une
// contrainte du schéma.
const SEED_ASSETS = {
  cover: {
    key: 'hotel-beaumont.cover',
    storagePath: 'cases/hotel-beaumont/cover/cover.webp',
    mimeType: 'image/webp',
  },
  map: {
    key: 'hotel-beaumont.map',
    storagePath: 'cases/hotel-beaumont/map/map.webp',
    mimeType: 'image/webp',
  },
} as const satisfies Record<string, SeedMediaAsset>;

async function findOrCreateMediaAsset(
  dataSource: DataSource,
  seed: SeedMediaAsset,
): Promise<MediaAsset> {
  const repo = dataSource.getRepository(MediaAsset);
  const existing = await repo.findOne({ where: { key: seed.key } });
  if (existing) {
    existing.storagePath = seed.storagePath;
    existing.mimeType = seed.mimeType;
    return repo.save(existing);
  }

  return repo.save(
    repo.create({
      key: seed.key,
      type: MediaAssetType.IMAGE,
      storagePath: seed.storagePath,
      mimeType: seed.mimeType,
      caseId: null,
      width: null,
      height: null,
      durationMs: null,
      isPrivate: false,
    }),
  );
}

export async function seedHotelBeaumont(dataSource: DataSource): Promise<void> {
  const cover = await findOrCreateMediaAsset(dataSource, SEED_ASSETS.cover);
  const map = await findOrCreateMediaAsset(dataSource, SEED_ASSETS.map);

  const casesRepo = dataSource.getRepository(Case);
  await casesRepo.upsert(
    {
      slug: 'le-meurtre-de-l-hotel-beaumont',
      title: "Le meurtre de l'Hôtel Beaumont",
      eraLabel: 'Paris — 1962',
      synopsis:
        "Charles Beaumont, propriétaire de l'hôtel familial, est retrouvé mort dans la chambre 417 par une nuit de pluie. Aucun signe d'effraction, mais le personnel et la famille semblent tous cacher quelque chose. Au joueur d'interroger, d'examiner les indices et de confronter les témoignages pour démasquer le coupable avant que l'affaire ne soit classée.",
      difficulty: 3,
      themeKey: 'hotel-1960',
      publicationStatus: CasePublicationStatus.PUBLISHED,
      coverAssetId: cover.id,
      detailBackgroundId: cover.id,
      mapAssetId: map.id,
      sortOrder: 0,
    },
    ['slug'],
  );
}
