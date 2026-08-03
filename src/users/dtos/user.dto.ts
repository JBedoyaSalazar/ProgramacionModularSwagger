import { IsString, IsNotEmpty, IsEmail, Length, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import { Role } from '../enum/role.enums';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  @IsString()
  @IsEmail()
  readonly email!: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password!: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin || user',
  })
  @IsNotEmpty()
  @IsEnum(Role, {
    message: `role must be one of: ${Object.values(Role).join(', ')}`,
  })
  readonly role!: Role;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
