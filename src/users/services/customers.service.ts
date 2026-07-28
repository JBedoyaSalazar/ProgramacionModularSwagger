import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
  ) {}

  async findAll() {
    return this.customerModel.find().exec();
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async create(data: CreateCustomerDto) {
    try {
      const newCustomer = new this.customerModel(data);
      await newCustomer.save();
      return newCustomer;
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException(
          'Error create customer: Phone number already exists',
        );
      }
      throw error;
    }
  }

  async update(id: string, changes: UpdateCustomerDto) {
    try {
      const customer = await this.findOne(id);
      const updatedCustomer = Object.assign(customer, changes);
      await updatedCustomer.save();
      return updatedCustomer;
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException(
          'Error update customer: Phone number already exists',
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await customer.remove();
    return 'Customer deleted successfully';
  }
}
