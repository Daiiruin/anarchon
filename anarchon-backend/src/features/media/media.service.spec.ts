import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MediaService } from './media.service';
import { MediaAsset } from './entities/media-asset.entity';
import { MediaAssetType } from './enums/media-asset-type.enum';

function buildAsset(storagePath: string): MediaAsset {
  return {
    id: '1',
    caseId: null,
    key: 'k',
    type: MediaAssetType.IMAGE,
    storagePath,
    mimeType: 'image/webp',
    width: null,
    height: null,
    durationMs: null,
    isPrivate: false,
    createdAt: new Date(),
  };
}

describe('MediaService', () => {
  let service: MediaService;
  const repo = { findOne: jest.fn() };
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('https://cdn.example.com/media'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    configService.getOrThrow.mockReturnValue('https://cdn.example.com/media');
    const module = await Test.createTestingModule({
      providers: [
        MediaService,
        { provide: getRepositoryToken(MediaAsset), useValue: repo },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();
    service = module.get(MediaService);
  });

  describe('resolveUrl', () => {
    it('returns null for a null asset', () => {
      expect(service.resolveUrl(null)).toBeNull();
    });

    it('joins the base URL and storage path with a single slash', () => {
      expect(service.resolveUrl(buildAsset('cases/hotel/cover.webp'))).toBe(
        'https://cdn.example.com/media/cases/hotel/cover.webp',
      );
    });

    it('does not produce a double slash when storagePath has a leading slash', () => {
      expect(service.resolveUrl(buildAsset('/cases/hotel/cover.webp'))).toBe(
        'https://cdn.example.com/media/cases/hotel/cover.webp',
      );
    });

    it('does not produce a double slash when the base URL has a trailing slash', () => {
      configService.getOrThrow.mockReturnValue(
        'https://cdn.example.com/media/',
      );
      expect(service.resolveUrl(buildAsset('cases/hotel/cover.webp'))).toBe(
        'https://cdn.example.com/media/cases/hotel/cover.webp',
      );
    });
  });

  describe('resolveUrlById', () => {
    it('returns null for a null id without querying the repository', async () => {
      const result = await service.resolveUrlById(null);
      expect(result).toBeNull();
      expect(repo.findOne).not.toHaveBeenCalled();
    });

    it('returns null when the asset does not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      const result = await service.resolveUrlById('missing-id');
      expect(result).toBeNull();
    });

    it('resolves the URL for an existing asset', async () => {
      repo.findOne.mockResolvedValue(buildAsset('cases/hotel/cover.webp'));
      const result = await service.resolveUrlById('1');
      expect(result).toBe(
        'https://cdn.example.com/media/cases/hotel/cover.webp',
      );
    });
  });
});
