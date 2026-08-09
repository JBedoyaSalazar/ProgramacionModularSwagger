import {
  Controller,
  Get,
  ParseIntPipe,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { OrdersService } from '../services/orders.service';
import { UsersService } from '../services/users.service';
import { CreateOrderDto } from '../dtos/order.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../enum/role.enums';

@ApiTags('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
  })
  @ApiOkResponse({
    description: 'The orders were retrieved successfully',
    type: [CreateOrderDto],
  })
  async findAll(@Req() req: any) {
    const caller = await this.usersService.findOne(req.user.sub);
    if (caller.role === Role.ADMIN) {
      return this.ordersService.findAll();
    }
    if (!caller.customer) {
      return [];
    }
    return this.ordersService.findAll(caller.customer.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an order by id',
  })
  @ApiOkResponse({
    description: 'The order was retrieved successfully',
    type: CreateOrderDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const order = await this.ordersService.findOne(id);
    const caller = await this.usersService.findOne(req.user.sub);
    if (caller.role !== Role.ADMIN) {
      if (
        !caller.customer ||
        !order.customer ||
        order.customer.id !== caller.customer.id
      ) {
        throw new ForbiddenException('You can only access your own orders');
      }
    }
    return order;
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new order',
  })
  @ApiOkResponse({
    description: 'The order was created successfully',
    type: CreateOrderDto,
  })
  async create(@Req() req: any) {
    const caller = await this.usersService.findOne(req.user.sub);
    if (!caller.customer) {
      throw new BadRequestException(
        'You need a customer profile to create an order',
      );
    }
    return this.ordersService.create(caller.customer.id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an order by id',
  })
  @ApiOkResponse({
    description: 'The order was updated successfully',
  })
  async update(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const order = await this.ordersService.findOne(id);
    const caller = await this.usersService.findOne(req.user.sub);
    if (caller.role !== Role.ADMIN) {
      if (
        !caller.customer ||
        !order.customer ||
        order.customer.id !== caller.customer.id
      ) {
        throw new ForbiddenException('You can only update your own orders');
      }
    }
    return this.ordersService.update(id, {});
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an order by id',
  })
  @ApiOkResponse({
    description: 'The order was deleted successfully',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const order = await this.ordersService.findOne(id);
    const caller = await this.usersService.findOne(req.user.sub);
    if (caller.role !== Role.ADMIN) {
      if (
        !caller.customer ||
        !order.customer ||
        order.customer.id !== caller.customer.id
      ) {
        throw new ForbiddenException('You can only delete your own orders');
      }
    }
    return this.ordersService.remove(id);
  }
}
