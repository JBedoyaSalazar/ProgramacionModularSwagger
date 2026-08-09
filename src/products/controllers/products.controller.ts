import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ParseIntPipe } from '../../common/parse-int.pipe';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/products.dtos';
import { ProductsService } from '../services/products.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorators';

@ApiTags('products')
@UseGuards(JwtAuthGuard)
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
  @Public()
  getProducts(@Query() params: FilterProductsDto) {
    return this.productsService.findAll(params);
  }

  @Get(':productId')
  @ApiOperation({
    summary: 'Get a product by productId',
  })
  @ApiOkResponse({
    description: 'The product was retrieved successfully',
    type: CreateProductDto,
  })
  @Public()
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

  @Post(':productId/categories/:categoryId')
  @ApiOperation({
    summary: 'Add a category to a product',
  })
  @ApiOkResponse({
    description: 'The category was added to the product successfully',
    type: CreateProductDto,
  })
  addCategoryToProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.addCategoryToProduct(productId, categoryId);
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

  @Delete(':productId/categories/:categoryId')
  @ApiOperation({
    summary: 'Remove a category from a product',
  })
  removeCategoryFromProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.removeCategoryFromProduct(
      productId,
      categoryId,
    );
  }
}
