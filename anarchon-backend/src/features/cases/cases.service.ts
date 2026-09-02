import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Case } from './entities/case.entity';
import { CasePublicationStatus } from './enums/case-publication-status.enum';
import { CaseStatus } from './enums/case-status.enum';
import { CaseProgress } from '../progression/entities/case-progress.entity';
import { MediaService } from '../media/media.service';
import { CaseSummaryDto } from './dto/case-summary.dto';
import { CaseDetailDto } from './dto/case-detail.dto';

const SYNOPSIS_EXCERPT_LENGTH = 160;

@Injectable()
export class CasesService {
  constructor(
    @InjectRepository(Case)
    private readonly casesRepo: Repository<Case>,
    @InjectRepository(CaseProgress)
    private readonly caseProgressRepo: Repository<CaseProgress>,
    private readonly mediaService: MediaService,
  ) {}

  async findCatalogue(userId: string): Promise<CaseSummaryDto[]> {
    const cases = await this.casesRepo.find({
      where: { publicationStatus: CasePublicationStatus.PUBLISHED },
      order: { sortOrder: 'ASC' },
    });

    return Promise.all(
      cases.map((caseEntity) => this.toSummaryDto(caseEntity, userId)),
    );
  }

  async findBySlug(slug: string, userId: string): Promise<CaseDetailDto> {
    const found = await this.casesRepo.findOne({ where: { slug } });
    if (!found || found.publicationStatus !== CasePublicationStatus.PUBLISHED) {
      throw new NotFoundException();
    }

    const [summary, detailBackgroundUrl] = await Promise.all([
      this.toSummaryDto(found, userId),
      this.mediaService.resolveUrlById(found.detailBackgroundId),
    ]);

    return { ...summary, synopsis: found.synopsis, detailBackgroundUrl };
  }

  deriveStatus(progress: CaseProgress | null): CaseStatus {
    if (!progress) return CaseStatus.NOT_STARTED;
    return progress.completedAt === null
      ? CaseStatus.IN_PROGRESS
      : CaseStatus.COMPLETED;
  }

  private async toSummaryDto(
    caseEntity: Case,
    userId: string,
  ): Promise<CaseSummaryDto> {
    const [progress, coverUrl] = await Promise.all([
      this.caseProgressRepo.findOne({
        where: { userId, caseId: caseEntity.id },
      }),
      this.mediaService.resolveUrlById(caseEntity.coverAssetId),
    ]);

    return {
      id: caseEntity.id,
      slug: caseEntity.slug,
      title: caseEntity.title,
      eraLabel: caseEntity.eraLabel,
      synopsisExcerpt: this.truncateSynopsis(caseEntity.synopsis),
      difficulty: caseEntity.difficulty,
      themeKey: caseEntity.themeKey,
      coverUrl,
      status: this.deriveStatus(progress),
    };
  }

  private truncateSynopsis(synopsis: string): string {
    if (synopsis.length <= SYNOPSIS_EXCERPT_LENGTH) return synopsis;
    return `${synopsis.slice(0, SYNOPSIS_EXCERPT_LENGTH).trimEnd()}…`;
  }
}
