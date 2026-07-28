import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';

import { MongoIdPipe } from '../../common/mongo-id.pipe';
import { BrandsService } from '../services/brands.service';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all brands',
  })
  @ApiOkResponse({
    description: 'The brands were retrieved successfully',
    type: [CreateBrandDto],
  })
  async findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a brand by id',
  })
  @ApiOkResponse({
    description: 'The brand was retrieved successfully',
    type: CreateBrandDto,
  })
  async get(@Param('id', new MongoIdPipe()) id: string) {
    return this.brandsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new brand',
  })
  async create(@Body() payload: CreateBrandDto) {
    return this.brandsService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a brand by id',
  })
  async update(
    @Param('id', new MongoIdPipe()) id: string,
    @Body() payload: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a brand by id',
  })
  async remove(@Param('id', new MongoIdPipe()) id: string) {
    return this.brandsService.remove(id);
  }
}
