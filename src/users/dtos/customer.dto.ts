import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import { SkillDto } from '../dtos/skills.dto';
import { Type } from 'class-transformer';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'The last name of the customer',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty({
    description: 'The skills of the customer',
    example: [{ name: 'JavaScript', level: 'Advanced' }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillDto)
  skills!: SkillDto[];
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
