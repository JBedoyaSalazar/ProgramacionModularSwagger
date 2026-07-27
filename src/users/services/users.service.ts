import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { User } from '../entities/user.entity';
import { Order } from '../entities/order.entity';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';

import { ProductsService } from '../../products/services/products.service';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UsersService {
  private readonly collectionName = 'users';
  constructor(
    private productsService: ProductsService,
    private readonly databaseService: DatabaseService,
  ) {}

  private async getCollection() {
    const db = await this.databaseService.connect();
    return db.collection<User>(this.collectionName);
  }

  async findAll() {
    const usersCollection = await this.getCollection();
    return await usersCollection.find().toArray();
  }

  async findOne(id: string) {
    const usersCollection = await this.getCollection();

    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId');
    }

    const objectId = new ObjectId(id);
    const user = await usersCollection.findOne({ _id: objectId });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async create(data: CreateUserDto) {
    const usersCollection = await this.getCollection();

    const user: User = {
      ...data,
    };

    const result = await usersCollection.insertOne({
      ...data,
    });

    return {
      _id: result.insertedId,
      ...data,
    };
  }

  async update(id: string, changes: UpdateUserDto) {
    const usersCollection = await this.getCollection();

    const user = await this.findOne(id);

    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: changes,
      },
    );

    return usersCollection.findOne({
      _id: user._id,
    });
  }

  async remove(id: string) {
    const usersCollection = await this.getCollection();

    const user = await this.findOne(id);

    await usersCollection.deleteOne({
      _id: user._id,
    });

    return user;
  }

  async findOrdersByUser(id: string): Promise<Order> {
    return {
      date: new Date(),
      user: await this.findOne(id),
      products: await this.productsService.findAll(),
    };
  }
}
