import { ApiProperty } from '@nestjs/swagger';
import { GameElementDto } from './game-element.dto';

export class CaseContentSummaryDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty()
  declare slug: string;

  @ApiProperty()
  declare title: string;
}

export class CaseElementsDto {
  @ApiProperty({ type: [GameElementDto] })
  declare locations: GameElementDto[];

  @ApiProperty({ type: [GameElementDto] })
  declare items: GameElementDto[];

  @ApiProperty({ type: [GameElementDto] })
  declare characters: GameElementDto[];

  @ApiProperty({ type: [GameElementDto] })
  declare documents: GameElementDto[];
}

export class CaseContentDto {
  @ApiProperty({ type: CaseContentSummaryDto })
  declare case: CaseContentSummaryDto;

  @ApiProperty({ type: CaseElementsDto })
  declare content: CaseElementsDto;

  @ApiProperty({ type: [String] })
  declare discoveredElementIds: string[];
}
