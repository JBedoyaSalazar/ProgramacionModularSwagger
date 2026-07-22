import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone!: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
