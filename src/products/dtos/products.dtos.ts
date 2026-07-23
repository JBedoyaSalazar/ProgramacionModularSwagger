import {
  IsString,
  IsNumber,
  IsUrl,
  IsNotEmpty,
  IsPositive,
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
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
