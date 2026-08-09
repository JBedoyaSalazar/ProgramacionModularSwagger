import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindConditions,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { Product } from '../entities/product.entity';
import {
  CreateProductDto,
  UpdateProductDto,
  FilterProductsDto,
} from '../dtos/products.dtos';

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

  private buildFilters(params: FilterProductsDto): FindConditions<Product> {
    if (
      params.minPrice !== undefined &&
      params.maxPrice !== undefined &&
      params.maxPrice < params.minPrice
    ) {
      throw new BadRequestException(
        'maxPrice must be greater than or equal to minPrice.',
      );
    }

    const where: FindConditions<Product> = {};

    if (params.minPrice !== undefined && params.maxPrice !== undefined) {
      where.price = Between(params.minPrice, params.maxPrice);
    } else if (params.minPrice !== undefined) {
      where.price = MoreThanOrEqual(params.minPrice);
    } else if (params.maxPrice !== undefined) {
      where.price = LessThanOrEqual(params.maxPrice);
    }

    if (params.brand) {
      where.brand = {
        name: params.brand,
      };
    }

    return where;
  }

  async findAll(params: FilterProductsDto) {
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;

    const where = this.buildFilters(params);

    return this.productRepo.find({
      where,
      relations: ['brand', 'categories'],
      take: limit,
      skip: offset,
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
    try {
      const newProduct = await this.productRepo.create(payload);

      if (payload.brandId) {
        const brand = await this.brandsService.findOne(payload.brandId);
        newProduct.brand = brand;
      }
      if (payload.categoryIds && payload.categoryIds.length > 0) {
        const categories = await this.categoryRepo.findByIds(
          payload.categoryIds,
        );
        newProduct.categories = categories;
      }
      await this.productRepo.save(newProduct);
      return this.findOne(newProduct.id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Product already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, payload: UpdateProductDto) {
    const product = await this.findOne(id);
    if (payload.brandId) {
      const brand = await this.brandsService.findOne(payload.brandId);
      product.brand = brand;
    }

    if (payload.categoryIds) {
      const categories = await this.categoryRepo.findByIds(payload.categoryIds);
      product.categories = categories;
    }
    try {
      await this.productRepo.merge(product, payload);
      await this.productRepo.save(product);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Product already exists');
      }
      throw new BadRequestException(error.message);
    }
    return this.findOne(id);
  }

  async removeCategoryFromProduct(productId: number, categoryId: number) {
    const product = await this.findOne(productId);

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }

    const hasCategory = product.categories.some((cat) => cat.id === categoryId);
    if (!hasCategory) {
      throw new BadRequestException(
        `Category #${categoryId} is not associated with Product #${productId}`,
      );
    }

    product.categories = product.categories.filter(
      (cat) => cat.id !== categoryId,
    );
    await this.productRepo.save(product);
    return this.findOne(productId);
  }

  async addCategoryToProduct(productId: number, categoryId: number) {
    const product = await this.findOne(productId);

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }

    const alreadyAssigned = product.categories.some(
      (cat) => cat.id === categoryId,
    );
    if (alreadyAssigned) {
      throw new ConflictException(
        `Category #${categoryId} is already assigned to product #${productId}`,
      );
    }

    product.categories.push(category);
    await this.productRepo.save(product);
    return this.findOne(productId);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return `Product #${id} deleted`;
  }
}
