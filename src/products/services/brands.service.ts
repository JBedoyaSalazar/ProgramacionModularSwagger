import { Injectable, NotFoundException } from '@nestjs/common';
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
    const product = await this.brandRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  async create(data: CreateBrandDto) {
    const newBrand = this.brandRepository.create(data);
    await this.brandRepository.save(newBrand);
    return await this.findOne(newBrand.id);
  }

  async update(id: number, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    await this.brandRepository.merge(brand, changes);
    await this.brandRepository.save(brand);

    return await this.findOne(brand.id);
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    return `Brand ${id} deleted successfully`;
  }
}
