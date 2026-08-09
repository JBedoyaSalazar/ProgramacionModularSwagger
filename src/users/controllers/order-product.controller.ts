import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

import { OrderProductService } from '../services/order-product.service';
import {
  CreateOrderProductDto,
  UpdateOrderProductDto,
} from '../dtos/orderProduct.dto';
import { UsersService } from '../services/users.service';
import { OrdersService } from '../services/orders.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../enum/role.enums';

@ApiTags('orderProduct')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('order-product')
export class OrderProductController {
  constructor(
    private orderProductService: OrderProductService,
    private usersService: UsersService,
    private ordersService: OrdersService,
  ) {}

  private async verifyOrderOwnership(
    orderId: number,
    userId: number,
  ): Promise<void> {
    const caller = await this.usersService.findOne(userId);
    if (caller.role === Role.ADMIN) {
      return;
    }
    const order = await this.ordersService.findOne(orderId);
    if (
      !caller.customer ||
      !order.customer ||
      order.customer.id !== caller.customer.id
    ) {
      throw new ForbiddenException(
        'You can only manage products in your own orders',
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an order product by id',
  })
  @ApiOkResponse({
    description: 'The order product was retrieved successfully',
    type: CreateOrderProductDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const orderProduct = await this.orderProductService.findOne(id);
    await this.verifyOrderOwnership(orderProduct.order.id, req.user.sub);
    return orderProduct;
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new order product',
  })
  @ApiOkResponse({
    description: 'The order product was created successfully',
    type: CreateOrderProductDto,
  })
  async create(@Body() payload: CreateOrderProductDto, @Req() req: any) {
    await this.verifyOrderOwnership(payload.orderId, req.user.sub);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateOrderProductDto,
    @Req() req: any,
  ) {
    const orderProduct = await this.orderProductService.findOne(id);
    await this.verifyOrderOwnership(orderProduct.order.id, req.user.sub);
    if (payload.orderId) {
      await this.verifyOrderOwnership(payload.orderId, req.user.sub);
    }
    return this.orderProductService.update(id, payload);
  }
}
