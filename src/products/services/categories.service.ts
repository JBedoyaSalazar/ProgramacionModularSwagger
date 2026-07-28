import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async findAll() {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const newCategory = await new this.categoryModel(data);
    return newCategory.save();
  }

  async update(id: string, changes: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const updatedCategory = Object.assign(category, changes);
    return updatedCategory.save();
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    await category.remove();
    return 'Category deleted successfully';
  }
}
