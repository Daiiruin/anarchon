import { DataSource } from 'typeorm';
import { Case } from '../../features/cases/entities/case.entity';
import { CasePublicationStatus } from '../../features/cases/enums/case-publication-status.enum';

export async function seedHotelBeaumont(dataSource: DataSource): Promise<void> {
  const casesRepo = dataSource.getRepository(Case);
  await casesRepo.upsert(
    {
      slug: 'hotel-beaumont',
      title: "Le meurtre de l'Hôtel Beaumont",
      eraLabel: 'Paris - 1962',
      synopsis:
        "Charles Beaumont, propriétaire de l'hôtel familial, est retrouvé mort dans la chambre 417 par une nuit de pluie. Aucun signe d'effraction, mais le personnel et la famille semblent tous cacher quelque chose. Agent, votre but est d'interroger, d'examiner les indices et de confronter les témoignages pour démasquer le coupable avant que l'affaire ne soit classée.",
      difficulty: 1,
      themeKey: 'hotel-1960',
      publicationStatus: CasePublicationStatus.PUBLISHED,
      sortOrder: 0,
    },
    ['slug'],
  );
}
