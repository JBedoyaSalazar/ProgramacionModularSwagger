import { IsMongoId, IsNotEmpty, IsDate, IsArray } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly customer: string;

  @IsDate()
  @IsNotEmpty()
  readonly date: Date;

  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  readonly products: string[];
}

export class UpdateOrderDto extends PartialType(
  OmitType(CreateOrderDto, ['products']),
) {}

export class AddProductToOrderDto {
  @IsArray()
  @IsNotEmpty()
  @IsMongoId({ each: true })
  readonly productsIds: string[];
}
