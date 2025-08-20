import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserEntity } from '../../../database/entities';

export class DeleteUserDto {
  @IsNumber()
  @ApiProperty({
    example: 'Id пользователя, которого надо удалить',
  })
  id: UserEntity['id'];
}
