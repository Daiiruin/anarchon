import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CasesService } from './cases.service';
import { CaseSummaryDto } from './dto/case-summary.dto';
import { CaseDetailDto } from './dto/case-detail.dto';

@ApiTags('cases')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

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
}
