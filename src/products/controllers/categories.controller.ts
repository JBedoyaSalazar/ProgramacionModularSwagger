import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { MongoIdPipe } from '../../common/mongo-id.pipe';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
  })
  @ApiOkResponse({
    description: 'The categories were retrieved successfully',
    type: CreateCategoryDto,
  })
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Get(':id/products/:productId')
  @ApiOperation({
    summary: 'Get a category by productId and id',
  })
  @ApiOkResponse({
    description: 'The category was retrieved successfully',
    type: CreateCategoryDto,
  })
  getCategory(@Param('productId') productId: string, @Param('id') id: string) {
    return `product ${productId} and ${id}`;
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The category was retrieved successfully',
    type: CreateCategoryDto,
  })
  @ApiOperation({
    summary: 'Get a category by id',
  })
  getCategoryById(@Param('id', new MongoIdPipe()) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiOkResponse({
    description: 'The category was created successfully',
    type: CreateCategoryDto,
  })
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoriesService.create(payload);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a category by id',
  })
  @ApiOkResponse({
    description: 'The category was updated successfully',
    type: UpdateCategoryDto,
  })
  updateCategory(
    @Param('id', new MongoIdPipe()) id: string,
    @Body() payload: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category by id',
  })
  @ApiOkResponse({
    description: 'The category was deleted successfully',
  })
  deleteCategory(@Param('id', new MongoIdPipe()) id: string) {
    return this.categoriesService.remove(id);
  }
}
