import { IsString } from 'class-validator';

export class SubmitAccusationDto {
  @IsString()
  declare suspectId: string;

  @IsString()
  declare motiveId: string;

  @IsString()
  declare weaponId: string;
}
