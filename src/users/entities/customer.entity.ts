import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { SubDoc, SubDocSchema } from './sub-doc.entitiy';

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

  @Prop({
    type: [SubDocSchema],
    default: [],
  })
  skills: Types.Array<SubDoc>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
