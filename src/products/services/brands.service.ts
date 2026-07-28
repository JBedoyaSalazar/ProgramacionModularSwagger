import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async findAll() {
    return this.brandModel.find().exec();
  }

  async findOne(id: string) {
    const brand = await this.brandModel.findById(id).exec();
    if (!brand) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return brand;
  }

  async create(data: CreateBrandDto) {
    const newBrand = await new this.brandModel(data);
    await newBrand.save();
    return newBrand;
  }

  async update(id: string, changes: UpdateBrandDto) {
    const brand = await this.findOne(id);
    const updatedBrand = Object.assign(brand, changes);
    await updatedBrand.save();
    return updatedBrand;
  }

  async remove(id: string) {
    const brand = await this.findOne(id);
    await brand.remove();
    return true;
  }
}
