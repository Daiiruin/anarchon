import { ApiProperty } from '@nestjs/swagger';
import { CaseSummaryDto } from './case-summary.dto';

export class CaseDetailDto extends CaseSummaryDto {
  @ApiProperty()
  declare synopsis: string;
}
