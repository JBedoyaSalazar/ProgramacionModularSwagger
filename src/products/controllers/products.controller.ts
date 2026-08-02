import {
  Controller,
  Get,
  // Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
// import { Response } from 'express';
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
  getProducts() {
    // @Query('brand') brand: string, // @Query('offset') offset = 0, // @Query('limit') limit = 100,
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
  getOne(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.findOne(productId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
  })
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a product by id',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product by id',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
