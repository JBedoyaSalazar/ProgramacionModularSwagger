import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

import { CreateCategoryDto } from './category.dtos';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Nike Air Max',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    description: 'The description of the product',
    example: 'A comfortable running shoe',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 99.99,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly price: number;

  @ApiProperty({
    description: 'The stock of the product',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  readonly stock: number;

  @ApiProperty({
    description: 'The image of the product',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  readonly image: string;

  @ApiProperty({
    description: 'The category of the product',
    type: CreateCategoryDto,
  })
  @ValidateNested()
  @IsNotEmpty()
  readonly category: CreateCategoryDto;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductsDto {
  @ApiProperty({
    description: 'The maximun products to return',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'The offset of the products to return',
    example: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  offset?: number;

  @ApiProperty({
    description: 'The minimum price of the products to return',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  minPrice?: number;

  @ApiProperty({
    description: 'The maximum price of the products to return',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxPrice?: number;
}
