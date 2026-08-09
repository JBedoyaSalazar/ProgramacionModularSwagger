import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { CustomersService } from '../services/customers.service';
import { UsersService } from '../services/users.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../enum/role.enums';

@ApiTags('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('customers')
export class CustomerController {
  constructor(
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all customers',
  })
  @ApiOkResponse({
    description: 'The customers were retrieved successfully',
    type: [CreateCustomerDto],
  })
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a customer by id',
  })
  @ApiOkResponse({
    description: 'The customer was retrieved successfully',
    type: CreateCustomerDto,
  })
  async get(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const caller = await this.usersService.findOne(req.user.sub);
    if (caller.role !== Role.ADMIN) {
      if (!caller.customer || caller.customer.id !== id) {
        throw new ForbiddenException(
          'You can only access your own customer profile',
        );
      }
    }
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new customer profile for the authenticated user',
  })
  async create(@Body() payload: CreateCustomerDto, @Req() req: any) {
    const caller = await this.usersService.findOne(req.user.sub);
    if (caller.role !== Role.ADMIN && caller.customer) {
      throw new BadRequestException(
        'You already have a customer profile associated',
      );
    }
    const newCustomer = await this.customersService.create(payload);
    if (caller.role !== Role.ADMIN) {
      await this.usersService.update(caller.id, {
        customerId: newCustomer.id,
      } as any);
    }
    return newCustomer;
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a customer by id',
  })
  @ApiOkResponse({
    description: 'The customer was updated successfully',
    type: UpdateCustomerDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
    @Req() req: any,
  ) {
    const caller = await this.usersService.findOne(req.user.sub);
    if (caller.role !== Role.ADMIN) {
      if (!caller.customer || caller.customer.id !== id) {
        throw new ForbiddenException(
          'You can only update your own customer profile',
        );
      }
    }
    return this.customersService.update(id, payload);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a customer by id',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(+id);
  }
}
