import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Brand extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  image: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
