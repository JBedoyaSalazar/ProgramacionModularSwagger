import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(params?: FilterProductsDto) {
    if (params) {
      const filter: FilterQuery<Product> = {};
      const { limit, offset, minPrice, maxPrice } = params;

      if (minPrice && maxPrice) {
        if (minPrice > maxPrice) {
          throw new ForbiddenException(
            `The minimum price cannot be greater than the maximum price`,
          );
        }
        filter.price = { $gte: minPrice, $lte: maxPrice };
      } else if (maxPrice && !minPrice) {
        filter.price = { $lte: maxPrice };
      } else if (minPrice && !maxPrice) {
        filter.price = { $gte: minPrice };
      }
      return await this.productModel
        .find(filter)
        .populate('brand')
        .skip(offset)
        .limit(limit)
        .exec();
    }
    const products = await this.productModel.find().populate('brand').exec();
    return products;
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate('brand')
      .exec();
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
