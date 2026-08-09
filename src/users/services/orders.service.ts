import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/order.entity';
import { UpdateOrderDto } from '../dtos/order.dto';

import { CustomersService } from './customers.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    private customersService: CustomersService,
  ) {}

  async findAll(customerId?: number) {
    if (customerId) {
      return await this.orderRepo.find({
        where: { customer: { id: customerId } },
        relations: ['customer'],
      });
    }
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

  async create(customerId: number) {
    const newOrder = new Order();
    const customer = await this.customersService.findOne(customerId);
    newOrder.customer = customer;
    await this.orderRepo.save(newOrder);
    return this.findOne(newOrder.id);
  }

  async update(id: number, payload: UpdateOrderDto) {
    const order = await this.findOne(id);
    await this.orderRepo.save(order);
    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    return await this.orderRepo.remove(order);
  }
}
