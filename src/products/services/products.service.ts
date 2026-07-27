import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll() {
    const products = await this.productModel.find().exec();
    return products;
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = await this.productModel.create(payload);
    return newProduct.save();
  }

  async update(id: string, payload: UpdateProductDto) {
    const changedProduct = await this.productModel
      .findByIdAndUpdate(id, { $set: payload }, { new: true })
      .exec();

    if (!changedProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return changedProduct;
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return `Product #${id} deleted successfully`;
  }
}
