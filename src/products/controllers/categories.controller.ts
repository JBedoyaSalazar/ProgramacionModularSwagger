import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { ParseIntPipe } from '../../common/parse-int.pipe';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dtos/category.dtos';

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
    type: String,
  })
  getCategories() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by productId and id',
  })
  @ApiOkResponse({
    description: 'The category was retrieved successfully',
    type: String,
  })
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new category',
  })
  @ApiOkResponse({
    description: 'The category was created successfully',
    type: String,
  })
  createCategory(@Body() payload: CreateCategoryDto) {
    return this.categoriesService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a category by id',
  })
  @ApiOkResponse({
    description: 'The category was updated successfully',
    type: String,
  })
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreateCategoryDto,
  ) {
    return this.categoriesService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category by id',
  })
  @ApiOkResponse({
    description: 'The category was deleted successfully',
    type: String,
  })
  deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
