import { ApiProperty } from '@nestjs/swagger';

export class AccusationResultDto {
  @ApiProperty()
  declare isCorrect: boolean;

  @ApiProperty()
  declare submittedAt: Date;
}
