import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

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
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
