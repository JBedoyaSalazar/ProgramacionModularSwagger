import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity({ name: 'order_products' })
export class OrderProduct {
  @PrimaryGeneratedColumn()
  id!: number;

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

  @Column({ type: 'int', nullable: false })
  quantity!: number;

  @ManyToOne(() => Product, (product) => product.orderProducts, {
    nullable: false,
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  @ManyToOne(() => Order, (order) => order.items, {
    nullable: false,
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;
}
