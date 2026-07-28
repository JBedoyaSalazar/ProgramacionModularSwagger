import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  )
  category: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
// ProductSchema.index({ price: 1, stock: -1 });
