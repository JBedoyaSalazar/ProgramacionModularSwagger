import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; //Agrega la clase ConfigService para poder usar las variables de entorno
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from '../../products/services/products.service';
import { CustomersService } from '../services/customers.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private productsService: ProductsService,
    private configService: ConfigService,
    private customersService: CustomersService,
  ) {}

  async findAll() {
    return await this.userRepo.find({
      relations: ['customer'],
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    try {
      const newUser = this.userRepo.create(data);
      if (data.customerId) {
        const customer = await this.customersService.findOne(data.customerId);
        newUser.customer = customer;
      }
      await this.userRepo.save(newUser);

      return this.findOne(newUser.id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `The phone number '${data.email}' is already registered.`,
        );
      }
      throw error;
    }
  }

  async update(id: number, changes: UpdateUserDto) {
    try {
      const user = await this.findOne(id);
      if (changes.customerId) {
        const customer = await this.customersService.findOne(
          changes.customerId,
        );
        user.customer = customer;
      }
      await this.userRepo.merge(user, changes);
      await this.userRepo.save(user);
      return this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `The phone number '${changes.email}' is already registered.`,
        );
      }
      throw error;
    }
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepo.remove(user);
    return `User #${id} has been deleted`;
  }

  async findOrdersByUser(id: number): Promise<Order> {
    return {
      date: new Date(),
      user: await this.findOne(id),
      products: await this.productsService.findAll(),
    };
  }
}
