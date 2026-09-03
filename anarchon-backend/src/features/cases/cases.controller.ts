import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CasesService } from './cases.service';
import { CaseContentService } from './case-content.service';
import { ProgressionService } from '../progression/progression.service';
import { CaseSummaryDto } from './dto/case-summary.dto';
import { CaseDetailDto } from './dto/case-detail.dto';
import { CaseContentDto } from './dto/case-content.dto';

@ApiTags('cases')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cases')
export class CasesController {
  constructor(
    private readonly casesService: CasesService,
    private readonly caseContentService: CaseContentService,
    private readonly progressionService: ProgressionService,
  ) {}

  @Get()
  @ApiOkResponse({ type: CaseSummaryDto, isArray: true })
  findCatalogue(@Req() req: Request): Promise<CaseSummaryDto[]> {
    const user = req.user as { id: string };
    return this.casesService.findCatalogue(user.id);
  }

  @Get(':slug')
  @ApiOkResponse({ type: CaseDetailDto })
  findBySlug(
    @Param('slug') slug: string,
    @Req() req: Request,
  ): Promise<CaseDetailDto> {
    const user = req.user as { id: string };
    return this.casesService.findBySlug(slug, user.id);
  }

  @Get(':slug/content')
  @ApiOkResponse({ type: CaseContentDto })
  async getContent(
    @Param('slug') slug: string,
    @Req() req: Request,
  ): Promise<CaseContentDto> {
    const user = req.user as { id: string };
    const caseEntity = await this.casesService.getPublishedCaseOrFail(slug);
    const content = this.caseContentService.getContent(slug);
    const discoveredElementIds =
      await this.progressionService.getDiscoveredElementIds(user.id, slug);

    return {
      case: {
        id: caseEntity.id,
        slug: caseEntity.slug,
        title: caseEntity.title,
      },
      content,
      discoveredElementIds,
    };
  }
}
