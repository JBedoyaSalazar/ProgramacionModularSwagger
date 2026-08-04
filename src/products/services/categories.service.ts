import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dtos';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async create(data: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name ${data.name} already exists`,
      );
    }

    try {
      const newCategory = this.categoryRepository.create(data);
      await this.categoryRepository.save(newCategory);
      return await this.findOne(newCategory.id);
    } catch (error) {
      throw new Error('Error creating category');
    }
  }

  async update(id: number, changes: UpdateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: changes.name },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name ${changes.name} already exists`,
      );
    }
    try {
      const category = await this.findOne(id);
      await this.categoryRepository.merge(category, changes);
      await this.categoryRepository.save(category);

      return await this.findOne(category.id);
    } catch (error) {
      throw new Error('Error updating category');
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return `Category ${id} deleted successfully`;
  }
}
