import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
  ) {}

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: number) {
    const product = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  async create(data: CreateBrandDto) {
    try {
      const newBrand = this.brandRepository.create(data);
      await this.brandRepository.save(newBrand);
      return await this.findOne(newBrand.id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Brand with name "${data.name}" already exists`,
        );
      }
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async update(id: number, changes: UpdateBrandDto) {
    try {
      const brand = await this.findOne(id);
      await this.brandRepository.merge(brand, changes);
      await this.brandRepository.save(brand);

      return await this.findOne(brand.id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `Brand with name "${changes.name}" already exists`,
        );
      }
      throw new Error(`Error updating brand: ${error.message}`);
    }
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    return `Brand ${id} deleted successfully`;
  }
}
