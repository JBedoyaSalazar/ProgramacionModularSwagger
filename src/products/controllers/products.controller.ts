import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { MongoIdPipe } from '../../common/mongo-id.pipe';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/products.dtos';
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
  async getProducts(@Query() params: FilterProductsDto) {
    return await this.productsService.findAll(params);
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
  async getOne(@Param('productId', new MongoIdPipe()) productId: string) {
    return await this.productsService.findOne(productId);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: CreateProductDto) {
    return this.productsService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a product by id',
  })
  @ApiOkResponse({
    description: 'The product was updated successfully',
    type: UpdateProductDto,
  })
  update(
    @Param('id', new MongoIdPipe()) id: string,
    @Body() payload: UpdateProductDto,
  ) {
    return this.productsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product by id',
  })
  delete(@Param('id', new MongoIdPipe()) id: string) {
    return this.productsService.remove(id);
  }
}
