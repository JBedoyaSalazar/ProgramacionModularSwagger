import { ObjectId } from 'mongodb';
import { Role } from '../enums/role.enum';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  role: Role;
}
