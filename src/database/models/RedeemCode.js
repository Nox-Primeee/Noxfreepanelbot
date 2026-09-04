const mongoose = require('mongoose');

const RedeemCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  reward: { type: Number, required: true },
  usedBy: [{ type: Number }],
  maxUses: { type: Number, default: 1 },
  createdBy: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('RedeemCode', RedeemCodeSchema);
