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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { CustomersService } from '../services/customers.service';
import { CreateCustomerDto, UpdateCustomerDto } from '../dtos/customer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorators';

@ApiTags('customers')
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all customers',
  })
  @ApiOkResponse({
    description: 'The customers were retrieved successfully',
    type: [CreateCustomerDto],
  })
  @Public()
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
  @Public()
  get(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new customer',
  })
  create(@Body() payload: CreateCustomerDto) {
    return this.customersService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a customer by id',
  })
  @ApiOkResponse({
    description: 'The customer was updated successfully',
    type: UpdateCustomerDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a customer by id',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.customersService.remove(+id);
  }
}
