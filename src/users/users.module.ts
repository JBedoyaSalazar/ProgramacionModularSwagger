import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CustomerController } from './controllers/customers.controller';
import { CustomersService } from './services/customers.service';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';

import { CustomerSchema, Customer } from './entities/customer.entity';
import { UserSchema, User } from './entities/user.entity';

import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: User.name, schema: UserSchema },
      // {}
    ]),
  ],
  controllers: [CustomerController, UsersController],
  providers: [CustomersService, UsersService],
  exports: [CustomersService, UsersService],
})
export class UsersModule {}
