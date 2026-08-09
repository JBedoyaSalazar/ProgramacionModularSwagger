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

import { BrandsService } from '../services/brands.service';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorators';

@ApiTags('brands')
@UseGuards(JwtAuthGuard)
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
  @Public()
  findAll() {
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
  @Public()
  get(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new brand',
  })
  create(@Body() payload: CreateBrandDto) {
    return this.brandsService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a brand by id',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBrandDto,
  ) {
    return this.brandsService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a brand by id',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.brandsService.remove(+id);
  }
}
