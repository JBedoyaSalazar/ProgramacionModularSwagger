import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

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

  @Exclude()
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  items!: OrderProduct[];

  @Exclude()
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Expose()
  get products() {
    if (this.items && this.items.length > 0) {
      return this.items
        .filter((item) => !!item)
        .map((item) => ({
          ...item.product,
          quantity: item.quantity,
          itemId: item.id,
        }));
    }
    return [];
  }

  @Expose()
  get total() {
    if (this.items && this.items.length > 0) {
      return this.items.reduce((acc, item) => {
        if (item && item.product) {
          return acc + item.product.price * item.quantity;
        }
        return acc;
      }, 0);
    }
    return 0;
  }
}
