import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { OrdersService } from '../services/orders.service';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorators';

@ApiTags('orders')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiOkResponse({
    description: 'The orders were retrieved successfully',
    type: [CreateOrderDto],
  })
  @Public()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an order by id',
  })
  @ApiOkResponse({
    description: 'The order was retrieved successfully',
    type: CreateOrderDto,
  })
  @Public()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiOkResponse({
    description: 'The order was created successfully',
    type: CreateOrderDto,
  })
  create(@Body() payload: CreateOrderDto) {
    return this.ordersService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an order by id',
  })
  @ApiOkResponse({
    description: 'The order was updated successfully',
    type: UpdateOrderDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an order by id',
  })
  @ApiOkResponse({
    description: 'The order was deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }
}
