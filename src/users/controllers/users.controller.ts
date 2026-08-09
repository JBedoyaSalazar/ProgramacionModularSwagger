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
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../users/enum/role.enums';

@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiOkResponse({
    description: 'The users were retrieved successfully',
    type: [CreateUserDto],
  })
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
  async get(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userPayload = req.user;
    const caller = await this.usersService.findOne(userPayload.sub);
    if (caller.role !== Role.ADMIN && caller.id !== id) {
      throw new ForbiddenException('You can only access your own profile');
    }
    return this.usersService.findOne(id);
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Create a new user (Public Registration)',
  })
  @ApiOkResponse({
    description: 'The user was registered successfully',
    type: CreateUserDto,
  })
  create(@Body() payload: CreateUserDto) {
    const registerData = {
      ...payload,
      role: Role.CUSTOMER,
      customerId: undefined,
    };
    return this.usersService.create(registerData);
  }

  @Roles(Role.ADMIN)
  @Post('admin')
  @ApiOperation({
    summary: 'Create a new user as an admin',
  })
  @ApiOkResponse({
    description: 'The user was created successfully by admin',
    type: CreateUserDto,
  })
  createAdmin(@Body() payload: CreateUserDto) {
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
    @Req() req: any,
  ) {
    const userPayload = req.user;
    const caller = await this.usersService.findOne(userPayload.sub);
    if (caller.role !== Role.ADMIN) {
      if (caller.id !== id) {
        throw new ForbiddenException('You can only update your own profile');
      }
      delete (payload as any).role;
      delete (payload as any).customerId;
    }
    return this.usersService.update(id, payload);
  }

  @Roles(Role.ADMIN)
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
