const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String },
  coins: { type: Number, default: 100 },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Number },
  referrals: [{ type: Number }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
