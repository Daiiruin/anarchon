import { ApiProperty } from '@nestjs/swagger';

export class DiscoveredElementsDto {
  @ApiProperty({ type: [String] })
  declare discoveredElementIds: string[];
}
