import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaseProgress } from './entities/case-progress.entity';
import { PlayerDiscovery } from './entities/player-discovery.entity';

@Injectable()
export class ProgressionService {
  constructor(
    @InjectRepository(CaseProgress)
    private readonly caseProgressRepo: Repository<CaseProgress>,
    @InjectRepository(PlayerDiscovery)
    private readonly playerDiscoveryRepo: Repository<PlayerDiscovery>,
  ) {}

  async getDiscoveredElementIds(
    userId: string,
    caseId: string,
  ): Promise<string[]> {
    const discoveries = await this.playerDiscoveryRepo.find({
      where: { userId, caseId },
    });
    return discoveries.map((discovery) => discovery.elementId);
  }

  async recordDiscovery(
    userId: string,
    caseId: string,
    elementId: string,
  ): Promise<string[]> {
    await this.ensureStarted(userId, caseId);
    await this.playerDiscoveryRepo
      .createQueryBuilder()
      .insert()
      .values({ userId, caseId, elementId })
      .orIgnore()
      .execute();
    return this.getDiscoveredElementIds(userId, caseId);
  }

  async resetProgress(userId: string, caseId: string): Promise<void> {
    await this.playerDiscoveryRepo.delete({ userId, caseId });
    await this.caseProgressRepo.delete({ userId, caseId });
  }

  async completeCase(userId: string, caseId: string): Promise<void> {
    await this.ensureStarted(userId, caseId);
    await this.caseProgressRepo.update(
      { userId, caseId },
      { completedAt: new Date() },
    );
  }

  private async ensureStarted(userId: string, caseId: string): Promise<void> {
    const existing = await this.caseProgressRepo.findOne({
      where: { userId, caseId },
    });
    if (existing) return;

    await this.caseProgressRepo
      .createQueryBuilder()
      .insert()
      .values({ userId, caseId, startedAt: new Date() })
      .orIgnore()
      .execute();
  }
}
