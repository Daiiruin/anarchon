import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CasesService } from '../cases/cases.service';
import { AccusationsService } from './accusations.service';
import { SubmitAccusationDto } from './dto/submit-accusation.dto';
import { AccusationResultDto } from './dto/accusation-result.dto';

@ApiTags('cases')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cases/:slug/accusations')
export class AccusationsController {
  constructor(
    private readonly casesService: CasesService,
    private readonly accusationsService: AccusationsService,
  ) {}

  @Post()
  @ApiOkResponse({ type: AccusationResultDto })
  async submit(
    @Param('slug') slug: string,
    @Body() dto: SubmitAccusationDto,
    @Req() req: Request,
  ): Promise<AccusationResultDto> {
    const user = req.user as { id: string };
    await this.casesService.getPublishedCaseOrFail(slug);
    return this.accusationsService.submit(user.id, slug, dto);
  }
}
