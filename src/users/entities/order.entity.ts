import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Customer } from './customer.entity';
import { OrderProduct } from './orderProduct.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  items!: OrderProduct[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
