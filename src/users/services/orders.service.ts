import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';

import { CustomersService } from './customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private customersService: CustomersService,
  ) {}

  async findAll() {
    return await this.orderRepo.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product', 'items.product.brand'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  async create(payload: CreateOrderDto) {
    const newOrder = new Order();
    if (payload.customerId) {
      const customer = await this.customersService.findOne(payload.customerId);
      newOrder.customer = customer;
    }
    await this.orderRepo.save(newOrder);
    return this.findOne(newOrder.id);
  }

  async update(id: number, payload: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (payload.customerId) {
      const customer = await this.customersService.findOne(payload.customerId);
      order.customer = customer;
    }
    await this.orderRepo.save(order);
    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return await this.orderRepo.remove(order);
  }
}
