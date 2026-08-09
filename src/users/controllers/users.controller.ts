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
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';

import { UsersService } from '../services/users.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorators';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiOkResponse({
    description: 'The users were retrieved successfully',
    type: [CreateUserDto],
  })
  @Public()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    example: 1,
  })
  @ApiOkResponse({
    description: 'The user was retrieved successfully',
    type: CreateUserDto,
  })
  @Public()
  get(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiOkResponse({
    description: 'The user was created successfully',
    type: CreateUserDto,
  })
  create(@Body() payload: CreateUserDto) {
    return this.usersService.create(payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    example: 1,
  })
  @ApiOkResponse({
    description: 'The user was updated successfully',
    type: UpdateUserDto,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.usersService.update(id, payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    example: 1,
  })
  @ApiOkResponse({
    description: 'The user was deleted successfully',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
