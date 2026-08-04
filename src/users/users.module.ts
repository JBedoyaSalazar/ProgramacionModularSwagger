import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerController } from './controllers/customers.controller';
import { UsersController } from './controllers/users.controller';

import { CustomersService } from './services/customers.service';
import { UsersService } from './services/users.service';

import { Customer } from './entities/customer.entity';
import { User } from './entities/user.entity';
import { Order } from './entities/order.entity';
import { OrderProduct } from './entities/orderProduct.entity';

import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([Customer, User, Order, OrderProduct]),
  ],
  controllers: [CustomerController, UsersController],
  providers: [CustomersService, UsersService],
  exports: [CustomersService, UsersService],
})
export class UsersModule {}
