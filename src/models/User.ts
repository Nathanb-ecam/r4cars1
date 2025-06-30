import mongoose from 'mongoose';

export const runtime = 'nodejs'


export enum UserRole {
  AFFILIATE = 'AFFILIATE',
  ADMIN = 'ADMIN',
  USER = 'USER',
  VISITOR = 'VISITOR',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  accessCode?: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<User>({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  name: { type: String },
  accessCode: { type: String },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models?.User || mongoose.model<User>('User', userSchema); 