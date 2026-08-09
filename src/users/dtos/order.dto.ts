import { PartialType } from '@nestjs/swagger';

export class CreateOrderDto {}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
