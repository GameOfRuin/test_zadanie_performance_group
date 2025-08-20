import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class IdNumberDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ example: 4 })
  id: number;
}
