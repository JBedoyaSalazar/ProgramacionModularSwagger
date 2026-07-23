import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  @Get(':id/products/:productId')
  @ApiOperation({
    summary: 'Get a category by productId and id',
  })
  @ApiOkResponse({
    description: 'The category was retrieved successfully',
    type: String,
  })
  getCategory(@Param('productId') productId: string, @Param('id') id: string) {
    return `product ${productId} and ${id}`;
  }
}
