import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Role } from '../enums/role.enum';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true, minlength: 6 })
  password: string;

  @Prop({ required: true, enum: Role })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
