import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  coins: number;
  referralCode: string;
  referredBy?: number;
  referrals: number[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String },
  coins: { type: Number, default: 100 },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Number },
  referrals: [{ type: Number }]
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
