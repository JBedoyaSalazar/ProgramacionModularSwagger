import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { OrderProductService } from '../services/order-product.service';
import {
  CreateOrderProductDto,
  UpdateOrderProductDto,
} from '../dtos/orderProduct.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorators';

@ApiTags('orderProduct')
@UseGuards(JwtAuthGuard)
@Controller('order-product')
export class OrderProductController {
  constructor(private orderProductService: OrderProductService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get an order product by id',
  })
  @ApiOkResponse({
    description: 'The order product was retrieved successfully',
    type: CreateOrderProductDto,
  })
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.orderProductService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new order product',
  })
  @ApiOkResponse({
    description: 'The order product was created successfully',
    type: CreateOrderProductDto,
  })
  create(@Body() payload: CreateOrderProductDto) {
    return this.orderProductService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an order product by id',
  })
  @ApiOkResponse({
    description: 'The order product was updated successfully',
    type: UpdateOrderProductDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderProductDto,
  ) {
    return this.orderProductService.update(id, payload);
  }
}
