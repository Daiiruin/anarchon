import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { MediaAsset } from './entities/media-asset.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaAsset)
    private readonly mediaAssetsRepo: Repository<MediaAsset>,
    private readonly configService: ConfigService,
  ) {}

  resolveUrl(asset: MediaAsset | null): string | null {
    if (!asset) return null;
    const base = this.configService
      .getOrThrow<string>('MEDIA_BASE_URL')
      .replace(/\/+$/, '');
    const path = asset.storagePath.replace(/^\/+/, '');
    return `${base}/${path}`;
  }

  async resolveUrlById(assetId: string | null): Promise<string | null> {
    if (!assetId) return null;
    const asset = await this.mediaAssetsRepo.findOne({
      where: { id: assetId },
    });
    return this.resolveUrl(asset);
  }
}
