import { ApiProperty } from '@nestjs/swagger';

export class UserIncludeDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Alex Parker' })
  name: string;
}
