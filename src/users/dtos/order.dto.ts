import { IsPositive, IsNumber, IsNotEmpty } from 'class-validator';
import { PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    description: 'The id of the customer',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  readonly customerId?: number;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
