const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String },
  coins: { type: Number, default: 100 },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Number },
  referrals: [{ type: Number }],
  plan: { type: String, default: 'FREE' }, // FREE, PREMIUM, VIP, OWNER
  lastDaily: { type: Date, default: null },
  joinedChannels: [{ type: String }], // IDs des canaux rejoints
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
