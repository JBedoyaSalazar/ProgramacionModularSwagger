import {
  IsString,
  IsNotEmpty,
  IsEmail,
  Length,
  IsEnum,
  IsPositive,
  IsOptional,
} from 'class-validator';
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
    example: 'admin || customer',
  })
  @IsOptional()
  @IsEnum(Role, {
    message: `role must be one of: ${Object.values(Role).join(', ')}`,
  })
  readonly role!: Role;

  @ApiProperty({
    description: 'The customer ID of the user',
    example: 1,
  })
  @IsOptional()
  @IsPositive()
  readonly customerId!: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
