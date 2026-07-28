import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from '../../products/services/products.service';

@Injectable()
export class UsersService {
  constructor(
    private productsService: ProductsService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll() {
    return await this.userModel.find().exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    try {
      const newUser = new this.userModel(data);
      await newUser.save();
      return newUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Error creating user');
      }
      throw error;
    }
  }

  async update(id: string, changes: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      const updatedUser = Object.assign(user, changes);
      await updatedUser.save();
      return updatedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Error updating user');
      }
      throw error;
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await user.deleteOne();
    return { message: `User #${id} deleted successfully` };
  }

  async findOrdersByUser(id: string): Promise<Order> {
    return {
      date: new Date(),
      user: await this.findOne(id),
      products: await this.productsService.findAll(),
    };
  }
}
