import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Customer extends Document {
  @Prop({ required: true })
  name!: string;
  @Prop({ required: true })
  lastName!: string;
  @Prop({ required: true, unique: true, trim: true })
  phone!: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
