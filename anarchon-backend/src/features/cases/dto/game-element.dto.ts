import { ApiProperty } from '@nestjs/swagger';
import { ElementType } from '../enums/element-type.enum';

export class GameElementDto {
  @ApiProperty()
  declare id: string;

  @ApiProperty({ enum: ElementType })
  declare type: ElementType;

  @ApiProperty()
  declare title: string;

  @ApiProperty({ required: false })
  declare description?: string;

  @ApiProperty({ required: false, nullable: true, type: String })
  declare imageUrl?: string;

  @ApiProperty({ required: false, type: [String] })
  declare requiredDiscoveries?: string[];

  @ApiProperty({ required: false, type: Object })
  declare data?: Record<string, unknown>;
}
