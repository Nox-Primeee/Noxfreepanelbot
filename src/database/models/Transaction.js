const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  type: { type: String, enum: ['earn', 'spend', 'referral'], required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  reference: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
