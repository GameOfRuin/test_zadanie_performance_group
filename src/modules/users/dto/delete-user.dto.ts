import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserEntity } from '../../../database/entities';

export class DeleteUserDto {
  @IsNumber()
  @ApiProperty({
    description: 'ID пользователя, которого необходимо удалить',
    example: 3,
  })
  id: UserEntity['id'];
}
