import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateOrderProductDto,
  UpdateOrderProductDto,
} from '../dtos/orderProduct.dto';
import { OrderProduct } from '../entities/orderProduct.entity';
import { ProductsService } from '../../products/services/products.service';
import { OrdersService } from './orders.service';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProduct)
    private orderProductRepo: Repository<OrderProduct>,
    private productsService: ProductsService,
    private ordersService: OrdersService,
  ) {}

  private checkStok(productQuantity: number, requestedQuantity: number) {
    if (productQuantity < requestedQuantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${productQuantity}, requested: ${requestedQuantity}`,
      );
    }
  }

  findAll() {
    return this.orderProductRepo.find();
  }

  async findOne(id: number) {
    const orderProduct = await this.orderProductRepo.findOne({
      where: { id },
      relations: ['product', 'order', 'order.customer', 'product.brand'],
    });
    if (!orderProduct) {
      throw new NotFoundException(`Order Product #${id} not found`);
    }
    return orderProduct;
  }

  async create(payload: CreateOrderProductDto) {
    const product = await this.productsService.findOne(payload.productId);

    const existing = await this.orderProductRepo.findOne({
      where: {
        order: { id: payload.orderId },
        product: { id: payload.productId },
      },
    });

    const finalQuantity = existing
      ? existing.quantity + payload.quantity
      : payload.quantity;

    this.checkStok(product.stock, finalQuantity);

    if (existing) {
      existing.quantity = finalQuantity;
      await this.orderProductRepo.save(existing);
      return this.findOne(existing.id);
    }

    const order = await this.ordersService.findOne(payload.orderId);
    const newOrderProduct = this.orderProductRepo.create({
      quantity: payload.quantity,
      product,
      order,
    });
    await this.orderProductRepo.save(newOrderProduct);
    return this.findOne(newOrderProduct.id);
  }

  async update(id: number, payload: UpdateOrderProductDto) {
    const orderProduct = await this.findOne(id);
    const quantity = payload.quantity ?? orderProduct.quantity;

    if (payload.productId) {
      const product = await this.productsService.findOne(payload.productId);
      this.checkStok(product.stock, quantity);
      orderProduct.product = product;
    }

    if (payload.orderId) {
      const order = await this.ordersService.findOne(payload.orderId);
      orderProduct.order = order;
    }

    this.orderProductRepo.merge(orderProduct, payload);
    await this.orderProductRepo.save(orderProduct);
    return this.findOne(orderProduct.id);
  }

  async addItemToOrder(id: number, payload: CreateOrderProductDto) {
    const orderProduct = await this.findOne(id);
    const product = await this.productsService.findOne(payload.productId);

    const finalQuantity = orderProduct.quantity + payload.quantity;
    this.checkStok(product.stock, finalQuantity);

    orderProduct.quantity = finalQuantity;
    await this.orderProductRepo.save(orderProduct);
    return this.findOne(orderProduct.id);
  }

  async remove(id: number) {
    const orderProduct = await this.findOne(id);
    return this.orderProductRepo.remove(orderProduct);
  }
}
