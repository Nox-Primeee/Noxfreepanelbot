import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: number;
  type: 'earn' | 'spend' | 'referral';
  amount: number;
  description: string;
  reference?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Number, required: true },
  type: { type: String, enum: ['earn', 'spend', 'referral'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  reference: { type: String }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
