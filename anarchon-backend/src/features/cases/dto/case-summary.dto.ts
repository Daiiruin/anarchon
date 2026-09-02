import { ApiProperty } from '@nestjs/swagger';
import { CaseStatus } from '../enums/case-status.enum';

export class CaseSummaryDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  declare slug: string;

  @ApiProperty()
  declare title: string;

  @ApiProperty()
  declare eraLabel: string;

  @ApiProperty()
  declare synopsisExcerpt: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  declare difficulty: number;

  @ApiProperty()
  declare themeKey: string;

  @ApiProperty({ nullable: true, type: String })
  declare coverUrl: string | null;

  @ApiProperty({ enum: CaseStatus })
  declare status: CaseStatus;
}
