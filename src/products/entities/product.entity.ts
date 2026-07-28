import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Brand } from './brand.entity';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Number, required: true, index: true })
  price: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop()
  image: string;

  @Prop(
    raw({
      name: { type: String, required: true },
      image: { type: String, required: true },
    }),
  ) //Relacion 1:1 Embebida
  category: Record<string, any>;

  @Prop({ type: Types.ObjectId, ref: Brand.name })
  brand: Brand | Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
// ProductSchema.index({ price: 1, stock: -1 });
