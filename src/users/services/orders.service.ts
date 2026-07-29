import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';
import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class OrdersService {
  constructor(
    private productsService: ProductsService,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  findAll() {
    return this.orderModel
      .find()
      .populate('customer')
      .populate('products')
      .exec();
  }

  async findOne(id: string) {
    return this.orderModel
      .findById(id)
      .populate('customer')
      .populate('products')
      .exec();
  }

  create(data: CreateOrderDto) {
    const newModel = new this.orderModel(data);
    return newModel.save();
  }

  update(id: string, changes: UpdateOrderDto) {
    return this.orderModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }

  async removeProductFromOrder(orderId: string, productId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    const product = await this.productsService.findOne(productId);

    const exists = order.products.some(
      (product) => product.toString() === productId,
    );
    if (!exists) {
      throw new NotFoundException(
        `Product with id ${productId} not found in order`,
      );
    }

    order.products.pull(productId);
    return order.save();
  }

  async addProductToOrder(orderId: string, productsIds: string[]) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    await Promise.all(
      productsIds.map((id) => this.productsService.findOne(id)),
    );

    for (const productId of productsIds) {
      order.products.push(productId);
    }

    return order.save();
  }
}
