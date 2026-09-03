import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accusation } from './entities/accusation.entity';
import { CaseContentService } from '../cases/case-content.service';
import { ProgressionService } from '../progression/progression.service';
import { SubmitAccusationDto } from './dto/submit-accusation.dto';
import { AccusationResultDto } from './dto/accusation-result.dto';

@Injectable()
export class AccusationsService {
  constructor(
    @InjectRepository(Accusation)
    private readonly accusationsRepo: Repository<Accusation>,
    private readonly caseContentService: CaseContentService,
    private readonly progressionService: ProgressionService,
  ) {}

  async submit(
    userId: string,
    caseId: string,
    dto: SubmitAccusationDto,
  ): Promise<AccusationResultDto> {
    const solution = this.caseContentService.getSolution(caseId);
    const isCorrect =
      dto.suspectId === solution.suspectId &&
      dto.motiveId === solution.motiveId &&
      dto.weaponId === solution.weaponId;

    const accusation = await this.accusationsRepo.save(
      this.accusationsRepo.create({ userId, caseId, ...dto, isCorrect }),
    );

    if (isCorrect) {
      await this.progressionService.completeCase(userId, caseId);
    }

    return { isCorrect, submittedAt: accusation.submittedAt };
  }
}
