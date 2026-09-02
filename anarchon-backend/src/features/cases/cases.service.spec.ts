import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CasesService } from './cases.service';
import { Case } from './entities/case.entity';
import { CaseProgress } from '../progression/entities/case-progress.entity';
import { MediaService } from '../media/media.service';
import { CasePublicationStatus } from './enums/case-publication-status.enum';
import { CaseStatus } from './enums/case-status.enum';

describe('CasesService', () => {
  let service: CasesService;
  const casesRepo = { find: jest.fn(), findOne: jest.fn() };
  const caseProgressRepo = { findOne: jest.fn() };
  const mediaService = { resolveUrlById: jest.fn() };

  const publishedCase = {
    id: 'c1',
    slug: 'hotel-beaumont',
    title: "Le meurtre de l'Hôtel Beaumont",
    eraLabel: 'Paris — 1962',
    synopsis: 'A'.repeat(200),
    difficulty: 3,
    themeKey: 'hotel-1960',
    publicationStatus: CasePublicationStatus.PUBLISHED,
    coverAssetId: 'asset-1',
    detailBackgroundId: 'asset-2',
  } as Case;

  beforeEach(async () => {
    jest.clearAllMocks();
    mediaService.resolveUrlById.mockResolvedValue(
      'https://cdn.example.com/x.webp',
    );
    const module = await Test.createTestingModule({
      providers: [
        CasesService,
        { provide: getRepositoryToken(Case), useValue: casesRepo },
        {
          provide: getRepositoryToken(CaseProgress),
          useValue: caseProgressRepo,
        },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();
    service = module.get(CasesService);
  });

  describe('findCatalogue', () => {
    it('only queries PUBLISHED cases, sorted by sortOrder', async () => {
      casesRepo.find.mockResolvedValue([]);
      await service.findCatalogue('user-1');
      expect(casesRepo.find).toHaveBeenCalledWith({
        where: { publicationStatus: CasePublicationStatus.PUBLISHED },
        order: { sortOrder: 'ASC' },
      });
    });

    it('truncates a long synopsis for the catalogue', async () => {
      casesRepo.find.mockResolvedValue([publishedCase]);
      caseProgressRepo.findOne.mockResolvedValue(null);
      const [summary] = await service.findCatalogue('user-1');
      expect(summary.synopsisExcerpt.length).toBeLessThan(
        publishedCase.synopsis.length,
      );
      expect(summary.synopsisExcerpt.endsWith('…')).toBe(true);
    });

    it('does not truncate a short synopsis', async () => {
      casesRepo.find.mockResolvedValue([
        { ...publishedCase, synopsis: 'Short synopsis.' },
      ]);
      caseProgressRepo.findOne.mockResolvedValue(null);
      const [summary] = await service.findCatalogue('user-1');
      expect(summary.synopsisExcerpt).toBe('Short synopsis.');
    });
  });

  describe('findBySlug', () => {
    it('throws NotFoundException for a DRAFT case', async () => {
      casesRepo.findOne.mockResolvedValue({
        ...publishedCase,
        publicationStatus: CasePublicationStatus.DRAFT,
      });
      await expect(
        service.findBySlug('hotel-beaumont', 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when the case does not exist', async () => {
      casesRepo.findOne.mockResolvedValue(null);
      await expect(service.findBySlug('unknown', 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('returns the full synopsis and detail background for a PUBLISHED case', async () => {
      casesRepo.findOne.mockResolvedValue(publishedCase);
      caseProgressRepo.findOne.mockResolvedValue(null);
      const detail = await service.findBySlug('hotel-beaumont', 'user-1');
      expect(detail.synopsis).toBe(publishedCase.synopsis);
      expect(detail.detailBackgroundUrl).toBe('https://cdn.example.com/x.webp');
    });
  });

  describe('deriveStatus', () => {
    it('returns NOT_STARTED when there is no progress', () => {
      expect(service.deriveStatus(null)).toBe(CaseStatus.NOT_STARTED);
    });

    it('returns IN_PROGRESS when completedAt is null', () => {
      expect(service.deriveStatus({ completedAt: null } as CaseProgress)).toBe(
        CaseStatus.IN_PROGRESS,
      );
    });

    it('returns COMPLETED when completedAt is set', () => {
      expect(
        service.deriveStatus({ completedAt: new Date() } as CaseProgress),
      ).toBe(CaseStatus.COMPLETED);
    });
  });
});
