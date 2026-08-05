import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
  IsOptional,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'The brand of the product',
    example: { id: 1, name: 'Nike', image: 'https://example.com/nike.jpg' },
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly brandId: number;

  @ApiProperty({
    description: 'The categories of the product',
    example: [
      { id: 1, name: 'Shoes' },
      { id: 2, name: 'Running' },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  readonly categoryIds: number[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class FilterProductsDto {
  @ApiProperty({
    description: 'The minimum price of the product',
    example: 50,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly minPrice?: number;

  @ApiProperty({
    description: 'The maximum price of the product',
    example: 200,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly maxPrice?: number;

  @ApiProperty({
    description: 'The brand of the product',
    example: 'Nike',
    required: false,
  })
  @IsString()
  @IsOptional()
  readonly brand?: string;

  @ApiProperty({
    description: 'The limit of products to return',
    example: 10,
    required: false,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly limit?: number;

  @ApiProperty({
    description: 'The offset of products to return',
    example: 0,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly offset?: number;
}
