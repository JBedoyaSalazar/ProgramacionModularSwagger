import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Customer } from './customer.entity';
import { Product } from '../../products/entities/product.entity';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Order extends Document {
  @Prop({ type: Date })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: Customer.name, required: true })
  customer: Customer | Types.ObjectId;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: Product.name,
      },
    ],
    required: true,
  })
  products: Types.Array<Product>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
