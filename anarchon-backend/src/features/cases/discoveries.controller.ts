import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CasesService } from './cases.service';
import { CaseContentService } from './case-content.service';
import { ProgressionService } from '../progression/progression.service';
import { DiscoveredElementsDto } from './dto/discovered-elements.dto';

@ApiTags('cases')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cases/:slug')
export class DiscoveriesController {
  constructor(
    private readonly casesService: CasesService,
    private readonly caseContentService: CaseContentService,
    private readonly progressionService: ProgressionService,
  ) {}

  @Post('discoveries/:elementId')
  @ApiOkResponse({ type: DiscoveredElementsDto })
  async discover(
    @Param('slug') slug: string,
    @Param('elementId') elementId: string,
    @Req() req: Request,
  ): Promise<DiscoveredElementsDto> {
    const user = req.user as { id: string };
    await this.casesService.getPublishedCaseOrFail(slug);
    if (!this.caseContentService.findElement(slug, elementId)) {
      throw new NotFoundException();
    }

    const discoveredElementIds = await this.progressionService.recordDiscovery(
      user.id,
      slug,
      elementId,
    );
    return { discoveredElementIds };
  }

  @Get('progress')
  @ApiOkResponse({ type: DiscoveredElementsDto })
  async getProgress(
    @Param('slug') slug: string,
    @Req() req: Request,
  ): Promise<DiscoveredElementsDto> {
    const user = req.user as { id: string };
    await this.casesService.getPublishedCaseOrFail(slug);
    const discoveredElementIds =
      await this.progressionService.getDiscoveredElementIds(user.id, slug);
    return { discoveredElementIds };
  }
}
