import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customerRepo: Repository<Customer>,
  ) {}

  async findAll() {
    return await this.customerRepo.find();
  }

  async findOne(id: number) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer #${id} not found`);
    }
    return customer;
  }

  async create(data: CreateCustomerDto) {
    try {
      const newCustomer = this.customerRepo.create(data);
      await this.customerRepo.save(newCustomer);

      return this.findOne(newCustomer.id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `The phone number '${data.phone}' is already registered.`,
        );
      }

      throw error;
    }
  }

  async update(id: number, changes: UpdateCustomerDto) {
    try {
      const customer = await this.findOne(id);
      this.customerRepo.merge(customer, changes);
      await this.customerRepo.save(customer);
      return this.findOne(id);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          `The phone number '${changes.phone}' is already registered.`,
        );
      }

      throw error;
    }
  }

  async remove(id: number) {
    const customer = await this.findOne(id);
    await this.customerRepo.remove(customer);
    return `Customer #${id} has been deleted`;
  }
}
