import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async findAll() {
    return this.productRepo.find();
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = await this.productRepo.create(payload);
    await this.productRepo.save(newProduct);
    return this.findOne(newProduct.id);
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.findOne(id);
    await this.productRepo.merge(product, payload);
    await this.productRepo.save(product);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return `Product #${id} deleted`;
  }
}
