import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { Skill } from '../interface/skills.interface';

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
    type: [
      {
        name: { type: String },
        level: { type: String },
      },
    ],
    default: [],
  })
  skills: Types.Array<Skill>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
