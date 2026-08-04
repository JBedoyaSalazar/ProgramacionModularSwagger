import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from '../dtos/products.dtos';

import { Category } from '../entities/category.entity';
import { BrandsService } from '../services/brands.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    // private categoriesService: CategoriesService,
    private brandsService: BrandsService,
  ) {}

  async findAll() {
    return this.productRepo.find({
      relations: ['brand', 'categories'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['brand', 'categories'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(payload: CreateProductDto) {
    const newProduct = await this.productRepo.create(payload);

    if (payload.brandId) {
      const brand = await this.brandsService.findOne(payload.brandId);
      newProduct.brand = brand;
    }
    if (payload.categoryIds && payload.categoryIds.length > 0) {
      const categories = await this.categoryRepo.findByIds(payload.categoryIds);
      newProduct.categories = categories;
    }
    await this.productRepo.save(newProduct);
    return this.findOne(newProduct.id);
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.findOne(id);
    if (payload.brandId) {
      const brand = await this.brandsService.findOne(payload.brandId);
      product.brand = brand;
    }

    if (payload.categoryIds && payload.categoryIds.length > 0) {
      const categories = await this.categoryRepo.findByIds(payload.categoryIds);
      product.categories = categories;
    }
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
