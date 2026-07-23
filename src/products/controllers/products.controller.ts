import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Res,
  // ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ParseIntPipe } from '../../common/parse-int.pipe';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { CreateProductDto, UpdateProductDto } from '../dtos/products.dtos';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
  })
  @ApiOkResponse({
    description: 'The products were retrieved successfully',
    type: [CreateProductDto],
  })
  getProducts(
    @Query('limit') limit = 100,
    @Query('offset') offset = 0,
    @Query('brand') brand: string,
  ) {
    // return {
    //   message: `products limit=> ${limit} offset=> ${offset} brand=> ${brand}`,
    // };
    return this.productsService.findAll();
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get a product by productId',
  })
  @ApiOkResponse({
    description: 'The product was retrieved successfully',
    type: CreateProductDto,
  })
  @HttpCode(HttpStatus.ACCEPTED)
  getOne(@Param('productId', ParseIntPipe) productId: number) {
    // response.status(200).send({
    //   message: `product ${productId}`,
    // });
    return this.productsService.findOne(productId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateProductDto) {
    // return {
    //   message: 'accion de crear',
    //   payload,
    // };
    return this.productsService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a product by id',
  })
  update(@Param('id') id: string, @Body() payload: UpdateProductDto) {
    return this.productsService.update(+id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product by id',
  })
  delete(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
